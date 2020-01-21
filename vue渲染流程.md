# Vue 渲染流程

1. new Vue触发第一次_init
   
2. 触发根组件的$mount

3. 触发mountComponent
   
4. 触发_update
   
5. 先执行_render拿到根组件vnode树（在创建根组件的子组件vnode的时候(即createCompoent方法) 生成子组件构造器 并 注册vnode的init钩子）
   
6. 创建渲染watcher 渲染watcher自执行一次 执行_update（并在此设置activeInstance）  触发patch
    
7.  执行patch 调用 createElm
    
8.  执行createElm 触发createComponent(createElm内部的)  触发init钩子
    
9.  init钩子中new一个子组件的构造器
    
10. 触发子组件的_init 在此时绑定父子关系
    
11. 触发子组件的$mount
    
12. 。。。递归到最深层的组件
    