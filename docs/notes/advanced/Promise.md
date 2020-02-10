# Promise的链式调用原理

> 关于 Promise 的基础概念和使用方法就不多讲了，我们来聊一聊它的实现原理

**请大家配合最下方的 Promise/A+ 规范实现代码来阅读**

**首先明确一个概念：决议，就是指将 Promise 的状态从 pending 变为 fulfilled/rejected**

**其次 Promise/A+ 规范实现代码中的 setTimeout 可以理解将代码添加到平台的微任务队列中异步执行**

## 结合代码描述 Promise 链式调用的整个流程

1. new Promise(excutor = (resolve, reject) => {}) 后 执行 `excutor` ， 返回一个 Promise 对象 obj

    ```js
      try {
        excutor(resolve, reject);
      } catch (e) {
        reject(e);
      }
    ```

2. 执行 obj.then(onFulfilled, onRejected)

   首先判断 onFulfilled 和 onRejected 是否是个函数，如果不是的话就将 onFulfilled 改写成 `value => value` ，将 onRejected 改写成 `reason => { throw reason }`

   ```js
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : reason => {
            throw reason;
          };
   ```

3. obj.then 返回一个 newPromise，它的 excutor 方法与 obj 此时的状态有关

    - 如果 obj 为 pending 状态

        ```js
        return newPromise = new Promise((resolve, reject) => {
          that.onFulfilledCallbacks.push(value => {
            try {
              let x = onFulfilled(value);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          that.onRejectedCallbacks.push(reason => {
            try {
              let x = onRejected(reason);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        })
        ```

        then 方法在 obj 处于 pending 状态时 干了这么几件事

        1. 创建一个新的 Promise 对象 newPromise 并返回

        2. 执行 newPromise 的 excutor，向 obj 的两个回调队列中添加回调

        3. 向 obj.onFulfilledCallbacks 添加一个成功回调：传入 obj.value 执行 onFulfilled(value) 然后执行 resolvePromise，obj.value 会在 resolve(value) 执行的时候被赋值

        4. 向 obj.onRejectedCallbacks 添加一个失败回调：传入 obj.reason 执行 onRejected(reason) 然后执行 resolvePromise，obj.value 会在 reject(reason) 执行的时候被赋值

    -  如果 obj 已经为 fulfilled 状态

        ```js
        return newPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              let x = onFulfilled(that.value);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        })
        ```

        我们同样返回了一个新的 Promise 对象，它的 excutor 函数会将 onFulfilled 和 resolvePromise 添加进微任务队列执行，也就是说如果 obj 在已经变为 fulfilled 后再执行 then 方法，就会在同步任务执行完毕后立即执行 then 中传入的 onFulfilled （这个 then 方法中的 onFulfilled 没必要再加入到回调队列中，因为它等不到 obj 执行 resolve 的那一天了，**Promise 的状态一经决议就不会改变**）

    - 如果 obj 已经为 rejected 状态，所做处理基本与 fulfilled 状态相同

4. 下面我们主要分析一下 pending 状态，如果 obj 在 pending 状态下执行了 then ，我们就等待 excutor 中的 resolve 或者 reject 被执行

   - resolve 执行

     接收一个参数 value , 如果 value 也是个 Promise 对象，那么返回 value.then(reslove, reject)

      ```js
      // 这里是为了保证一个 Promise 决议时的 value 绝对不会是另一个 Promise
      // 比如 promise1 = new Promise(resolve => resolve(promise2 = new Promise())) 的情况
      // 此时 promise1 决议的时候 value 为 promise2 ，那么就不能继续决议 promise1 了
      // 应该执行 promise2.then(resolve, reject)，等待 promise2 的决议然后再决议 promise1
      
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      ```

     异步执行接下来的步骤（此处的异步即放置在浏览器的微任务队列中）：

     如果 obj.status === 'pending'，改状态为 'fulfilled'，赋值 obj.value，执行全部 onFulfilledCallbacks 回调，这个时候就会调用我们在 then 中添加的 onFulfilled 函数

   - reject 执行

     接收一个参数 reason，异步执行接下来的步骤：

     如果 obj.status === 'pending'，改状态为 'fulfilled'，赋值 obj.reason，执行全部 onRejectedCallbacks 回调，这个时候就会调用我们在 then 中添加的 onRejected 函数

   - 关于异步执行

     我们说 Promise.then 是异步的，其实执行 then 方法不是异步的。但是 onFulfilled 和 onRejected 肯定是异步执行的，因为 resolve 和 reject 清空回调的时候是异步执行的

