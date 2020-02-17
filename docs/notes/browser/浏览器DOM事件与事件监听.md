# 浏览器 DOM 事件与事件监听

事件驱动是`JavaScript`作为一种脚本语言的特质之一，而事件则是`JavaScript`和`HTML`交互的基础。用户想要与任何的浏览器页面进行交互，都要通过绑定相应的事件。

DOM 事件分为`DOM0`、`DOM2`和`DOM3`三种（没错，没有`DOM1`）

## DOM0

DOM0 就是直接通过`onclick/onchange`等事件属性写在 HTML 中的事件
比如：

```html
<button id="btn" onclick="alert('DOM0')"></button>
```

或者：

```javascript
const button = document.getElementById("btn");

button.onclick = () => {
  alert("DOM0");
};
```

值得注意的是，清理 DOM0 事件的时候，只需要给该事件赋值为`null`

```javascript
button.onclick = null;
```

而且同一个 HTML 元素只能绑定一个同种事件类型的函数，否则后面的函数会覆盖之前的事件处理函数

## DOM2

DOM2 是通过`addEventListener`绑定的事件，它增加了许多 DOM1 不支持的新模块。因为浏览器的兼容性问题，在 IE 下 DOM2 事件通过`attchEvent`绑定

DOM2 事件中同一个元素的同种事件可以绑定多个事件处理函数，按照绑定顺序依次执行，而清除 DOM2 事件则需要使用`removeEventListener/detachEvent`传入函数清除指定函数（所以要移除事件请确保注册事件监听时传入的函数为**外部函数**，而不是**匿名函数**）

比如：

```javascript
function fnA() {
    ...
}
function fnB() {
    ...
}
// 绑定事件
button.addEventListener('click', fnA)
button.addEventListener('click', fnB)

// 移除事件
button.removeEventListener('click', fnA)
```

DOM2 级事件有三个参数：

- `type` 事件名，如`click, change`
- `listener` 事件处理函数
- `options` **可选**

  一个指定有关 listener 属性的可选参数对象。可用的选项如下：

  - capture: Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
  - once: Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
  - passive: Boolean，设置为 true 时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。

- `useCapture` **可选**

  代表事件执行/移除的阶段，`true`表示在捕获阶段，`false`表示在冒泡阶段，`addEventListener`中该参数默认为`false`，值得注意的是：**如果你在冒泡阶段和捕获阶段同时绑定了事件，那么移除事件的时候需要选择阶段单独移除**

> **此处要先介绍一下什么是事件流**

### 事件流

事件流描述的就是从页面中接收事件的顺序。而 IE 和 Netscape 提出了完全相反的事件流概念。IE 事件流是事件冒泡，而 Netscape 的事件流就是事件捕获。

### 事件冒泡

IE 的事件流叫做事件冒泡。即事件开始时由最具体的元素（文档中嵌套层次最深的那个节点）接收，然后逐级向上传播到较为不具体的节点（文档）。所有现代浏览器都支持事件冒泡，并且会将事件一直冒泡到`window`对象。

<div align=center><img src="/Learning-notes/img/dom-event/bubbling.png" /></div>

### 事件捕获

事件捕获的思想是不太具体的节点应该更早的接收到事件，而在最具体的节点应该最后接收到事件。事件捕获的用以在于事件到达预定目标之前捕获它。IE9+、Safari、Chrome、Opera 和 Firefox 支持，且从`window`开始捕获（尽管 DOM2 级事件规范要求从`document`）。由于老版本浏览器不支持，所以很少有人使用事件捕获。

<div align=center><img src="/Learning-notes/img/dom-event/capturing.png" /></div>

### DOM2 事件流

DOM2 级事件规定事件流包括三个阶段，事件捕获阶段、处于目标阶段和事件冒泡阶段。首先发生的事件捕获，为截获事件提供了机会；然后是实际的目标接收了事件；最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。我们可以通过设置`addEventListener`的第三个参数来决定是在捕获阶段还是冒泡阶段执行事件。

<div align=center><img src="/Learning-notes/img/dom-event/event-stream.png" /></div>

> **我们一般注册事件监听都是在事件冒泡阶段，因为它可以帮我们实现事件委托。**

