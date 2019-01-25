# JavaScript中的函数声明以及函数表达式
## 简单介绍
### 函数声明
```javascript
    function declaration () {
        return 'Function Declaration';
    }
```
### 函数表达式
```javascript
    const expression = () => {
        return 'Function Expression';
    } 
    // ES6写法  等价于 var expression = function () { return 'Function Expression'; }
    
```
## 二者区别
### 函数声明：会声明一个具名函数，且因为在预解析阶段函数提升的关系，该函数能在其所在作用域的任意位置被调用。你可以尝试`console.log(declaration.name);`，可以看到打印结果为`"declaration"，你可以将此函数通过函数名赋值给变量或者对象属性。
### 函数表达式：这种方法使用function操作符或者箭头函数的形式来创建一个匿名函数，就像它的名字一样它是没有函数名的，这一点可以通过`console.log(expression.name);`来证明。它并不能像函数声明一样在其所在作用域内被随意调用，因为函数表达式创建的函数实在运行时进行赋值，且要等到表达式赋值完成后才能调用。
比如说：
```javascript
    func();
    var func = () => {
        return 'Function Expression';
    }   // Error: func is not a function
    
    // 因为变量提升的关系，我们可以访问到变量func，但是函数表达式的赋值没有完成，所以还不能进行调用
    // 将上述函数表达式改为函数声明，则可以调用

    function func () {
        return 'Function Declaration';
    }

```