5. 执行 onFulfilled(value) 或者 onRejected(reason) 将返回值赋值给变量 x
    
    ```js
    let x = onFulfilled(value);
    ```

6. 执行 resolvePromise(promise2, x, resolve, reject)，根据 x 对 promise2 进行决议
    
    ```js
    resolvePromise(newPromise, x, resolve, reject);
    ```

   注意这里的 promise2 是 then 方法返回的 Promise 对象，resolve 和 reject 是 promise2 的 excutor 中的 resolve 和 reject，也就是说 resolvePromise 的执行过程中会对 promise2 进行决议

   我们仔细分析一下 resolvePromise 都做了什么

   首先这个参数 x 就是 onFulfilled(value) 的返回值，如果 onFulfilled 不是个函数，那它就会被改写成 `v => v`，也就是 `x = value`

   接下来就是判断 x 到底是什么

   - 如果 x === promise2，报循环引用的错误

   - 如果 x 是一个 Promise 对象且状态为 pending，那么就执行 x.then 将 onFulfilled 加入 x.onFulfilledCallbacks 回调并等待 x 决议， x 决议后执行回调中的 onFulfilled(x.value) 也就是 `x.value => resolvePromise(promise2, x.value, resolve, reject)`，而上文提到过此时的 x.value 绝不可能是一个 Promise 了

     ```js
     x.then(
       y => {
         resolvePromise(promise2, y, resolve, reject);
       },
       reason => {
         reject(reason);
       }
     );
     ```

   - 如果 x 是一个 thenable 对象，处理方式同 pending 状态的 Promise 对象，这里使用一个 called 锁来避免 thenable.then 多次调用传入的 onFulfilled/onRejected

   - 如果 x 是一个 Promise 对象且状态不为 pending，所以 x.value 或者 x.reason 必会存在一个，此时执行 `x.then(resolve, reject)`，直接决议 promise2 ，即执行 resolve(x.value) 或者 reject(x.reason)

   - 如果 x 是一个普通的函数/对象，或者其他数据类型，则 resolve(x)


## 重新梳理一下链式调用的流程

1. promise1 = new Promise(excutor = (resolve, reject) => { ... }) 中的 excutor 是立即执行的，但最后执行 resolve 可能是在异步操作中
   
2. promise1.then 会给 promise1 添加回调，然后返回一个新的 promise2，这个新的 promise2 的决议依靠之前回调中的 resolvePromise 方法
3. promise1 决议后会执行回调，首先执行 then 中传入的 onFulfilled(promise1.value)，赋值给变量 x，再执行 resolvePromise(promise2, x, promise2Resolve, promise2Reject)
4. 如果 x 是个已决议的 Promise 或者普通的数据类型，那么就可以 promise2Resolve(x) 决议 promise2
5. 如果 x 是个 pending 状态的 promise 或者 thenable 对象，那么执行 x.then ，将 resolvePromise 放入 x 的成功回调队列，等待 x 决议后将 x.value 成功赋值，然后执行 resolvePromise(promise2, x.value, promise2Resolve, promise2Reject)
6. 在此期间如果执行了 promise2.then 就新建一个 promise3 并返回 ，将新传入的 onFulfilled(promise2.value) 和针对 promise3 的 resolvePromise 传入 promise2 的成功回调队列中，等待 promise2 的决议
7. promise3.then 同上，就此实现了链式调用

## 链式调用的先后顺序
promise1 决议后才会决议 promise2 ，因为 promise2 的决议方法要在 promise1 的成功回调里执行

