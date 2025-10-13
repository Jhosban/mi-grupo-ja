# MiChat

MiChat es una aplicación web de chat conversacional (estilo ChatGPT) construida con Next.js. La interfaz actúa como cliente y delega la generación de respuestas y la lógica de recuperación de documentos a flujos en n8n mediante webhooks HTTP. Incluye autenticación (NextAuth/Prisma), manejo de conversaciones, historial de mensajes y subida de archivos.

## Resumen rápido
- Frontend: Next.js 14 (App Router) + TypeScript
- UI: Tailwind CSS, framer-motion, lucide-react
- Autenticación: next-auth con adaptador Prisma y soporte OAuth (p. ej. Google)
- Base de datos: PostgreSQL (Prisma ORM)
- Integración RAG / LLM: webhooks con n8n (configurable vía variables de entorno)
- Tests E2E: Playwright

## Requisitos
- Node.js >= 18.19.0
- pnpm >= 8.0.0
- PostgreSQL o cualquier datasource compatible que uses con `DATABASE_URL`

## Instalación (local)
1. Clona el repositorio

```bash
git clone <repo-url>
cd mi-grupo-ja
```

2. Instala dependencias

```bash
pnpm install
```

3. Copia las variables de entorno y edita `.env.local` con tus valores

```bash
cp .env.example .env.local
```

Variables importantes (ejemplos):
- `DATABASE_URL` – URL de conexión a la base de datos (Postgres)
- `NEXT_PUBLIC_APP_NAME` – Nombre de la app
- `N8N_BASE_URL` – URL base de n8n (ej. http://localhost:5678)
- `N8N_WEBHOOK_PATH` – Ruta del webhook en n8n (ej. /webhook/rag-chat)
- `N8N_API_KEY` o cualquier variable que uses en `lib/env.ts` para autenticar llamadas a n8n
- Variables para OAuth/NextAuth (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.)

Consulta `lib/env.ts` para ver la configuración concreta que la app espera.

4. Genera el cliente de Prisma (se ejecuta automáticamente en postinstall, pero puedes ejecutarlo manualmente):

```bash
pnpm prisma generate
```

5. Ejecuta migraciones si es necesario (opcional):

```bash
pnpm prisma migrate dev
```

6. Ejecuta la app en desarrollo:

```bash
pnpm dev
```

La app por defecto quedará disponible en http://localhost:3000

## Scripts útiles
- `pnpm dev` — iniciar servidor de desarrollo
- `pnpm build` — generar prisma client y construir la app
- `pnpm start` — iniciar la app construida
- `pnpm test:e2e` — ejecutar tests E2E con Playwright
- `pnpm type-check` — ejecutar TypeScript type check

## API / Endpoints principales
- `POST /api/auth/register` — registro manual de usuario (valida email y password). Implementado en `app/api/auth/register/route.ts`.
- NextAuth: rutas en `app/api/auth/[...nextauth]/route.ts` (OAuth, sesiones).
- `GET|POST /api/chat/send` — endpoint SSE para enviar mensajes y recibir la respuesta por partes (stream). Implementado en `app/api/chat/send/route.ts`. Este endpoint envía la petición al webhook configurado en n8n mediante `lib/services/n8n-client.ts`.
- `POST /api/uploads` — endpoint para subir archivos desde el cliente (componente `FileUpload.tsx`). El backend envía el archivo al flujo de n8n o al servicio configurado.

Formato esperado por n8n (request):

```json
{
   "chatInput": "texto del usuario",
   "topK": 5,
   "temperature": 0.7,
   "history": [{ "role": "USER|ASSISTANT|SYSTEM", "content": "..." }]
}
```

Formato esperado de respuesta desde n8n:

```json
{
   "output": "texto con la respuesta completa",
   "sources": [{ "title": "...", "url": "...", "snippet": "..." }],
   "usage": { "tokensInput": 0, "tokensOutput": 0 }
}
```

La aplicación fragmenta `output` en chunks y los transmite al cliente como eventos SSE para simular escritura progresiva.

## Base de datos y Prisma
- El esquema Prisma se encuentra en `prisma/schema.prisma`. Modelos principales: `User`, `Conversation`, `Message`, `Account`, `Session`, `DriveToken`, `UserRole`.
- Mensajes guardan `content`, `role` (USER/ASSISTANT/SYSTEM), `sources`, `usage` y relaciones de threading (`parentId` / `children`).

## Internacionalización
- Soporta `es-ES`, `es-CO` y `en-US`. Las traducciones están en `messages/{locale}/index.json` y `app/[locale]/layout.tsx` carga los mensajes dinámicamente.

## Notas sobre seguridad y despliegue
- Asegúrate de no exponer claves de n8n o tokens en el frontend. Usa variables de entorno en el servidor.
- Para producción configura `N8N_BASE_URL` y el `N8N_API_KEY` (si aplica) y protege el webhook en n8n (ej. con token/secret).

## Desarrollo y pruebas
- Type-check: `pnpm type-check`
- Lint: `pnpm lint` (usa la configuración de `eslint-config-next`)
- E2E: `pnpm test:e2e` (Playwright)

## Contribuciones y estructura del proyecto (rápido)
- `app/` — rutas y layouts de Next.js (App Router). Locales en `app/[locale]`.
- `app/api/` — endpoints server (auth, chat, uploads, conversations)
- `components/` — componentes React reutilizables (auth, chat, upload, ui)
- `lib/` — utilidades y clientes (db, auth helpers, env, servicios como n8n-client)
- `prisma/` — esquema y migraciones
- `messages/` — archivos de traducción

## Contacto / Ayuda
Si necesitas que actualice algo específico del README (por ejemplo: añadir instrucciones de despliegue en Vercel, Docker, o ejemplos de `.env.local`), dime qué prefieres y lo agrego.

---
Actualizado: información consolidada y pasos de ejecución.
