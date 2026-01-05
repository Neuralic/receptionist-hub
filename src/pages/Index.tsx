import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if this is a calendar callback
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      // This is a calendar OAuth callback
      handleCalendarCallback(code, state);
      return;
    }

    // Normal routing logic
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, searchParams]);

  const handleCalendarCallback = async (code: string, state: string) => {
    console.log('Calendar callback detected:', { code, state });

    try {
      // Send to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://whatsapp-receptionist-backend.onrender.com/api'}/calendar/callback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ code, state })
        }
      );

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok) {
        // Success - notify parent window if this is a popup
        if (window.opener) {
          window.opener.postMessage({
            type: 'CALENDAR_OAUTH_SUCCESS',
            staffId: JSON.parse(state).staffId
          }, '*');
          
          // Close popup after brief delay
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // If not popup, redirect to staff page
          navigate('/staff');
        }
      } else {
        throw new Error(data.error || 'Failed to connect calendar');
      }
    } catch (error) {
      console.error('Calendar callback error:', error);
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'CALENDAR_OAUTH_ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        }, '*');
        window.close();
      } else {
        navigate('/staff');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner text="Loading..." />
    </div>
  );
};

export default Index;
