# NextXesFrontend

> 学而思新的前端体验（第三方）

> [!WARNING]
>
> 因为React19的一些Breaking Changes，导致项目的依赖 Semi Design 还未开发兼容包，故暂时一些功能无法运行。

## 准备开发

1. 下载项目 `git clone https://github.com/chen3283891376/next-xes-frontend.git`
2. 切换到项目文件夹
3. 安装依赖项 `npm install`

## npm 脚本

- `npm run dev` 启动开发模式
- `npm run build` 构建项目
- `npm run start` 启动已构建的代码

- `npm run lint` 使用 EsLint 检查代码
- `npm run format` 使用 Prettier 格式化代码

## 运行开发服务器

1. 下载 nginx
2. 复制 nginx 到 `dev_nginx`。_注意不要把 `conf/nginx.conf` 给覆盖了！！！_
3. 启动 nginx。
4. 运行 `npm run dev`
5. 访问 `http://127.0.0.1:8080` 而不是 `http://127.0.0.1:3000`

## 开发进度

### 功能部分

- [x] 主页 /
- [x] 登录 /login
- [x] 发现 /discover
- [x] 搜索 /search
- [ ] 我的作品 /user
- [x] 用户信息展示 /userInfo
- [ ] 最终用户协议（等待补充内容） /eula
- [x] 关于 /about

- [x] 个人主页
    - [x] 主页 /space/:userId/home
    - [x] 封面 /space/:userId/cover
    - [x] 作品 /space/:userId/projects
    - [x] 收藏 /space/:userId/favourites
    - [x] 社交 /space/:userId/social

- [x] 消息中心
    - [x] 评论与回复 /message/1
    - [ ] 点赞与收藏 不计划制作
    - [x] 关注 /message/5
    - [ ] 反馈与审核 不计划制作
    - [ ] 系统消息 不计划制作

- [ ] 作品展示页面 /project
    - [ ] 作品展示
    - [ ] 评论

- [ ] 作品发布组件 ProjectPublishModal.tsx
    - [ ] 基本信息填写
    - [ ] 标签选择
    - [ ] 封面上传

### 作品部分

- [ ] 作品重定向页面 /ide /embed
- [ ] TurboWarp /ide/turbowarp /embed/turbowarp
- [ ] Python 基础 /ide/python /embed/python
- [ ] Python 海龟 /ide/webpy /embed/webpy
- [ ] Python 高阶 /ide/pygame /embed/pygame
- [ ] C++ /ide/cpp /embed/cpp

## 关于贡献

此仓库使用 GPL-3.0 许可证。

请在贡献前阅读 [贡献指南](CONTRIBUTING.md)。

若要报告安全漏洞，请阅读 [安全策略](SECURITY.md)。
