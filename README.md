幻觉实验室 (Mushroom Survivor) v2.5

幻觉实验室 是一个基于 React 开发的交互式 Web 应用。该项目结合了“赛博朋克/故障艺术”视觉风格与云南野生菌科普主题，集成了 AI 对话、数据可视化地图以及像素风小游戏。

📂 项目概述

本项目旨在通过高对比度的视觉设计和黑色幽默的交互方式，展示野生菌的种类、风险及中毒反应。

核心功能

实验室 (The Lab)

交互核心：控制 "Subject-01"（受试体）。

反馈系统：根据喂食的菌子毒性（致幻、剧毒、安全），受试体和背景会产生不同的视觉特效（色彩反转、故障抖动、粒子爆炸）。

物理交互：支持点击/触摸受试体触发情绪反应。

档案馆 (Archives)

数据库：收录常见云南野生菌（见手青、松茸、致命鹅膏等）。

AI 黑暗食谱：集成 Google Gemini API，为每种菌子生成“黑暗料理”食谱或“最后的晚餐”描述。

分类筛选：支持按毒性等级（安全干饭、见小人、全村吃席）筛选。

战术卫星地图 (Tactical Map)

矢量渲染：基于 SVG 绘制的云南省风格化地图。

分区数据：点击不同防区（如滇中、滇南热带雨林），实时调取该区域的菌子分布情报。

AI 鉴毒师 (Toxicologist)

自然语言处理：调用 Gemini API 进行角色扮演。

上下文感知：AI 知晓当前数据库中的所有菌子信息，能根据用户模糊描述（如“红伞伞白杆杆”）进行推理并返回对应的数据库卡片。

菌子大逃杀 (Mushroom Royale)

小游戏：内置像素风生存游戏。

机制：控制角色躲避毒菌、收集安全菌。

物理引擎：包含重力下落、碰撞检测、粒子爆炸特效。

操作：支持键盘 (WASD/方向键) 及屏幕触控。

🛠️ 技术栈

构建工具: Vite

前端框架: React (Hooks, State Management)

样式库: Tailwind CSS v4.0

图标库: Lucide React

AI 模型: Google Gemini 2.5 Flash (通过 REST API 调用)

🚀 本地安装与运行

确保您的环境已安装 Node.js (v18 或更高版本)。

1. 克隆/下载项目

git clone <your-repo-url>
cd mushroom-survivor


2. 安装依赖

npm install
# 必须安装以下 Tailwind v4 适配器
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer


3. 配置文件检查

由于使用了 Tailwind CSS v4，请确保根目录下的配置文件内容如下：

postcss.config.js

export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}


src/index.css

@import "tailwindcss";


4. 配置 API Key

打开 src/App.jsx (或 MushroomSurvivor.jsx)，找到以下行并填入您的 Google AI Studio API Key：

const apiKey = "YOUR_GEMINI_API_KEY_HERE";


注意：在生产环境中，建议使用后端代理或环境变量 (.env) 来保护 API Key。

5. 启动开发服务器

npm run dev


访问终端显示的本地地址（通常为 http://localhost:5173）。

🎮 游戏操作说明

菌子大逃杀 (Mini-Game)

键盘操作：

A / 左箭头：向左移动

D / 右箭头：向右移动

触控操作：

点击屏幕下方的 ◀ 和 ▶ 按钮。

状态说明：

🍄 (安全)：加分，回血。

🌀 (致幻)：扣血，操作方向反转。

💀 (剧毒)：大量扣血。

📦 构建生产版本

如需部署到 GitHub Pages 或 Vercel：

npm run build
