# 一些JS面试题整理

## Q1：输出以下代码的执行结果并解释为什么

```javascript
var a = {n: 1};
var b = a;
a.x = a = {n: 2};

console.log(a.x)
console.log(b.x)

a.x // --> undefined
b.x // --> {n: 2}
```

### 解析：

**运算符优先级和连续赋值带来的坑**

首先，`a`和`b`同时引用了`{n:2}`对象，接着执行到`a.x = a = {n：2}`语句，尽管赋值是从右到左的没错，但是`.`的优先级比`=`要高，所以这里首先执行`a.x`，相当于为`a`（或者`b`）所指向的`{n:1}`对象新增了一个属性x，即此时对象将变为`{n:1;x:undefined}`。

之后按正常情况，从右到左进行赋值，此时执行`a ={n:2}`的时候，`a`的引用改变，指向了新对象`{n：2}`,而`b`依然指向的是旧对象。之后执行`a.x = {n：2}`的时候，并不会重新解析一遍`a`，而是沿用最初解析`a.x`时候的`a`，也即旧对象，故此时旧对象的`x`的值为`{n：2}`，旧对象为 `{n:1;x:{n：2}}`，它被`b`引用着。

后面输出`a.x`的时候，又要解析`a`了，此时的`a`是指向新对象的`a`，而这个新对象是没有`x`属性的，故访问时输出`undefined`；而访问`b.x`的时候，将输出旧对象的`x`的值，即`{n:2}`。

## Q2：数组扁平化

```javascript
// [[1,2,2],[3, 4, 5, 5],[6, 7, 8, 9,[11,12,[12,13,[14]]]],10]  ------>   [1,2,2,3,4,5,5,6,7,8,9,11,12,12,13,14,10]

// 递归法  可使用reduce map for循环等实现
// reduce
function flatten(arr) {
    return arr.reduce((total, item) => total.concat(Array.isArray(item) ? flatten(item) : [item]), [])
}
// map
function flatten(arr) {
    return [].concat(...arr.map(item => Array.isArray(item) ? flatten(item) : item))
}
// for
function flatten(arr, result = []) {
    for (let item of arr) {
        if (Array.isArray(item)) {
            flatten(item, result)
        } else {
            result.push(item)
        }
    }
    return result
}
// 转字符串法 不过只适用于纯数字数组
function flatten(arr) {
    return arr.toString().split(',').map(item => Number(item))
}
```

## Q3：['1', '2', '3'].map(parseInt) 返回结果

### Arrray.map

`Array.map`方法会遍历原数组中的每个元素并执行`callback`，返回一个新的数组

- `callback`的第一个参数是`currentValue`，也就是原数组中正在处理的当前元素
- `callback`的第二个参数是`index`，是原数组中正在处理的当前元素的索引

### parseInt

`parseInt`方法解析一个字符串参数，并返回一个指定基数（进制）的整数

- `parseInt`的第一个参数是`string`，也就是要被解析的字符串的值
- `parseInt`得第二个参数是`radix`，一个介于2和36之间的整数，默认为10，代表解析字符串的基数（进制数）

```javascript
['1', '2', '3'].map(parseInt)
```

等同于

```javascript
['1', '2', '3'].map((item, index) => {
    return parseInt(item, index)
})
```

即返回值分别为

```javascript
parseInt('1', 0) //radix为0时，且string参数不以“0x”和“0”开头时，按照10为基数处理。这个时候返回1
parseInt('2', 1) //基数为1（1进制）表示的数中，最大值小于2，所以无法解析，返回NaN
parseInt('3', 2) //基数为2（2进制）表示的数中，最大值小于3，所以无法解析，返回NaN
```

所以

```javascript
['1', '2', '3'].map(parseInt)
// 1, NaN, NaN
```

## Q4：[] == ![]

```javascript
[] == ![]  // true
```

### 解析：

`==` 运算符，`javascript`语言灵活性的代表但也是最臭名昭著的黑魔法之一，比较运算之中发生的隐式类型转化不知坑了多少JSer。

我们先来列举一下`==`（相等运算符）的运算规则

- 如果两个值类型相同，进行 `====` （严格相等运算符） 比较
- 如果两个值类型不同，它们可能是相等的，此时根据下列规则进行类型转换后比较:
    1. 如果一个值为`null`，另一个是`undefined`，那么**相等**
    2. 如果一个值是`String`，另一个是`Number`，在比较之前要先将`String`转换为`Number`，即调用`Number()`方法
    3. 如果一个值是`Boolean`，则先将这个`Boolean`转换为数值后再进行比较，即调用`Number()`方法
    4. 如果一个值是`Object`，另一个是`String`或`Number`，则先将对象转换为基本数据类型再比较，即调用`javascript`内置类的`valueOf`或`toString`方法，`valueOf`会先于`toString`，例外的是`Date`对象，会直接用`toString`转换

接下来我们分析一下`[] == ![]`为什么返回`true`

1. 首先运算符右边的`![]`会先进行运算，得到`false`，即`[] == false`
2. 当等式两边有`Boolean`值得时候会先对其进行类型转换，即`Number(false) = 0`，等式两边变为`[] == 0`
3. 当等式两边一个值为`Object`另一个为`Number`时，将`Object`进行类型转换，即`[].valueOf()`，发现返回的结果`[]`仍是`Object`，所以再调用`[].toString()`得到`''`，`Number('')`得到`0`
4. `0 == 0` 成立， 返回`true`

