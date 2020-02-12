module.exports = {
  base: "/Learning-notes/",
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
            "network/TCP与DNS",
            "network/HTTP协议",
            "network/GET和POST请求的区别",
            "network/Web安全"
          ]
        },
        {
          title: "JavaScript进阶",
          collapsable: false,
          children: [
            "advanced/JS执行上下文栈",
            "advanced/原型链与继承",
            "advanced/Iterator和Generator",
            "advanced/Promise",
            "advanced/节流和防抖",
            "advanced/函数柯里化",
            "advanced/bind和call和apply",
            "advanced/另一个角度理解this",
            "advanced/闭包",
            "advanced/常见算法",
            "advanced/深拷贝",
            "advanced/单例模式",
            "advanced/观察者模式",
            "advanced/使用setTimeout模拟setInterval",
            "advanced/new运算符"
          ]
        },
        {
          title: "其他知识",
          collapsable: false,
          children: [
            "others/模块加载机制",
            "others/前端性能优化",
            "others/面试题整理",
            "others/最后梳理一遍输入URL到页面渲染的流程"
          ]
        }
      ],
      "/essays/": [
        {
          title: "个人随笔",
          collapsable: false,
          children: [
            "essay/给ReactRouter添加转场动画",
            "essay/Vue列表渲染中的key的作用",
            "essay/vue源码阅读知识点整理",
            "essay/Webpack知识点整理",
            "essay/Vue与React的区别",
          ]
        }
      ]
    },
    nav: [
      {
        text: "前端笔记",
        link: "/notes/"
      },
      {
        text: "个人随笔",
        link: "/essays/"
      }
    ]
  }
};
