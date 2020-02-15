# Webpack 知识点整理

## Webpack 核心概念

- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

## Webpack 的工作原理

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；

2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

## Webpack 模块化原理

首先 webpack 的 bundle.js 最外层是一个自执行函数

如果有异步加载的模块，那么这个函数中还会额外定义一个 webpackJsonpCallback 方法和一个 requireEnsure（ __webpack_require__.e ）方法

- __webpack_require__.e 用于加载被分割出去的，需要异步加载的 Chunk 对应的文件
- webpackJsonp 用于从异步加载的文件中安装模块

在使用了 CommonsChunkPlugin 去提取公共代码时输出的文件和使用了异步加载时输出的文件是一样的，都会有__webpack_require__.e和webpackJsonp。 原因在于提取公共代码和异步加载本质上都是代码分割

```js
(function(modules) {
  // 模拟 require 语句
  function __webpack_require__() {
    ...
  }
  // 执行存放所有模块数组中的第0个模块
  __webpack_require__(0);
})([
  /*存放所有模块的数组*/
  (function(module, exports, __webpack_require__) {
    // 第一个模块基本上就是入口文件 moduleId = 0
    // 通过 __webpack_require__ 规范导入 show 函数，show.js 对应的模块 index 为 1
    const show = __webpack_require__(1);
    // 执行 show 函数
    show("Webpack");
  }),
  (function (module, exports) {
      function show(content) {
        window.document.getElementById('app').innerText = 'Hello,' + content;
      }
      // 通过 CommonJS 规范导出 show 函数
      module.exports = show;
  })
]);
```

让我们来看一下 **webpack_require** 函数

```js
var installedModules = {}

function __webpack_require__(moduleId) {
  // Check if module is in cache
  if (installedModules[moduleId]) return installedModules[moduleId].exports;
  // Create a new module (and put it into the cache)
  var module = (installedModules[moduleId] = {
    exports: {},
    id: moduleId,
    loaded: false
  });
  // Execute the module function
  modules[moduleId].call(
    module.exports,
    module,
    module.exports,
    __webpack_require__
  );
  // Flag the module as loaded
  module.loaded = true;
  // Return the exports of the module
  return module.exports;
}
```

实际上就是模拟了 CommonJs 的 require module 和 exports，然后将 module exports require 作为参数传递给 modules 中的 module 使用


## Webpack 的 HMR 原理

1. webpack 对文件系统进行 watch 并打包到内存中

   webpack-dev-middleware 调用 webpack 的 api 对文件系统 watch，当 hello.js 文件发生改变后，webpack 重新对文件进行编译打包，然后保存到内存中。

2. devServer 通知浏览器端文件发生改变

   在这一阶段，sockjs 是服务端和浏览器端之间的桥梁，在启动 devServer 的时候，sockjs 在服务端和浏览器端建立了一个 webSocket 长连接，以便将 webpack 编译和打包的各个阶段状态告知浏览器，最关键的步骤还是 webpack-dev-server 调用 webpack 的 compiler 钩子监听 done 事件，当 compile 完成后，webpack-dev-server 通过 \_sendStatus 方法将编译打包后的新模块 hash 值发送到浏览器端。

3. webpack-dev-server/client 接收到服务端消息做出响应

   webpack-dev-server/client 当接收到 type 为 hash 消息后会将 hash 值暂存起来，当接收到 type 为 ok 的消息后对应用执行 reload 操作，如下图所示，hash 消息是在 ok 消息之前。

   在 reload 操作中，webpack-dev-server/client 会根据 hot 配置决定是刷新浏览器还是对代码进行热更新（HMR）

   首先将 hash 值暂存到 currentHash 变量，当接收到 ok 消息后，对 App 进行 reload。如果配置了模块热更新，就调用 webpack/hot/emitter 将最新 hash 值 通过 `hotEmitter.emit('webpackHotUpdate', currentHash)` 发送给 webpack/hot/dev-server（这个东西也在浏览器中）

4. webpack/hot/dev-server 接收到最新 hash 值验证并通过 HMR runtime 请求模块代码

   webpack/hot/dev-server 监听第三步 webpack-dev-server/client 发送的 webpackHotUpdate 消息，调用 webpack/lib/HotModuleReplacement.runtime（简称 HMR runtime）中的 check 方法，检测是否有新的更新。如果有更新，则通过 JSONP 请求最新的模块代码，HMR runtime 会根据返回的新模块代码做进一步处理，可能是刷新页面，也可能是对模块进行热更新。

5. HotModuleReplacement.runtime 对模块进行热更新

   这一步是整个模块热更新（HMR）的关键步骤，而且模块热更新都是发生在 HMR runtime 中的 hotApply 方法中

   模块热替换主要分三个阶段：

   - 第一个阶段是找出 outdatedModules 和 outdatedDependencies
   - 第二个阶段从缓存中删除过期的模块和依赖
   - 第三个阶段是将新的模块添加到 modules 中，当下次调用 **webpack_require** 方法的时候，就是获取到了新的模块代码了


## Webpack 优化

1. 使用 HappyPack 

   进行多进程 Loader 转换，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。
  
2. 使用 ParallelUglifyPlugin 并行压缩

   它会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过 UglifyJS 去压缩代码，但是变成了并行执行。 所以 ParallelUglifyPlugin 能更快的完成对多个文件的压缩工作。

3. 开启 Tree Shaking （webpack-deep-scope-analysis-plugin）

    Tree Shaking原理：
    
    ES6的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码。分析程序流，判断哪些变量未被使用、引用，进而删除此代码。

4. 提取公共代码 CommonsChunkPlugin

5. 按需加载 调用 Webpack 的 import 方法
   
6. 开启 Scope Hoisting (作用于提升)

    Scope Hoisting 的实现原理其实很简单：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。 因此只有那些被引用了一次的模块才能被合并。

## output 中 chunk 的 hash 类型

1. **hash**
> 所有文件哈希值相同，只要改变内容跟之前的不一致，所有哈希值都改变，没有做到缓存意义

hash是跟整个项目的构建相关，构建生成的文件hash值都是一样的，所以hash计算是跟整个项目的构建相关，同一次构建过程中生成的hash都是一样的，只要项目里有文件更改，整个项目构建的hash值都会更改。

如果出口是hash，那么一旦针对项目中任何一个文件的修改，都会构建整个项目，重新获取hash值，缓存的目的将失效。

2. **chunkhash**
> 同一个模块，就算将js和css分离，其哈希值也是相同的，修改一处，js和css哈希值都会变，同hash，没有做到缓存意义

它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的hash值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成hash值，那么只要我们不改动公共库的代码，就可以保证其hash值不会受影响。

由于采用chunkhash，所以项目主入口文件main.js及其对应的依赖文件main.css由于被打包在同一个模块，所以共用相同的chunkhash。
这样就会有个问题，只要对应css或则js改变，与其关联的文件hash值也会改变，但其内容并没有改变，所以没有达到缓存意义。

3. **contenthash**
> 只要文件内容不一样，产生的哈希值就不一样

contenthash表示由文件内容产生的hash值，内容不同产生的contenthash值也不一样。在项目中，通常做法是把项目中css都抽离出对应的css文件来加以引用。