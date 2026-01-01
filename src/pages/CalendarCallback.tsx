import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function CalendarCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      // Send callback data to backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://whatsapp-receptionist-backend.onrender.com/api'}/calendar/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code, state })
      })
        .then(response => response.json())
        .then(data => {
          // Notify parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'CALENDAR_OAUTH_SUCCESS',
              staffId: JSON.parse(state).staffId
            }, '*');
            window.close();
          }
        })
        .catch(error => {
          console.error('OAuth callback error:', error);
          if (window.opener) {
            window.opener.postMessage({
              type: 'CALENDAR_OAUTH_ERROR',
              error: error.message
            }, '*');
            window.close();
          }
        });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner text="Connecting calendar..." />
        <p className="text-muted-foreground mt-4">Please wait while we sync your calendar...</p>
      </div>
    </div>
  );
}
