# HTTP/HTTPS/HTTP2

## HTTP

### HTTP 请求报文组成

- 请求方法（GET/POST 等）
- URI
- 协议版本 (HTTP/1.1)
- 请求头
- 请求体

### 请求头字段

- **Accept**：客户端能够处理的媒体类型。如 text/html, 表示客户端让服务器返回 html 类型的数据
- **Authorization**：表示客户端的认证信息，jwt 中 token 存放于此
- **Host**： 表示访问资源所在的主机名，即 URL 中的域名部分
- **Origin**： 站点信息 如 baidu.com
- **Referer**：告知服务器请求是从哪个页面发起的 如 baidu.com/xxx
- **User-Agent**：将发起请求的浏览器和代理名称等信息发送给服务端

- **If-None-Match**: If-Match 的值与所请求资源的 ETag 值不一致时服务器才处理此请求

- **If-Modified-Since**: 用于确认客户端拥有的本地资源的时效性。 如果客户端请求的资源在 If-Modified-Since 指定的时间后发生了改变，则服务器处理该请求，失效了就返回新的

- **Range**：获取部分资源，如视频流（服务器正确处理则返回 206 状态码）

- Accept-Charset: 表示客户端支持的字符集。例如：Accept-Charset: GB2312, ISO-8859-1
  
- Accept-Encoding： 表示客户端支持的内容编码格式。如：Accept-Encoding：gzip
  
- Accept-Language：表示客户端支持的语言。如：Accept-Language: zh-cn, en
  
- If-Match: If-Match 的值与所请求资源的 ETag 值（实体标记，与资源相关联。资源变化，实体标记跟着变化）一致时，服务器才处理此请求
  
- If-Unmodified-Since：与 If-Modified-Since 相反，表示请求的资源在指定的时间之后未发生变化时，才处理请求，否则返回 412

- If-Range： If-Range 的值（ETag 值或时间）与所访问资源的 ETag 值或时间相一致时，服务器处理此请求，并返回 Range 字段中设置的指定范围的数据。如果不一致，则返回所有内容 If-Range 其实算是 If-Match 的升级版，因为它的值不匹配时，依然能够返回数据，而 If-Match 不匹配时，请求不会被处理，需要数据时需再次进行请求

- Max-Forwards：表示请求可经过的服务器的最大数目，请求每被转发一次，Max-Forwards 减 1，当 Max-Forwards 为 0

- Cookie：属于请求型报文字段，在请求时添加Cookie, 以实现HTTP的状态记录

### HTTP 响应报文组成

- 方法
- URI
- 协议版本
- 响应头
- 响应体

其中Url包括
- protocal 协议头 比如http https ftp
- host  主机域名或ip地址
- port 端口号
- path 目录路径（路由）
- query 查询参数
- hash #后的哈希值

### 响应头字段

CORS相关
- Access-Control-Allow-Headers: 如 Authorization
- Access-Control-Allow-Methods: GET, OPTIONS, HEAD, PUT, POST
- Access-Control-Allow-Origin: 如 https://baidu.com
- Access-Control-Max-Age: 1800

普通响应头

- **Content-Length**：响应体的长度

- **Content-Range**：在整个返回体中本部分的字节位置，对应Rnage

- **Content-Type**：返回内容的MIME类型，对应Accept

- **ETag**：请求变量的实体标签的当前值

- **Expires**：响应过期的日期和时间

- **Last-Modified**：请求资源的最后修改时间

- Accept-Ranges：表明服务器是否支持指定范围请求及哪种类型的分段请求

- Age：从原始服务器到代理缓存形成的估算时间（以秒计，非负）

- Allow：对某网络资源的有效的请求行为，不允许则返回405

- Content-Encoding：服务器支持的返回内容压缩编码类型

- Content-Language：响应体的语言

- Content-Location：请求资源可替代的备用的另一地址

- Content-MD5：返回资源的MD5校验值

- Location：用来重定向接收方到非请求URL的位置来完成请求或标识新的资源

- Pragma：包括实现特定的指令，它可应用到响应链上的任何接收方

- Proxy-Authenticate：它指出认证方案和可应用到代理的该URL上的参数

- refresh：应用于重定向或一个新的资源被创造，在5秒之后重定向（由网景提出，被大部分浏览器支持）

- Retry-After：如果实体暂时不可取，通知客户端在指定时间之后再次尝试

- Server：告知服务端当前使用的HTTP服务器应用程序的相关信息

