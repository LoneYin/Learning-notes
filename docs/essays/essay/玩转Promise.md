# 玩转Promise

## promise 队列化执行

参考下面这个例子，会打印什么呢？

```js
function onFulfilled(count) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`${count}s过去了`)
      resolve(count + 1);
    }, 1000);
  });
}

const chain = [];

for (let i = 0; i < 5; i++) {
  chain.push(onFulfilled);
}

let promise = Promise.resolve(1);

while (chain.length) {
  promise = promise.then(chain.shift());
}

promise.then(count => {
  setTimeout(() => {
    console.log(count);
  }, 1000)
});
```

就算引用 promise 的变量被重新赋值，但是旧的 promise 对象在堆内存中并没有被回收，因为 promise.then() 返回的新的 Promise 的决议依然掌握在旧的 promise 对象中。

我们可以用上例中简单的循环来实现异步函数的队列化顺序执行。

## promise 的挂起


