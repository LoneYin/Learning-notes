# JS执行上下文栈

## JS 代码的执行

我们知道 JavaScript 属于解释型语言，JavaScript 的执行分为：解释和执行两个阶段,这两个阶段所做的事并不一样：

### 解释阶段：

1. 词法分析
2. 语法分析
3. 作用域规则确定

### 执行阶段：

1. 创建执行上下文
2. 执行函数代码
3. 垃圾回收

JavaScript 解释阶段便会确定作用域规则，因此作用域在函数定义时就已经确定了，而不是在函数调用时确定，但是执行上下文是函数执行之前创建的。执行上下文最明显的就是 this 的指向是执行时确定的。而作用域访问的变量是编写代码的结构确定的。

作用域和执行上下文之间最大的区别是：执行上下文在运行时确定，随时可能改变；作用域在定义时就确定，并且不会改变。

一个作用域下可能包含若干个上下文环境。有可能从来没有过上下文环境（函数从来就没有被调用过）；有可能有过，现在函数被调用完毕后，上下文环境被销毁了；有可能同时存在一个或多个（闭包）。同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值。

> 思考一下问什么 js 代码可以保持顺序执行？

## 执行上下文

这就要说到 JavaScript 的可执行代码(executable code)的类型有哪些了？

其实很简单，就三种，全局代码、函数代码、eval 代码。

而执行上下文就是代码的运行时环境，分为以下三种，分别对应三种可执行代码：

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

当执行一个的函数的时候，就先创建一个执行上下文，并且压入执行上下文栈，函数执行的时候就是进入这个执行上下文，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。知道了这样的工作原理，让我们来看看如何处理上面这段代码：

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

******
以下内容为 ES5 规范的内容

## 建立执行上下文

函数执行时就会创建一个执行上下文，而执行上下文的建立阶段完成了**词法环境**和**变量环境**的创建和 this 的绑定

### This Binding

在全局执行上下文中，this 的值指向全局对象，在浏览器中，this 的值指向 window 对象。

在函数执行上下文中，this 的值取决于函数的调用方式。如果它被一个对象引用调用，那么 this 的值被设置为该对象，否则 this 的值被设置为全局对象或 undefined（严格模式下）。

### 词法环境（Lexical Environment）

词法环境是一个包含标识符变量映射的结构。（这里的标识符表示变量/函数的名称，变量是对实际对象【包括函数类型对象】或原始值的引用）

在词法环境中，有两个组成部分：

1. **环境记录（environment record）**，环境记录是存储变量和函数声明的实际位置（可以理解为变量对象）。
2. **对外部环境的引用**，对外部环境的引用意味着它可以访问其外部词法环境（可以理解为作用域链中的链）。

对于函数环境而言，环境记录 还包含了一个 arguments 对象，该对象包含了索引和传递给函数的参数之间的映射以及传递给函数的参数的长度（数量）。

环境记录 同样有两种类型： 

1. **声明性环境记录**，存储变量、函数和参数。一个函数环境包含声明性环境记录。
2. **对象环境记录** 用于定义在全局执行上下文中出现的变量和函数的关联。全局环境包含对象环境记录。

### 变量环境（Variable Environment）

和词法环境的定义基本类似，他们的区别在于：

> 在 ES6 中，Lexical Environment 组件和 Variable Environment 组件的区别在于前者用于存储函数声明和变量（ let 和 const ）绑定，而后者仅用于存储变量（ var ）绑定。

结合代码理解词法环境与变量环境：

```js
let a = 20;  
const b = 30;  
var c;

function multiply(e, f) {  
 var g = 20;  
 return e * f * g;  
}

c = multiply(20, 30);
```

执行上下文如下所示：

```js
GlobalExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      a: < uninitialized >,  
      b: < uninitialized >,  
      multiply: < func >  
    }  
    outer: <null>  
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      c: undefined,  
    }  
    outer: <null>  
  }  
}

FunctionExectionContext = {  
   
  ThisBinding: <Global Object>,

  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      Arguments: {0: 20, 1: 30, length: 2},  
    },  
    outer: <GlobalLexicalEnvironment>  
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      g: undefined  
    },  
    outer: <GlobalLexicalEnvironment>  
  }  
}
```

******
以下内容是 ES3 的概念

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