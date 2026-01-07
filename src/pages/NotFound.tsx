import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, MessageSquare } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Button>
        </div>

        {/* ReceptHub Branding */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">ReceptHub</span> - AI-Powered WhatsApp Receptionist
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
