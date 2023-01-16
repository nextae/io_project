## Setting up the backend app

### Prerequisites
- Python version 3.10 or higher
- PostgreSQL database server

To create the database tables, execute the `backend/schema.sql` file in the PostgreSQL server.

### Config file
The PostgreSQL database details and a JWT secret key need to be placed in a `.env` file in the `backend` directory.

Example `.env` file:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_URL=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE_NAME=app
JWT_SECRET_KEY=2de6949790543a015a9e0a32288adb37fdac0181dee95b107f617f4a5d48b9b1
```

Then you will need to install all the required python libraries, to do that run the following commands:

### Linux
```
cd backend
python3 -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
uvicorn app:app
```

### Windows
```
cd backend
py -m venv venv
.\venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app:app
```

After successfully starting the backend application the GraphQL API is available on http://localhost:8000/graphql

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
