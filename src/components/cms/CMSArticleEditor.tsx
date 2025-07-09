
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';
import { CMSArticle } from '@/hooks/useCMSArticles';
import { useCreateCMSArticle, useUpdateCMSArticle, usePublishCMSArticle } from '@/hooks/useCMSArticleOperations';
import { useCMSCategories } from '@/hooks/useCMSCategories';

interface CMSArticleEditorProps {
  article?: CMSArticle;
  onBack: () => void;
  onSave: (article: CMSArticle) => void;
}

const CMSArticleEditor = ({ article, onBack, onSave }: CMSArticleEditorProps) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    language: 'tr',
    category_id: '',
    featured_image_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_featured: false,
    tags: [] as string[],
    reading_time_minutes: 5
  });

  const { data: categories = [] } = useCMSCategories();
  const createMutation = useCreateCMSArticle();
  const updateMutation = useUpdateCMSArticle();
  const publishMutation = usePublishCMSArticle();

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        status: article.status || 'draft',
        language: article.language || 'tr',
        category_id: article.category_id || '',
        featured_image_url: article.featured_image_url || '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        meta_keywords: article.meta_keywords || '',
        is_featured: article.is_featured || false,
        tags: article.tags || [],
        reading_time_minutes: article.reading_time_minutes || 5
      });
    }
  }, [article]);

  const handleSave = async () => {
    try {
      // Get current user ID - in a real app you'd get this from auth context
      const getCurrentUserId = () => {
        // This should be replaced with actual user ID from auth context
        return '1d15dfd9-8b51-486a-af47-762d11da3948'; // Placeholder
      };

      const articleData = {
        ...formData,
        author_id: getCurrentUserId(),
        tags: formData.tags,
        reading_time_minutes: formData.reading_time_minutes,
        likes_count: 0,
        views_count: 0
      };

      let savedArticle;
      if (article) {
        savedArticle = await updateMutation.mutateAsync({ id: article.id, ...articleData });
      } else {
        savedArticle = await createMutation.mutateAsync(articleData);
      }
      
      onSave(savedArticle);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handlePublish = async () => {
    if (article) {
      try {
        await publishMutation.mutateAsync(article.id);
        onSave({ ...article, status: 'published', published_at: new Date().toISOString() });
      } catch (error) {
        console.error('Error publishing article:', error);
      }
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <h1 className="text-xl font-semibold">
              {article ? 'Makale Düzenle' : 'Yeni Makale'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Önizle
            </Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
            {article && article.status === 'draft' && (
              <Button onClick={handlePublish} disabled={publishMutation.isPending}>
                <Send className="w-4 h-4 mr-2" />
                {publishMutation.isPending ? 'Yayınlanıyor...' : 'Yayınla'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Makale başlığını girin"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="makale-slug"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Özet</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Makale özeti..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">İçerik *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Makale içeriğini yazın..."
              rows={15}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="published">Yayınlandı</SelectItem>
                  <SelectItem value="archived">Arşivlendi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Dil</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured_image_url">Öne Çıkan Görsel URL</Label>
            <Input
              id="featured_image_url"
              value={formData.featured_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="sağlık, turizm, tedavi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reading_time">Okuma Süresi (dakika)</Label>
              <Input
                id="reading_time"
                type="number"
                value={formData.reading_time_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, reading_time_minutes: parseInt(e.target.value) || 5 }))}
                min="1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Öne Çıkan Makale</Label>
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">SEO Ayarları</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Başlık</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO için meta başlık"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Açıklama</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO için meta açıklama"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Anahtar Kelimeler</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="anahtar, kelime, listesi"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSArticleEditor;
