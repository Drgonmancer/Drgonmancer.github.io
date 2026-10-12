'use strict';
window.PORTFOLIO_PROJECTS=[
  {
    "name": "AI 智能图文创作器",
    "en": "CONTENT STUDIO",
    "short": "图文创作器",
    "category": "tools",
    "repo": "AI-Image-Text-Studio",
    "url": "https://github.com/Drgonmancer/AI-Image-Text-Studio",
    "image": "assets/proj-studio.webp",
    "desc": "7 Agent 三阶段编排的图文创作平台，支持人机协作断点、SSE 实时进度推送与一键容器化部署。",
    "summary": "7 Agent 三阶段编排的图文创作平台，支持人机协作断点、SSE 实时进度推送与一键容器化部署。",
    "tags": [
      "Python",
      "FastAPI",
      "LangGraph",
      "Vue 3",
      "Redis",
      "SSE",
      "DeepSeek",
      "Docker"
    ],
    "tech": "Python / FastAPI / LangGraph",
    "period": "2026.05 — 2026.06",
    "role": "负责人",
    "points": [
      "基于 LangGraph 设计 7 Agent 三阶段编排流水线（选题 / 标题 / 大纲 / 正文 / 配图 / 评审），通过 SceneRegistry 为 3 场景配置独立 Prompt 模板与 Graph 工厂。",
      "实现三阶段人机协作（HITL）断点：标题生成后暂停待用户选择、大纲支持拖拽编辑与自然语言 AI 修改；基于 Redis Pub/Sub 驱动 SSE 实时进度推送。",
      "搭建 FastAPI 后端，设计 22 个 REST / SSE 接口，落地 JWT 鉴权、每日配额与 Mock VIP 会员体系。",
      "建设 Agent Trace 管理后台，双写 LangSmith 与本地日志，可视化 Token 消耗与耗时。"
    ],
    "number": "01",
    "accent": "lilac"
  },
  {
    "name": "多 Agent 求职辅助系统",
    "en": "JOB MATCH",
    "short": "求职辅助系统",
    "category": "agent",
    "repo": "job-match-workflow",
    "url": "https://github.com/Drgonmancer/job-match-workflow",
    "image": "assets/proj-jobmatch.webp",
    "desc": "围绕「岗位分析 → 简历匹配 → 低分优化 → 求职建议」真实链路的多 Agent 可恢复状态图系统。",
    "summary": "围绕「岗位分析 → 简历匹配 → 低分优化 → 求职建议」真实链路的多 Agent 可恢复状态图系统。",
    "tags": [
      "Python",
      "LangGraph",
      "FastAPI",
      "Vue 3",
      "SQLite Checkpoint",
      "Docker Compose"
    ],
    "tech": "Python / LangGraph / FastAPI",
    "period": "2026.06 — 2026.07",
    "role": "负责人",
    "points": [
      "基于开源多 Agent 方案落地可恢复状态图系统，完成前后端联调与容器化启动。",
      "采用 Supervisor 与岗位分析、简历评审、简历优化、职业教练四角色协作；LangGraph 的 Send 并行、子图与低分回路实现可回路优化。",
      "基于 SQLite Checkpoint 管理 thread_id 会话状态，支持中断恢复与历史快照读取。",
      "使用 FastAPI 提供认证、会话管理、简历上传（txt / md / pdf）与图执行接口，Vue 前端完成分析空间与结果展示。"
    ],
    "number": "02",
    "accent": "mint"
  },
  {
    "name": "生产级客服 Agent",
    "en": "SUPPORT AGENT",
    "short": "客服 Agent",
    "category": "agent",
    "repo": "customer-support-agent",
    "url": "https://github.com/Drgonmancer/customer-support-agent",
    "image": "assets/proj-support.webp",
    "desc": "面向生产环境的客服工作流：Supervisor 调度专职子 Agent，大额退款必须人工审批，护栏与评估内嵌在链路里，全离线可跑。",
    "summary": "面向生产环境的客服工作流：Supervisor 调度专职子 Agent，大额退款必须人工审批，护栏与评估内嵌在链路里，全离线可跑。",
    "tags": [
      "Python",
      "LangGraph",
      "Langfuse",
      "Pydantic",
      "MCP",
      "BM25 RAG",
      "pytest",
      "Ruff"
    ],
    "tech": "Python / LangGraph / Langfuse",
    "period": "2026.08",
    "role": "负责人",
    "points": [
      "用 LangGraph 的 StateGraph 做 Supervisor 路由，把消息分派给专职子 Agent；路由是带类型、可单测的函数，而不是一条自由发挥的 Prompt。",
      "金额相关操作全部落成有类型、有测试的 Python 工具，模型只负责意图分类与措辞，绝不做钱的算术。",
      "中额退款在 interrupt() 上暂停等人工裁决，状态经 checkpointer 跨暂停保留；超过硬上限的退款在治理层被结构性拒绝。",
      "guard_input / guard_output 逐轮包裹：入站脱敏 PII 并拦截提示注入，出站绝不回吐 PII；14 条标注场景的 eval 套件在 CI 上守门。"
    ],
    "number": "03",
    "accent": "peach"
  },
  {
    "name": "Agentic RAG 系统",
    "en": "AGENTIC RAG",
    "short": "Agentic RAG",
    "category": "agent",
    "repo": "rag-agent-workflow",
    "url": "https://github.com/Drgonmancer/rag-agent-workflow",
    "image": "assets/proj-rag.webp",
    "desc": "端到端的 Agentic RAG：PDF 转 Markdown 后层次化分块、Qdrant 向量检索、Map-Reduce 并行子查询，并用 RAGAS 量化评测。",
    "summary": "端到端的 Agentic RAG：PDF 转 Markdown 后层次化分块、Qdrant 向量检索、Map-Reduce 并行子查询，并用 RAGAS 量化评测。",
    "tags": [
      "Python",
      "LangGraph",
      "Qdrant",
      "Ollama",
      "Gradio",
      "RAGAS",
      "Langfuse",
      "Docker"
    ],
    "tech": "Python / LangGraph / Qdrant",
    "period": "2026.08",
    "role": "负责人",
    "points": [
      "层次索引：用小颗粒度子块保证检索精度，命中后回溯父块补足上下文，兼顾精度与信息完整度。",
      "多智能体 Map-Reduce：把复杂问题拆成最多 3 条并行子查询，各自由独立子图完成「检索 → 自纠 → 收敛」。",
      "会话滚动摘要 + 查询改写让多轮追问不断片；语义不清时在 interrupt 上暂停，先向用户澄清再检索。",
      "工具调用预算与上下文压缩控制长链路开销；RAGAS 五项指标量化检索与回答质量，Langfuse 全链路可观测。"
    ],
    "number": "04",
    "accent": "lilac"
  },
  {
    "name": "AI 闯关学习小程序",
    "en": "QUEST LEARNING",
    "short": "闯关学习",
    "category": "tools",
    "repo": "ai-quest-learning-mini-program",
    "url": "https://github.com/Drgonmancer/ai-quest-learning-mini-program",
    "image": "assets/proj-quest.webp",
    "desc": "基于 ReAct 智能体 + RAG 知识库的闯关式学习小程序，支持联网检索出题、结构化判分与 AI 自动配图。",
    "summary": "基于 ReAct 智能体 + RAG 知识库的闯关式学习小程序，支持联网检索出题、结构化判分与 AI 自动配图。",
    "tags": [
      "Python",
      "FastAPI",
      "LangGraph",
      "DeepSeek",
      "Tavily",
      "Chroma",
      "Taro 4",
      "Docker"
    ],
    "tech": "Python / FastAPI / LangGraph",
    "period": "2026.07 — 2026.08",
    "role": "负责人",
    "points": [
      "基于 LangGraph 构建 ReAct 出题智能体，接入 Tavily 联网搜索，由模型自主决定检索关键词与轮次，解决大模型知识截止导致的题目过时问题。",
      "用 LangChain 将模型输出稳定约束为结构化 JSON（单选 / 多选 / 判断三类题型），保证前端渲染与判分逻辑可靠。",
      "设计异步出题任务架构：POST 提交 + GET 轮询，配合 asyncio 并发与超时管理，避免长耗时 LLM 调用阻塞请求链路。",
      "从 0 实现 RAG 知识库：PDF / Word / Markdown 解析 → 分块 → 百炼 text-embedding-v4 向量化存入 Chroma → Top-K 4 检索增强。"
    ],
    "number": "05",
    "accent": "mint"
  },
  {
    "name": "Pulse · AI 热点监控与决策助手",
    "en": "PULSE",
    "short": "热点监控",
    "category": "tools",
    "repo": "AI-real-time-buzz-tracker",
    "url": "https://github.com/Drgonmancer/AI-real-time-buzz-tracker",
    "image": "assets/proj-buzz.webp",
    "desc": "聚合 15+ 平台热点的实时监控台：定时采集、跨平台关键词搜索、勾选式 AI 分析，WebSocket 秒级推送到前端。",
    "summary": "聚合 15+ 平台热点的实时监控台：定时采集、跨平台关键词搜索、勾选式 AI 分析，WebSocket 秒级推送到前端。",
    "tags": [
      "React 18",
      "TypeScript",
      "Express",
      "Prisma",
      "SQLite",
      "Socket.IO",
      "DeepSeek",
      "Vite"
    ],
    "tech": "React 18 / TypeScript / Express",
    "period": "2026.05 — 2026.06",
    "role": "负责人",
    "points": [
      "自研采集服务统一 15+ 数据源（百度 / 微博 / B站 / GitHub / HN / Reddit / Google News 等）的字段口径，支持来源筛选与混合排序。",
      "关键词跨平台并行搜索，结果自动去重入库，各平台成功与失败状态单独回传。",
      "Socket.IO 推送新热点入库与 AI 分析完成事件，前端顶部 LIVE 指示灯与列表始终保持最新。",
      "「先勾选、再分析」按需调用 DeepSeek，输出相关性评分、中文摘要与重要性判断；未配置 Key 时其余功能完全可用。"
    ],
    "number": "06",
    "accent": "peach"
  },
  {
    "name": "AI 万能视频下载器",
    "en": "VIDEO DOWNLOADER",
    "short": "视频下载器",
    "category": "tools",
    "repo": "AI-Powered-Video-Downloader",
    "url": "https://github.com/Drgonmancer/AI-Powered-Video-Downloader",
    "image": "assets/proj-vdl.webp",
    "desc": "本地 Web 应用：多平台视频解析与下载，实时进度推送，可选 AI 生成内容摘要、字幕要点与思维导图。",
    "summary": "本地 Web 应用：多平台视频解析与下载，实时进度推送，可选 AI 生成内容摘要、字幕要点与思维导图。",
    "tags": [
      "Vue 3",
      "Vite",
      "Pinia",
      "Tailwind CSS",
      "FastAPI",
      "WebSocket",
      "yt-dlp",
      "ffmpeg",
      "Stripe"
    ],
    "tech": "Vue 3 / Vite / Pinia",
    "period": "2026.05 — 2026.06",
    "role": "负责人",
    "points": [
      "解析链路基于 yt-dlp 覆盖 1000+ 站点；抖音做专项适配，短链 / 标准链接 / 图文笔记均可，无水印直链且多数场景免 Cookie。",
      "WebSocket 实时推送进度、速度与状态，替代轮询刷新；相同链接二次解析走缓存。",
      "可选接入任意 OpenAI 兼容大模型，一键生成结构化摘要、字幕要点与 Markmap 思维导图，支持导出 MD / SVG。",
      "内置 JWT 账号体系、Stripe 订阅与每日下载配额，可 fork 成自己的 Video SaaS；Docker / Render 一键部署。"
    ],
    "number": "07",
    "accent": "lilac"
  },
  {
    "name": "FaceGuard · 人脸识别身份管理平台",
    "en": "FACEGUARD",
    "short": "人脸识别平台",
    "category": "other",
    "repo": "FaceLens",
    "url": "https://github.com/Drgonmancer/FaceLens",
    "image": "assets/proj-facelens.webp",
    "desc": "基于 OpenCV 与 Django 的 B/S 人脸识别身份管理平台：浏览器完成注册与人脸采集，支持刷脸或密码登录与陌生人告警。",
    "summary": "基于 OpenCV 与 Django 的 B/S 人脸识别身份管理平台：浏览器完成注册与人脸采集，支持刷脸或密码登录与陌生人告警。",
    "tags": [
      "Python",
      "Django",
      "OpenCV",
      "Vue 3",
      "JavaScript",
      "Haar 检测",
      "LBPH 识别"
    ],
    "tech": "Python / Django / OpenCV",
    "period": "2026.05 — 2026.06",
    "role": "负责人",
    "points": [
      "采用 Haar 检测 + LBPH 识别，纯 CPU 即可运行，无需 GPU，人脸数据全部本地存储、不出内网。",
      "管理后台提供注册用户、今日登录、陌生人告警、识别成功率四项实时指标，以及近 7 日登录趋势与登录方式分布。",
      "打通「注册 → 人脸采集 → 模型训练 → 刷脸 / 密码双通道登录 → 陌生人告警处理」的完整闭环。",
      "配套一键安装与启动脚本，适合作为教学演示与中小型私有化部署的参考实现。"
    ],
    "number": "08",
    "accent": "mint"
  },
  {
    "name": "Python 全栈入门教程",
    "en": "PYTHON FULL STACK",
    "short": "Python 教程",
    "category": "docs",
    "repo": "Leo_code",
    "url": "https://github.com/Drgonmancer/Leo_code",
    "image": "assets/proj-leo.webp",
    "desc": "边学边练的 Python 全栈教程站：8 大篇章外加项目部署附录，Docsify 驱动，配图讲解，推送即自动发布。",
    "summary": "边学边练的 Python 全栈教程站：8 大篇章外加项目部署附录，Docsify 驱动，配图讲解，推送即自动发布。",
    "tags": [
      "Docsify",
      "Markdown",
      "Mermaid",
      "GitHub Pages",
      "GitHub Actions"
    ],
    "tech": "Docsify / Markdown / Mermaid",
    "period": "2026.02 — 2026.06",
    "role": "作者",
    "points": [
      "8 大篇章覆盖基础语法、面向对象、Linux 命令、Web 服务器、多任务编程、前端基础、MySQL 与 Redis，共 60 余篇。",
      "每篇配章节导读、Mermaid 流程图与实战案例（学员管理系统、烤地瓜、搬家具等），并附完整代码与练习。",
      "推送 main 分支由 GitHub Actions 自动同步到 gh-pages，线上站提供左侧目录导航与点击跳转。"
    ],
    "number": "09",
    "accent": "peach"
  }
];
