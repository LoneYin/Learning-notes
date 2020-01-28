# 浏览器DOM事件与事件监听

事件驱动是`JavaScript`作为一种脚本语言的特质之一，而事件则是`JavaScript`和`HTML`交互的基础。用户想要与任何的浏览器页面进行交互，都要通过绑定相应的事件。

DOM事件分为`DOM0`、`DOM2`和`DOM3`三种（没错，没有`DOM1`）

## DOM0

DOM0就是直接通过`onclick/onchange`等事件属性写在HTML中的事件
比如：

```html
<button id="btn" onclick="alert('DOM0')"></button>
```

或者：

```javascript
const button = document.getElementById('btn')

button.onclick = () => {
    alert('DOM0')
}
```

值得注意的是，清理DOM0事件的时候，只需要给该事件赋值为`null`

``` javascript
button.onclick = null
```

而且同一个HTML元素只能绑定一个同种事件类型的函数，否则后面的函数会覆盖之前的事件处理函数

## DOM2

DOM2是通过`addEventListener`绑定的事件，它增加了许多DOM1不支持的新模块。因为浏览器的兼容性问题，在IE下DOM2事件通过`attchEvent`绑定

DOM2事件中同一个元素的同种事件可以绑定多个事件处理函数，按照绑定顺序依次执行，而清除DOM2事件则需要使用`removeEventListener/detachEvent`传入函数清除指定函数（所以要移除事件请确保注册事件监听时传入的函数为**外部函数**，而不是**匿名函数**）

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

DOM2级事件有三个参数：

- 第一个参数是事件名，如`click, change`
- 第二个参数是事件处理函数
- 第三个参数代表事件执行/移除的阶段，`true`表示在捕获阶段，`false`表示在冒泡阶段，`addEventListener`中该参数默认为`false`，值得注意的是：**如果你在冒泡阶段和捕获阶段同时绑定了事件，那么移除事件的时候需要选择阶段单独移除**

>**此处要先介绍一下什么是事件流**

### 事件流

事件流描述的就是从页面中接收事件的顺序。而IE和Netscape提出了完全相反的事件流概念。IE事件流是事件冒泡，而Netscape的事件流就是事件捕获。

### 事件冒泡

IE的事件流叫做事件冒泡。即事件开始时由最具体的元素（文档中嵌套层次最深的那个节点）接收，然后逐级向上传播到较为不具体的节点（文档）。所有现代浏览器都支持事件冒泡，并且会将事件一直冒泡到`window`对象。

<div align=center><img src="/img/dom-event/bubbling.png" /></div>

### 事件捕获

事件捕获的思想是不太具体的节点应该更早的接收到事件，而在最具体的节点应该最后接收到事件。事件捕获的用以在于事件到达预定目标之前捕获它。IE9+、Safari、Chrome、Opera和Firefox支持，且从`window`开始捕获（尽管DOM2级事件规范要求从`document`）。由于老版本浏览器不支持，所以很少有人使用事件捕获。

<div align=center><img src="/img/dom-event/capturing.png" /></div>

### DOM2事件流

DOM2级事件规定事件流包括三个阶段，事件捕获阶段、处于目标阶段和事件冒泡阶段。首先发生的事件捕获，为截获事件提供了机会；然后是实际的目标接收了事件；最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。我们可以通过设置`addEventListener`的第三个参数来决定是在捕获阶段还是冒泡阶段执行事件。

<div align=center><img src="/img/dom-event/event-stream.png" /></div>

>**我们一般注册事件监听都是在事件冒泡阶段，因为它可以帮我们实现事件委托。**

值得注意的是，事件 handler 的第一个参数事件对象 e 的 e.currentTarget属性指向绑定事件的DOM元素，而 e.target则是指向触发事件的DOM元素，两者在事件委托的模式下可能并不相等。

## DOM3

DOM3进一步扩展了DOM，在DOM3中引入了以下模块：

- DOM加载和保存模块（DOM Load and Save）：引入了以统一方式加载和保存文档的方法
- DOM验证模块（DOM Validation）：定义了验证文档的方法
- DOM核心的扩展（DOM Style）：支持XML 1.0规范，涉及XML Infoset、XPath和XML Base
- **自定义事件**

### DOM中的自定义事件

DOM3级还定义了自定义事件，自定义事件不是由DOM原生触发的，它的目的是让开发人员创建自己的事件。要创建的自定义事件可以由`createEvent("CustomEvent")`， 返回的对象有一个`initCustomEvent`方法接收如下四个参数：

- type（字符串）：触发的事件类型，自定义。例如 `keyDown`，`selectedChange`
- bubble（布尔值）：标示事件是否应该冒泡
- cancelable（布尔值）：标示事件是否可以取消
- detail：任意值，保存在event对象的detail属性中

示例如下：

```javascript
button.addEventListener("myEvent", () => {
　　alert("div myEvent!")
})

if (document.implementation.hasFeature("CustomEvents", "3.0")) {
　　const e = document.createEvent("CustomEvent")
　　e.initCustomEvent("myEvent", true, false, "hello world!")
    button.dispatchEvent(e) // 这样button就会在执行这段代码后执行myEvent事件处理函数
}
```