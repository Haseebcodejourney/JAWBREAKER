
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadParams {
  file: File;
  documentType: string;
  bookingId: string;
}

// Simple document type
interface DocumentRecord {
  id: string;
  owner_id: string | null;
  clinic_id: string | null;
  document_type: string;
  file_name: string;
  file_url: string;
  mime_type: string | null;
  file_size: number | null;
  verified: boolean | null;
  created_at: string;
  booking_id?: string;
}

// Separate the query function with explicit typing
const fetchDocuments = async (bookingId?: string) => {
  if (!bookingId) return [];
  
  console.log('Fetching documents for booking:', bookingId);
  
  // Use any to break type inference, then cast result
  const result = await (supabase as any)
    .from('documents')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false });
  
  if (result.error) {
    console.error('Error fetching documents:', result.error);
    throw result.error;
  }
  
  return (result.data || []) as DocumentRecord[];
};

// Separate the mutation function with explicit typing
const uploadDocument = async (params: DocumentUploadParams) => {
  const userResult = await (supabase as any).auth.getUser();
  if (!userResult.data?.user) throw new Error('User not authenticated');

  const insertResult = await (supabase as any)
    .from('documents')
    .insert({
      owner_id: userResult.data.user.id,
      document_type: params.documentType,
      file_name: params.file.name,
      file_url: `placeholder-url-${Date.now()}`,
      mime_type: params.file.type,
      file_size: params.file.size,
      booking_id: params.bookingId
    })
    .select()
    .single();

  if (insertResult.error) throw insertResult.error;
  return insertResult.data as DocumentRecord;
};

export const useDocuments = (bookingId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ['documents', bookingId],
    queryFn: () => fetchDocuments(bookingId),
    enabled: !!bookingId
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', bookingId] });
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully.",
      });
    },
    onError: (error) => {
      console.error('Document upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    uploadDocument: uploadDocumentMutation.mutate,
    isUploading: uploadDocumentMutation.isPending
  };
};
