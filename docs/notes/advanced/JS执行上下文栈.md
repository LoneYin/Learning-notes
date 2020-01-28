# JS执行上下文栈

> 思考一下问什么 js 代码可以保持顺序执行？

## 执行上下文

这就要说到 JavaScript 的可执行代码(executable code)的类型有哪些了？

其实很简单，就三种，全局代码、函数代码、eval 代码。

举个例子，当执行到一个函数的时候，就会进行准备工作，这里的“准备工作”，让我们用个更专业一点的说法，就叫做"执行上下文(execution context)"。

执行上下文对应三种可执行代码：

- 全局执行上下文：只有一个，浏览器中的全局对象就是 window 对象，this 指向这个全局对象。

- 函数执行上下文：存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文。

- Eval 函数执行上下文： 指的是运行在 eval 函数中的代码，很少用而且不建议使用。

## 执行上下文栈

因为 JS 引擎创建了很多的执行上下文，所以 JS 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文。没错，这个栈就是 JS 引擎存储除了 js 对象之外数据的地方，而当上下文切换时，处于顶层的栈里的数据就会被销毁。

为了模拟执行上下文栈的行为，让我们定义执行上下文栈是一个数组：

```js
ECStack = [];
```

试想当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先就会向执行上下文栈压入一个全局执行上下文，我们用 globalContext 表示它，并且只有当整个应用程序结束的时候，ECStack 才会被清空，所以程序结束之前， ECStack 最底部永远有个 GlobalContext：

现在 JavaScript 遇到下面的这段代码了：

```js
function fun3() {
  console.log("fun3");
}

function fun2() {
  fun3();
}

function fun1() {
  fun2();
}

fun1();
```

当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。知道了这样的工作原理，让我们来看看如何处理上面这段代码：

```js
// 伪代码

// 执行fun1()
ECStack.push(`<fun1>` ExecutionContext);

// fun1中竟然调用了fun2，还要创建fun2的执行上下文
ECStack.push(`<fun2>` ExecutionContext);

// 擦，fun2还调用了fun3！
ECStack.push(`<fun3>` ExecutionContext);

// fun3执行完毕
ECStack.pop();

// fun2执行完毕
ECStack.pop();

// fun1执行完毕
ECStack.pop();

// javascript接着执行下面的代码，但是ECStack底层永远有个GlobalContext
```

## 执行上下文里的重要属性

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

### 变量对象（VO）

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。

因为不同执行上下文下的变量对象稍有不同，全局上下文中的变量对象就是全局对象，this 在 undefined 情况下就会指向全局对象，也就是浏览器中的 window。

### 活动对象（AO）

在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。

活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object 呐，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

### 代码执行过程

执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

1. 进入执行上下文，用 arguments 创建活动对象
2. 代码执行

#### 进入执行上下文

当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)

   - 由名称和对应值组成的一个变量对象的属性被创建
   - 没有实参，属性值设为 undefined

2. 函数声明

   - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性（变量声明无法覆盖函数声明）

3. 变量声明
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举个例子

```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;
}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

#### 代码执行

在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是：

```js
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

到这里变量对象的创建过程就介绍完了，让我们简洁的总结我们上述所说：

- 全局上下文的变量对象初始化是全局对象

- 函数上下文的变量对象初始化只包括 Arguments 对象

- 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值

- 在代码执行阶段，会再次修改变量对象的属性值，此时的可访问对象即活动对象

## 作用域链

当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

举个例子
```js
function foo() {
  function bar() {
    ...
  }
}
```
函数创建时，各自的[[scope]]为：
```js
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
  fooContext.AO,
  globalContext.VO
];
```

再举个例子

```js
var scope = "global scope";
function checkscope() {
  var scope2 = "local scope";
  return scope2;
}
checkscope();
```

对于这段代码来说，执行过程如下：

1.  checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

    ```js
    checkscope.[[scope]] = [
      globalContext.VO
    ];
    ```
2. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

    ```js
    ECStack = [
      checkscopeContext,
      globalContext
    ];
    ```
3. checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

    ```js
    checkscopeContext = {
      Scope: checkscope.[[scope]],
    }
    ```

4. 第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

    ```js
    checkscopeContext = {
      AO: {
        arguments: {
          length: 0
        },
        scope2: undefined
      }，
      Scope: checkscope.[[scope]],
    }
    ```

5. 第三步：将活动对象压入 checkscope 作用域链顶端

    ```js
    checkscopeContext = {
      AO: {
        arguments: {
          length: 0
        },
        scope2: undefined
      },
      Scope: [AO, [[Scope]]]
    }
    ```

6. 准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

    ```js
    checkscopeContext = {
      AO: {
        arguments: {
          length: 0
        },
        scope2: 'local scope'
      },
      Scope: [AO, [[Scope]]]
    }
    ```

7. 查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

    ```js
    ECStack = [
      globalContext
    ];
    ```