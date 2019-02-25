function throttle(fn, cycle) {
    let start = Date.now();
    let now;
    let timer;
    return function() {
        now = Date.now();
        if (now - start >= cycle) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            fn.apply(this, arguments);
            start = now;
        } else if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, arguments);
            }, cycle);
        }
    };
}

document.querySelector('body').addEventListener(
    'mousemove',
    debounce(function(e) {
        console.log(1);
    }, 500)
);
function debounce(fn, delay) {
    let timer = null;
    return function() {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
}

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, timer;
    return function() {
        var context = scope || this;

        var now = new Date(),
            args = arguments;
        if (last && now - last - threshhold < 0) {
            // hold on to it
            clearTimeout(timer);
            timer = setTimeout(function() {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

function throttle(fn, delay) {
    let timer = null,
        remaining = 0,
        previous = new Date();

    return function() {
        let now = new Date();
        remaining = now - previous;

        if (remaining >= delay) {

            if (timer) {
                clearTimeout(timer);
            }

            fn.apply(this, arguments);
            previous = now;
        } else {
            if (!timer) {
                timer = setTimeout(function() {
                    fn.apply(this, arguments);
                    previous = new Date();
                }, delay - remaining);
            }
        }
    };
}

function throttle(fn, delay) {
    let timer = null,
        context = this,
        remaining = 0,
        previous = new Date();
    return function() {
        let now = new Date();
        remaining = now - previous;
        if (remaining >= delay) {
            timer && clearTimeout(timer);
            timer = null;
            console.log(this);
            console.log(context);
            fn.apply(context, arguments);
            previous = now;
        } else {
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(context, arguments);
                    previous = new Date();
                }, delay - remaining);
            }
        }
    };
}
document.querySelector('body').addEventListener(
    'mousemove',
    throttle(function(e) {
        console.log(1);
    }, 500)
);