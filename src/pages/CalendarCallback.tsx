import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function CalendarCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      console.log('Calendar callback received:', { code, state });

      if (!code || !state) {
        console.error('Missing code or state');
        if (window.opener) {
          window.opener.postMessage({
            type: 'CALENDAR_OAUTH_ERROR',
            error: 'Missing authorization code'
          }, '*');
          window.close();
        } else {
          navigate('/staff');
        }
        return;
      }

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
          // Success - notify parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'CALENDAR_OAUTH_SUCCESS',
              staffId: JSON.parse(state).staffId
            }, '*');
            
            // Show success message briefly before closing
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

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner text="Connecting calendar..." />
        <p className="text-muted-foreground mt-4">Please wait while we sync your calendar...</p>
        <p className="text-xs text-muted-foreground mt-2">This window will close automatically</p>
      </div>
    </div>
  );
}
