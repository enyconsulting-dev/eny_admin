# Deployment

This project is a Vite + React + TypeScript SPA. Build artifacts are static files in dist that can be served by any static host or web server.

## Build

```sh
# install dependencies
npm ci

# build for production
npm run build

# optional: preview the production build locally
npm run preview
```

Artifacts will be generated in dist/.

## Environment variables

- At build time, variables must be prefixed with VITE_ (e.g., VITE_API_URL).
- Create .env.production or configure variables in your hosting platform.

## Static hosting (any provider)

- Run the build.
- Upload the contents of dist/ to your static host (S3+CDN, Cloudflare Pages, Azure Static Web Apps, etc.).
- Ensure your host rewrites all routes to /index.html for client-side routing.

## Nginx

Example server block:

```
server {
    listen 80;
    server_name your.domain.com;

    root /var/www/app/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

## Vercel

- New Project → Import your repo.
- Framework preset: Vite.
- Build command: npm run build
- Output directory: dist
- Configure env vars (VITE_*) in Project Settings.

## Netlify

- New site from Git → pick your repo.
- Build command: npm run build
- Publish directory: dist
- For SPA routing, add _redirects with:
    ```
    /* /index.html 200
    ```

Optional netlify.toml:
```
[build]
    command = "npm run build"
    publish = "dist"

[[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
```

## GitHub Pages (via Actions)

- Settings → Pages → Source: GitHub Actions.
- Add .github/workflows/pages.yml:

```yaml
name: Deploy to GitHub Pages
on:
    push:
        branches: [ main ]
permissions:
    contents: read
    pages: write
    id-token: write
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
                with: { node-version: 20 }
            - run: npm ci
            - run: npm run build
            - uses: actions/upload-pages-artifact@v3
                with: { path: dist }
    deploy:
        needs: build
        runs-on: ubuntu-latest
        environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
        steps:
            - id: deployment
                uses: actions/deploy-pages@v4
```

If serving from a subpath, set base in vite.config.ts:
```
export default defineConfig({ base: '/repo-name/' })
```

## Docker (Nginx)

Dockerfile:
```
# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA routing
RUN printf 'server { listen 80; root /usr/share/nginx/html; location / { try_files $uri /index.html; } }\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
```

Build and run:
```sh
docker build -t app .
docker run -p 8080:80 app
```

## Notes

- For non-root paths, configure base in Vite as shown above.
- Ensure correct cache headers for static assets and SPA fallback to index.html.
- Use HTTPS and a CDN where possible for best performance.
