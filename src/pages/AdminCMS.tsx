
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CMSCategoryManager from '@/components/cms/CMSCategoryManager';
import CMSArticleList from '@/components/cms/CMSArticleList';
import CMSArticleEditor from '@/components/cms/CMSArticleEditor';
import CMSPageManager from '@/components/cms/CMSPageManager';
import CMSSiteSettings from '@/components/cms/CMSSiteSettings';
import CMSMenuManager from '@/components/cms/CMSMenuManager';
import { CMSArticle } from '@/hooks/useCMSArticles';

const AdminCMS = () => {
  const [activeView, setActiveView] = useState<'list' | 'editor'>('list');
  const [editingArticle, setEditingArticle] = useState<CMSArticle | undefined>();

  const handleCreateNew = () => {
    setEditingArticle(undefined);
    setActiveView('editor');
  };

  const handleEdit = (article: CMSArticle) => {
    setEditingArticle(article);
    setActiveView('editor');
  };

  const handleBack = () => {
    setActiveView('list');
    setEditingArticle(undefined);
  };

  const handleSave = (article: CMSArticle) => {
    setActiveView('list');
  };

  if (activeView === 'editor') {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <main className="flex-1">
            <CMSArticleEditor
              article={editingArticle}
              onBack={handleBack}
              onSave={handleSave}
            />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">İçerik Yönetim Sistemi</h1>
                <p className="text-gray-600 mt-2">Web sitenizin içeriklerini, sayfalarını ve ayarlarını yönetin.</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">İçerik</TabsTrigger>
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="menus">Menüler</TabsTrigger>
              <TabsTrigger value="settings">Site Ayarları</TabsTrigger>
              <TabsTrigger value="media">Medya</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <CMSPageManager />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CMSCategoryManager />
            </TabsContent>

            <TabsContent value="menus" className="space-y-6">
              <CMSMenuManager />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <CMSSiteSettings />
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="text-center p-8">
                <p className="text-gray-500">Medya Kütüphanesi bir sonraki aşamada implement edilecek</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminCMS;
