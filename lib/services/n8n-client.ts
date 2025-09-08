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
  private baseUrl: string;
  private webhookPath: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.webhookPath = process.env.N8N_WEBHOOK_PATH || '/webhook/rag-chat';
    this.apiKey = process.env.N8N_API_KEY;
  }

  async sendMessage(message: string, topK?: number, temperature?: number): Promise<N8nResponseBody> {
    const url = `${this.baseUrl}${this.webhookPath}`;
    
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`N8n service error: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      throw error;
    }
  }
}
