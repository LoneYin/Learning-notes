# JavaScript中的事件循环机制（Event Loop）

## JavaScript的单线程特性

JavaScript的一大特点就是单线程，换句话说，在同一时间JavaScript引擎只能在单个线程中处理一行语句。

JavaScript单线程的这个设定是由它被设计时的用途决定的。JavaScript作为浏览器的脚本语言，在设计之初的用途就是用来给用户提供与网页之间的交互能力，而如果JavaScript不是单线程语言，这些交互操作就会带来很复杂的同步问题（比如两个线程一个删除DOM节点，另一个修改同一个DOM节点，这种相悖的操作浏览器肯定是无法一起执行的）。

单线程意味着所有的任务都需要在一个执行队列中排队，前一个任务执行结束后，才会去执行下一个任务，即同步JavaScript。同步意味着一旦线程阻塞，那么我们将无法执行其它操作，这时候就需要引入异步JavaScript。

## JavaScript是如何在引擎中执行的

在我们介绍异步JavaScript之前，让我们先来了解一下在JavaScript引擎中同步JavaScript代码是如何执行的。例如：

```javascript

```