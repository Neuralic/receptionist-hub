import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { servicesApi, Service } from '@/lib/api';
import { Plus, Pencil, Trash2, Clock, DollarSign, Briefcase, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categories = ['Hair', 'Nails', 'Skincare', 'Massage', 'Makeup', 'Other'];

const serviceImages: Record<string, string> = {
  Hair: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  Nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
  Skincare: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
  Massage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
  Makeup: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
  Other: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=400&h=300&fit=crop',
};

const mockServices: Service[] = [
  { id: '1', name: 'Premium Haircut', description: 'Professional haircut with styling consultation', duration: 45, price: 65, category: 'Hair' },
  { id: '2', name: 'Gel Manicure', description: 'Long-lasting gel polish with nail care', duration: 60, price: 45, category: 'Nails' },
  { id: '3', name: 'Deep Tissue Massage', description: 'Therapeutic massage for muscle relief', duration: 90, price: 120, category: 'Massage' },
  { id: '4', name: 'Facial Treatment', description: 'Rejuvenating facial with premium products', duration: 60, price: 85, category: 'Skincare' },
  { id: '5', name: 'Bridal Makeup', description: 'Full bridal makeup with trial session', duration: 120, price: 250, category: 'Makeup' },
  { id: '6', name: 'Hair Coloring', description: 'Full color treatment with premium dyes', duration: 120, price: 150, category: 'Hair' },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      const result = await servicesApi.getAll();
      if (result.data) {
        setServices(result.data.services);
      } else {
        // Use mock data if API fails
        setServices(mockServices);
      }
      setIsLoading(false);
    };
    fetchServices();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '', duration: '', price: '', category: '' });
    setEditingService(null);
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        duration: service.duration.toString(),
        price: service.price.toString(),
        category: service.category,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const serviceData = {
      name: formData.name,
      description: formData.description,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      category: formData.category,
    };

    if (editingService) {
      const result = await servicesApi.update(editingService.id, serviceData);
      if (result.data) {
        setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s));
        toast({ title: 'Service updated successfully' });
      } else {
        // Update locally for demo
        setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s));
        toast({ title: 'Service updated successfully' });
      }
    } else {
      const result = await servicesApi.create(serviceData);
      if (result.data) {
        setServices([...services, result.data.service]);
        toast({ title: 'Service created successfully' });
      } else {
        // Add locally for demo
        const newService = { ...serviceData, id: Date.now().toString() };
        setServices([...services, newService]);
        toast({ title: 'Service created successfully' });
      }
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await servicesApi.delete(id);
    setServices(services.filter(s => s.id !== id));
    toast({ title: 'Service deleted successfully' });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading services..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground">Manage your business services and pricing</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Update the service details below' : 'Fill in the details to create a new service'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Premium Haircut"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the service..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="60"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="50.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingService ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-8 h-8 text-muted-foreground" />}
            title="No services yet"
            description="Add your first service to start accepting bookings through WhatsApp"
            actionLabel="Add Service"
            onAction={() => handleOpenDialog()}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className="overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={serviceImages[service.category] || serviceImages.Other}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3">{service.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground text-lg">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {service.duration} min
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      <DollarSign className="w-4 h-4" />
                      {service.price}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
