# TANIROVKA — Railway deploy

## 1. GitHub'ga yuklash
Loyiha papkasida PowerShell oching:

```powershell
git init
git add .
git commit -m "Tanirovka Railway deploy"
git branch -M main
git remote add origin GITHUB_REPO_URL
git push -u origin main
```

## 2. Railway'da servis yaratish
1. Railway → New Project.
2. Deploy from GitHub repo.
3. GitHub repozitoriyani tanlang.
4. Railway `npm start` orqali serverni ishga tushiradi.

## 3. Variables
Railway service → Variables bo‘limida:

```env
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=OZINGIZNING_MUSTAHKAM_PAROLINGIZ
SESSION_SECRET=KAMIDA_32_BELGILI_TASODIFIY_MAXFIY_KALIT
DATA_DIR=/data
```

`PORT` ni qo‘lda kiritmang — Railway o‘zi beradi.

## 4. Buyurtmalar saqlanishi uchun Volume
1. Service → Volumes → Add Volume.
2. Mount Path: `/data`
3. Deploy/Restart qiling.

Volume qo‘yilmasa `orders.json` redeploy yoki restartda yo‘qolishi mumkin.

## 5. Domen
Service → Settings → Networking → Generate Domain.

Tekshiruv:
- Sayt: `https://SIZNING-DOMENINGIZ.up.railway.app`
- Admin: `/admin.html`
- Health: `/api/health`
