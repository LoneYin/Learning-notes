# 手写 bind/call/apply

## call 的实现

```js
Function.prototype.myCall = function(context) {
  context = context || window;
  context.fn = this;

  const args = [...arguments].splice(1);
  const result = context.fn(...args);

  context.fn = undefined; // 或者 delete context.fn
  return result;
};
```

## apply 的实现

```js
Function.prototype.myApply = function(context) {
  context = context || window;
  context.fn = this;

  const args = arguments[1];
  const result = args ? context.fn(...args) : context.fn();

  context.fn = undefined; // 或者 delete context.fn
  return result;
};
```

## bind 的实现

```js
Function.prototype.myBind = function(context) {
  context = context || window;
  const self = this;
  const _args = [...arguments].splice(1);

  return () => {
    const args = arguments;
    return self.apply(context, [..._args, ...args]);
  };
};
```

如果绑定后的函数被当做构造函数被 new 调用，则此时的 this 指向构造函数的实例对象，我们可以加一个空构造函数（fNOP）进行中转，通过判断 this instanceof fNOP 来判断这个绑定函数是否被 new 调用了，如果是的话就不改变 this （实例对象），不是的话就继续绑定最初传入的 context

```js
Function.prototype.myBind = function(context) {
  context = context || window;
  const self = this;
  const _args = [...arguments].splice(1);

  function fNOP() {};

  function fBound() {
    const args = arguments;
    return self.apply(this instanceof fNOP ? this : context, [
      ..._args,
      ...args
    ]);
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```
