import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Users
} from 'lucide-react';

export default function Help() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
          <p className="text-muted-foreground">Get assistance and learn how to use ReceptHub</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border hover:shadow-elevated transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Get help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <Mail className="w-4 h-4" />
                Email Support
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-elevated transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-success" />
                Documentation
              </CardTitle>
              <CardDescription>
                Learn how to use all features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                View Docs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">How do I connect my WhatsApp?</h3>
                <p className="text-sm text-muted-foreground">
                  WhatsApp connection is configured during initial setup. Contact support if you need to update your WhatsApp Business API credentials.
                </p>
              </div>

              <div className="border-l-4 border-success pl-4">
                <h3 className="font-semibold text-foreground mb-2">How do I sync staff calendars?</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Staff page, click "Sync" button on any staff member card. This will connect their Google/Outlook calendar for availability tracking.
                </p>
              </div>

              <div className="border-l-4 border-warning pl-4">
                <h3 className="font-semibold text-foreground mb-2">How does the AI handle bookings?</h3>
                <p className="text-sm text-muted-foreground">
                  The AI receptionist automatically responds to WhatsApp messages, checks staff availability, and creates bookings in your calendar. You'll receive notifications for new bookings.
                </p>
              </div>

              <div className="border-l-4 border-info pl-4">
                <h3 className="font-semibold text-foreground mb-2">Can I customize AI responses?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Go to Settings → Knowledge Base (coming soon) to add custom FAQs and business-specific information that the AI will use in conversations.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">What are the usage limits?</h3>
                <p className="text-sm text-muted-foreground">
                  Free plan includes 50 conversations per month. Pro plan offers 1,000 conversations. Enterprise plan has unlimited conversations. View your current usage in Settings → Billing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Video className="w-6 h-6 text-primary" />
                <span className="font-medium">Video Tutorials</span>
                <span className="text-xs text-muted-foreground">Watch how-to guides</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <FileText className="w-6 h-6 text-success" />
                <span className="font-medium">API Documentation</span>
                <span className="text-xs text-muted-foreground">For developers</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="w-6 h-6 text-warning" />
                <span className="font-medium">Community Forum</span>
                <span className="text-xs text-muted-foreground">Connect with users</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Need More Help?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help you succeed
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="gap-2">
                  <Mail className="w-4 h-4" />
                  support@recepthub.com
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Live Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
