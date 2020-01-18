# null 和 undefined 的 区别

## 为什么会出现 undefined

历史原因，js的作者在创造这门语言的时候，发现 Number(null) == 0 而不是他想要的 NaN，而这无疑会引发很多问题，所以他又创造出了 undefined ，Number(undefined) 值为 NaN

使用起来是没有区别的，但是js一些未赋值的情景下，默认都是采用undefined