# 資料庫 final project

- 小組名稱：黃薇倫的朋友和弟弟
- 系統主題：租屋網

## PDF
- PDF 檔案都在 `/pdfs` 資料夾中

| 文件                                                                 |
| ------------------------------------------------------------------ |
| [專題題目說明](pdfs/專題題目說明_0512.pdf)                                          |
| [ER model, relational schema 更新版](pdfs/ER_model_relational_schema_v2.pdf) |
| [系統架構](pdfs/系統架構.pdf) |

---

## How to run
### 1. Run backend
1. `git clone https://github.com/NCCU-DB-FINAL/backend.git`
2. Create `.env` in the `backend` directory
```shell
# .env 
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=rental_db
```
3. `pip install` packages. See README.md in the `backend` directory
4. Run `python main.py`

### 2. Run frontend
1. Clone this repo
2. `cd frontend`
3. `npm install`
4. `npm run dev`

