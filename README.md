# Pi Web V2

Pi 桌面系统的独立 Web V2 基础工程。当前阶段只包含应用架构、系统 Layout、基础组件和路由占位页，不包含认证、模拟数据或业务功能。

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS

## 本地运行

```bash
npm.cmd install
npm.cmd run dev
```

浏览器访问 `http://localhost:3000`。根路径会自动进入 `/dashboard`，登录入口位于 `/login`。

## 验证

```bash
npm.cmd run lint
npm.cmd run build
```
