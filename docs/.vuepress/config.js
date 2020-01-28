module.exports = {
  title: "学习笔记",
  description: "构建自己的前端知识体系",
  themeConfig: {
    sidebar: {
      "/notes/": [
        {
          title: "浏览器知识",
          collapsable: false,
          children: [
            "browser/浏览器的进程与线程",
            "browser/浏览器的渲染原理",
            "browser/浏览器JS引擎",
            "browser/浏览器EventLoop",
            "browser/浏览器缓存策略",
            "browser/跨域与页面通信",
            "browser/浏览器DOM事件与事件监听"
          ]
        },
        {
          title: "网络知识",
          collapsable: false,
          children: [
            "network/网络知识",
            "network/Web安全"
          ]
        },
        {
          title: "JavaScript进阶",
          collapsable: false,
          children: [
            "advanced/JS执行上下文栈",
            "advanced/原型链与继承",
            "advanced/Generator",
            "advanced/Promise",
            "advanced/Proxy",
            "advanced/节流和防抖",
            "advanced/函数柯里化",
            "advanced/bind和call和apply",
            "advanced/常见算法",
          ]
        },
        {
          title: "其他知识",
          collapsable: false,
          children: [
            "others/模块加载机制",
            "others/前端性能优化",
            "others/移动端适配方案",
            "others/Vue与React的区别"
          ]
        },
        {
          title: '个人随笔',
          collapsable: false,
          children: [
            "essay/vue源码阅读知识点整理"
          ]
        }
      ]
    },
    nav: [
      {
        text: "笔记",
        link: "/notes/"
      }
    ]
  }
};