## Q5: React中setState在什么情况下是同步的？

在 React 中，如果是在 React 引发的事件处理方法（比如通过 onClick 引发的事件处理）或在生命周期中调用 setState 不会同步更新 this.state 。除此之外的 setState 调用会同步执行this.state。所谓**除此之外**，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。

> 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。  —— [官方文档](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)

>setState 的**异步**并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。

> setState 的批量更新优化也是建立在**异步**（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在**异步**中如果对同一个值进行多次 setState ， setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

关于setState的具体内容详见大佬的文章[《你真的理解setState吗？》](https://juejin.im/post/5b45c57c51882519790c7441)

## Q6: HTTP2.0了解吗？

HTTP2.0新特性如下：

1. **新的二进制格式**： HTTP1.x的解析是基于文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认0和1的组合。基于这种考虑HTTP2.0的协议解析决定采用二进制格式，实现方便且健壮。
2. **多路复用**：即连接共享，HTTP2.0多个请求可同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其它连接的正常执行，HTTP1.x则可能会因为一个请求超时而发生线头阻塞。
3. **header压缩**：HTTP1.x的header带有大量信息，而且每次都要重复发送，HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小。
4. **服务端推送**：服务端推送能把客户端所需要许多资源随着单次请求一起发送到客户端，省去了客户端重复请求的步骤

## Q7: TCP连接的三次握手和四次挥手

### 三次握手：

客户端：我想和你建立连接

服务端：ok，我现在可以和你建立连接

客户端：好的，那我们现在开始连接吧

### 四次挥手：

客户端：我准备断开连接了

服务端：ok，但是我这边可能还有一些数据要传，等我传我我会通知你

服务端：我传完了，可以断开连接了

客户端：ok，你断开连接吧

（服务端：收到客户端最后一次信息后断开连接，未收到就会要求客户端重新发送关闭信息）

（客户端：发送最后一次信息后等待2MLS(2倍报文最大生存时间)，没有收到服务端的重传请求就关闭自己的连接）

### 三次握手具体操作：

- 第一次握手：客户端发送一个TCP标志位SYN=1，ACK=0的数据包给服务端，并随机会产生一个Sequence number=3233.当服务端接收到这个数据后，服务端由SYN=1可知客户端是想要建立连接；

- 第二次握手：服务端要对客户端的联机请求进行确认，向客户端发送应答号ACK=1、SYN=1
确认号Acknowledge number=3234，此值是客户端的序列号加1，还会产生一个随机的序列号Sequence number=36457，这样就告诉客户端可以进行连接；

- 第三次握手：客户端收到数据后检查Acknowledge number是否是3233+1的值，以及ACK的值是否为1，若为1，host1会发送ACK=1、确认号码Acknowledge number=36457，告诉服务端,你的请求连接被确认，连接可以建立。

### 四次挥手具体操作：

- 第一次挥手：当传输的数据到达尾部时，客户端向服务端发送FIN=1标志位；可理解成，客户端向服务端说，我这边的数据传送完成了，我准备断开了连接；

- 第二次挥手：因TCP的连接是全双工的双向连接，关闭也是要从两边关闭；当服务端收到客户端发来的FIN=1的标志位后，服务端不会立刻向客户端发送FIND=1的请求关闭信息，
而是先向客户端发送一个ACK=1的应答信息，表示：你请求关闭的请求我已经收到，但我可能还有数据没有完成传送，你再等下，等我数据传输完成了我就告诉你；

- 第三次挥手：服务端数据传输完成，向客户端发送FIN=1，客户端收到请求关闭连接的请求后，客户端就明白服务端的数据已传输完成，现在可以断开连接了，

- 第四次挥手：客户端收到FIND=1后，客户端还是怕由于网络不稳定的原因，怕服务端不知道他要断开连接，于是向服务端发送ACK=1确认信息进行确认，
把自己设置成TIME_WAIT状态并启动定时器，如果服务端没有收到ACK，服务端TCP的定时器到达后，会要求客户端重新发送ACK，当服务端收到ACK后，服务端就断开连接；
当客户端等待2MLS（2倍报文最大生存时间）后，没有收到服务端的重传请求后，他就知道服务端已收到了ACK，所以客户端此时才关闭自己的连接。

## Q8: HTTPS的握手流程

1. 浏览器给出协议版本号、一个客户端生成的随机数（Client random），以及客户端支持的加密方法。

2. web服务器确认双方使用的加密方法，并给出数字证书、以及一个服务器生成的随机数（Server random）。

3. 浏览器确认数字证书有效，然后生成一个新的随机数（Premaster secret），并使用数字证书中的公钥，加密这个随机数，发给web服务器。

4. web服务器使用自己的私钥，获取浏览器发来的随机数（即Premaster secret）。

5. 浏览器和web服务器根据约定的加密方法，使用前面的三个随机数，生成"对话密钥"（session key），用来加密接下来的整个对话过程。

## Q9: Function.__proto__ === Function.prototype?
是对的  因为 Function 也是一个函数，它的__proto__指向 Function 构造函数的原型，很扯

应该是现有 Function.prototype 然后有的 function Function()