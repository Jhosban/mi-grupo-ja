/**
 * Este archivo centraliza la configuración de variables de entorno
 * para asegurarse de que se leen correctamente tanto en el cliente como en el servidor
 */

export const env = {
  // Aplicación
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'MiGrupoJA',
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  appVersion: process.env.APP_VERSION || '1.0.0',

  // n8n configuración
  n8n: {
    baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
    webhookPath: process.env.N8N_WEBHOOK_PATH || '/webhook/rag-chat',
    apiKey: process.env.N8N_API_KEY || '',
    
    // Configuración para cliente o servidor
    useProd: process.env.NEXT_PUBLIC_N8N_USE_PROD === 'true' || process.env.N8N_USE_PROD === 'true',
    
    // URLs de webhooks
    prodWebhookUrl: process.env.NEXT_PUBLIC_N8N_PROD_WEBHOOK_URL || 
                   process.env.N8N_PROD_WEBHOOK_URL || 
                   'https://hooks.singularity.cyou/webhook/d6ac9b0e-d367-43a0-9953-6071ccc35cb7',
    testWebhookUrl: process.env.NEXT_PUBLIC_N8N_TEST_WEBHOOK_URL || 
                   process.env.N8N_TEST_WEBHOOK_URL || 
                   'https://flows.singularity.cyou/webhook-test/d6ac9b0e-d367-43a0-9953-6071ccc35cb7',
    
    // URLs de subida de archivos
    prodFileUploadUrl: process.env.NEXT_PUBLIC_N8N_PROD_FILE_UPLOAD_URL || 
                      process.env.N8N_PROD_FILE_UPLOAD_URL || 
                      'https://hooks.singularity.cyou/form/82848bc4-5ea2-4e5a-8bb6-3c09b94a8c5d',
    testFileUploadUrl: process.env.NEXT_PUBLIC_N8N_TEST_FILE_UPLOAD_URL || 
                      process.env.N8N_TEST_FILE_UPLOAD_URL || 
                      'https://flows.singularity.cyou/form-test/82848bc4-5ea2-4e5a-8bb6-3c09b94a8c5d',
    
    // Obtener las URLs activas según la configuración
    get activeWebhookUrl() {
      return this.useProd ? this.prodWebhookUrl : this.testWebhookUrl;
    },
    
    get activeFileUploadUrl() {
      return this.useProd ? this.prodFileUploadUrl : this.testFileUploadUrl;
    }
  },
  
  // i18n configuración
  i18n: {
    defaultLocale: process.env.DEFAULT_LOCALE || 'es-ES',
    supportedLocales: (process.env.SUPPORTED_LOCALES || 'es-ES,en-US,es-CO').split(','),
  }
};