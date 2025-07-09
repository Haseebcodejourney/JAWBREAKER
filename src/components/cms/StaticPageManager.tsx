
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
  Globe
} from 'lucide-react';
import { useStaticPages, StaticPage } from '@/hooks/useStaticPages';
import { useDeleteStaticPage } from '@/hooks/useStaticPageOperations';
import StaticPageFormModal from './StaticPageFormModal';

const StaticPageManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPage, setEditingPage] = useState<StaticPage | undefined>();
  const [showFormModal, setShowFormModal] = useState(false);
  
  const { data: pages, isLoading } = useStaticPages();
  const deleteMutation = useDeleteStaticPage();

  const filteredPages = pages?.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemplateDisplay = (template: string) => {
    const templates: { [key: string]: string } = {
      'home': 'home',
      'default': 'default',
      'contact': 'contact',
      'support': 'support',
      'legal': 'legal'
    };
    return templates[template] || template;
  };

  const handleEdit = (page: StaticPage) => {
    setEditingPage(page);
    setShowFormModal(true);
  };

  const handleCreateNew = () => {
    setEditingPage(undefined);
    setShowFormModal(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handlePreview = (page: StaticPage) => {
    const previewUrl = `/preview/page/${page.slug}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statik Sayfa Yönetimi</h2>
          <p className="text-gray-600">Statik sayfaları ve içeriklerini yönetin</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Sayfa
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Sayfa ara..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>Statik Sayfalar ({filteredPages.length})</CardTitle>
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
          ) : filteredPages.length > 0 ? (
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {page.title}
                          </h3>
                          <Badge className={getStatusColor(page.status)}>
                            {page.status}
                          </Badge>
                          <Badge variant="outline">
                            {getTemplateDisplay(page.template)}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Globe className="w-3 h-3 mr-1" />
                            {page.language}
                          </div>
                          {page.is_system_page && (
                            <Badge variant="secondary">
                              Sistem Sayfası
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          Slug: /{page.slug}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(page.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePreview(page)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" disabled={page.is_system_page}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Sayfayı Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu sayfayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(page.id)}
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
              <p className="text-gray-500">Sayfa bulunamadı</p>
            </div>
          )}
        </CardContent>
      </Card>

      <StaticPageFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        page={editingPage}
        onSuccess={() => setShowFormModal(false)}
      />
    </div>
  );
};

export default StaticPageManager;
