import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

// GET handler for fetching conversations
export async function GET(req: NextRequest) {
  // In a production app, this would fetch from your database
  // For now, we'll return mock data
  const conversations = [
    { id: '1', title: 'Conversación de prueba' },
  ];

  return NextResponse.json(conversations);
}

// POST handler for creating a new conversation
export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    
    // In a production app, this would create in your database
    const newConversation = {
      id: `new-${Date.now()}`,
      title: title || `Conversación ${Date.now()}`,
    };

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
