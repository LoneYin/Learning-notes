# key在Vue渲染列表时究竟起到了什么作用

Vue2+采用`diff`算法来进行新旧`vnode`的对比从而更新DOM节点。而通常在我们使用`v-for`这个指令的时候，`Vue`会要求你给循环列表的每一项添加唯一的`key`，那么这个`key`在渲染列表时究竟起到了什么作用呢？

在解释这一点之前，你最好已经了解`Vue`的`diff`算法的具体原理是什么。

Vue2更新真实DOM节点的操作主要是两种：**创建新DOM节点并移除旧DOM节点** 和 **更新已存在的DOM节点**，这两种方式里创建新DOM节点的开销肯定是远大于移动已有DOM节点位置或更新DOM节点属性的，所以在`diff`中逻辑都是为了减少新的创建而更多的去复用已有DOM节点来完成DOM的更新。

在新旧`vnode`的`diff`过程中，`key`是判断两个节点是否为同一节点的首要条件：

```javascript

// 参见Vue2源码 core/vdom/patch.js

function sameVnode (a, b) {
    return (
        a.key === b.key && (
            (
                a.tag === b.tag &&
                a.isComment === b.isComment &&
                isDef(a.data) === isDef(b.data) &&
                sameInputType(a, b)
            ) || (
                isTrue(a.isAsyncPlaceholder) &&
                a.asyncFactory === b.asyncFactory &&
                isUndef(b.asyncFactory.error)
            )
        )
    )
}

```

值得注意的是，如果新旧`vnode`的`key`值都未定义的话那么两个`key`都为`undefined`，`a.key === b.key` 是成立的

接下来是在`updateChildren`方法中

```javascript

// 参见Vue2源码 core/vdom/patch.js

function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    ...
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
            ...
        } else if (isUndef(oldEndVnode)) {
            ...
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            ...
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            ...
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            ...
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            ...
        } else {
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            idxInOld = isDef(newStartVnode.key)
                ? oldKeyToIdx[newStartVnode.key]
                : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
            if (isUndef(idxInOld)) { // New element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            } else {
                vnodeToMove = oldCh[idxInOld]
                if (sameVnode(vnodeToMove, newStartVnode)) {
                    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                    oldCh[idxInOld] = undefined
                    canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
                } else {
                    // same key but different element. treat as new element
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
                }
            }
            newStartVnode = newCh[++newStartIdx]
        }
    }
    ...
}
```

## 设置`key`的可以在`diff`中更快速的找到对应节点，提高`diff`速度

在`updateChildren`方法的`while`循环中，如果**头尾交叉对比**没有结果，即`oldStartVnode`存在且`oldEndVnode`存在且新旧`children`首尾四个`vnode`互不相同的条件下，会根据`newStartVnode`的`key`去对比`oldCh`数组中的`key`，从而找到相应`oldVnode`

首先通过`createKeyToOldIdx`方法创建一个关于`oldCh`的`map`

```javascript
if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)

function createKeyToOldIdx (children, beginIdx, endIdx) {
    let i, key
    const map = {}
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key
        if (isDef(key)) map[key] = i
    }
    return map
}
```

这个`map`中将所有定义了`key`的`oldVnode`在数组中的`index`值作为键值，它的`key`作为键名存储起来，然后赋给`oldKeyToIdx`

```javascript
idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)

function findIdxInOld (node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
        const c = oldCh[i]
        if (isDef(c) && sameVnode(node, c)) return i
    }
}
```

如果`newStartVnode`的`key`存在的话，就去`oldKeyToIdx`中寻找相同`key`所对应的`index`值，这样就能拿到跟`newStartVnode`的`key`相同的`oldVnode`在`oldCh`数组中的`index`，即得到了与`newStartVnode`对应的`oldVnode`。如果找不到的话，那么`idxInOld`就为`undefined`。

而如果`newStartVnode`并没有设置`key`，则通过`findIdxInOld`方法遍历`oldCh`来获取与`newStartVnode`互为`sameVnode`的`oldVnode`，返回这个`oldVnode`在`oldCh`数组的`index`。（前面介绍过，`Vue`在更新真实DOM时倾向于真实DOM节点的复用，所以在这里还是会选择去找对应的`oldVnode`，来更新已有的DOM节点）

