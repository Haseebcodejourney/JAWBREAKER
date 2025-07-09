
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploadFixedProps {
  bookingId?: string;
  clinicId?: string;
  onUploadComplete?: (fileUrl: string, fileName: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
}

const DocumentUploadFixed: React.FC<DocumentUploadFixedProps> = ({
  bookingId,
  clinicId,
  onUploadComplete,
  acceptedTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('not found')) {
          throw new Error('Storage bucket not configured. Please contact support.');
        }
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-documents')
        .getPublicUrl(filePath);

      // Save document record to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          owner_id: user.id,
          clinic_id: clinicId,
          document_type: 'medical',
          file_name: file.name,
          file_url: publicUrl,
          mime_type: file.type,
          file_size: file.size,
          booking_id: bookingId,
          verified: false
        });

      if (dbError) throw dbError;

      const newFile: UploadedFile = {
        name: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString()
      };

      setUploadedFiles(prev => [...prev, newFile]);
      onUploadComplete?.(publicUrl, file.name);

      toast({
        title: "Upload successful",
        description: "Your document has been uploaded successfully",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Medical Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Upload medical documents, prescriptions, or test results
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (max {maxSize}MB)
          </p>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </>
            )}
          </Button>
        </div>

        {!user && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">Please log in to upload documents</p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Uploaded Files:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploadFixed;
