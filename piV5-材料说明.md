# piV5 材料包

本材料包以桌面 `皮皮p2` 为最新版代码来源，于 2026-08-07 整理。

## 已保留

- `src/`：完整应用源码
- `public/`：运行所需品牌、地图和模板素材
- `设计稿/`：可继续使用的页面设计参考
- `tools/`：项目工具脚本
- `package.json`、`package-lock.json`：依赖和版本锁定
- Next.js、TypeScript、Tailwind 和 ESLint 配置
- 项目说明、架构文档与设计 QA 记录

## 已排除

- `node_modules/`：可通过安装命令重新生成
- `.next/`：开发及生产构建缓存
- `.npm-cache/`：npm 下载缓存
- `tsconfig.tsbuildinfo`：TypeScript 增量编译缓存

以上目录和文件是原资料包体积过大的主要原因，不属于需要长期保存的源码或设计资料。

## 启动方式

在 PowerShell 中进入本目录后运行：

```powershell
npm.cmd install
npm.cmd run dev
```

然后打开 `http://localhost:3000`。
