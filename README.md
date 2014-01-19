Host-switch

域名ip切换工具:

基于 代理pac 自动切换一个域名的ip,而不用修改 hosts,
方便web开发人员在 各种/测试/开发/线上 环境快速切换

可以先设置 ip别名

比如:
```
127.0.0.1 web1
127.0.0.2 web2
```
然后在设置
```
web1   www.xyz.com
web1   *.abc.com
```
支持通配符,类似泛域名解析


添加界面

![ScreenShot](/snap/add2.png)
![ScreenShot](/snap/add3.png)

主界面

![ScreenShot](/snap/main.png)

支持模糊搜索
![ScreenShot](/snap/search.png)



@todo 支持 自定义端口的 代理 域名设置
参考 :http://zh.wikipedia.org/wiki/%E4%BB%A3%E7%90%86%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE
