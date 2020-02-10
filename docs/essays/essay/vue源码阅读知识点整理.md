# Vue 源码阅读知识点整理

## Vue 首次渲染流程

1. new Vue 触发第一次\_init 调用 beforeCreate 和 created hook

2. 触发根组件的\$mount

3. 触发 mountComponent 调用 beforeMount hook

4. 触发\_update

5. 先执行 vm.\_render 拿到根组件 vnode 树（render 会调用组件的 render 方法通过 createElement 方法创建 vnode，在创建根组件的子组件 vnode 的时候(即 createCompoent 方法) 生成子组件构造器 并 注册 vnode 的 init 钩子）

6. 创建渲染 watcher 渲染 watcher 自执行一次 执行\_update（并在此设置 activeInstance） 触发 patch 并注册 beforeUpdate 钩子

7. 执行 patch 调用 createElm

8. 执行 createElm 如果是组件就触发 createComponent(createElm 内部的) 触发 init 钩子

9. init 钩子中 new 一个子组件的构造器

10. 触发子组件的\_init 在此时绑定父子关系

11. 触发子组件的\$mount，然后触发 createComponent 后续的 insert

12. 。。。递归到最深层的组件

13. createElm 会执行 insert 将真实 dom 节点插入父节点 然后 patch 调用 vnode 的 insert 钩子 然后 insert 中执行 mounted hook （mounted 是先子后父，因为子组件先 insert 完成）

14. 真实的 DOM 树会在递归完成时一级一级向上插入，最后插入到 body 上

## 为什么全局注册组件在哪里都能用（全局指令，全局过滤器同理）

因为全局注册组件合并到了 Vue.options 上，而所有的子组件的\$options 对象都能通过原型链访问到 Vue.options

而局部注册的组件合并到了 Sub.options 上 也就是它的父组件上

具体可以看 \_init 中的 initInternalComponent 方法中的

```js
const opts = (vm.$options = Object.create(vm.constructor.options));
```

## 依赖收集的流程

1. initState 对 props data 等递归进行 observe(obj), obeserve 调用 new Observe 并将实例赋值给 obj 的不可枚举属性**ob**，Observe 构造函数中执行 walk 或 observeArray 递归调用 defineReactive

2. defineReactive 中会首先 new Dep 对应这个响应对象，然后定义对象 get 方法

3. initState 之后挂载的时候调用 mountComponent 方法

4. mountComponent 会新建一个渲染 watcher，new Watcher 的过程中调用构造函数，构造函数最后执行 get 方法 然后 pushTarget 然后 Dep.target 就变成当前渲染 watcher 然后执行\_update(之前当做 getter 传入了 watcher 的构造函数)

5. 执行\_update 首先要执行\_render 这个过程中就访问了响应对象，调用了他们的 get 方法

6. 当 get 执行的时候就会执行 dep.depend，然后当前的 Watcher(即 Dep.target)执行 addDep，此时 dep.sub 中添加了 Watcher，Watcher 中的 newDeps newDepIds 也添加了 dep

   ```js
   // dep.js
   depend () {
     if (Dep.target) {
       Dep.target.addDep(this)
     }
   }
   // watcher.js
   addDep (dep: Dep) {
     const id = dep.id
     if (!this.newDepIds.has(id)) {
       this.newDepIds.add(id)
       this.newDeps.push(dep)
       if (!this.depIds.has(id)) {
         dep.addSub(this)
       }
     }
   }
   ```

7. 当前渲染 watcher 的依赖收集完毕，然后 popTarget 回到上一个 watcher（因为\_update 是递归的，所以有一个 targetStack 栈保存 Dep.target）

8. 执行 cleanupDeps 把上一次 render 中添加的(newDepIds 中添加了 id 的 dep)但在这一次 render 中并没有添加的 dep 给清除掉（清除的是 dep.subs 中的 watcher）

   ```js
   if (!this.newDepIds.has(dep.id)) {
     dep.removeSub(this);
   }
   ```

## 派发更新的流程

1. 触发 响应对象的 setter 调用 dep.notify 然后触发 subs 中所有 watcher 的 update

2. 执行 queueWatcher 添加进 queue，然后再 nextTick 中执行 flushSchedulerQueue，这个方法执行会把 flushing 这个变量变为 true。

   注意：此时 queueWatcher 不会直接 queue.push 而是会找到第一个待插入 watcher 的 id 比 queue 中 watcher 的 id 大的位置，把 watcher 按照 id 插入到 queue 中

3. flushSchedulerQueue 会先对 queue 进行排序，然后遍历 watcher 执行 watcher.before(beforeUpdate 钩子) 然后执行 watcher.run

   ```js
   queue.sort((a, b) => a.id - b.id);
   ```

   排序的作用：

   1. 组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的创建也是先父后子，执行顺序也应该保持先父后子。

   2. 用户的自定义 watcher 要优先于渲染 watcher 执行；因为用户自定义 watcher 是在渲染 watcher 之前创建的。

   3. 如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher 执行都可以被跳过，所以父组件的 watcher 应该先执行。

   在 watcher.run() 的时候，很可能用户会再次添加新的 watcher，这样会再次执行到 queueWatcher，然后 queue 的长度发生变化，然后遍历的 watcher 就会变多。如果检测到新加入的 watcher 已经存在于未遍历的数组中，则触发无限循环更新的报错（比如在 watch 的 cb 里修改被 watch 的变量的值）