值得注意的是，事件 handler 的第一个参数事件对象 e 的 e.currentTarget 属性指向绑定事件的 DOM 元素，而 e.target 则是指向触发事件的 DOM 元素，两者在事件委托的模式下可能并不相等。

## DOM3

DOM3 进一步扩展了 DOM，在 DOM3 中引入了以下模块：

- DOM 加载和保存模块（DOM Load and Save）：引入了以统一方式加载和保存文档的方法
- DOM 验证模块（DOM Validation）：定义了验证文档的方法
- DOM 核心的扩展（DOM Style）：支持 XML 1.0 规范，涉及 XML Infoset、XPath 和 XML Base
- **自定义事件**

### DOM 中的自定义事件

DOM3 级还定义了自定义事件，自定义事件不是由 DOM 原生触发的，它的目的是让开发人员创建自己的事件。要创建的自定义事件可以由 new Event(typeArg, eventInit)创建，其中 eventInit(可选)是个 options 对象，接收如下字段：

- **bubbles** 可选，Boolean 类型，默认值为 false，表示该事件是否冒泡。
- **cancelable** 可选，Boolean 类型，默认值为 false， 表示该事件能否被取消。
- **composed** 可选，Boolean 类型，默认值为 false，指示事件是否会在影子 DOM 根节点之外触发侦听器。

示例如下：

```javascript
if (document.implementation.hasFeature("CustomEvents", "3.0")) {
  // 创建一个支持冒泡且不能被取消的myEvent事件
  const e = new Event("myEvent", { bubbles: true, cancelable: false });
  document.dispatchEvent(e); // 这样document就会在执行这段代码后执行myEvent事件处理函数

  // 事件可以在任何元素触发，不仅仅是document
  myDiv.dispatchEvent(e);

  myDiv.addEventListener("myEvent", () => {
    alert("div myEvent!");
  });
}
```

## 事件对象 Event

### Event 常见属性

- **Event.bubbles** 一个布尔值，用来表示该事件是否在 DOM 中冒泡。

- **Event.cancelable** 一个布尔值，用来表示这个事件是否可以取消。

- **Event.target**: 触发事件的元素的引用

- **Event.currentTarget**: 注册事件的元素的引用

  currentTarget 在事件传递过程中是可以改变的，比如

  ```js
  function hide(e) {
    e.currentTarget.style.visibility = "hidden";
    console.log(e.currentTarget);
    // 该函数用作事件处理器时: this === e.currentTarget
  }

  var ps = document.getElementsByTagName("p");

  for (var i = 0; i < ps.length; i++) {
    // console: 打印被点击的p元素
    ps[i].addEventListener("click", hide, false);
  }
  // console: 打印body元素
  document.body.addEventListener("click", hide, false);
  ```
- **Event.relatedTarget**: 对于 mouseover/mouseout 有用，指的是鼠标over时离开的目标/鼠标out时进入的目标，对于其他事件则没有意义

- **Event.eventPhase**  指示事件流正在处理哪个阶段。

  - 0
  
    这个时间，没有事件正在被处理

  - 1
  
    事件正在被目标元素的祖先对象处理. 这个处理过程从 Window 开始，然后 Document, 然后是 HTMLHtmlElement, 一直这样，直到目标元素的父元素。 通过 EventTarget.addEventListener() 注册为捕获模式的 Event listeners 被调用。
    
  - 2

    事件对象已经抵达 the event's target. 为这个阶段注册的事件监听被调用。 如果 Event.bubbles 的值为 false, 对事件对象的处理在这个阶段后就会结束.

  - 3
    事件对象逆向向上传播回目标元素的祖先元素, 从父亲元素开始，并且最终到达包含元素 Window. 这就是冒泡，并且只有 Event.bubbles 值为 true 的时候才会发生。 为这个阶段注册的 Event listeners 在这个过程中被触发。

- **Event.isTrusted**

  指明事件是否是由浏览器（当用户点击实例后）或者由脚本（使用事件的创建方法，例如 event.initEvent）启动。

### Event 常见方法

- **Event.initEvent** 通过 DocumentEvent 的接口给被创建的事件初始化某些值。

- **Event.preventDefault** 取消事件（如果该事件可取消）。

- **Event.stopPropagation** 停止事件冒泡。