这时候设置`key`的好处就显而易见了，有`key`存在时我们可以通过`map`映射快速定位到对应的`oldVnode`然后进行`patch`，没有`key`值时我们需要遍历这个`oldCh`数组然后去一一进行比较，相比之下肯定是`key`存在时`diff`更高效。

接下来就是更新DOM的过程，如果`oldCh[idxInOld]`存在且与`newStartVnode`互为`sameVnode`存在则先更新再移动，否则创建新的`element`

```javascript
if (isUndef(idxInOld)) { // New element
    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
} else {
    vnodeToMove = oldCh[idxInOld]
    if (sameVnode(vnodeToMove, newStartVnode)) {
        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldCh[idxInOld] = undefined
        canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
    } else {
        // same key but different element. treat as new element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
    }
}
```

## 那么设置`key`值就一定能提高`diff`效率吗？

答案是否定的

```javascript

`<div v-for="i in arr">{{ i }}</div>`

// 如果我们的数组是这样的
[1, 2, 3, 4, 5]

// 它的渲染结果是这样的
`<div>1</div>`  // key: undefined
`<div>2</div>`  // key: undefined
`<div>3</div>`  // key: undefined
`<div>4</div>`  // key: undefined
`<div>5</div>`  // key: undefined

// 将它打乱
[4, 1, 3, 5, 2]

// 渲染结果是这样的 期间只发生了DOM节点的文本内容的更新
`<div>4</div>`  // key: undefined
`<div>1</div>`  // key: undefined
`<div>3</div>`  // key: undefined
`<div>5</div>`  // key: undefined
`<div>2</div>`  // key: undefined


// 如果我们给这个数组每一项都设置了唯一的key
[{id: 'A', value: 1}, {id: 'B', value: 2}, {id: 'C', value: 3}, {id: 'D', value: 4}, {id: 'E', value: 5}]

// 它的渲染结果应该是这样的
`<div>1</div>`  // key: A
`<div>2</div>`  // key: B
`<div>3</div>`  // key: C
`<div>4</div>`  // key: D
`<div>5</div>`  // key: E

// 将它打乱
[{id: 'D', value: 4}, {id: 'A', value: 1}, {id: 'C', value: 3}, {id: 'E', value: 5}, {id: 'B', value: 2}]

// 渲染结果是这样的  期间只发生了DOM节点的移动
`<div>4</div>`  // key: D
`<div>1</div>`  // key: A
`<div>3</div>`  // key: C
`<div>5</div>`  // key: E
`<div>2</div>`  // key: B
```

我们给数组设置了`key`之后数组的`diff`效率真的变高了吗？

并没有，因为在简单模板的数组渲染中，新旧节点的`key`都为`undefined`，根据`sameVnode`的判断条件，这些新旧节点的`key`、`tag`等属性全部相同，所以在`sameVnode(oldStartVnode, newStartVnode)`这一步的时候就已经判定为对应的节点（不再执行头尾交叉对比），然后直接进行`patchVnode`，根本没有走后面的那些`else`。每一次循环新旧节点都是相对应的，只需要更新其内的文本内容就可以完成DOM更新，这种**原地复用**的效率无疑是最高的。

而当我们设置了`key`之后，则会根据**头尾交叉对比**结果去执行下面的`if else`，进行判断之后还需要执行`insertBefore`等方法移动真实DOM的节点的位置或者进行DOM节点的添加和删除，这样的**查找复用**开销肯定要比不带`key`直接**原地复用**的开销要高。

Vue文档中对此也进行了说明：

>当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。

>这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出。

>建议尽可能在使用 v-for 时提供 key，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。

所以，简单列表的渲染可以不使用`key`或者用数组的`index`作为`key`（效果等同于不带`key`），这种模式下性能最高，但是并不能准确的更新列表项的状态。一旦你需要保存列表项的状态，那么就需要用使用唯一的`key`用来准确的定位每一个列表项以及复用其自身的状态，而大部分情况下列表组件都有自己的状态。

## 总结

`key`在列表渲染中的作用是：在复杂的列表渲染中快速准确的找到与`newVnode`相对应的`oldVnode`，提升`diff`效率