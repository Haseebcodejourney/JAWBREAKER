
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRespondToReview } from '@/hooks/useReviewOperations';

interface ReviewResponseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: string;
  patientName: string;
  reviewContent: string;
  onSuccess?: () => void;
}

const ReviewResponseModal = ({ 
  open, 
  onOpenChange, 
  reviewId, 
  patientName, 
  reviewContent,
  onSuccess 
}: ReviewResponseModalProps) => {
  const [response, setResponse] = useState('');
  const respondMutation = useRespondToReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!response.trim()) return;

    try {
      await respondMutation.mutateAsync({ reviewId, response: response.trim() });
      setResponse('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Değerlendirmeye Yanıt Ver</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-sm text-gray-700 mb-2">
              {patientName} adlı hastanın değerlendirmesi:
            </p>
            <p className="text-gray-600 text-sm">{reviewContent}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Yanıtınız</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Değerlendirme için teşekkür ederiz..."
                rows={6}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={respondMutation.isPending || !response.trim()}
              >
                {respondMutation.isPending ? 'Gönderiliyor...' : 'Yanıt Gönder'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewResponseModal;
