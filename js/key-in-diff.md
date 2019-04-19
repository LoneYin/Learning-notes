# Vue源码探究(一)：key在Vue渲染列表时究竟起到了什么作用

Vue2+采用`diff`算法来进行新旧`vnode`的对比从而更新DOM节点。而通常在我们使用`v-for`这个指令的时候，`Vue`会要求你给循环列表的每一项添加唯一的`key`，那么这个`key`在渲染列表时究竟起到了什么作用呢？

在解释这一点之前，你最好已经了解`Vue`的`diff`算法的具体原理是什么。

Vue2更新真实DOM节点的操作主要是两种：**创建新DOM并移除旧DOM** 和 **更新已存在的DOM**，这两种方式里创建新DOM的开销肯定是远大于移动已有DOM位置或更新DOM属性的，所以在`diff`中逻辑都是为了减少新的创建而用更多复用已有DOM完成DOM更新。

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

在`updateChildren`方法的`while`循环中，如果前面几种`if`条件都不成立就会跳到最后一种`else`中，即oldStartVnode存在且oldEndVnode存在且新旧children首尾四个vnode互不相同的条件下，就需要用到vnode的key值来进行DOM的更新

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

这个`map`中将所有定义了`key`的`oldVnode`的`index`值作为键值，它的`key`作为键名存储起来，然后赋给`oldKeyToIdx`

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

这时候设置`key`的好处就显而易见了，有`key`存在时我们可以通过map映射快速定位到对应的`oldVnode`然后进行`patch`，没有`key`值时我们需要遍历这个`oldCh`数组然后去一一进行比较，相比之下肯定是`key`存在时`diff`更高效。