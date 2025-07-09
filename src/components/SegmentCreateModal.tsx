
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SegmentCreateModalProps {
  trigger?: React.ReactNode;
}

const SegmentCreateModal = ({ trigger }: SegmentCreateModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');
  const [type, setType] = useState('demographic');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Segment oluşturma işlemi burada yapılacak
    // Şimdilik sadece bildirim gösterelim
    toast({
      title: "Segment Oluşturuldu",
      description: `"${name}" segmenti başarıyla oluşturuldu.`,
    });

    setName('');
    setDescription('');
    setCriteria('');
    setType('demographic');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Yeni Segment Oluştur
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Müşteri Segmenti</DialogTitle>
          <DialogDescription>
            Yeni müşteri segmenti oluşturun ve hedefleme kriterleri belirleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Segment Adı</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Yüksek Değerli Müşteriler"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Segment Tipi</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demographic">Demografik</SelectItem>
                <SelectItem value="behavioral">Davranışsal</SelectItem>
                <SelectItem value="geographic">Coğrafi</SelectItem>
                <SelectItem value="psychographic">Psikografik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="criteria">Segmentasyon Kriterleri</Label>
            <Textarea
              id="criteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Örn: Son 6 ayda 2+ rezervasyon yapan, toplam harcama >$5000"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bu segmentin amacı ve kullanım alanları..."
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit">
              Segment Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SegmentCreateModal;
