# 给React-Router添加转场动画

>PS: 本篇文章使用的`React-Router`版本为`react-router-dom: ^5.0.0` (兼容4.x)

使用过Vue2的同学们应该都知道`<transition>`这个内置组件，它可以帮我们添加过渡动画，之前一直用它来给`Vue-Router`路由的跳转添加转场动画，使用起来非常便捷。那在React中应该如何给路由切换添加过渡动画呢？

## react-transition-group

我们需要借助React的官方动画库`react-transition-group`，[文档戳这里](https://reactcommunity.org/react-transition-group/)

`react-transition-group`提供了三个React组件，分别是`<Transition>`，`<CSSTransition>`以及`<TranstionGroup>`，关于它们的详细api还请各位去查阅官方文档，这里只是简单介绍一下它们各自的用途：

- `<Transition>`：通过`javascript`动态修改`style`的方式为子元素添加动画，对比`<CSSTransiton>`多了几个编程式的`props`可以配置
- `<CSSTransition>`：相比`<Transition>`多了一个`classNames`可以配置，通过引入CSS以及动态更改子元素`className`的方式为子元素添加动画（是不是像极了Vue里的`<transition>`）
- `<TranstionGroup>`：顾名思义，为多个子元素添加动画，需要结合`<Transition>`或`<CSSTransition>`使用

关于`react-transititon-group`与`react-router`的结合使用方式，[官方文档里](https://reactcommunity.org/react-transition-group/with-react-router)也给出了示例，但是直接拿来实现路由转场动画，我觉得方式并不够优雅。我还是更倾向于封装一个`<AnimatedSwitch>`组件来替换`react-router`自带的`<Switch>`组件来实现路由跳转时的转场动画。

## 编写过渡组件

实际代码也非常的简单

比如我们的路由长下面这个样子:

```html
<!-- App.js -->

<Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/" component={Home} />
</Switch>
```

我们需要写一个`<AnimatedSwitch>`来实现`<Switch>`的功能还要给路由跳转添加动画，其实也就是在`<Swtich>`外部用`<CSSTransition>`和`<TranstionGroup>`再封装一层。

代码如下：

```less
// AnimatedSwitch.less

// 很多动画都需要给路由对应组件最外层元素设置position: absolute;
.route {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

// 帧动画
.fade-enter {
    opacity: 0;
}

.fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
}

.fade-exit {
    opacity: 1;
}

.fade-exit.fade-exit-active {
    opacity: 0;
    transition: opacity 300ms ease-in;
}
```

```jsx
// AnimatedSwitch.js

import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Route, Switch } from 'react-router-dom'
import './AnimatedSwitch.less'

const AnimatedSwitch = props => {
    const { children } = props
    return (
        <Route
            render={({ location }) => (
                <TransitionGroup>
                    <CSSTransition
                        key={location.key}
                        classNames={props.type || 'fade'}
                        timeout={props.duration || 300}
                    >
                        <Switch location={location}>{children}</Switch>
                    </CSSTransition>
                </TransitionGroup>
            )}
        />
    )
}

export default AnimatedSwitch
```

其中值得注意的是用到了`Route`的`render`函数，我们需要用它将`route props`中的`location`传递给`<Switch>`，使其具有动态更换子路由的能力。

我们原有的JSX可以更换成如下结构：

```html
<!-- App.js -->

<AnimatedSwitch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/" component={Home} />
</AnimatedSwitch>
```

至此，一个简单的`<AnimatedSwitch>`组件的编写就完成了。