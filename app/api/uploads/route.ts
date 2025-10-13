import { NextRequest, NextResponse } from 'next/server';
import { N8nClient } from '@/lib/services/n8n-client';

export async function POST(request: NextRequest) {
  console.log('Servidor: Recibiendo solicitud de subida de archivo');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    // Obtenemos el modelo seleccionado del formData (si no existe, usamos 'gemini' por defecto)
    const model = (formData.get('model') as string) || 'gemini';
    
    console.log('Servidor: Modelo seleccionado para la subida:', model);
    
    if (!file) {
      console.error('Servidor: No se encontró el archivo en la solicitud');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('Servidor: Archivo recibido:', file.name, file.size, 'bytes');

    // Utilizamos el cliente de n8n para subir el archivo con el modelo seleccionado
    const n8nClient = new N8nClient(model as 'gemini' | 'openai');
    const uploadResult = await n8nClient.uploadFile(file);
    
    if (!uploadResult.success) {
      console.error('Servidor: Error al subir archivo:', uploadResult.message);
      return NextResponse.json(
        { error: uploadResult.message || 'Failed to upload file' },
        { status: 500 }
      );
    }
    
    console.log('Servidor: Archivo subido exitosamente:', uploadResult);
    return NextResponse.json(uploadResult);
    
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