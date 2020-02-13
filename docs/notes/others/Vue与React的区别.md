# Vue与React的区别

## 核心区别

### 1. 数据驱动的模式不一样

>Vue: Reactive

Vue视图的更新是通过依赖收集和数据监听自动触发的，开发者只需要对响应对象进行赋值操作即可触发视图的更新。

>React: Immutable

React则是让开发者通过setState手动更新视图，React本身并不知道何时该去更新。

### 2. API 的设计哲学不一样

>Vue：易用性

Vue提供的API比较多，这些API(语法糖)覆盖了很多场景，再加上自动化的响应式模型，使用Vue可以大大简化开发者的代码，提升开发体验。作为一个开发者你不需要知道这些API的原理，只要会用就足够了。

>Recat：简约性

React提供的API很少，整体设计透露着一种简约的美。React只是给开发者框定了一个编写React应用的大体范围，开发者需要考虑如何具体的实现功能，这对开发者的js能力有更高的要求，但同时也给了开发者更高的自由度。

## 主要区别

### 1. 编写UI的方式不同 jsx vs template

jsx 就是 javascript 语法的延伸，他具有 js 的逻辑表达能力和动态性，这使得 jsx 的编写十分灵活自由，但是过高的灵活性会使得运行时可用于优化的信息不足，而且 jsx 可以作为简洁的 Render Function 在组件中传递。

(React 团队也在尝试使用 React + Prepack 的组合进行预编译优化，只是 prepack 有点坑）

template 更符合一般模板的规范，易于上手，而且 vue 的在模板编译过程做了更多的工作以支持 指令/过滤器 等特性，使得模板在大部分情况下都有着更高的开发效率，而且模板的相对静态性有利于它在编译过程中的优化，比如 optimize 中的静态节点标记，以及 Vue3 中的 block tree。

(这里谈一下 Vue3 的优化思路。Vue2 compile 过程中的 optimize 是把整棵 AST 树当做动态的然后去标记静态节点进行优化，这样做的目的是为了兼容，Vue3 的优化思路反了过来，是先将整棵DOM树看做静态的，然后找到其中动态的节点，而事实上在实际项目中静态节点的数量是要比动态节点更多的)

### 2. 组件声明的方式不同 class API vs options object

React: class API

优点：
1. 方便 Typescript 类型推导 
2. 便于实现高阶组件 
3. 可以使用一些原生 ES 新特性如 decorator

缺点：
1. 拓展性差 
2. decorator 等提案并不稳定 

Vue2: options object

优点：
1. 易于理解和上手 
2. 对用户的代码进行了规范，看起来更条理 

缺点：
1. 拓展性差

### 3. 复用逻辑的方式不同（这是由于上面种种原因造成的）

React: 
- Mixins(随着 createClass 一起废弃)
- HOC 缺点：来源不清晰，嵌套地狱
- RenderProps 缺点：嵌套地狱

- React Hooks

Vue:
- Mixins 缺点：来源不清晰，命名冲突
- Slots 缺点：嵌套地狱
- HOC(Vue 的 HOC 谁用谁知道)
- RenderProps(理论上可以实现，因为Vue支持手写render，但有 scope-slots 方案)

- Compositiona API

其中 RenderProps 和 Slots 在形式和其作用上都是十分相近的

### 4. React 的性能优化与 Fiber 架构 与 Concurrent 模式

Vue：基于组件的 diff，更新粒度较细，更新方式是一边 diff 一边 patch，由于可以精确以到某个组件为单位，所以性能较好。

React：局部（或全部）暴力递归更新策略，更新分两个阶段：一个阶段是 vodm tree 的 diff (Reconciliation)，然后是集中的 patch。当应用过于庞大的时候，会有性能问题（未经优化的子组件全部会重新渲染）。

所以关于 React 的性能优化一直是开发者要解决的难题，React 先后提供了 shouldComponentUpdate PureComponent React.memo useCallback useMemo 等 API，让开发者对应用进行优化。

React 引入了在框架内部 时间分片 和 任务调度 的理念，采用 Fiber 架构来解决更新卡顿的问题。

React 将树状的 react element 转变成了由 Fiber 构成的链表结构，现在的 diff 过程变成了遍历而不是之前的递归，在开启 concurrent 模式后，借助自己 polyfill 的 requesetIdleCallback API 使得 diff 过程从同步的阻塞式的变成了可中断和恢复的。

简单理解 Fiber 架构：React 采用了双重缓冲的技术，在原始 Fiber tree（旧的树）之外维护了一颗 WIP(workInProces，Fiber 在 reconciliation 过程中复制生成的镜像) tree，这棵树记录了当前 reconciler 更新的 Fiber，然后通过类似 requesetIdleCallback 的机制开启 WorkLoop，通过 reconciliation 过程的**中断-恢复**这种循环分次执行 WIP tree 的构建，在此期间完全不会阻塞 UI 的渲染，然后在 WIP tree 全部更新完毕后一次性 commit 给真实DOM节点。

### 5. React Hooks 与 Vue3

用组件作为承载逻辑的单元会带来更多的**组件嵌套问题**和**性能消耗**，所以我们应该把可复用的逻辑从组件内部抽离出来，同样是给组件注入逻辑，Hooks 或者 Vue3 的 Function API 对组件的侵入性更低、更可控，可以把他们理解为一种有迹可循的 Mixin，更细粒度的 Mixin

React 抛弃了一直以来组件为核心的设计理念，Hooks 是跟 Fiber 紧密结合的。但是由于每次组件更新都要重新执行所有的 Hooks，对性能也是一种消耗，而 React 团队的设计理念好像并不在乎这点性能。

Vue3 的 Composition API 不同，它保留了 Options API，保留了组件的逻辑和生命周期，同时也将 Vue3 中的 Composition API 限定在了 setup 方法中，而 setup 只会在组件创建的时候执行。