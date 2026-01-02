import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { businessApi, faqApi, Business, FAQ } from '@/lib/api';
import { 
  Building2, 
  Palette, 
  Globe, 
  Save, 
  Loader2,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Lock,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    brandColor: '',
    timezone: '',
    description: '',
  });

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isSavingFaq, setIsSavingFaq] = useState(false);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchBusiness = async () => {
      const result = await businessApi.get();
      if (result.data) {
        const biz = result.data.business;
        setBusiness(biz);
        setFormData({
          name: biz.name || '',
          logoUrl: biz.logoUrl || '',
          brandColor: biz.brandColor || '#4F46E5',
          timezone: biz.timezone || 'UTC',
          description: '',
        });
      }
      setIsLoading(false);
    };
    fetchBusiness();
  }, []);

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoadingFaqs(true);
      const result = await faqApi.getAll();
      if (result.data) {
        setFaqs(result.data.faqs);
      }
      setLoadingFaqs(false);
    };
    
    if (!isLoading) {
      fetchFaqs();
    }
  }, [isLoading]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://whatsapp-receptionist-backend.onrender.com/api'}/business`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: formData.name,
            logoUrl: formData.logoUrl,
            brandColor: formData.brandColor,
            timezone: formData.timezone,
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBusiness(data.business);
        toast({
          title: 'Settings saved!',
          description: 'Your business information has been updated.'
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error saving settings',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetFaqForm = () => {
    setFaqFormData({ question: '', answer: '', category: 'General' });
    setEditingFaq(null);
  };

  const handleOpenFaqDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      });
    } else {
      resetFaqForm();
    }
    setIsFaqDialogOpen(true);
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFaq(true);

    if (editingFaq) {
      const result = await faqApi.update(editingFaq.id, faqFormData);
      if (result.data) {
        setFaqs(faqs.map(f => f.id === editingFaq.id ? { ...f, ...faqFormData } : f));
        toast({ title: 'FAQ updated successfully' });
      }
    } else {
      const result = await faqApi.create(faqFormData);
      if (result.data) {
        setFaqs([...faqs, result.data.faq]);
        toast({ title: 'FAQ added successfully' });
      }
    }

    setIsSavingFaq(false);
    setIsFaqDialogOpen(false);
    resetFaqForm();
  };

  const handleDeleteFaq = async (id: string) => {
    await faqApi.delete(id);
    setFaqs(faqs.filter(f => f.id !== id));
    toast({ title: 'FAQ deleted successfully' });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading settings..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your business profile and preferences</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="business" className="gap-2">
              <Building2 className="w-4 h-4" />
              Business Info
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="w-4 h-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>

          {/* Business Info Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Update your business details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Business Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your business and services..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used by the AI to provide better customer service
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    placeholder="UTC"
                  />
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Brand Identity
                </CardTitle>
                <CardDescription>
                  Customize your brand colors and logo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.logoUrl && (
                    <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                      <img 
                        src={formData.logoUrl} 
                        alt="Logo preview" 
                        className="h-16 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandColor">Brand Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="brandColor"
                      type="color"
                      value={formData.brandColor}
                      onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.brandColor}
                      onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                      placeholder="#4F46E5"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This color will be used in customer-facing interfaces
                  </p>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp Connection
                </CardTitle>
                <CardDescription>
                  Manage your WhatsApp integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">Connection Status</p>
                    <p className="text-sm text-muted-foreground">WhatsApp Business API</p>
                  </div>
                  {business?.whatsappConnected ? (
                    <Badge variant="secondary" className="gap-1 bg-success/10 text-success border-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning border-0">
                      Not Connected
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Phone Number ID</Label>
                  <Input
                    value={business?.whatsappPhoneNumberId || 'Not configured'}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="rounded-lg border border-border p-4 bg-blue-50/50 dark:bg-blue-950/20">
                  <p className="text-sm text-foreground">
                    <strong>Note:</strong> WhatsApp configuration is managed by your administrator. 
                    Contact support if you need to update your WhatsApp connection.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Knowledge Base
                    </CardTitle>
                    <CardDescription>
                      Train your AI with frequently asked questions
                    </CardDescription>
                  </div>
                  <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleOpenFaqDialog()} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add FAQ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
                        <DialogDescription>
                          {editingFaq ? 'Update the FAQ details' : 'Add a new frequently asked question'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleFaqSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={faqFormData.category}
                            onChange={(e) => setFaqFormData({ ...faqFormData, category: e.target.value })}
                            placeholder="e.g., Booking, Pricing, Services"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="question">Question</Label>
                          <Input
                            id="question"
                            value={faqFormData.question}
                            onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                            placeholder="What customers might ask..."
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="answer">Answer</Label>
                          <Textarea
                            id="answer"
                            value={faqFormData.answer}
                            onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                            placeholder="How the AI should respond..."
                            rows={4}
                            required
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button type="button" variant="outline" className="flex-1" onClick={() => setIsFaqDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="flex-1" disabled={isSavingFaq}>
                            {isSavingFaq ? <Loader2 className="w-4 h-4 animate-spin" /> : editingFaq ? 'Update' : 'Add'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loadingFaqs ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : faqs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No FAQs Yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      Add frequently asked questions to help your AI provide accurate answers to customers.
                    </p>
                    <Button onClick={() => handleOpenFaqDialog()} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First FAQ
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(
                      faqs.reduce((acc, faq) => {
                        const cat = faq.category || 'General';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(faq);
                        return acc;
                      }, {} as Record<string, typeof faqs>)
                    ).map(([category, categoryFaqs]) => (
                      <div key={category} className="space-y-3">
                        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-primary">
                          {category}
                        </h3>
                        {categoryFaqs.map((faq) => (
                          <Card key={faq.id} className="bg-muted/50 border-border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <p className="font-medium text-foreground">{faq.question}</p>
                                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenFaqDialog(faq)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteFaq(faq.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
