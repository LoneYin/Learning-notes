# JavaScript中的new运算符到底做了什么

> 阅读下面内容需要先了解JavaScript中的原型链以及构造函数

我们都知道，构造函数也是函数，就算不用`new`运算符，它也是可以直接运行的。

例如：

```javascript
function Person(name) {
    this.name = name
    this.getName = function () {
        console.log(this.name)
    }
}

Person('Tom')
// 当我们直接执行构造函数时，this默认指向了window
// 所以你会发现 window 多了两个属性分别是：
// window.name = 'Tom'; window.getName = function () { console.log(this.name) }

new Person('Tom')
// 当执行上面这行代码的时候，返回了一个关于Person的实例对象
// Person { name: "Tom", getName: f }

```

```javascript
var foo = new Foo()
```

那么你有没有好奇过，当我们执行上述代码的时候，究竟发生了什么？

MDN是这样介绍的：

> 当代码 `new Foo(...)` 执行时，会发生以下事情：
> - 一个继承自 `Foo.prototype` 的新对象被创建。
> - 使用指定的参数调用构造函数 `Foo` ，并将 `this` 绑定到新创建的对象。`new Foo` 等同于 `new Foo()`，也就是没有指定参数列表，`Foo` 不带任何参数调用的情况。
> - 由构造函数返回的对象就是 `new` 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

我们可以这样来理解
