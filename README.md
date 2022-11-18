## Running the backend app

### Linux
```
cd backend
python3 -m venv io_project
./io_project/Scripts/activate
pip install -r requirements.txt
uvicorn app:app
```

### Windows
```
cd backend
py -m venv io_project
.\io_project\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app:app
```

### Config file
You also need to set up a PostgreSQL database server and place the details in a `.env` file in the `backend` directory for example:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_URL=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE_NAME=app
```
The tables schema you need to run can be found in `backend/schema.sql`
