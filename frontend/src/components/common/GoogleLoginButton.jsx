import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// Official Google Multi-Color SVG Icon
export const GoogleIcon = ({ className = 'w-4 h-4 sm:w-5 sm:h-5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function GoogleLoginButton({
  onSuccess,
  onError,
  className = '',
  text = 'Continue with Google',
  disabled = false,
}) {
  const { googleLogin, isLoggingIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const hiddenGsiRef = useRef(null);

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '1084224796030-v9q3gq9q4kq8j5c4u7k1p2b3a4z5x6y7.apps.googleusercontent.com'; // Standard placeholder

  useEffect(() => {
    // Dynamically inject Google Identity Services script if not already present
    if (typeof window === 'undefined') return;

    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGsi();
      };
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initGsi();
    }

    function initGsi() {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render hidden official Google button if needed for instant popups
          if (hiddenGsiRef.current) {
            window.google.accounts.id.renderButton(hiddenGsiRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
            });
          }
        }
      } catch (err) {
        console.warn('GSI initialize notice:', err);
      }
    }
  }, [googleClientId]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      toast.error('Could not obtain Google credentials');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await googleLogin({ credential: response.credential });
      if (typeof onSuccess === 'function') {
        onSuccess(loggedUser);
      }
    } catch (err) {
      if (typeof onError === 'function') {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleClick = async () => {
    if (loading || isLoggingIn || disabled) return;

    // Check if Google GSI is available on window
    if (window.google?.accounts?.id) {
      try {
        setLoading(true);

        // Attempt 1: OAuth2 token client popup
        if (window.google.accounts.oauth2) {
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'email profile openid',
            callback: async (tokenResponse) => {
              if (tokenResponse?.access_token) {
                try {
                  const loggedUser = await googleLogin({ accessToken: tokenResponse.access_token });
                  if (typeof onSuccess === 'function') {
                    onSuccess(loggedUser);
                  }
                } catch (e) {
                  if (typeof onError === 'function') onError(e);
                } finally {
                  setLoading(false);
                }
              } else {
                setLoading(false);
              }
            },
            error_callback: (err) => {
              console.warn('OAuth2 error callback:', err);
              // Fallback to GSI prompt
              triggerGsiPrompt();
            },
          });
          tokenClient.requestAccessToken({ prompt: 'consent' });
          return;
        }

        // Attempt 2: GSI Prompt
        triggerGsiPrompt();
      } catch (err) {
        console.warn('Google sign-in popup notice:', err);
        triggerGsiPrompt();
      }
    } else {
      // If GSI script failed to load (offline or adblocker)
      toast.info('Connecting to Google Identity Services...');
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const triggerGsiPrompt = () => {
    try {
      window.google?.accounts?.id?.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt was skipped or not displayed, click hidden GSI button if available
          const gsiBtn = hiddenGsiRef.current?.querySelector('div[role="button"]');
          if (gsiBtn) {
            gsiBtn.click();
          } else {
            setLoading(false);
          }
        }
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const isBusy = loading || isLoggingIn;

  return (
    <>
      {/* Hidden container used by Google GSI if needed */}
      <div ref={hiddenGsiRef} className="hidden" aria-hidden="true" />

      <button
        type="button"
        onClick={handleCustomGoogleClick}
        disabled={isBusy || disabled}
        className={`w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden group ${className}`}
      >
        {/* Subtle hover sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        {isBusy ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">Connecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleIcon />
            <span className="tracking-tight">{text}</span>
          </>
        )}
      </button>
    </>
  );
}
