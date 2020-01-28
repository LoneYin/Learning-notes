(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{224:function(e,t,r){"use strict";r.r(t);var v=r(0),_=Object(v.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("h1",{attrs:{id:"web安全-——-xss-与-csrf"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#web安全-——-xss-与-csrf"}},[e._v("#")]),e._v(" Web安全 —— XSS 与 CSRF")]),e._v(" "),r("h2",{attrs:{id:"xss-攻击"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#xss-攻击"}},[e._v("#")]),e._v(" XSS 攻击")]),e._v(" "),r("h3",{attrs:{id:"xss-是什么？"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#xss-是什么？"}},[e._v("#")]),e._v(" XSS 是什么？")]),e._v(" "),r("p",[e._v("XSS，即 Cross Site Script，是指攻击者在网站上注入恶意的客户端代码，通过恶意脚本对客户端网页进行篡改，从而在用户浏览网页时，对用户浏览器进行控制或者获取用户隐私数据的一种攻击方式。")]),e._v(" "),r("p",[e._v("攻击者对客户端网页注入的恶意脚本一般包括 JavaScript，有时也会包含 HTML 和 Flash。有很多种方式进行 XSS 攻击，但它们的共同点为：将一些隐私数据像 cookie、session 发送给攻击者，将受害者重定向到一个由攻击者控制的网站，在受害者的机器上进行一些恶意操作。")]),e._v(" "),r("h3",{attrs:{id:"xss-的种类"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#xss-的种类"}},[e._v("#")]),e._v(" XSS 的种类")]),e._v(" "),r("ul",[r("li",[r("h4",{attrs:{id:"反射型"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#反射型"}},[e._v("#")]),e._v(" 反射型")]),e._v(" "),r("p",[e._v("反射型 XSS 的攻击步骤：")]),e._v(" "),r("ol",[r("li",[e._v("攻击者构造出特殊的 URL，其中包含恶意代码。")]),e._v(" "),r("li",[e._v("用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。")]),e._v(" "),r("li",[e._v("用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。")]),e._v(" "),r("li",[e._v("恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执 5. 行攻击者指定的操作。")])]),e._v(" "),r("p",[e._v("反射型 XSS 跟存储型 XSS 的区别是：存储型 XSS 的恶意代码存在数据库里，反射型 XSS 的恶意代码存在 URL 里。")]),e._v(" "),r("p",[e._v("反射型 XSS 漏洞常见于通过 URL 传递参数的功能，如网站搜索、跳转等。")]),e._v(" "),r("p",[e._v("由于需要用户主动打开恶意的 URL 才能生效，攻击者往往会结合多种手段诱导用户点击。\nPOST 的内容也可以触发反射型 XSS，只不过其触发条件比较苛刻（需要构造表单提交页面，并引导用户点击），所以非常少见。")])]),e._v(" "),r("li",[r("h4",{attrs:{id:"存储型"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#存储型"}},[e._v("#")]),e._v(" 存储型")]),e._v(" "),r("p",[e._v("存储型 XSS 的攻击步骤：")]),e._v(" "),r("ol",[r("li",[e._v("攻击者将恶意代码提交到目标网站的数据库中。")]),e._v(" "),r("li",[e._v("用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。")]),e._v(" "),r("li",[e._v("用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。")]),e._v(" "),r("li",[e._v("恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。")])]),e._v(" "),r("p",[e._v("这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信(UGC 内容)等。")])]),e._v(" "),r("li",[r("h4",{attrs:{id:"dom型"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#dom型"}},[e._v("#")]),e._v(" DOM型")]),e._v(" "),r("p",[e._v("DOM 型 XSS 的攻击步骤：")]),e._v(" "),r("ol",[r("li",[e._v("攻击者构造出特殊的 URL，其中包含恶意代码。")]),e._v(" "),r("li",[e._v("用户打开带有恶意代码的 URL。")]),e._v(" "),r("li",[e._v("用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。")]),e._v(" "),r("li",[e._v("恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。")])]),e._v(" "),r("p",[e._v("DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。")])])]),e._v(" "),r("h3",{attrs:{id:"怎么预防xss攻击？"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#怎么预防xss攻击？"}},[e._v("#")]),e._v(" 怎么预防XSS攻击？")]),e._v(" "),r("ul",[r("li",[r("p",[e._v("改成纯前端渲染，把代码和数据分隔开")]),e._v(" "),r("p",[e._v("在纯前端渲染中，我们会明确的告诉浏览器：下面要设置的内容是文本（.innerText），还是属性（.setAttribute），还是样式（.style）等等。浏览器不会被轻易的被欺骗，执行预期外的代码了。但纯前端渲染还需注意避免 DOM 型 XSS 漏洞（例如 onload 事件和 href 中的 javascript:xxx 等）")])]),e._v(" "),r("li",[r("p",[e._v("对 HTML 做充分转义")]),e._v(" "),r("p",[e._v("常用的模板引擎，如 doT.js、ejs、FreeMarker 等，对于 HTML 转义通常只有一个规则，就是把 & < > \" ' / 这几个字符转义掉，确实能起到一定的 XSS 防护作用，但并不完善，尽量使用")])]),e._v(" "),r("li",[r("p",[e._v("Content Security Policy（H5内容安全策略）")]),e._v(" "),r("p",[e._v("严格的 CSP 在 XSS 的防范中可以起到以下的作用：")]),e._v(" "),r("ul",[r("li",[r("p",[e._v("禁止加载外域代码，防止复杂的攻击逻辑。")])]),e._v(" "),r("li",[r("p",[e._v("禁止外域提交，网站被攻击后，用户的数据不会泄露到外域。")])]),e._v(" "),r("li",[r("p",[e._v("禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）。")])]),e._v(" "),r("li",[r("p",[e._v("禁止未授权的脚本执行（新特性，Google Map 移动版在使用）。")])]),e._v(" "),r("li",[r("p",[e._v("合理使用上报可以及时发现 XSS，利于尽快修复问题。")])])])]),e._v(" "),r("li",[r("p",[e._v("输入内容长度控制，用户输入检查，服务端输出检查")])]),e._v(" "),r("li",[r("p",[e._v("HTTP-only Cookie:\n禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie。")])]),e._v(" "),r("li",[r("p",[e._v("少用 .innerHTML、.outerHTML、document.write() 或者 eval()、setTimeout()、setInterval()")])])]),e._v(" "),r("h2",{attrs:{id:"csrf-攻击"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#csrf-攻击"}},[e._v("#")]),e._v(" CSRF 攻击")]),e._v(" "),r("h3",{attrs:{id:"csrf-是什么？"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#csrf-是什么？"}},[e._v("#")]),e._v(" CSRF 是什么？")]),e._v(" "),r("p",[e._v("CSRF 跨站点请求伪造(Cross—Site Request Forgery)，跟 XSS 攻击一样，存在巨大的危害性，你可以这样来理解：")]),e._v(" "),r("p",[e._v("攻击者盗用了你的身份，以你的名义发送恶意请求，对服务器来说这个请求是完全合法的，但是却完成了攻击者所期望的一个操作，比如以你的名义发送邮件、发消息，盗取你的账号，添加系统管理员，甚至于购买商品、虚拟货币转账等。 如下：其中 Web A 为存在 CSRF 漏洞的网站，Web B 为攻击者构建的恶意网站，User C 为 Web A 网站的合法用户。")]),e._v(" "),r("h3",{attrs:{id:"csrf-攻击介绍及防御"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#csrf-攻击介绍及防御"}},[e._v("#")]),e._v(" CSRF 攻击介绍及防御")]),e._v(" "),r("p",[e._v("CSRF 攻击攻击原理及过程如下：")]),e._v(" "),r("ol",[r("li",[r("p",[e._v("用户 C 打开浏览器，访问受信任网站 A，输入用户名和密码请求登录网站 A；")])]),e._v(" "),r("li",[r("p",[e._v("在用户信息通过验证后，网站 A 产生 Cookie 信息并返回给浏览器，此时用户登录网站 A 成功，可以正常发送请求到网站 A；")])]),e._v(" "),r("li",[r("p",[e._v("用户未退出网站 A 之前，在同一浏览器中，打开一个 TAB 页访问网站 B；")])]),e._v(" "),r("li",[r("p",[e._v("网站 B 接收到用户请求后，返回一些攻击性代码，并发出一个请求要求访问第三方站点 A；")])]),e._v(" "),r("li",[r("p",[e._v("浏览器在接收到这些攻击性代码后，根据网站 B 的请求，在用户不知情的情况下携带 Cookie 信息，向网站 A 发出请求。网站 A 并不知道该请求其实是由 B 发起的，所以会根据用户 C 的 Cookie 信息以 C 的权限处理该请求，导致来自网站 B 的恶意代码被执行。")])])]),e._v(" "),r("h3",{attrs:{id:"csrf-攻击实例"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#csrf-攻击实例"}},[e._v("#")]),e._v(" CSRF 攻击实例")]),e._v(" "),r("p",[e._v("受害者 Bob 在银行有一笔存款，通过对银行的网站发送请求 "),r("code",[e._v("http://bank.example/withdraw?account=bob&amount=1000000&for=bob2")]),e._v(" 可以使 Bob 把 1000000 的存款转到 bob2 的账号下。通常情况下，该请求发送到网站后，服务器会先验证该请求是否来自一个合法的 session，并且该 session 的用户 Bob 已经成功登陆。")]),e._v(" "),r("p",[e._v("黑客 Mallory 自己在该银行也有账户，他知道上文中的 URL 可以把钱进行转帐操作。Mallory 可以自己发送一个请求给银行："),r("code",[e._v("http://bank.example/withdraw?account=bob&amount=1000000&for=Mallory")]),e._v("。但是这个请求来自 Mallory 而非 Bob，他不能通过安全认证，因此该请求不会起作用。")]),e._v(" "),r("p",[e._v("这时，Mallory 想到使用 CSRF 的攻击方式，他先自己做一个网站，在网站中放入如下代码： "),r("code",[e._v('src="http://bank.example/withdraw?account=bob&amount=1000000&for=Mallory"')]),e._v(" ，并且通过广告等诱使 Bob 来访问他的网站。当 Bob 访问该网站时，上述 url 就会从 Bob 的浏览器发向银行，而这个请求会附带 Bob 浏览器中的 cookie 一起发向银行服务器。大多数情况下，该请求会失败，因为他要求 Bob 的认证信息。但是，如果 Bob 当时恰巧刚访问他的银行后不久，他的浏览器与银行网站之间的 session 尚未过期，浏览器的 cookie 之中含有 Bob 的认证信息。这时，悲剧发生了，这个 url 请求就会得到响应，钱将从 Bob 的账号转移到 Mallory 的账号，而 Bob 当时毫不知情。等以后 Bob 发现账户钱少了，即使他去银行查询日志，他也只能发现确实有一个来自于他本人的合法请求转移了资金，没有任何被攻击的痕迹。而 Mallory 则可以拿到钱后逍遥法外。")]),e._v(" "),r("h3",{attrs:{id:"csrf-漏洞检测"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#csrf-漏洞检测"}},[e._v("#")]),e._v(" CSRF 漏洞检测")]),e._v(" "),r("p",[e._v("检测 CSRF 漏洞是一项比较繁琐的工作，最简单的方法就是抓取一个正常请求的数据包，去掉 Referer 字段后再重新提交，如果该提交还有效，那么基本上可以确定存在 CSRF 漏洞。")]),e._v(" "),r("p",[e._v("随着对 CSRF 漏洞研究的不断深入，不断涌现出一些专门针对 CSRF 漏洞进行检测的工具，如 CSRFTester，CSRF Request Builder 等。")]),e._v(" "),r("p",[e._v("以 CSRFTester 工具为例，CSRF 漏洞检测工具的测试原理如下：使用 CSRFTester 进行测试时，首先需要抓取我们在浏览器中访问过的所有链接以及所有的表单等信息，然后通过在 CSRFTester 中修改相应的表单等信息，重新提交，这相当于一次伪造客户端请求。如果修改后的测试请求成功被网站服务器接受，则说明存在 CSRF 漏洞，当然此款工具也可以被用来进行 CSRF 攻击。")]),e._v(" "),r("h3",{attrs:{id:"防御-csrf-攻击"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#防御-csrf-攻击"}},[e._v("#")]),e._v(" 防御 CSRF 攻击")]),e._v(" "),r("p",[e._v("目前防御 CSRF 攻击主要有三种策略")]),e._v(" "),r("ol",[r("li",[r("p",[e._v("验证 HTTP Referer 字段")]),e._v(" "),r("p",[e._v("根据 HTTP 协议，在 HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址。在通常情况下，访问一个安全受限页面的请求来自于同一个网站，比如需要访问 "),r("code",[e._v("http://bank.example/withdraw?account=bob&amount=1000000&for=Mallory")]),e._v("，用户必须先登陆 bank.example，然后通过点击页面上的按钮来触发转账事件。这时，该转帐请求的 Referer 值就会是转账按钮所在的页面的 URL，通常是以 "),r("code",[e._v("bank.example")]),e._v(" 域名开头的地址。而如果黑客要对银行网站实施 CSRF 攻击，他只能在他自己的网站构造请求，当用户通过黑客的网站发送请求到银行时，该请求的 Referer 是指向黑客自己的网站。因此，要防御 CSRF 攻击，银行网站只需要对于每一个转账请求验证其 Referer 值，如果是以 bank.example` 开头的域名，则说明该请求是来自银行网站自己的请求，是合法的。如果 Referer 是其他网站的话，则有可能是黑客的 CSRF 攻击，拒绝该请求。")]),e._v(" "),r("p",[e._v("这种方法的显而易见的好处就是简单易行，网站的普通开发人员不需要操心 CSRF 的漏洞，只需要在最后给所有安全敏感的请求统一增加一个拦截器来检查 Referer 的值就可以。特别是对于当前现有的系统，不需要改变当前系统的任何已有代码和逻辑，没有风险，非常便捷。")]),e._v(" "),r("p",[e._v("然而，这种方法并非万无一失。Referer 的值是由浏览器提供的，虽然 HTTP 协议上有明确的要求，但是每个浏览器对于 Referer 的具体实现可能有差别，并不能保证浏览器自身没有安全漏洞。使用验证 Referer 值的方法，就是把安全性都依赖于第三方（即浏览器）来保障，从理论上来讲，这样并不安全。事实上，对于某些浏览器，比如 IE6 或 FF2，目前已经有一些方法可以篡改 Referer 值。如果 bank.example 网站支持 IE6 浏览器，黑客完全可以把用户浏览器的 Referer 值设为以 bank.example 域名开头的地址，这样就可以通过验证，从而进行 CSRF 攻击。")]),e._v(" "),r("p",[e._v("即便是使用最新的浏览器，黑客无法篡改 Referer 值，这种方法仍然有问题。因为 Referer 值会记录下用户的访问来源，有些用户认为这样会侵犯到他们自己的隐私权，特别是有些组织担心 Referer 值会把组织内网中的某些信息泄露到外网中。因此，用户自己可以设置浏览器使其在发送请求时不再提供 Referer。当他们正常访问银行网站时，网站会因为请求没有 Referer 值而认为是 CSRF 攻击，拒绝合法用户的访问。")])]),e._v(" "),r("li",[r("p",[e._v("在请求地址中添加 token 并验证")]),e._v(" "),r("p",[e._v("CSRF 攻击之所以能够成功，是因为黑客可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 cookie 中，因此黑客可以在不知道这些验证信息的情况下直接利用用户自己的 cookie 来通过安全验证。要抵御 CSRF，关键在于在请求中放入黑客所不能伪造的信息，并且该信息不存在于 cookie 之中。可以在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。")]),e._v(" "),r("p",[e._v("这种方法要比检查 Referer 要安全一些，token 可以在用户登陆后产生并放于 session 之中，然后在每次请求时把 token 从 session 中拿出，与请求中的 token 进行比对，但这种方法的难点在于如何把 token 以参数的形式加入请求。对于 GET 请求，token 将附在请求地址之后，这样 URL 就变成 http://url?csrftoken=tokenvalue。 而对于 POST 请求来说，要在 form 的最后加上 "),r("code",[e._v('<input type="hidden" name="csrftoken" value="tokenvalue"/>')]),e._v("，这样就把 token 以参数的形式加入请求了。但是，在一个网站中，可以接受请求的地方非常多，要对于每一个请求都加上 token 是很麻烦的，并且很容易漏掉，通常使用的方法就是在每次页面加载时，使用 javascript 遍历整个 dom 树，对于 dom 中所有的 a 和 form 标签后加入 token。这样可以解决大部分的请求，但是对于在页面加载之后动态生成的 html 代码，这种方法就没有作用，还需要程序员在编码时手动添加 token。")]),e._v(" "),r("p",[e._v("该方法还有一个缺点是难以保证 token 本身的安全。特别是在一些论坛之类支持用户自己发表内容的网站，黑客可以在上面发布自己个人网站的地址。由于系统也会在这个地址后面加上 token，黑客可以在自己的网站上得到这个 token，并马上就可以发动 CSRF 攻击。为了避免这一点，系统可以在添加 token 的时候增加一个判断，如果这个链接是链到自己本站的，就在后面添加 token，如果是通向外网则不加。不过，即使这个 csrftoken 不以参数的形式附加在请求之中，黑客的网站也同样可以通过 Referer 来得到这个 token 值以发动 CSRF 攻击。这也是一些用户喜欢手动关闭浏览器 Referer 功能的原因。")])]),e._v(" "),r("li",[r("p",[e._v("在 HTTP 头中自定义属性并验证")]),e._v(" "),r("p",[e._v("这种方法也是使用 token 并进行验证，和上一种方法不同的是，这里并不是把 token 以参数的形式置于 HTTP 请求之中，而是把它放到 HTTP 头中自定义的属性里。通过 XMLHttpRequest 这个类，可以一次性给所有该类请求加上 csrftoken 这个 HTTP 头属性，并把 token 值放入其中。这样解决了上种方法在请求中加入 token 的不便，同时，通过 XMLHttpRequest 请求的地址不会被记录到浏览器的地址栏，也不用担心 token 会透过 Referer 泄露到其他网站中去。")]),e._v(" "),r("p",[e._v("然而这种方法的局限性非常大。XMLHttpRequest 请求通常用于 Ajax 方法中对于页面局部的异步刷新，并非所有的请求都适合用这个类来发起，而且通过该类请求得到的页面不能被浏览器所记录下，从而进行前进，后退，刷新，收藏等操作，给用户带来不便。另外，对于没有进行 CSRF 防护的遗留系统来说，要采用这种方法来进行防护，要把所有请求都改为 XMLHttpRequest 请求，这样几乎是要重写整个网站，这代价无疑是不能接受的。")])])])])}),[],!1,null,null,null);t.default=_.exports}}]);