import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Home,
  FileText
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useLanguage } from '@/contexts/LanguageContext';

const CMSMenuManager = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: menuItems = [], isLoading } = useMenuItems('main');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    label: '',
    url: '',
    menu_type: 'main',
    target: '_self',
    is_active: true,
    translation_key: ''
  });

  // Predefined translation keys for common menu items
  const commonTranslationKeys = [
    { key: 'nav.home', label: 'Home' },
    { key: 'nav.about', label: 'About' },
    { key: 'nav.services', label: 'Services' },
    { key: 'nav.treatments', label: 'Treatments' },
    { key: 'nav.destinations', label: 'Destinations' },
    { key: 'nav.contact', label: 'Contact' },
    { key: 'nav.support', label: 'Support' },
    { key: 'nav.blog', label: 'Blog' },
    { key: 'nav.faq', label: 'FAQ' },
    { key: 'nav.allTreatments', label: 'All Treatments' },
    { key: 'nav.findClinics', label: 'Find Clinics' }
  ];

  const addItemMutation = useMutation({
    mutationFn: async (item: typeof newItem) => {
      const maxOrder = Math.max(...menuItems.map(m => m.sort_order), 0);
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          ...item,
          sort_order: maxOrder + 1,
          translation_key: item.translation_key || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Menü öğesi eklendi",
      });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      setNewItem({ 
        label: '', 
        url: '', 
        menu_type: 'main', 
        target: '_self', 
        is_active: true,
        translation_key: ''
      });
      setIsAddingItem(false);
    },
    onError: (error) => {
      console.error('Menu item add error:', error);
      toast({
        title: "Hata",
        description: "Menü öğesi eklenirken hata oluştu",
        variant: "destructive",
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('menu_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Menü öğesi güncellendi",
      });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      setEditingItem(null);
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Menü öğesi silindi",
      });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    }
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    }
  });

  const moveItemMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('menu_items')
        .update({ sort_order: newOrder, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    }
  });

  const addMenuItem = () => {
    if (newItem.label && newItem.url) {
      addItemMutation.mutate(newItem);
    }
  };

  const deleteMenuItem = (id: string) => {
    deleteItemMutation.mutate(id);
  };

  const toggleMenuItem = (id: string, currentActive: boolean) => {
    toggleItemMutation.mutate({ id, is_active: !currentActive });
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = menuItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < menuItems.length - 1)
    ) {
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const currentItem = menuItems[currentIndex];
      const targetItem = menuItems[targetIndex];
      
      // Swap sort orders
      moveItemMutation.mutate({ id: currentItem.id, newOrder: targetItem.sort_order });
      moveItemMutation.mutate({ id: targetItem.id, newOrder: currentItem.sort_order });
    }
  };

  const updateTranslationKey = (id: string, translation_key: string) => {
    updateItemMutation.mutate({ id, updates: { translation_key: translation_key || null } });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h2>
          <p className="text-gray-600">Site navigasyon menülerini yönetin</p>
        </div>
        <Button onClick={() => setIsAddingItem(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Menü Öğesi
        </Button>
      </div>

      {/* Add New Item Form */}
      {isAddingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Menü Öğesi Ekle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Menü Adı</Label>
                <Input
                  id="label"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="Menü adını girin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  placeholder="/sayfa-adi veya https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="translation_key">Çeviri Anahtarı (Opsiyonel)</Label>
                <Select
                  value={newItem.translation_key}
                  onValueChange={(value) => setNewItem({ ...newItem, translation_key: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Çeviri anahtarı seçin (opsiyonel)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Çeviri anahtarı yok</SelectItem>
                    {commonTranslationKeys.map((key) => (
                      <SelectItem key={key.key} value={key.key}>
                        {key.key} - {key.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="menu_type">Menü Tipi</Label>
                <Select
                  value={newItem.menu_type}
                  onValueChange={(value) => setNewItem({ ...newItem, menu_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Ana Menü</SelectItem>
                    <SelectItem value="footer">Footer Menü</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Hedef</Label>
                <Select
                  value={newItem.target}
                  onValueChange={(value) => setNewItem({ ...newItem, target: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Aynı Pencere</SelectItem>
                    <SelectItem value="_blank">Yeni Pencere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addMenuItem} disabled={addItemMutation.isPending}>
                {addItemMutation.isPending ? 'Ekleniyor...' : 'Ekle'}
              </Button>
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>İptal</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Ana Menü Öğeleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-1 bg-blue-100 rounded">
                    {item.url.startsWith('http') ? (
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    ) : item.url === '/' ? (
                      <Home className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">
                        {item.translation_key ? t(item.translation_key) : item.label}
                      </p>
                      {item.translation_key && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {item.translation_key}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{item.url}</p>
                    
                    {editingItem === item.id ? (
                      <div className="mt-2">
                        <Select
                          value={item.translation_key || ''}
                          onValueChange={(value) => updateTranslationKey(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Çeviri anahtarı seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Çeviri anahtarı yok</SelectItem>
                            {commonTranslationKeys.map((key) => (
                              <SelectItem key={key.key} value={key.key}>
                                {key.key} - {key.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={() => toggleMenuItem(item.id, item.is_active)}
                  />
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveItem(item.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveItem(item.id, 'down')}
                    disabled={index === menuItems.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteMenuItem(item.id)}
                    disabled={deleteItemMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSMenuManager;
