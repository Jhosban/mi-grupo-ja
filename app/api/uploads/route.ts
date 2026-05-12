import { NextRequest, NextResponse } from 'next/server';
import { BackendService } from '@/lib/services/backend-service';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  console.log('Servidor: Recibiendo solicitud de subida de archivo');

  try {
    // Obtener sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const conversationId = (formData.get('conversationId') as string) || undefined;
    // Obtenemos el modelo seleccionado del formData (si no existe, usamos 'gemini' por defecto)
    const model = (formData.get('model') as string) || 'gemini';
    
    console.log('Servidor: Modelo seleccionado para la subida:', model);
    console.log('Servidor: Conversation ID:', conversationId);
    
    if (!file) {
      console.error('Servidor: No se encontró el archivo en la solicitud');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('Servidor: Archivo recibido:', file.name, file.size, 'bytes');

    // Utilizamos el servicio de backend para subir el archivo
    const backendService = new BackendService(model as 'gemini' | 'openai');
    const uploadResult = await backendService.uploadFile(file);
    
    console.log('📤 Resultado de subida:', uploadResult);
    
    if (!uploadResult.success) {
      console.error('Servidor: Error al subir archivo:', uploadResult.message);
      return NextResponse.json(
        { error: uploadResult.message || 'Failed to upload file' },
        { status: 500 }
      );
    }
    
    // Guardar settings específicos del backend en la conversación
    if (conversationId) {
      try {
        console.log('📝 Guardando configuración para backend: n8n');
        
        // Obtener la conversación actual
        const currentConversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });
        
        // Combinar settings existentes
        const existingSettings = currentConversation?.settings as any || {};
        let newSettings: any = {
          ...existingSettings,
          backend: 'n8n',
          uploadedAt: new Date().toISOString()
        };
        newSettings.n8nSessionData = {
          model: model,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          fileSize: file.size,
          fileType: file.type,
          processed: true // Indica que fue procesado por webhook
        };
        
        const updatedConversation = await prisma.conversation.update({
          where: { id: conversationId },
          data: { settings: newSettings }
        });
        
        console.log('✅ n8n: Listo (sin sesión requerida)');
        console.log('📋 Settings actualizados:', JSON.stringify(updatedConversation.settings, null, 2));
      } catch (dbError) {
        console.error('❌ Error guardando settings para n8n:', dbError);
        // Continuamos de todas formas
      }
    }
    
    console.log('Servidor: Archivo subido exitosamente al webhook:', uploadResult);
    // El webhook no devuelve datos específicos, solo confirmamos la subida
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      message: 'Archivo procesado correctamente por el webhook'
    });
    
  } catch (error) {
    console.error('Servidor: Error procesando la subida del archivo:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process file upload', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}