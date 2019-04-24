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
3. 当等式两边一个值为`Object`另一个为`Number`时，将`Object`进行类型转换，即`[].valueOf()`，发现返回的结果`'[]'`与`0`还是不相等，所以再调用`[].toString()`得到`''`，`Number('')`得到`0`
4. `0 == 0` 成立， 返回`true`