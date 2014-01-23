Host-switch

域名ip切换工具:

基于 代理pac 自动切换一个域名的ip,而不用修改 hosts,
方便web开发人员在 各种/测试/开发/线上 环境快速切换

可以先设置 ip别名

比如:
```
127.0.0.1 web1
127.0.0.2 web2

#如果是 其他非80 端口的,增加端口即可

192.168.1.100 www.test.com:8888

```
然后访问 http://www.test.com:8888/ 即 指向 127.0.0.1:8888
然后在设置
```
web1   www.xyz.com
web1   *.abc.com

```
支持通配符,类似泛域名解析

插件地址:

[url]http://shendongming.github.io/dist/chrome-host-switch.crx[/url]

截图:

添加界面

![ScreenShot](/snap/add2.png)
![ScreenShot](/snap/add3.png)

主界面

![ScreenShot](/snap/main.png)

支持模糊搜索
![ScreenShot](/snap/search.png)



搜索语法

全部字段搜索关键词 www
 www

全部字段搜索这2个关键词
www web


全部字段搜索这2个关键词 而且 ip包含 127
```
    www web ip:127
```


搜索语法仅仅 支持 and 逻辑


搜索 标签包含test
```
    tags:test
```
搜索 标签包含test 和 dev的
```
    tags:test tags:dev

```


