// src/app/core/services/api-base.ts
//
// Backend runs behind NGINX in docker-compose on :8080 (see
// infrastructure/nginx/nginx.conf). Running a single instance directly
// (no docker-compose) instead uses :8085 from application.yml — swap this
// if that's how you're running it locally.

export const API_BASE = 'http://localhost:8080/api';
