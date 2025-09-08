// app/api/chat/send/route.ts
import { NextRequest } from 'next/server';
import { N8nClient } from '@/lib/services/n8n-client';

export const runtime = 'nodejs'; // SSE estable

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

// Support both GET and POST methods
export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

// Shared handler for both GET and POST
async function handleRequest(req: NextRequest) {
  try {
    let message, conversationId, settings;
    
    // Check if request is from EventSource (GET with query params) or fetch (POST with body)
    const url = new URL(req.url);
    const dataParam = url.searchParams.get('data');
    
    if (dataParam) {
      // Parse from URL parameter (for EventSource)
      const parsedData = JSON.parse(decodeURIComponent(dataParam));
      message = parsedData.message;
      conversationId = parsedData.conversationId;
      settings = parsedData.settings;
    } else {
      // Parse from request body (for regular POST)
      const body = await req.json().catch(() => ({}));
      message = body.message;
      conversationId = body.conversationId;
      settings = body.settings;
    }
    
    if (!message) {
      return new Response(
        `data: ${JSON.stringify({ 
          type: 'error', 
          data: { 
            message: 'Message is required', 
            code: 'INVALID_REQUEST' 
          } 
        })}\n\n`, 
        {
          headers: { 
            'Content-Type': 'text/event-stream', 
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        }
      );
    }
    
    // Create N8N client
    const n8nClient = new N8nClient();
    
    // Send message to N8N service
    const baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
    const webhookPath = process.env.N8N_WEBHOOK_PATH || '/webhook/rag-chat';
    const res = await fetch(baseUrl + webhookPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_API_KEY ? { Authorization: `Bearer ${process.env.N8N_API_KEY}` } : {})
      },
      body: JSON.stringify({
        chatInput: message,
        topK: settings?.topK ?? 5,
        temperature: settings?.temperature ?? 0.7
      })
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        `data: ${JSON.stringify({ type: 'error', data: { message: text, code: 'N8N_SERVICE_ERROR' } })}\n\n`, 
        {
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
        }
      );
    }

    // Get response data
    const data = await res.json(); // bloque: { output, sources?, usage? }
    
    // Create encoder for SSE
    const encoder = new TextEncoder();
    
    // Create stream
    const stream = new ReadableStream({
      async start(controller) {
        // Helper to push SSE events
        const push = (obj: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        
        // Chunk output into blocks of 600-800 characters
        const chunks = data.output.match(/[\s\S]{600,800}|[\s\S]{1,800}/g) ?? [];
        
        // Send each chunk as a message event
        for (const chunk of chunks) {
          push({ type: 'message', data: { content: chunk } });
          
          // Add a small delay between chunks to simulate typing
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Send sources if available
        if (data.sources) {
          push({ type: 'sources', data: { sources: data.sources } });
        }
        
        // Send usage if available
        if (data.usage) {
          push({ type: 'usage', data: { usage: data.usage } });
        }
        
        // Send completion event
        push({ type: 'complete', data: { ok: true } });
        
        // Close the stream
        controller.close();
      }
    });

    // Return the stream as an SSE response
    return new Response(stream, { 
      headers: { 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return new Response(
      `data: ${JSON.stringify({ type: 'error', data: { message: 'Internal server error', code: 'INTERNAL_ERROR' } })}\n\n`, 
      {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
        status: 500
      }
    );
  }
}