- Set-Cookie：属于应答型报文字段。服务器给客户端传递Cookie信息时，就是通过此字段实现的

### 通用头部字段

- **Cache-Control**：控制缓存行为（max-age/no-cache/no-store）

- **Connection**：管理持久连接，设置其值为Keep-Alive可实现长连接

- Via：追踪客户端和服务端之间的报文的传输路径，还可避免会环的发生，所以在经过代理时必须添加此字段

- Transfer-Encoding：规定了传输报文主题时使用的传输编码，如Transfer-Encoding: chunked

- Date：创建HTTP报文的日期和时间

- Pragma：Http/1.1之前的历史遗留字段，仅作为HTTP/1.0向后兼容而定义，虽然是通用字段，当通常被使用在客户单的请求中，如Pragma: no-cache, 表示客户端在请求过程中不循序服务端返回缓存的数据

- Upgrade: 用于检查HTTP协议或其他协议是否有可使用的更高版本

- Warning：Http/1.1的报文字段，从Http/1.0的AfterRetry演变而来，用来告知用户一些与缓存相关的警告信息
  
### HTTP状态码

#### 2XX 成功

* 200 OK，表示从客户端发来的请求在服务器端被正确处理
* 204 No content，表示请求成功，但响应报文不含实体的主体部分
* 206 Partial Content，进行范围请求（请求实体部分内容成功）

#### 3XX 重定向

* 301 moved permanently，永久性重定向，表示资源已被分配了新的 URL
* 302 found，临时性重定向，表示资源临时被分配了新的 URL
* 303 see other，表示资源存在着另一个 URL，应使用 GET 方法定向获取资源
* 304 not modified，表示服务器允许访问资源，但因发生请求未满足条件的情况(一般是命中了缓存)

#### 4XX 客户端错误

* 400 bad request，请求报文存在语法错误
* 401 unauthorized，表示发送的请求需要有通过 HTTP 认证的认证信息
* 403 forbidden，表示对请求资源的访问被服务器拒绝
* 404 not found，表示在服务器上没有找到请求的资源

#### 5XX 服务器错误

* 500 internal sever error，表示服务器端在执行请求时发生了错误
* 502 bad gateway，错误网关，一般是服务器网络错误
* 503 service unavailable，表明服务器暂时处于超负载或正在停机维护，无法处理请求

## HTTPS

现在一般使用的是 TLS（基于 RSA 非对称加密）

TLS(Transport Layer Secure 传输层安全)1.0 === SSL(Secure Socket Layer 安全套接层)3.0

### 握手流程（包含 Pre-Master Secret）

1. 浏览器给出协议版本号、一个客户端生成的随机数（Client Random），以及客户端支持的加密方法，发出安全请求。

2. web 服务器确认双方使用的加密方法，并给出数字证书（包含服务器的**公钥**）、以及一个服务器生成的随机数（Server Random）。

3. 浏览器通过预置的 CA 列表确认数字证书有效（这一步使得中间人没法造假），然后生成一个新的随机数（Pre-Master Secret），并使用数字证书中的**公钥**加密这个随机数，发给 web 服务器。

4. web 服务器使用自己的**私钥**，解密浏览器发来的随机数（即 Pre-Master Secret），非对称加密部分完结。

5. 浏览器和 web 服务器根据约定的加密方法，使用前面的三个随机数，生成对称秘钥"对话密钥"（Session Key），用来加密接下来的整个对话过程。

包含 Pre-Master Secret 就是加了两个随机数（Client Random，Server Random）用来生成最后的"对话秘钥"，每加一个随机数随机性就会增加很多，更安全

## HTTP2

1. **新的二进制格式**： HTTP1.x 的解析是基于文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认 0 和 1 的组合。基于这种考虑 HTTP2.0 的协议解析决定采用二进制格式，实现方便且健壮。
2. **多路复用**：即连接共享，HTTP2.0 多个请求可同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其它连接的正常执行，HTTP1.x 则可能会因为一个请求超时而发生线头阻塞。
3. **header 压缩**：HTTP1.x 的 header 带有大量信息，而且每次都要重复发送，HTTP2.0 使用 HPACK 对头部信息进行压缩，通讯双方各自 cache 一份 header fields 表（键值对），这样重复的 header 只需要传递索引即可，既避免了重复 header 的传输，又减小了需要传输的大小。
4. **服务端推送**：Server Push 服务端推送能把客户端所需要许多资源随着单次请求一起发送到客户端，省去了客户端重复请求的步骤  

