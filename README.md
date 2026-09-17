# Family Travel OS

一个手机优先的家庭旅行与 Travel Operations 网页。

当前旅行：**West Coast Christmas 2026**

- 2 adults + 2 children
- 2026-12-23 → 2027-01-02
- San Jose + Thousand Oaks / Los Angeles
- Route A–D 对比
- 倒计时、路线图、逐日时间表、地图导航
- BOOKED / PAID / STILL NEEDED 状态追踪
- PWA / dark mode / live weather
- Gmail travel-confirmation auto sync

## Gmail → GitHub 自动同步

自动同步代码位于：

`gmail-sync/`

数据流：

**Gmail → Google Apps Script → travel parser → GitHub Contents API → `trip-data.json` → GitHub Pages**

当前 parser 包括针对实际邮件格式的规则，例如：

- Marriott Bonvoy confirmation / cancellation
- IHG confirmation
- American Airlines `Your trip confirmation (PHL - LAX)`
- United `eTicket Itinerary and Receipt for Confirmation …`
- 其他主要 airlines / rental-car providers 的通用规则

只有与当前 trip 日期窗口相关、且解析置信度足够的预订才会自动写入。无法安全解析的邮件进入 review，不会盲目修改行程。

安装说明见：`gmail-sync/SETUP.md`。

## 数据文件

页面的公开-safe旅行状态来自：

`trip-data.json`

前端通过 `app-live.js` 动态渲染 booking dashboard 和 sync 状态。

## 隐私

这是公开 GitHub Pages 网页。不要提交：

- 航班 / 酒店原始确认号或 record locator
- 票号
- Gmail message ID / raw email body
- 护照或证件号
- loyalty account number
- 信用卡信息
- GitHub token
- 家庭完整住址

Gmail sync 会把 confirmation code 先 hash，再只写入 public-safe source key。GitHub token 必须只保存在 Google Apps Script 的 Script Properties 中。

## 主要文件

- `index.html` — 页面结构
- `app-live.js` — live booking dashboard
- `trip-data.json` — 当前行程公开-safe数据
- `weather.js` — 天气模块
- `site-theme.js` — UI theme
- `sw.js` / `manifest.webmanifest` — PWA
- `gmail-sync/Code.gs` — Gmail parser + GitHub sync engine
- `gmail-sync/appsscript.json` — Apps Script manifest
- `gmail-sync/SETUP.md` — 自动同步安装步骤
