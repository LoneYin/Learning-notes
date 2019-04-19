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
// [1, [2, 3, [4, 5]]]  ------>    [1, 2, 3, 4, 5]

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
function flatten(arr) {
    const result = []
    const func = arrInside => {
        for (let item of arrInside) {
            if (Array.isArray(item)) {
                func(item)
            } else {
                result.push(item)
            }
        }
    }s
    func(arr)
    return result
}
// 转字符串法 不过只适用于纯数字数组
function flatten(arr) {
    return arr.toString().split(',').map(item => Number(item))
}
```