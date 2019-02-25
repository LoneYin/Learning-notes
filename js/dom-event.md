# 浏览器DOM事件与事件监听

事件驱动是`JavaScript`作为一种脚本语言的特质之一，而事件则是`JavaScript`和`HTML`交互的基础。用户想要与任何的浏览器页面进行交互，都要通过绑定相应的事件。

DOM事件分为`DOM0`、`DOM2`和`DOM3`三种（没错，没有DOM1）

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
DOM2是通过`addEventListener`绑定的事件，因为浏览器的兼容性问题，在IE下DOM2事件通过`attchEvent`绑定

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

**此处要先介绍一下什么是事件流**

## 事件流

事件流描述的就是从页面中接收事件的顺序。而IE和Netscape提出了完全相反的事件流概念。IE事件流是事件冒泡，而Netscape的事件流就是事件捕获。

## 事件冒泡

IE的事件流叫做事件冒泡。即事件开始时由最具体的元素（文档中嵌套层次最深的那个节点）接收，然后逐级向上传播到较为不具体的节点（文档）。所有现代浏览器都支持事件冒泡，并且会将事件一直冒泡到window对象。

<div align=center>![avatar](/img/dom-event/bubbling.png)</div>

DOM2级事件规定事件流包括三个阶段，事件捕获阶段、处于目标阶段和事件冒泡阶段。首先发生的事件捕获，为截获事件提供了机会。然后是实际的目标接收了事件。最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

### 事件流