# 🎮 Kinetic Gallery — Quiz Game

React + Zustand bilan qurilgan to'liq ishlaydigan viktorina o'yini.

## 📁 Fayl tuzilmasi

```
src/
├── App.jsx                    ← Asosiy router (fase: landing/board/modal/gameover)
├── index.css                  ← Global CSS tokenlar + barcha keyframe animatsiyalar
├── data/
│   └── questions.json         ← 8 mavzu × 14 savol = 112 ta savol (MC + T/F)
├── store/
│   └── useGameStore.js        ← Zustand store — barcha o'yin holati
└── components/
    ├── LandingPage.jsx        ← Bosh sahifa (mavzu, jamoalar, start)
    ├── GameBoard.jsx          ← O'yin taxtasi (tillar, skor, turn badge, toast)
    ├── QuizModal.jsx          ← Savol modali (taymer, MC/TF, natija, confetti)
    └── GameOver.jsx           ← Yakuniy ekran (g'olib, ballar, qayta o'ynash)
```

## ⚙️ O'rnatish

```bash
# 1. Yangi React loyihasi yarating
npm create vite@latest kinetic-gallery -- --template react
cd kinetic-gallery

# 2. Zustand va Lucide o'rnating
npm install zustand lucide-react

# 3. Fayllarni joylashtiring (yuqoridagi tuzilmaga mos)

# 4. index.html <head> ichiga font qo'shing:
```

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

```bash
# 5. Loyihani ishga tushiring
npm run dev
```

## 🎯 O'yin qoidalari

| Hodisa           | Ball o'zgarishi        | Navbat    |
|------------------|------------------------|-----------|
| ✅ To'g'ri javob | +savol ballari         | Almashadi |
| ❌ Noto'g'ri     | 0                      | Almashadi |
| 💣 Bomba tile    | −20                    | Almashadi |
| 🎁 Sovg'a tile   | +20                    | Qoladi    |
| ⏱ Vaqt tugadi    | 0                      | Almashadi |

## 🎨 Animatsiyalar

- **Landing**: Logo, sarlavha, tugmalar — staggered fadeUp entrance
- **Mavzu tugmalari**: Bosishda scale ripple
- **GameBoard**: Tillar staggered tileIn, skor count-up + bounce
- **Modal**: Spring modalIn + shimmer effekti
- **Taymer**: SVG halqa real-time, 10s qolsa qizil + pulse
- **Variantlar**: Staggered optIn, bosishda ripple
- **To'g'ri**: confetti burst + iconPop
- **Noto'g'ri**: shake animatsiyasi
- **Bomba/Sovg'a**: Tile flip + toast bottom overlay
- **GameOver**: FullConfetti + staggered score cards

## 🗂 Savol qo'shish

`src/data/questions.json` fayliga qo'shing:

```json
{
  "mathematics": [
    {
      "id": "m15",
      "type": "mc",
      "text": "Savol matni?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "points": 10
    },
    {
      "id": "m16",
      "type": "tf",
      "text": "Bu to'g'rimi?",
      "answer": true,
      "points": 5
    }
  ]
}
```

`type` qiymatlari: `"mc"` (multiple choice, 4 variant) | `"tf"` (true/false)