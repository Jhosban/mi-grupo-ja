# MiChat - Aplicación de Chat estilo ChatGPT con integración a n8n

Esta aplicación es un frontend de chat desarrollado con Next.js 14, TypeScript, Tailwind CSS y next-intl que se conecta por HTTP a webhooks de n8n.

## Requisitos Previos

- Node.js 18.19.0 o superior
- pnpm 8.0.0 o superior

## Tecnologías

- Next.js 14.0.4 (App Router)
- TypeScript 5.3.3
- Tailwind CSS 3.3.6
- Prisma ORM 5.7.0
- next-intl 3.4.0
- next-auth 4.24.5

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
pnpm install
```

3. Copia el archivo `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

4. Configura las variables de entorno en `.env.local`:
   - `NEXT_PUBLIC_APP_NAME`: Nombre de tu aplicación
   - `N8N_BASE_URL`: URL base de tu instancia de n8n (ej. http://localhost:5678)
   - `N8N_WEBHOOK_PATH`: Ruta del webhook en n8n (ej. /webhook/rag-chat)

## Ejecución

Para ejecutar el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Configuración de n8n

Para integrar con n8n, necesitarás:

1. Un webhook en n8n que acepte peticiones POST
2. El webhook debe esperar un JSON con:
   ```json
   {
     "chatInput": "texto del usuario",
     "topK": 5,
     "temperature": 0.7
   }
   ```

3. El webhook debe devolver un JSON con:
   ```json
   {
     "output": "respuesta completa en texto",
     "sources": [{"title":"...","url":"...","snippet":"..."}], // opcional
     "usage": {"tokensInput":0,"tokensOutput":0} // opcional
   }
   ```

4. Configurar las variables `N8N_BASE_URL` y `N8N_WEBHOOK_PATH` en tu `.env.local`

## Test E2E

Para ejecutar los tests end-to-end con Playwright:

```bash
pnpm test:e2e
```
