# 设计 Skills 接入规范

本项目以 **免费、开源、项目级、可替换** 为优先原则。设计能力只作为开发期 Agent 工具，不进入桌面应用运行时依赖，不增加最终安装包的强制外部服务。

## 默认接入

运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-design-skills.ps1
```

默认按 Codex 项目级安装。需要其他 Agent 时：

```powershell
.\scripts\setup-design-skills.ps1 -Agent claude-code
.\scripts\setup-design-skills.ps1 -Agent cursor
```

默认技能：

- **Hallmark**：新页面、重设计、反模板化审美检查、页面结构去 AI 味。
- **UI/UX Pro Max**：设计系统、颜色、字体、布局、可访问性、交互与数据可视化决策。
- **Taste Skill**：降低模板感、提高视觉差异化与前端审美约束。
- **GSAP Skills**：滚动触发、时间轴、React 动效、性能与清理规范。
- **Claude Design Skill**：落地页、原型、视觉探索、品牌资产驱动的设计工作流。
- **Landing Page Generator**：三号官网的营销页面结构、SEO、CTA、FAQ、功能展示等。
- **Cinematic UI**：仅在明确需要电影感、叙事式、沉浸式视觉时启用。

## 自动调用与优先级

不要一次把所有技能混在同一个页面任务里。按任务选择最小组合：

1. **产品后台 / 桌面应用 UI**：UI/UX Pro Max → Hallmark → Taste。
2. **复杂动效**：在上面基础上仅追加 GSAP Skills。
3. **官网常规页面**：Landing Page Generator → Hallmark → UI/UX Pro Max。
4. **官网电影级视觉段落**：在官网组合上追加 Cinematic UI。
5. **原型 / 视觉探索 / 品牌稿**：Claude Design Skill 优先。
6. 完成后必须进行浏览器实测、响应式检查、交互状态检查和性能检查。

若已有项目级 `DESIGN.md`、品牌 Token 或设计系统，其优先级高于任何第三方 Skill 的默认风格。

## 不默认安装的三项

### OpenDesign

它是完整的本地优先设计工作台/桌面系统，并非单一 Skill。功能与本项目自身桌面架构、Figma/Canva 和现有 Agent 工作流有明显重叠，因此**不作为主项目依赖**。只在需要研究其开源设计系统或单独技能时引用。

### PencilPlaybook

主要面向 Pencil.dev + Claude Code。当前项目已经以 Figma、实际 React 页面和浏览器验收为主，所以不默认引入，避免增加另一套设计工具链。若后续明确采用 Pencil.dev 再单独安装。

### design-md-chrome

这是 Chrome 扩展，不是 Agent Skill。适合从参考网站提取 `DESIGN.md` / `SKILL.md`。仅在需要分析指定网站视觉体系时使用，不进入项目依赖。

## 合并项目规则

一号、二号合并为“皮皮来助你”主仓库后，本文件和安装脚本只保留一份，迁移到统一根目录。三号官网作为主仓库的官网应用，共用同一套设计 Token、Logo、组件规范和 Skill 调用策略。

第三方 Skill 不应修改业务架构、数据库模型、ADB 控制逻辑或桌面安装逻辑；它们只能影响设计决策、前端实现质量、动效和视觉验收。
