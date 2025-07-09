
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Check, 
  X, 
  Eye, 
  Download,
  FileText,
  Calendar,
  Building,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type?: string;
  created_at: string;
  verified: boolean;
  clinics: {
    name: string;
    city: string;
    country: string;
  };
}

interface DocumentReviewProps {
  document: Document;
  onStatusChange: () => void;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({ document, onStatusChange }) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('documents')
        .update({ 
          verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id);

      if (error) throw error;
      
      toast({
        title: t('document.approved'),
        description: `${document.document_type} ${t('document.approved').toLowerCase()}.`,
      });
      
      onStatusChange();
      setShowApprovalDialog(false);
      setReviewNotes('');
    } catch (error) {
      console.error('Error approving document:', error);
      toast({
        title: t('common.error'),
        description: t('common.error') + ' - ' + t('document.approve'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (error) throw error;
      
      toast({
        title: t('document.rejected'),
        description: `${document.document_type} ${t('document.rejected').toLowerCase()}.`,
      });
      
      onStatusChange();
      setShowRejectionDialog(false);
      setReviewNotes('');
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast({
        title: t('common.error'),
        description: t('common.error') + ' - ' + t('document.reject'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(document.file_url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const downloadLink = window.document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = document.file_name;
      window.document.body.appendChild(downloadLink);
      downloadLink.click();
      window.document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: t('common.success'),
        description: t('document.download') + ' ' + t('common.success').toLowerCase(),
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: t('common.error'),
        description: t('document.download') + ' ' + t('common.error').toLowerCase(),
        variant: "destructive"
      });
    }
  };

  const handleViewDocument = () => {
    window.open(document.file_url, '_blank');
  };

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{document.document_type}</CardTitle>
              <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                <Building className="w-4 h-4" />
                <span>{document.clinics.name}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {t('document.pending')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-2">{t('document.details')}</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">{t('document.fileName')}:</span> {document.file_name}
              </div>
              <div>
                <span className="font-medium">{t('document.fileSize')}:</span> {formatFileSize(document.file_size)}
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{t('document.uploadDate')}: {new Date(document.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">{t('document.clinicInfo')}</h4>
            <div className="text-sm">
              <div>{document.clinics.name}</div>
              <div className="text-gray-600">{document.clinics.city}, {document.clinics.country}</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t">
          <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                <Check className="w-4 h-4 mr-2" />
                {t('document.approve')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('document.approve')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>{document.document_type}</strong> {t('document.confirmApproval')}</p>
                <Textarea
                  placeholder={t('document.approvalNotes')}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleApprove} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? t('document.approving') : t('document.confirmApprovalAction')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                {t('document.reject')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('document.reject')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>{document.document_type}</strong> {t('document.confirmRejection')}</p>
                <Textarea
                  placeholder={t('document.rejectionReason')}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleReject} 
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? t('document.rejecting') : t('document.confirmRejectionAction')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleViewDocument}>
            <Eye className="w-4 h-4 mr-2" />
            {t('document.view')}
          </Button>

          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            {t('document.download')}
          </Button>

          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleViewDetails}>
                <FileText className="w-4 h-4 mr-2" />
                {t('document.details')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('document.details')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('document.documentInfo')}</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>{t('document.documentType')}:</strong> {document.document_type}</div>
                    <div><strong>{t('document.fileName')}:</strong> {document.file_name}</div>
                    <div><strong>{t('document.fileSize')}:</strong> {formatFileSize(document.file_size)}</div>
                    {document.mime_type && (
                      <div><strong>MIME {t('document.type')}:</strong> {document.mime_type}</div>
                    )}
                    <div><strong>{t('document.uploadDate')}:</strong> {new Date(document.created_at).toLocaleString('tr-TR')}</div>
                    <div><strong>{t('document.verificationStatus')}:</strong> {document.verified ? t('status.approved') : t('status.pending')}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t('document.clinicInfo')}</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>{t('document.clinic')}:</strong> {document.clinics.name}</div>
                    <div><strong>{t('document.location')}:</strong> {document.clinics.city}, {document.clinics.country}</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleViewDocument}
                    className="flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('document.openDocument')}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('document.download')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentReview;
