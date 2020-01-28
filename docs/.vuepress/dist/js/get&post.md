# GET请求和POST请求的区别

## 二者在本质上没有区别，只是语义上并不相同

GET 和 POST 只是 HTTP 协议中两种请求方式，而 HTTP 协议是基于 TCP/IP 的应用层协议，无论 GET 还是 POST，用的都是同一个传输层协议，所以在传输上，没有区别。GET和POST能做的事情是一样一样的。你要给GET加上request body，给POST带上url参数，技术上是完全行的通的。 二者的区别都是我们约定出来的。

## 报文格式上的区别

报文格式上，不带参数时，最大区别就是第一行方法名不同，不带参数时他们的区别就仅仅是报文的前几个字符不同而已。

>POST方法请求报文第一行是这样的 POST /uri HTTP/1.1 \r\n

>GET方法请求报文第一行是这样的 GET /uri HTTP/1.1 \r\n

带参数时报文的区别呢？ 在约定中，GET 方法的参数应该放在 url 中，POST 方法参数应该放在 body 中

## 应用中的区别

- GET 请求可被缓存， POST 请求不会被缓存
- GET 请求保留在浏览器历史记录中， POST 请求不会保留在浏览器历史记录中
- GET 请求可被收藏为书签， POST 不能被收藏为书签
- GET 请求不应在处理敏感数据时使用，因为会明文展示给用户
- GET 请求有长度限制，POST 请求对数据长度没有要求
- GET 请求只应当用于取回数据

值得注意的是，W3C规定了，在跨域请求中几种HTTP请求方式分为简单请求（HEAD、GET和部分POST，POST时content-type属于application/x-www-form-urlencoded，multipart/form-data，text/plain三种中的一种）和复杂请求（非简单请求的POST和PUT、DELETE等），而复杂请求发出之前，就会出现一次OPTIONS请求。