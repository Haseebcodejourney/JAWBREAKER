
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  FileText,
  Eye,
  Calendar,
  User,
  Globe
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CMSArticle } from '@/hooks/useCMSArticles';
import { useDeleteCMSArticle, usePublishCMSArticle } from '@/hooks/useCMSArticleOperations';
import CMSArticleFormModal from './CMSArticleFormModal';

interface CMSArticleListProps {
  onCreateNew: () => void;
  onEdit: (article: CMSArticle) => void;
}

const CMSArticleList = ({ onCreateNew, onEdit }: CMSArticleListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingArticle, setEditingArticle] = useState<CMSArticle | undefined>();
  const [showFormModal, setShowFormModal] = useState(false);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['cms-articles'],
    queryFn: async () => {
      console.log('Fetching CMS articles...');
      
      const { data, error } = await supabase
        .from('cms_articles')
        .select(`
          *,
          cms_categories (name),
          profiles (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      console.log('CMS articles:', data);
      return data || [];
    },
  });

  const deleteMutation = useDeleteCMSArticle();
  const publishMutation = usePublishCMSArticle();

  const filteredArticles = articles?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (article: CMSArticle) => {
    setEditingArticle(article);
    setShowFormModal(true);
  };

  const handleCreateNew = () => {
    setEditingArticle(undefined);
    setShowFormModal(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handlePublish = async (id: string) => {
    await publishMutation.mutateAsync(id);
  };

  const handlePreview = (article: CMSArticle) => {
    const previewUrl = `/preview/article/${article.slug}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Makale Yönetimi</h2>
          <p className="text-gray-600">Blog yazıları ve içerikleri yönetin</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Makale
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Makale ara..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Makaleler ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{article.title}</h3>
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                          {article.is_featured && (
                            <Badge variant="outline">Öne Çıkan</Badge>
                          )}
                          <div className="flex items-center text-xs text-gray-500">
                            <Globe className="w-3 h-3 mr-1" />
                            {article.language}
                          </div>
                        </div>
                        
                        {article.excerpt && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.profiles ? 
                              `${article.profiles.first_name} ${article.profiles.last_name}` : 
                              'Bilinmeyen Yazar'
                            }
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views_count} görüntülenme
                          </div>
                          {article.cms_categories && (
                            <span>Kategori: {article.cms_categories.name}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(article)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePreview(article)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {article.status === 'draft' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handlePublish(article.id)}
                          disabled={publishMutation.isPending}
                        >
                          Yayınla
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Makaleyi Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(article.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Makale bulunamadı</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CMSArticleFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        article={editingArticle}
        onSuccess={() => setShowFormModal(false)}
      />
    </div>
  );
};

export default CMSArticleList;
