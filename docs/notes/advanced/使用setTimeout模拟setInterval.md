# 用 setTimeout 实现 setInterval

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
  set(cb, duraing = 1000) {
    if (cb && typeof cb === "function") {
      this.identifier = setTimeout(() => {
        cb();
        this.isTimeout ? this.clear() : this.set(cb, duraing);
      }, duraing);
    } else {
      throw new Error("cb must be a function");
    }
  }
  clear() {
    clearTimeout(this.identifier);
    this.identifier = undefined;
  }
}
```
