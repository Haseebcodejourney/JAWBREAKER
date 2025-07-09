
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
  BookOpen,
  Eye,
  Calendar,
  Globe,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useBlogArticles, BlogArticle } from '@/hooks/useBlogArticles';
import { useDeleteBlogArticle } from '@/hooks/useBlogArticleOperations';

const BlogManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: articles, isLoading } = useBlogArticles();
  const deleteMutation = useDeleteBlogArticle();

  const filteredArticles = articles?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (article: BlogArticle) => {
    // TODO: Implement edit functionality
    console.log('Edit article:', article);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handlePreview = (article: BlogArticle) => {
    const previewUrl = `/preview/blog/${article.slug}`;
    window.open(previewUrl, '_blank');
  };

  const handleCreateNew = () => {
    // TODO: Implement create new functionality
    console.log('Create new blog article');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h2>
          <p className="text-gray-600">Blog makalelerini yönetin ve düzenleyin</p>
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
          <CardTitle>Blog Makaleleri ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {article.title}
                          </h3>
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Globe className="w-3 h-3 mr-1" />
                            {article.language}
                          </div>
                          {article.is_featured && (
                            <Badge variant="secondary">
                              Öne Çıkan
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          Slug: /{article.slug}
                        </p>

                        {article.excerpt && (
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views_count} görüntülenme
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {article.likes_count} beğeni
                          </div>
                          {article.reading_time_minutes && (
                            <div className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {article.reading_time_minutes} dk okuma
                            </div>
                          )}
                        </div>

                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {article.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(article)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePreview(article)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Blog Makalesini Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu blog makalesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Makale bulunamadı</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
