# Railway + PostgreSQL deploy

1. GitHub repositoryga ushbu versiyani push qiling.
2. Railway canvasda **+ New → Database → PostgreSQL** ni tanlang.
3. `web` servisida **Variables → Add Reference Variable** orqali Postgres servisidagi `DATABASE_URL` ni ulang.
4. Qiymat qo‘lda yozilsa: `${{Postgres.DATABASE_URL}}` (`Postgres` — servis nomi).
5. `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_ENV=production` saqlansin.
6. **Deploy** ni bosing.
7. `/api/health` javobida `database.mode = postgresql` va `connected = true` bo‘lishi kerak.

PostgreSQL jadvali avtomatik yaratiladi. Postgres ishlaganda `/data` Volume talab qilinmaydi.
