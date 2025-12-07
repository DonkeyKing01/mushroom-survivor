幻觉实验室 (Mushroom Survivor) v2.5

幻觉实验室是一个基于 React 开发的交互式 Web 应用。项目结合了故障艺术 (Glitch Art) 视觉风格与云南野生菌科普数据，集成了 AI 对话、数据可视化地图以及像素风格生存游戏。

📂 项目概述

本项目通过高对比度视觉设计和黑色幽默交互，展示野生菌的种类、食用风险及中毒反应。

核心功能模块

1. 实验室 (The Lab)

交互核心：控制 "Subject-01"（受试体）。

反馈系统：根据喂食菌子的毒性（致幻、剧毒、安全），受试体和背景产生特定视觉特效（色彩反转、故障抖动、粒子爆炸）。

物理交互：点击或触摸受试体可触发情绪反应动画。

2. 档案馆 (Archives)

数据库：收录常见云南野生菌（如见手青、松茸、致命鹅膏）的详细数据。

AI 黑暗食谱：集成 Google Gemini API，为每种菌子实时生成食谱或“最后的晚餐”描述。

分类筛选：支持按毒性等级（安全干饭、见小人、全村吃席）筛选数据。

3. 战术卫星地图 (Tactical Map)

矢量渲染：基于 SVG 绘制的风格化云南省地图。

分区数据：点击不同防区（如滇中、滇南热带雨林），实时调取该区域的菌子分布数据。

4. AI 鉴毒师 (Toxicologist)

自然语言处理：调用 Gemini API 进行特定角色的多轮对话。

上下文感知：AI 已植入当前数据库中的菌子信息，可根据用户模糊描述（如“红伞伞白杆杆”）推理并返回对应的数据库卡片。

5. 菌子大逃杀 (Mushroom Royale)

游戏机制：内置像素风生存游戏，控制角色躲避毒菌、收集安全菌。

物理引擎：包含重力下落、碰撞检测及粒子爆炸特效。

操作支持：支持物理键盘及屏幕触控 UI。

🛠️ 技术栈

构建工具: Vite

前端框架: React (Hooks, State Management)

样式库: Tailwind CSS v4.0

图标库: Lucide React

AI 模型: Google Gemini 2.5 Flash (REST API)

🚀 安装与运行

请确保您的环境已安装 Node.js (v18 或更高版本)。

1. 获取代码

git clone <your-repo-url>
cd mushroom-survivor


2. 安装依赖

npm install
# 安装 Tailwind v4 相关适配器
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer


3. 配置环境变量 (关键步骤)

在项目根目录下创建一个名为 .env 的文件，并将 API Key 填入其中。请参考 .env.example 文件。

步骤：

复制 .env.example 重命名为 .env。

编辑 .env 文件，填入你的 Google AI Studio API Key：

# .env 文件内容
VITE_GEMINI_API_KEY=你的_API_KEY_粘贴在这里


注意：不要直接修改代码中的 apiKey 变量，请始终使用环境变量。

4. 启动开发服务器

npm run dev


终端将显示本地访问地址（默认为 http://localhost:5173）。

🎮 游戏操作说明 (菌子大逃杀)

键盘操作：

A / 左箭头：向左移动

D / 右箭头：向右移动

触控操作：

点击屏幕下方的 ◀ 和 ▶ 按钮。

状态图例：

🍄 (安全)：加分，恢复生命值。

🌀 (致幻)：扣除生命值，操作方向反转。

💀 (剧毒)：大量扣除生命值。

📦 构建生产版本

如需部署到 GitHub Pages、Vercel 或 Netlify：

npm run build


构建产物将输出至 dist 目录。