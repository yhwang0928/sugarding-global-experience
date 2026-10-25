# 糖鼎全球品牌互動網站

Mobile-first 的糖鼎品牌單頁網站，包含多口味互動、全球市場地圖、通路品牌資訊與完整動態效果。

## 本機開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 資料維護

- 口味資料：`src/data.js` 的 `flavors`
- 全球市場與通路：`src/data.js` 的 `markets`
- 動態與版面：`src/styles.css`

台灣通路資料整理自糖鼎官網；美國通路資料由品牌方提供。其他市場在確認通路名單前，以「通路資料整理中」顯示，避免使用未確認資訊。
