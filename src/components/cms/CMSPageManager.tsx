
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaticPageManager from './StaticPageManager';
import BlogManager from './BlogManager';

const CMSPageManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">İçerik Yönetimi</h2>
        <p className="text-gray-600">Blog makalelerini ve statik sayfaları yönetin</p>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages">Statik Sayfalar</TabsTrigger>
          <TabsTrigger value="blog">Blog Makaleleri</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <StaticPageManager />
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <BlogManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSPageManager;
