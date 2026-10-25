# Full-Stack Chat Application

A three-tier chat application built with a frontend, a Node.js backend, and a MongoDB database. The application is containerized with Docker, with the frontend served through Nginx.

## Project Overview

The application is organized into three layers:

1. **Frontend** — the user interface, served by Nginx on port `3001` on the host.
2. **Backend** — a Node.js API server running on port `5001`.
3. **Database** — MongoDB, used to persist application data.

### Architecture

```text
User's Browser
     |
     | http://localhost:3001
     v
Frontend (Nginx)
     |
     | API requests
     v
Node.js Backend (:5001)
     |
     | MongoDB connection
     v
MongoDB (:27017)
```

> **Note:** The host ports shown here are the ports exposed by the Docker setup. Inside a Docker network, services should connect using container or service names rather than `localhost`.

## Technology Stack

- **Frontend:** Web frontend served by Nginx
- **Backend:** Node.js
- **Database:** MongoDB
- **Containerization:** Docker
- **Multi-container setup:** Docker Compose
- **Web server / reverse proxy:** Nginx
- **Orchestration (deployment guide):** Kubernetes

## Services and Ports

| Component | Purpose | Port |
|---|---|---:|
| Frontend / Nginx | Serves the frontend to the browser | `3001` on host, `80` in container |
| Node.js backend | Handles API requests and application logic | `5001` |
| MongoDB | Stores application data | `27017` |

## How the Application Works

1. A user opens the frontend in a browser.
2. Nginx serves the frontend files.
3. The frontend sends API requests to the Node.js backend.
4. The backend processes requests and reads from or writes to MongoDB.
5. The backend returns responses to the frontend, which updates the interface.

If Nginx is configured to reverse-proxy API requests, it forwards them to the backend using the backend's Docker-network hostname and port. If the browser calls the API directly, the API URL must be reachable from the browser.

## Running the Project

The project can be run using Docker Compose, which starts the frontend, backend, and MongoDB services together.

For the Compose configuration, environment variables, commands to start and stop the services, and troubleshooting, see:

➡️ **[Docker Compose Guide](./docker-compose-readme.md)**

## Deployment with Kubernetes

The application can also be deployed to Kubernetes. The Kubernetes guide covers the deployment resources and service networking used to run the frontend, backend, and database in a cluster.

➡️ **[Kubernetes Deployment Guide](./kubernetes.readme.md)**

## Documentation

- [Project Overview](./README.md)
- [Docker Compose Guide](./docker-compose-readme.md)
- [Kubernetes Deployment Guide](./kubernetes.readme.md)
