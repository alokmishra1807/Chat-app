# Full-Stack Chat App — Docker Compose

This project runs the chat application's frontend, backend, and MongoDB database using Docker Compose.

## Architecture

The application contains three services:

- **Frontend** — serves the web application through Nginx on container port `80`.
- **Backend** — runs the application API on container port `5001`.
- **MongoDB** — stores application data on container port `27017`.

All three services are connected to the `fullstack-chatapp` Docker bridge network, allowing containers to communicate using their service names.

## Docker Compose Configuration

### 1. MongoDB (`mongodb`)

```yaml
mongodb:
  image: mongo:latest
  container_name: mongodb
  volumes:
    - mongo-data:/data/db
  ports:
    - "27017:27017"
  networks:
    - fullstack-chatapp
```

- `image`: uses the official MongoDB image.
- `container_name`: names the container `mongodb`.
- `volumes`: stores database files in the persistent Docker volume `mongo-data`, so data can survive container recreation.
- `ports`: maps host port `27017` to container port `27017`, allowing tools on the host machine to connect to MongoDB.
- `networks`: connects MongoDB to the shared application network.

From another container on this Compose network, the MongoDB connection host should be `mongodb`, for example:

```text
mongodb://mongodb:27017/App-yt
```

Replace `App-yt` with your actual database name if needed.

### 2. Backend (`backend`)

```yaml
backend:
  image: alokmishra773/chat-app-backend:latest
  container_name: chat-backend
  ports:
    - "5001:5001"
  env_file:
    - ./backend/.env
  depends_on:
    - mongodb
  networks:
    - fullstack-chatapp
```

- `image`: pulls and runs the backend image from Docker Hub.
- `container_name`: names the container `chat-backend`.
- `ports`: maps host port `5001` to container port `5001`, making the API accessible from the host at `http://localhost:5001`.
- `env_file`: loads environment variables from `./backend/.env`. Ensure this file exists and contains the required configuration, including the MongoDB URI and any required secrets.
- `depends_on`: starts the MongoDB container before the backend container. It does **not** guarantee that MongoDB is ready to accept connections; the backend should retry database connections or use a health check.
- `networks`: allows the backend to reach MongoDB using the hostname `mongodb`.

Make sure the backend's MongoDB URI uses `mongodb` as the hostname rather than `localhost`, because `localhost` inside the backend container refers to that backend container itself.

### 3. Frontend (`frontend`)

```yaml
frontend:
  image: alokmishra773/chat-app-frontend:latest
  container_name: chat-frontend
  ports:
    - "3001:80"
  depends_on:
    - backend
  networks:
    - fullstack-chatapp
```

- `image`: pulls and runs the frontend image from Docker Hub.
- `container_name`: names the container `chat-frontend`.
- `ports`: maps host port `3001` to Nginx's container port `80`. Open `http://localhost:3001` in a browser to access the frontend.
- `depends_on`: starts the backend container before the frontend container, but does not wait for the backend API to become ready.
- `networks`: connects the frontend to the shared bridge network.

**Important:** If Nginx in the frontend container proxies API requests to the backend, it can use `http://chat-backend:5001` when both containers share this network. If the browser's JavaScript calls the API directly, `chat-backend` will not normally resolve on the user's computer; configure a browser-accessible API URL or route requests through Nginx.

### 4. Network

```yaml
networks:
  fullstack-chatapp:
    driver: bridge
```

Creates a user-defined Docker bridge network named `fullstack-chatapp`. Containers on this network can communicate with each other by service name or configured container name.

### 5. Persistent volume

```yaml
volumes:
  mongo-data:
```

Creates a named Docker volume for MongoDB's data directory. Removing containers with `docker compose down` normally preserves this volume. To remove the volume and its database data as well, use `docker compose down -v` — this is destructive.

## Prerequisites

- Docker installed and running.
- Docker Compose V2 available (`docker compose version`).
- Access to the Docker Hub images referenced in the Compose file.
- A correctly configured `./backend/.env` file.

## Run the application

Run these commands from the directory containing `compose.yaml` or `docker-compose.yml`:

```bash
# Validate the Compose configuration
docker compose config

# Download the configured images
docker compose pull

# Start all services in the background
docker compose up -d

# View running containers
docker compose ps

# Follow logs from all services
docker compose logs -f

# Follow logs for one service
docker compose logs -f backend
docker compose logs -f mongodb
docker compose logs -f frontend
```

Open the frontend at:

```text
http://localhost:3001
```

The backend is exposed on the host at:

```text
http://localhost:5001
```

MongoDB is exposed on the host at:

```text
mongodb://localhost:27017
```

The actual API endpoints depend on the routes implemented by the backend.

## Stop the application

```bash
# Stop and remove the containers and Compose network
docker compose down
```

MongoDB data in `mongo-data` is preserved by this command.

To also remove the named volume and permanently delete the database files stored in it:

```bash
docker compose down -v
```

## Useful notes

- Container-to-container connections should use service names such as `mongodb` and `backend`, not `localhost`.
- Host port mappings use the format `HOST_PORT:CONTAINER_PORT`.
- `depends_on` controls startup order; it does not by itself confirm that a dependency is healthy.
- Avoid committing `.env` files containing passwords, tokens, or other secrets to source control.
- For reproducible deployments, consider pinning image tags instead of using `latest`.
