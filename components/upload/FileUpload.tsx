import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { getActiveBackend } from '@/lib/backend-config';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete?: (fileData: any) => void;
  onError?: (error: any) => void;
  model?: 'gemini' | 'openai';
  conversationId?: string;
}

export default function FileUpload({ onUploadComplete, onError, model = 'gemini', conversationId }: FileUploadProps) {
  const t = useTranslations('FileUpload');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<'uploading' | 'processing' | 'complete'>('uploading');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Función para simular progreso de carga
  const simulateProgress = () => {
    setUploadProgress(0);
    setUploadPhase('uploading');
    
    // Simular progreso de subida (0-70%)
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 70) {
          clearInterval(uploadInterval);
          setUploadPhase('processing');
          
          // Simular procesamiento (70-95%)
          const processInterval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 95) {
                clearInterval(processInterval);
                return prev;
              }
              return prev + Math.random() * 3;
            });
          }, 500);
          
          return 70;
        }
        return prev + Math.random() * 10 + 5;
      });
    }, 200);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      case 'txt':
        return '📃';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '🖼️';
      default:
        return '📎';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    console.log('Cliente: Iniciando subida de archivo', selectedFile.name);
    setIsUploading(true);
    simulateProgress();
    
    try {
      // Si no hay conversationId, crear una nueva conversación primero
      let finalConversationId = conversationId;
      
      if (!finalConversationId) {
        console.log('Cliente: No hay conversationId, creando nueva conversación...');
        
        try {
          const formattedDate = `${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}, ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`;
          
          const convResponse = await fetch('/api/conversations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: `${formattedDate}`,
            }),
          });
          
          if (!convResponse.ok) {
            throw new Error('Failed to create conversation');
          }
          
          const newConversation = await convResponse.json();
          finalConversationId = newConversation.id;
          console.log('Cliente: Nueva conversación creada:', finalConversationId);
        } catch (error) {
          console.error('Cliente: Error creando conversación:', error);
          throw new Error('No se pudo crear una conversación para el archivo');
        }
      }
      
      // Obtener el backend activo
      const activeBackend = getActiveBackend();
      console.log('Cliente: Backend activo:', activeBackend);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Solo enviamos los campos mínimos necesarios para nuestro API interno
      formData.append('model', model);
      if (!finalConversationId) {
        throw new Error('No conversation available for file upload');
      }
      formData.append('conversationId', finalConversationId);
      formData.append('activeBackend', activeBackend);
      console.log('Cliente: FormData creado con el archivo', selectedFile.name, 'y modelo', model, 'conversationId:', finalConversationId, 'backend:', activeBackend);
      
      // Subir el archivo utilizando nuestro endpoint que utiliza n8n
      console.log('Cliente: Enviando solicitud a /api/uploads');
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Cliente: Respuesta recibida, status:', response.status);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Cliente: Datos recibidos:', data);
      
      // Completar el progreso
      setUploadProgress(100);
      setUploadPhase('complete');
      
      // Esperar un poco antes de llamar onUploadComplete para mostrar el 100%
      setTimeout(() => {
        if (onUploadComplete) {
          console.log('Cliente: Llamando a onUploadComplete con los datos');
          onUploadComplete(data);
        }
        
        setSelectedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        console.log('Cliente: Archivo subido exitosamente');
      }, 1000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadProgress(0);
      if (onError) {
        onError(error);
      }
    } finally {
      // No resetear inmediatamente para mostrar el progreso completo
      setTimeout(() => {
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Área de drag & drop */}
      <div className="relative">
        <div
          className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-105' 
              : isUploading 
                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          } ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}`}
          onDragEnter={!isUploading ? handleDragEnter : undefined}
          onDragLeave={!isUploading ? handleDragLeave : undefined}
          onDragOver={!isUploading ? handleDragOver : undefined}
          onDrop={!isUploading ? handleDrop : undefined}
          onClick={!isUploading ? () => fileInputRef.current?.click() : undefined}
        >
          {isUploading ? (
            /* Overlay de carga */
            <div className="flex flex-col items-center space-y-6">
              {/* Indicador de progreso circular */}
              <div className="relative">
                <div className="w-20 h-20">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 30}`}
                      strokeDashoffset={`${2 * Math.PI * 30 * (1 - uploadProgress / 100)}`}
                      className={`transition-all duration-300 ${
                        uploadPhase === 'complete' 
                          ? 'text-emerald-500' 
                          : 'text-indigo-500'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Icono central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {uploadPhase === 'complete' ? (
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <Upload className="w-8 h-8 text-indigo-500 animate-bounce" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Estados de carga */}
              <div className="text-center space-y-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {uploadPhase === 'uploading' && t('uploadingFile')}
                  {uploadPhase === 'processing' && t('processingFile')}
                  {uploadPhase === 'complete' && t('uploadComplete')}
                </h4>
                
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                  <span className="font-semibold text-lg">{Math.round(uploadProgress)}%</span>
                </div>
              </div>
            </div>
          ) : selectedFile ? (
            /* Archivo seleccionado */
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  {getFileIcon(selectedFile.name)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile();
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              <div className="text-center space-y-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                Hacer clic para cambiar archivo
              </p>
            </div>
          ) : (
            /* Estado inicial */
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sube tu archivo
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Arrastra y suelta aquí o{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    haz clic para explorar
                  </span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Soporta: PDF, DOC, XLS, PPT, TXT, Imágenes
                </p>
              </div>
            </div>
          )}
          
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Botón de subida */}
      {selectedFile && !isUploading && (
        <Button
          onClick={handleUpload}
          className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <Upload className="w-5 h-5 mr-2" />
          {t('uploadFile')}
        </Button>
      )}
    </div>
  );
}