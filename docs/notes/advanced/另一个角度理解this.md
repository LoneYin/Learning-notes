# 从另一个角度理解this

看几个例子

```js
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}

//示例1
console.log(foo.bar()); // 2
//示例2
console.log((foo.bar)()); // 2
//示例3
console.log((foo.bar = foo.bar)()); // 1
//示例4
console.log((false || foo.bar)()); // 1
//示例5
console.log((foo.bar, foo.bar)()); // 1
// 这里注意一下(foo.bar, foo.bar)会返回后者，也就是 function ()
```

为什么示例1和示例2的`this`指向`foo`而其余的全部为`undefined`呢 ?

我们仔细观察一下执行运算符`()`前的表达式，你可以发现`foo.bar`和`(foo.bar)`明显与其余四个不相同，他们之间的区别才是决定`this`指向的关键。

`foo.bar`指向 的是一个 `Reference` (引用)，而其余表达式返回的都是函数`bar`，丢失了引用。`(foo.bar)`因为`()`运算符并没有更改表达式返回的引用关系所以`this`仍然为`foo`

我们可以简单的理解为谁调用`this`就指向谁，但是也要当心执行前引用丢失的情况