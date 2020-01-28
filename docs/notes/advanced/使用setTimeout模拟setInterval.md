# 封装一个 Timer 类，用 setTimeout 实现 setInterval

## 代码如下

```javascript
class Timer {
  constructor(once) {
    if (once) {
      this.isTimeout = true;
    }
  }

  isTimeout = false;
  identifier = undefined;
  set(fn, duraing = 1000) {
    if (fn && typeof fn === "function") {
      this.identifier = setTimeout(() => {
        fn();
        if (this.isTimeout) {
          this.clear();
        } else {
          this.set(fn, duraing);
        }
      }, duraing);
    } else {
      throw new Error("fn must be a function");
    }
  }
  clear() {
    clearTimeout(this.identifier);
  }
}
```