## 链式调用的透传
如果 promise1.then 中传入的的 onFulfilled 不是个函数，那么 onFulfilled 会在 then 中被改写成 `value => value`，这样就可以将 promise1.value 传递给 promise2 的 resolvePromise 帮助它决议。如果恰好 value 不是一个 pending 状态的 Promise 或者 thenable 对象，那么 promise2 会直接决议，然后 promise1.value 会被赋值给 promise2.value 进而传递给 promise3，这就是所谓的透传

## 思考

如果 promise2.then 的 onFulfilled/onRejected 反回了一个新的 PromiseA，那么 promise2 将直接取这个 PromiseA 的状态和值为己用，这发生在 resolvePromise 中；

如果 PromiseA 的 resolve 时传入的 value 是一个新的 PromiseB，那么 PromiseA 也会直接取这个 PromiseB 的状态和值为己用，这发生在 resolve 中；

也就是说，我们可以通过在 onFulfilled/onRejected 时返回一个 newPromise，或者 resolve 时传入一个 newPromise，再执行 `newPromise.then(resolve, reject)` 来实现一个 Promise 决议的挂起（后置），直至 newPromise 决议。

## Promise/A+ 规范实现

```js

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function Promise(excutor) {
  let that = this; 
  that.status = PENDING;
  that.value = undefined;
  that.reason = undefined;
  that.onFulfilledCallbacks = [];
  that.onRejectedCallbacks = [];

  function resolve(value) {
    
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }

    setTimeout(() => {
      if (that.status === PENDING) {
        that.status = FULFILLED;
        that.value = value;
        that.onFulfilledCallbacks.forEach(cb => cb(that.value));
      }
    });
  }

  function reject(reason) {
    setTimeout(() => {
      if (that.status === PENDING) {
        that.status = REJECTED;
        that.reason = reason;
        that.onRejectedCallbacks.forEach(cb => cb(that.reason));
      }
    });
  }

  try {
    excutor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise!"));
  }

  let called = false;
  if (x instanceof Promise) {
    if (x.status === PENDING) {
      x.then(
        y => {
          resolvePromise(promise2, y, resolve, reject);
        },
        reason => {
          reject(reason);
        }
      );
    } else {
      x.then(resolve, reject);
    }
  } else if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          reason => {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  const that = this;
  let newPromise;
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : value => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : reason => {
          throw reason;
        };

  if (that.status === FULFILLED) {
    return (newPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onFulfilled(that.value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }

  if (that.status === REJECTED) {
    return (newPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onRejected(that.reason);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }

  if (that.status === PENDING) {
    return (newPromise = new Promise((resolve, reject) => {
      that.onFulfilledCallbacks.push(value => {
        try {
          let x = onFulfilled(value);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      that.onRejectedCallbacks.push(reason => {
        try {
          let x = onRejected(reason);
          resolvePromise(newPromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }
};
```

## Promise.all

```js
/**
 * Promise.all Promise进行并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部变为resolve状态的时候，才会resolve。
 */
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let done = gen(promises.length, resolve);
    promises.forEach((promise, index) => {
      promise.then(value => {
        done(index, value);
      }, reject);
    });
  });
};

function gen(length, resolve) {
  let count = 0;
  let values = [];
  return function(i, value) {
    values[i] = value;
    if (++count === length) {
      resolve(values);
    }
  };
}
```

## Promise.race

```js
/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(resolve, reject);
    });
  });
};
```

## Promise.catch

```js
// 用于promise方法链时 捕获前面onFulfilled/onRejected抛出的异常
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};
```

## Promise.resolve

```js
Promise.resolve = function(value) {
  return new Promise(resolve => {
    resolve(value);
  });
};
```

## Promise.reject

```js
Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);s
  });
};
```

## Promise.finally

```js
Promise.prototype.finally = function(callback) {
  this.then(value => {
    return Promise.resolve(callback()).then(() => {
      return value;
    })
  }, error => {
    return Promise.resolve(callback()).then(() => {
      throw error;
    })
  })
}
```