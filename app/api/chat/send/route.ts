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
    
    try {
      // Send message using the configured N8nClient
      const responseData = await n8nClient.sendMessage(
        message,
        settings?.topK ?? 5,
        settings?.temperature ?? 0.7
      );
      
      // Create encoder for SSE
      const encoder = new TextEncoder();
      
      // Create stream
      const stream = new ReadableStream({
        async start(controller) {
          // Helper to push SSE events
          const push = (obj: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
          
          // Chunk output into blocks of 600-800 characters
          const chunks = responseData.output.match(/[\s\S]{600,800}|[\s\S]{1,800}/g) ?? [];
          
          // Send each chunk as a message event
          for (const chunk of chunks) {
            push({ type: 'message', data: { content: chunk } });
            
            // Add a small delay between chunks to simulate typing
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // Send sources if available
          if (responseData.sources) {
            push({ type: 'sources', data: { sources: responseData.sources } });
          }
          
          // Send usage if available
          if (responseData.usage) {
            push({ type: 'usage', data: { usage: responseData.usage } });
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
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al llamar a N8N';
      console.error('Error from N8N service:', errorMessage);
      return new Response(
        `data: ${JSON.stringify({ type: 'error', data: { message: errorMessage, code: 'N8N_SERVICE_ERROR' } })}\n\n`, 
        {
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
        }
      );
    }
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
