# Kit de deploy de Eclipse para restaurantes. En Codespaces, desde la raíz del repo:
#   docker build -t foody-kit -f deploy/Dockerfile .
#   docker run -it --rm -v "$PWD/deploy-out:/out" foody-kit
# Te pide los datos por consola y deja en ./deploy-out el sitio, el .htaccess, las variables y los secretos.
FROM node:22-bookworm-slim
RUN apt-get update \
  && apt-get install -y --no-install-recommends zip \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENTRYPOINT ["node", "deploy/kit.mjs"]