4. watcher.run 执行 get 方法 即 pushTarget getter(updateComponent) popTarget 等操作，触发组件的重新渲染，并在重新渲染过程中 重新进行依赖收集

5. watcher 遍历完毕之后 执行 resetSchedulerState 重置 queue 和 flushing waiting 等，然后调用 activated 和 updated 钩子

## nextTick 实现

1. 维护一个 callbacks 数组
2. 定义一个 flushCallbacks，拷贝 callbacks 清空 callbacks 后遍历执拷贝得来的 callbacks
3. 定义一个 timerFunc，将 flushCallbacks 进行异步化

   timerFunc 的优先级分别为

   1. Promise.then
   2. MutationObserver(之前还用过 MessageChannel)
      ```js
      let counter = 1;
      const observer = new MutationObserver(flushCallbacks);
      const textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
      ```
   3. setImmediate
   4. setTimeout(flushCallbacks, 0)

4. 定义 nextTick 每次执行都会给 callbacks 数组中添加 cb，如果这次执行没有传 cb 的话就返回一个 Promise 用来支持.then 链式调用，然后向 callbacks 中 push 这个 Promise 的 resolve

## computed 实现原理

1. 执行 initComputed 创建一个 computed watcher 执行 definedComputed(这一步在创建 Sub 构造器的时候已经执行了，所以 computed key 被挂载到了 vm 的原型上)

2. definedComputed 会给 这个 computed key 添加数据监听，get 方法为 createComputedGetter

3. createComputedGetter 中会取到 key 对应的 watcher 然后执行 watcher 的 evaluate 方法（如果 dirty 为 true，即依赖没发生改变才重新 evaluate），就是执行 watcher.get 然后 pushTarget 执行 getter popTarget 完成依赖收集，不过这里的 getter 不同于渲染 watcher 不是 updateComponent 了，而是求值然后，然后又将这些依赖添加到了渲染 watcher（ 或者上一层的computed watcher ） 中，保证每次 computed 值变化就触发重新渲染

4. 当响应对象 set 之后，会触发 dep.notify 这时候就会使该 dep.subs 下的 computed watcher 更新 将 watcher.dirty 变为 true，下次 get 重新计算

## watch 实现原理

其实就是创建一个一个 user watcher ，与其它 watcher 不同的地方在于可以传 cb 和 options(如 deep sync immediate 等) 然后这个地方的 getter 会被处理成一个响应对象的属性名（嵌套属性用 parsePath 处理成数组）

new Watcher 最后 执行 get 方法时，getter 就是访问定义的响应对象，然后就完成了依赖收集

如果 options deep 为 true 就在 get 中执行 traverse 把深层对象的所有值全访问一遍收集依赖
如果 options sync 为 true 则不进入 queueWatcher，直接同步执行 watcher.run
如果 options immediate 为 true 则在执行\$watch 的时候，在 new Watcher 之后就直接执行一遍 cb

## 组件更新流程

1. patch 方法中，如果 oldVnode 和 vnode 都存在，则判断是否为 sameVnode
   
2. 如果是的话 进入 patchVnode，不是的话 执行 createElm，生成新的 DOM 节点并插入，然后更新 ancestor.elm(用新创建的 DOM 节点更新父的占位符节点下的真实 DOM 节点)，删除旧的 DOM 节点
   
3. 接上文，如果是的话，执行 patchVnode，如果 vnode 是组件 vnode，则先执行 prepatch 钩子更新组件的 attr props listners 等
   
4. 如果 vnode.text 不存在，也就是说不是文本节点，则有以下几种情况，见代码

    ```js
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch)
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== "production") {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, "");
      }
    }
    ```

    其中 updateChildren 中又会递归执行patchVnode，更新整棵组件DOM树

    updateChildren 对oldVnode和vnode进行头尾交叉对比，然后根据对比情况采取不同的逻辑变更真实的DOM，如果头尾交叉对比没结果，就根据key来

5. 不然就更新 vnode.text

    ```js
    else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    ```
6. 组件vnode patch 完毕之后会再执行一次prepatch钩子

## compile流程

1. createCompilerCreator传入baseCompile方法，返回createCompiler方法
   
2. createCompiler传入平台baseOptions 返回compile方法和compileToFunctions方法
   
3. 一连串的执行后我们执行编译核心方法baseCompile
   
4. 先parse生成AST
   
    parseHTML，advance不停地切割template，过程中判断标签，收集attrs，加入stack中

    parseStartTag后赋值给startTagMatch 如果startTagMatch为 true 执行handleStartTag，handleStartTag最后执行options.start，生成ASTelement，处理attrs（比如各种process方法，给ASTelement添加属性），根据stack确定闭合状态和进行AST管理（确立父子关系）

    ASTelm type有三种  1是普通ast 2是表单式如{{}} 3是文本ast

    endTagMatch如果为true 执行parseEndTag 执行options.end 更新stack 执行closeElement
   
5. optimize优化AST  递归对AST进行markStatic 和 markStaticRoot 静态优化 staticRoot如果子节点是纯文本节点且长度为1则为false

6. generate生成render函数