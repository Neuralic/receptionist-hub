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
import { businessApi, Business } from '@/lib/api';
import { 
  Building2, 
  Palette, 
  Globe, 
  Save, 
  Loader2,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Lock
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
          description: '', // Add this to backend later
        });
      }
      setIsLoading(false);
    };
    fetchBusiness();
  }, []);

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
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Knowledge Base
                </CardTitle>
                <CardDescription>
                  Train your AI with business-specific information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    The Knowledge Base feature is currently in development. 
                    You'll soon be able to upload FAQs, business policies, and custom responses 
                    to make your AI receptionist even smarter.
                  </p>
                  <Badge variant="secondary" className="mt-4 bg-primary/10 text-primary border-0">
                    Phase 2 Feature
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
