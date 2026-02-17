# Api Forge


## 🛠️ Development Environment Setup

#### This section walks you through the steps required to set up your local development environment.

### About the environment

The development environment is composed of two services. One service runs both the frontend and backend applications, while the second service hosts the SQL Server database. This setup allows you to start only the database service when needed, which is useful for local development or testing scenarios.

### Prerequisites

Make sure you have the following installed:

- **Docker** (with Docker Compose)
- **.NET SDK** (version matching the project, e.g. .NET 9)
- **Node.js**

### 1. Clone the repository

```bash
git clone https://github.com/nrazv/ApiForge.git
```

### 2. Update the `.env` file

### In the root directory of the project you will find a `.env` file that has the following:

```
# SQL Server credentials

DB_NAME='Database name her'
DB_PASSWORD='Database password here'
DB_ID='Database username here'
DB_SERVER='sqlserver'

```

This file allows you to configure the database server, name, username, and password. _Because it contains sensitive credentials, it must be added to .gitignore and should never be committed to source control._
Once this file has been updated, you can proceed to the next step.

### 3. Build and start the development environment

#### Open a terminal in the project `root directory` and run:

- cd into /backed and run `dotnet build`
- cd into /frontend and run `npm i && npm run build`

```
docker-compose up -d --build
```

#### This will:

- Start MSSQL Server in a container named `sqlserver`

- Build and run the backend & frontend in a container named `ravelers-app`

- Expose the API and frontend at http://localhost:8080

```
ApiForge/          👈 THIS is the project root
│
├─ backend/
│  ├─ Program.cs
│  ├─ backend.csproj
│  └─ ...
│
├─ frontend/
│  └─ ...
│
├─ docker-compose.yml
├─ Dockerfile
└─ .env

```

After executing the `docker-compose up -d --build` command, the services should start successfully. You can confirm that both services `api-forge-app` and `apiForge-sqlserver` are running by using the `docker ps` command.

### Stop the running containers:

    docker-compose stop

### Stop the application running container:

    docker stop travelers-app

### Stop the sqlserver running container:

    docker stop sqlserver

### 4. Reflect changes in the development environment

During development, if you need to apply changes to the containers, you can do so by following these steps:

### Frontend changes

Applying changes to the frontend is simple. Just run:

`npm run build`

Then refresh your browser — all changes will be applied immediately. **No Docker container restart is required.**

### Backend changes

1. Run the following command to rebuild the project:

   `dotnet build`

2. Restart the Docker container to apply the changes:

   `docker restart travelers-app`
