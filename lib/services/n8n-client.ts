import { NextResponse } from 'next/server';

export type N8nRequestBody = {
  chatInput: string;
  topK?: number;
  temperature?: number;
  history?: { role: 'USER' | 'ASSISTANT' | 'SYSTEM', content: string }[];
  metadata?: Record<string, unknown>;
};

export type N8nResponseBody = {
  output: string;
  sources?: {
    title: string;
    url: string;
    snippet: string;
  }[];
  usage?: {
    tokensInput: number;
    tokensOutput: number;
  };
};

export type SSEEvent = {
  type: 'message' | 'sources' | 'usage' | 'complete' | 'error';
  data: any;
};

export class N8nClient {
  private endpointUrl: string;
  private apiKey?: string;

  constructor() {
    // Determinar qué URL utilizar según la configuración
    const useProd = process.env.N8N_USE_PROD === 'true';
    
    if (useProd) {
      // Usar el webhook de producción
      this.endpointUrl = process.env.N8N_PROD_WEBHOOK_URL || 'https://hooks.singularity.cyou/webhook/d6ac9b0e-d367-43a0-9953-6071ccc35cb7';
      console.log('Usando webhook de PRODUCCIÓN');
    } else {
      // Usar el webhook de prueba
      this.endpointUrl = process.env.N8N_TEST_WEBHOOK_URL || 'https://flows.singularity.cyou/webhook-test/d6ac9b0e-d367-43a0-9953-6071ccc35cb7';
      console.log('Usando webhook de PRUEBA');
    }
    
    this.apiKey = process.env.N8N_API_KEY;
  }

  async sendMessage(message: string, topK?: number, temperature?: number): Promise<N8nResponseBody> {
    const url = this.endpointUrl;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const body: N8nRequestBody = {
      chatInput: message,
      topK: topK ?? 5,
      temperature: temperature ?? 0.7,
      metadata: {
        source: 'webapp',
        appVersion: process.env.APP_VERSION || '1.0.0'
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const rawText = await response.text();
      console.log('Respuesta cruda de n8n:', rawText);

      if (!response.ok) {
        throw new Error(`N8n service error: ${response.status} ${rawText}`);
      }

      // Intentar parsear el JSON
      return JSON.parse(rawText);
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      throw error;
    }
  }
}
