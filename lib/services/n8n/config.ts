/**
 * Configuración específica para n8n
 * Centraliza todas las URLs y configuración de n8n
 */

export const n8nConfig = {
  // URLs de webhooks para Gemini (predeterminado)
  gemini: {
    prod: {
      webhook: process.env.NEXT_PUBLIC_N8N_PROD_WEBHOOK_URL || 
               process.env.N8N_PROD_WEBHOOK_URL || 
               'https://sswebhookss.andresblanco.website/webhook/d6ac9b0e-d367-43a0-9953-6071ccc35cb7',
      fileUpload: process.env.NEXT_PUBLIC_N8N_PROD_FILE_UPLOAD_URL || 
                 process.env.N8N_PROD_FILE_UPLOAD_URL || 
                 'https://sswebhookss.andresblanco.website/form/82848bc4-5ea2-4e5a-8bb6-3c09b94a8c5d',
    },
    test: {
      webhook: process.env.NEXT_PUBLIC_N8N_TEST_WEBHOOK_URL || 
              process.env.N8N_TEST_WEBHOOK_URL || 
              'https://ssn8nss.andresblanco.website/webhook-test/d6ac9b0e-d367-43a0-9953-6071ccc35cb7',
      fileUpload: process.env.NEXT_PUBLIC_N8N_TEST_FILE_UPLOAD_URL || 
                 process.env.N8N_TEST_FILE_UPLOAD_URL || 
                 'https://ssn8nss.andresblanco.website/form-test/82848bc4-5ea2-4e5a-8bb6-3c09b94a8c5d',
    }
  },
  
  // URLs de webhooks para OpenAI
  openai: {
    prod: {
      webhook: process.env.N8N_PROD_WEBHOOK_URL_OPENAI || 
              'https://sswebhookss.andresblanco.website/webhook/595a3632-72af-4cdb-91df-efb7e783fec1',
      fileUpload: process.env.N8N_PROD_FILE_UPLOAD_URL_OPENAI || 
                 'https://sswebhookss.andresblanco.website/webhook/595a3632-72af-4cdb-91df-efb7e783fec1',
    },
    test: {
      webhook: process.env.N8N_TEST_WEBHOOK_URL_OPENAI || 
              'https://ssn8nss.andresblanco.website/webhook-test/595a3632-72af-4cdb-91df-efb7e783fec1',
      fileUpload: process.env.N8N_TEST_FILE_UPLOAD_URL_OPENAI || 
                 'https://ssn8nss.andresblanco.website/webhook-test/595a3632-72af-4cdb-91df-efb7e783fec1',
    }
  },
  
  // Usar prod o test
  useProd: process.env.NEXT_PUBLIC_N8N_USE_PROD === 'true' || process.env.N8N_USE_PROD === 'true',
  
  // API Key para n8n (si es necesario)
  apiKey: process.env.N8N_API_KEY || '',
  
  /**
   * Obtiene la URL del webhook según el modelo y ambiente
   */
  getWebhookUrl(model: 'gemini' | 'openai' = 'gemini'): string {
    const environment = this.useProd ? 'prod' : 'test';
    const urls = model === 'gemini' ? this.gemini : this.openai;
    return (urls as any)[environment].webhook;
  },
  
  /**
   * Obtiene la URL de subida de archivos según el modelo y ambiente
   */
  getFileUploadUrl(model: 'gemini' | 'openai' = 'gemini'): string {
    const environment = this.useProd ? 'prod' : 'test';
    const urls = model === 'gemini' ? this.gemini : this.openai;
    return (urls as any)[environment].fileUpload;
  }
};
