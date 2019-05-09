# 封装一个Timer类，实现setTimeout以及用setTimeout实现setInterval

## 代码如下

```javascript
class Timer {
    constructor(once) {
        if (once) {
            this.isTimeout = true
        }
    }

    isTimeout = false
    identifier = undefined
    set(fn, duraing = 1000) {
        if (fn && typeof fn === 'function') {
            this.identifier = setTimeout(() => {
                fn()
                !this.isTimeout && this.set(fn, duraing)
                this.isTimeout && this.clear()
            }, duraing)
        } else {
            throw new Error('fn must be a function')
        }
    }
    clear() {
        clearTimeout(this.identifier)
    }
}
```