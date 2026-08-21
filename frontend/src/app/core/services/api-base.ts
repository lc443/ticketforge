// src/app/core/services/api-base.ts
//
// Both production NGINX and the Angular development proxy forward /api to
// TicketForge's API gateway. A relative URL keeps browser configuration out
// of the compiled application and avoids cross-origin requests.

export const API_BASE = '/api';
