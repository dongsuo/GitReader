# GitReader
## 一个用Github Issue 实现 read it later 功能的Chrome插件
- 安装：
  1. clone 或下载本项目
  2. 进入Chrome的扩展管理页面并开启开发者模式：chrome://extensions/
  3. 点击加载已解压的扩展程序，选择解压出来的文件夹
- Warning：
  1. 考虑到安全问题，本项目没有提供Github API的授权码，因此在本地使用无法调用Github API
  2. 如需使用，可以在https://github.com/settings/developers 页面中申请你自己的授权码(文档：https://help.github.com/articles/authorizing-oauth-apps/)，然后将其添加指 config.js 文件中并保存：
  

```
var CONFIG = {
	"token":"",
	"client_secret":"Put your client secret code here",
	"client_id":"Put your client id here"
}
```
