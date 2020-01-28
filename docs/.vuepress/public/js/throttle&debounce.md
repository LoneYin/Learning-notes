# 函数的节流和防抖

> 在日常需求中经常需要监听高触发频率的事件，如果事件每次触发都执行相应的处理函数的话，往往会带来性能上的浪费，而通过节流和防抖则可以很好的解决这个问题

## 函数防抖

预期效果：多次触发事件后，事件处理函数只执行一次，并且是在最后一次触发事件时执行。

实现原理：对处理函数进行延时操作，若在延时到来之前再次该触发事件，则重置延时操作。

简单实现：

```javascript
function debounce(fn, delay) {
  let timer = null;
  return function() {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}
```

应用场景：

- 通过监听 scroll 事件，检测滚动位置，根据滚动位置显示返回顶部按钮
- 通过监听 resize 事件，对某些自适应页面调整 DOM 的渲染
- 通过监听 keyup 事件，监听文字输入并调用接口进行模糊匹配或校验
- ......

不足之处：

函数防抖也是有其局限性的，比如当我们要在页面向下滚动时进行图片的懒加载，如果我们使用了函数防抖，那么只有当事件结束的时候（我们的滚轮停下）才会进行图片的加载，这会有很大的延时。对于这种需要实时触发事件的情景，函数防抖就显得不适合了。**此时我们就需要函数的节流，控制事件函数周期性的触发。**

## 函数节流

预期效果：执行事件处理函数之后在一定时间内无法再次执行，只有过了规定时间间隔后才能进行下一次的调用（相当于加锁操作）。

实现原理：第一次触发事件时执行事件处理函数，而当再次触发事件时则判断是否已经过了预设的周期间隔，是则再次执行事件处理函数，否则设置延迟时间为周期间隔的延时操作执行事件处理函数。

简单实现：

```javascript
function throttle(fn, delay) {
  let timer = null,
    remaining = 0,
    previous = Date.now();
  return function() {
    let now = Date.now();
    remaining = now - previous;
    if (remaining >= delay) {
      timer && clearTimeout(timer);
      timer = null;
      fn.apply(this, arguments);
      previous = now;
    } else {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, arguments);
          previous = Date.now();
        }, delay - remaining);
      }
    }
  };
}
// 注意throttle函数内的this指向并非window，在哪个执行上下文调用throttle方法，this就指向谁，如果需要让他指向window，可以定义变量context = this，然后将context作为第一个参数传入fn.apply
```

应用场景：在监听事件过程中一些需要实时执行的方法（如图片懒加载）