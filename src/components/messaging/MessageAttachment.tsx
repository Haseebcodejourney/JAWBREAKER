
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, ImageIcon, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageAttachmentProps {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export const MessageAttachment: React.FC<MessageAttachmentProps> = ({
  fileName,
  fileUrl,
  fileType,
  fileSize
}) => {
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = fileType.startsWith('image/');

  const handleView = () => {
    try {
      window.open(fileUrl, '_blank');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to view file',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Success',
        description: 'File downloaded successfully'
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 max-w-xs hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0">
        {isImage ? (
          <ImageIcon className="w-8 h-8 text-blue-500" />
        ) : (
          <FileIcon className="w-8 h-8 text-gray-500" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
          {fileName}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(fileSize)}
        </p>
      </div>
      
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          title="View file"
          className="h-8 w-8 p-0"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          title="Download"
          className="h-8 w-8 p-0"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
