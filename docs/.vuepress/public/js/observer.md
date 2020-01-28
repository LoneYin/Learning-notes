# 观察者模式的简单实现

## 什么是观察者模式

>观察者模式是软件设计模式的一种。在此种模式中，一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。这通常透过呼叫各观察者所提供的方法来实现。此种模式通常被用来实时事件处理系统。

顾名思义，观察者的作用就是观察，它会接受被观察对象所发出的信息，然后执行相应的操作。我们最常用的观察者模式有浏览器的DOM事件监听机制，Vue的数据绑定等

### 几种简单的观察者模式的实现

## 通过`Object.defineProperty()`

****
先来简单认识一下这个方法

### 语法

```javascript
Object.defineProperty(obj, prop, descriptor)
```

### 参数说明

> - obj：必需，目标对象
> - prop：必需，要定义或者修改的属性的名字
> - descriptor：必需，目标属性所拥有的特性

### 返回值

> 传入函数的对象。即第一个参数obj

### descriptor (属性描述符)

>对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。**数据描述符**是一个具有值的属性，该值可能是可写的，也可能不是可写的。**存取描述符**是由`getter-setter`函数对描述的属性。**描述符必须是这两种形式之一，不能同时是两者**。

#### 数据描述符和存取描述符均具有以下可选键值：

#### `configurable`

当且仅当该属性的 `configurable` 为 `true` 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 `false。`

#### `enumerable`

当且仅当该属性的enumerable为`true`时，该属性才能够出现在对象的枚举属性中。默认为 `false`。

#### 数据描述符同时具有以下可选键值：

#### `value`

该属性对应的值。可以是任何有效的 `JavaScript` 值（数值，对象，函数等）。默认为 `undefined。`

#### `writable`

当且仅当该属性的`writable`为`true`时，`value`才能被赋值运算符改变。默认为 `false`。

#### 存取描述符同时具有以下可选键值：

#### `get`

一个给属性提供 `getter` 的方法，如果没有 `getter` 则为 `undefined`。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入`this`对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。
默认为 `undefined`。

#### `set`

一个给属性提供 `setter` 的方法，如果没有 `setter` 则为 `undefined`。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。
默认为 `undefined`。

****

可以看到，因为`Object.defineProperty()`方法中的第三个参数属性描述符能够修改对象属性的`setter-getter`函数，所以我们就可以在`setter-getter`中向观察者发送当前对象属性变更的信息，达到观察者的目的。

代码示例如下：

```javascript
// 创建目标对象
var targetObj = {
    age: 1
}
// 定义值改变时的处理函数
function observer(oldVal, newVal) {
    // 其他处理逻辑...
    console.log('name属性的值从 '+ oldVal +' 改变为 ' + newVal)
}

// 定义name属性及其set和get方法
Object.defineProperty(targetObj, 'name', {
    enumerable: true,
    configurable: true,
    get: function() {
        return name
    },
    set: function(val) {
        //调用处理函数
        observer(name, val)
        name = val
    }
})

targetObj.name = 'Tom'
targetObj.name = 'Jerry'
```

## 通过class中的set方法实现

与 ES5 的对象一样，在ES6的`class`内部可以使用`get`和`set`关键字，对类的某个属性设置存值函数和取值函数，拦截该属性的存取行为。

代码示例如下：

```javascript
class TargetObj {
    constructor(age, name) { // constructor是一个构造方法，用来接收参数
        this.name = name
        this.age = age
    }
    set name(val) {
        observer(name, val)
        name = val
    }
}

let targetObj = new TargetObj(1, 'Tom')

// 定义值改变时的处理函数
function observer(oldVal, newVal) {
    // 其他处理逻辑...
    console.log('name属性的值从 '+ oldVal +' 改变为 ' + newVal)
}
targetObj.name = 'Jerry'
```

## 通过Reflect和Proxy实现

> Vue3也将使用Proxy方案代替Object.defineProperty方法实现数据绑定

代码示例如下：

```javascript
class TargetObj {
    constructor(age, name) {
        this.name = name
        this.age = age
    }
}

let targetObj = new TargetObj(1, 'Tom')

let observerProxy = new Proxy(targetObj, {
    set(target, property, value, reciever) {
        if (property === 'name') {
            observer(target[property], value)
        }

        Reflect.set(target, property, value, reciever)
    }
})
// 定义值改变时的处理函数
function observer(oldVal, newVal) {
    // 其他处理逻辑...
    console.log(`name属性的值从 ${oldVal} 改变为 ${newVal}`)
}

observerProxy.name = 'Jerry'
```