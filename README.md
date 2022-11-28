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

The GraphQL API is then available on http://localhost:8000/graphql

## Running the frontend
```
cd frontend
npm install
npm run dev
```

### Configuration
The frontend is configured similarly to the backend app, with a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:8000/graphql
VITE_API_WS_URL=ws://localhost:8000/graphql
```
