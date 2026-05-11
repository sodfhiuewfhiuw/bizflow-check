# BizFlow Check 建置回報

更新時間：2026-05-12

## 快速預覽

- GitHub Pages：https://sodfhiuewfhiuw.github.io/bizflow-check/
- GitHub Repo：https://github.com/sodfhiuewfhiuw/bizflow-check
- here.now：https://tawny-bridge-ac9v.here.now/
- Claim URL：https://here.now/claim?slug=tawny-bridge-ac9v&token=91a4400c477c4467986ea1d08b8eae68e5f91060e45e192559a03018c7de8335
- 狀態：GitHub Pages 為正式耐久展示；here.now 為臨時預覽備援。

## 本機專案

- 路徑：`C:\Users\vin96\OneDrive\桌面\自動化自媒體管理台\bizflow-check`
- Repo：standalone `bizflow-check` git repository
- 最新主線：BizFlow Check v3｜Lead Capture UX

## 已完成功能

- 單頁健檢網站：公司網址、產業、流程描述、工具、部署風險輸入。
- 規則式三軸評分：BDS、OPS、DFS。
- 結果報告：部署等級、優先建議、適合/不建議自動化清單、CTA。
- fallback AI 顧問摘要：GitHub Pages 靜態版可正常使用。
- 報告工具：複製 Markdown、匯出 JSON、列印/存 PDF。
- 本機 lead preview：寫入 `bizflow_leads` localStorage。
- Lead Capture UX：結果後可留下回覆聯絡方式、偏好回覆方式、急迫性、想了解方案。
- 諮詢提交 UX：產生 `ready_for_review` payload，寫入 `bizflow_submissions` localStorage，顯示成功狀態並複製諮詢摘要。
- 合規提醒：只做公司/品牌層級流程健檢，不做自然人個資反查，不自動私訊或群發。

## 驗收結果

- `npm run smoke`：PASS
- 本機瀏覽器互動：填入示範資料 → 產生健檢結果 → 顯示 Lead Capture UX：PASS
- 諮詢需求提交：`leadSuccess` 成功狀態顯示、`bizflow_submissions` 寫入：PASS
- Console JS error：0
- GitHub Pages 正式耐久公開網址：PASS

## 限制

- GitHub Pages 是靜態 hosting，不會執行 `api/generate-report.js`。
- AI API 正式版需部署到 Vercel / Cloudflare Workers / Netlify Functions 等 serverless 環境。
- 真正 lead 收件目前尚未接 Google Sheet / Supabase / Email notification；v3 先用 localStorage + 複製交接稿完成靜態可用 UX。
- `OPENAI_API_KEY` 不可放前端；需設定在 serverless 環境變數。

## 下一步

1. 最快營運版：接 Google Form 或 Google Sheet Apps Script webhook。
2. 穩定後端版：Supabase table + Vercel API + Email/Telegram 通知。
3. 後台版：lead list、狀態更新、匯出 CSV、人工 review queue。
4. 正式 AI 版：serverless API 讀 `OPENAI_API_KEY`，AI 只做摘要，分數與合規紅線維持規則式。
