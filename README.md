# Call from Afar

一个以“时空电话亭”为主题的静态网页应用。用户可以选择想倾诉的对象，模拟一次跨时空通话，并在结束后生成一张纪念票根。

## 技术栈

- React 18
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS
- Framer Motion
- html2canvas
- lucide-react

## 功能

- 星空背景与首页文字加载动画
- 录入自己的昵称、对方身份和对方昵称
- 支持的对方身份：
  - 至亲家人
  - 昔日挚友
  - 遗憾恋人
  - 过去的自己
  - 其他故人
- 首次进入通话前展示私密通话确认
- 模拟“接通时空”过程，并记录通话时长
- 根据对方身份生成不同类型的温柔寄语
- 生成“时空电话亭 · 跨时空告白留存”纪念票根
- 支持保存票根图片、打印票根和调用浏览器分享
- 提供动画、音效、过渡效果开关

## 页面流程

应用使用 React Router 管理 4 个页面：

- `/`：首页，展示项目主题并进入通话流程
- `/entry`：通话信息录入
- `/call`：模拟时空电话接通和通话计时
- `/ticket`：生成并展示纪念票根

## 目录结构

```text
.
|-- src/
|   |-- components/     # 页面组件、插画、票根、动效组件
|   |-- data/           # 身份分类与寄语文案
|   |-- hooks/          # 通话计时 hook
|   |-- lib/            # 通用工具
|   |-- pages/          # Home / Entry / Call / Ticket 页面
|   |-- store/          # Zustand 应用状态
|   |-- App.tsx         # 路由定义
|   `-- main.tsx        # React 入口
|-- public/             # 静态资源
|-- dist/               # 构建输出
|-- package.json
|-- vite.config.ts
|-- tailwind.config.js
`-- tsconfig.json
```

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

类型检查：

```bash
npm run check
```

代码检查：

```bash
npm run lint
```

构建生产产物：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 部署

运行 `npm run build` 后，将 `dist/` 目录作为静态站点根目录部署即可。适合部署到 GitHub Pages、Netlify、Vercel、Cloudflare Pages 或任意支持静态文件托管的服务。

如果部署到非根路径，需要根据托管路径调整 Vite 的 `base` 配置。

## 隐私说明

应用界面说明中写明：本次跨时空通话为私密独白，网页不会保存任何语音内容，仅记录通话时长与生成时间，用于生成纪念票根。当前状态保存在前端运行时状态中，刷新页面后不会持久保留。

## 许可证

本项目使用 MIT License。详见 [LICENSE](LICENSE)。
