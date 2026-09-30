# Drgonmancer.github.io

个人主页 —— Liquid Glass 单页作品集，纯静态、零框架、零运行时依赖。

**线上地址：<https://drgonmancer.github.io/>**

## 说明

这个仓库只放**部署产物**，不含源码与构建脚本：

| 内容 | 说明 |
|---|---|
| `index.html` | 构建产物。含完整静态内容，禁用 JS 仍可完整阅读 |
| `avatar.jpg` | 证件照 480×480 |
| `fonts/` | 3 个自托管 woff2，Noto Sans SC + Inter + JetBrains Mono，已按页面字符集子集化 |
| `assets/` | 9 个项目卡截图，1280×720 WebP |

## 为什么是产物分支而不是源码

站点源码、构建与图像生成脚本、以及全部核验工具在本地工程里维护。这个仓库的职责单一：
被 GitHub Pages 直接服用。改内容请改源码后重新构建再推送，不要直接改这里的 `index.html`
——下次发布会被整体覆盖。

## 部署方式

因为本机 `github.com:443` 直连被重置，推送走 GitHub REST API（Git Data API），
不用 `git push`。
