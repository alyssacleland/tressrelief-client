/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { getOAuthStatus, initiateOAuth } from '@/api/oauthData';

export default function StylistOAuthTile() {
  const { user } = useAuth();
  const [status, setStatus] = useState({ connected: false, calendar_id: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getOAuthStatus(user.uid)
        .then(setStatus)
        .catch(() => setStatus({ connected: false }))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleConnect = () => {
    initiateOAuth(user.uid).then((data) => {
      // successful oauth inititation returns { url: 'https://accounts.google.com/....' } (consent screen)
      if (data.url) {
        window.location.href = data.url; // redirect stylist to Google consent
        // and then back to our backend /oauth/google/callback to finish the process
        // which will then redirect back to the front-end /stylists page
      }
    });
  };

  return (
    <div>
      <Card className="mb-3 p-3">
        <h5>Hi, {user?.display_name}! Your Stylist Google Calendar:</h5>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Connect your Google Calendar so clients can only book when you’re free. We’ll read your busy times and add appointments to your calendar automatically.
        </p>

        {loading ? (
          <Spinner animation="border" size="sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : status?.connected ? (
          <p>✅ Connected to calendar: {status.calendar_id || 'primary'}</p>
        ) : (
          <>
            <p>⚠️ Not connected</p>
            <Button variant="primary" onClick={handleConnect}>
              Connect Calendar
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
