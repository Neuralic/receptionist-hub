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
        `https://whatsapp-receptionist-backend.onrender.com/api/calendar/callback`,
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
        console.log('SUCCESS! Notifying parent window...');
        
        // Success - notify parent window
        if (window.opener) {
          const parsedState = JSON.parse(state);
          window.opener.postMessage({
            type: 'CALENDAR_OAUTH_SUCCESS',
            staffId: parsedState.staffId
          }, '*');
          
          // Show success message briefly
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><div style="text-align:center;"><h2 style="color:#10b981;">✓ Calendar Connected!</h2><p>This window will close automatically...</p></div></div>';
          
          // Close popup after 2 seconds
          setTimeout(() => {
            window.close();
          }, 2000);
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
        
        // Show error message
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><div style="text-center;"><h2 style="color:#ef4444;">✗ Connection Failed</h2><p>This window will close automatically...</p></div></div>';
        
        setTimeout(() => {
          window.close();
        }, 2000);
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
