# EventLoop

## 为什么要有 EventLoop?

因为 Javascript 设计之初就是一门单线程语言，也就是说它只有一个调用栈，也就是说JS引擎在同一时间只能做一件事。

所以为了让异步任务不阻塞主线程，浏览器就引入了 EventLoop ，其作用就是将执行JS代码所产生的异步任务在适当的时候推入调用栈中执行。

## 宏任务与微任务

不同的 API 注册的异步任务会依次进入自身对应的队列中（task queue 和 microTask queue），然后等待 Event Loop 将它们依次压入执行栈中执行。

异步任务分为两种：

- task(宏任务)主要包含：callbacks、setTimeout、setInterval、postMessage、MessageChannel、setImmediate(Nodejs/IE10)、I/O、UI 交互事件（宏任务通过各类触发线程加入到 task queue 中）
  
- microtask(微任务)主要包含：Promise.then、process.nextTick(Nodejs)、MutaionObserver、V8垃圾回收机制（ microtask queue 应该是JS线程内部维护的）

还有一种特殊的异步任务 requestAnimationFrame，它的回调  不在 microtask/task queue 之中

## EventLoop 流程

整个最基本的 Event Loop 如图所示：

- queue 可以看做一种数据结构，用以存储需要执行的函数
- timer 类型的 API（setTimeout/setInterval）注册的函数，等到期后进入 task 队列（这里不详细展开 timer 的运行机制）
- 其余 API 注册函数直接进入自身对应的 task/microtask 队列

EventLoop 流程：

- Event Loop 执行一次，主线程查询 task 队列是否有任务，从 task 队列中拉出一个 task 压入执行栈执行
- 执行完一个 task 后，Event Loop 继续检查 microtask 队列是否为空，依次执行直至清空队列
- 开启下一次 Event Loop，执行期间如果产生新的 task/microtask 则加入相应队列

<img src="/Learning-notes/img/eventloop.png">

举个例子：

```js
console.log(1);

setTimeout(() => {
  console.log(2);
  new Promise(resolve => {
    console.log(4);
    resolve();
  }).then(() => {
    console.log(5);
  });
});

new Promise(resolve => {
  console.log(7);
  resolve();
}).then(() => {
  console.log(8);
});

setTimeout(() => {
  console.log(9);
  new Promise(resolve => {
    console.log(11);
    resolve();
  }).then(() => {
    console.log(12);
  });
});
// 1同步, 7同步, 8清空微任务, 2第一个task执行, 4task中同步, 5清空微任务, 9第二个task执行, 11task中同步, 12清空微任务
```

这里要注意的是，同是 microtask，但 process.nextTick 注册的函数优先级高于 Promise，也就是说 process.nextTick 会先执行

还有一点就是，setTimeout 等 Timer API 在浏览器标准中的最低有效延迟时间是 4ms（是为了给CPU留下休息时间），而在 Nodejs 中是 1ms，也就是说

```js
setTimeout(() => {
  console.log(1);
}, 1);

setTimeout(() => {
  console.log(0);
}, 0);
// 会输出 1, 0 而不是 0, 1
```

## Nodejs 中的 EventLoop

而且 Nodejs 中的 EventLoop 与浏览器中有很大不同，因为 Nodejs 多了 I/0，setImmediate，close handlers 等情景

Nodejs 中的 EventLoop 是分阶段的，阶段有先后，依次是

- expired timers and intervals，即到期的 setTimeout/setInterval
- I/O events，也就是轮询阶段(poll)，包含文件，网络等等
- check阶段，执行通过 setImmediate 注册的函数
- close handlers，close 事件的回调，比如 TCP 连接断开

同步任务及每个阶段之后都会清空 microtask 队列

- 优先清空 next tick queue，即通过 process.nextTick 注册的函数
- 再清空 other queue，常见的如 Promise

它不会每执行一个 task 就清空 microtask 队列，而是同步任务及每个阶段之后都会清空 microtask 队列，相当于将同一个阶段的多个 task 合并为了一个 task

举个例子：

```js
setTimeout(() => {
  console.log(1);
  new Promise(resolve => {
    console.log(3);
    resolve();
  }).then(() => {
    console.log(4);
  });
});

setTimeout(() => {
  console.log(2);
  new Promise(resolve => {
    console.log(5);
    resolve();
  }).then(() => {
    console.log(6);
  });
});

// 在Nodejs中会输出 1, 2, 3, 4, 5, 6
```

更正：在nodejs v11+版本中，上面的例子中Nodejs也会打印1,3,4,2,5,6，同浏览器保持一致