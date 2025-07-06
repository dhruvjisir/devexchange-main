import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ui/use-toast';

interface CaptchaPortalProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: (error: any) => void;
  isVisible: boolean;
}

declare global {
  interface Window {
    hcaptcha: {
      render: (container: HTMLElement, options: any) => number;
      reset: (widgetId: number) => void;
      execute: (widgetId: number) => void;
    };
    onloadCallback: () => void;
  }
}

export const CaptchaPortal: React.FC<CaptchaPortalProps> = ({
  onVerify,
  onExpire,
  onError,
  isVisible,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only create portal container if captcha is visible
    if (isVisible) {
      let portalContainer = document.getElementById('captcha-portal-container');
      if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = 'captcha-portal-container';
        portalContainer.style.position = 'fixed';
        portalContainer.style.top = '0';
        portalContainer.style.left = '0';
        portalContainer.style.width = '100%';
        portalContainer.style.height = '100%';
        portalContainer.style.pointerEvents = 'none';
        portalContainer.style.zIndex = '9999';
        document.body.appendChild(portalContainer);
      }

      // Define the onload callback
      window.onloadCallback = () => {
        setIsScriptLoaded(true);
      };

      const loadHCaptcha = () => {
        if (!document.querySelector('script[src*="hcaptcha"]')) {
          const script = document.createElement('script');
          script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=onloadCallback&recaptchacompat=off&sitekey=1c8ed136-3aac-4b52-a004-c220e056b676';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        } else {
          window.onloadCallback();
        }
      };

      loadHCaptcha();
    }

    return () => {
      if (widgetIdRef.current) {
        window.hcaptcha.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      delete window.onloadCallback;
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && isScriptLoaded && containerRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: '1c8ed136-3aac-4b52-a004-c220e056b676',
          theme: 'light',
          callback: (token: string) => {
            if (token) {
              onVerify(token);
            } else {
              onError(new Error('No token received from captcha'));
            }
          },
          'expired-callback': () => {
            onExpire();
            if (widgetIdRef.current) {
              window.hcaptcha.reset(widgetIdRef.current);
            }
          },
          'error-callback': (error: any) => {
            console.error('Captcha error:', error);
            onError(error);
            if (widgetIdRef.current) {
              window.hcaptcha.reset(widgetIdRef.current);
            }
          },
          size: 'normal',
          'recaptchacompat': 'off',
          'sentry': false,
          'custom': true,
          'hl': 'en',
          'preload': true,
          'enterprise': false,
          'challenge-container': 'captcha-portal-container'
        });
      } catch (error) {
        console.error('Error rendering hCaptcha:', error);
        toast({
          title: "Error",
          description: "Failed to initialize captcha. Please refresh the page.",
          variant: "destructive",
        });
      }
    }
  }, [isVisible, isScriptLoaded, onVerify, onExpire, onError, toast]);

  const getPosition = () => {
    const joinText = document.querySelector('.text-gray-400.text-sm.mb-2');
    if (joinText) {
      const rect = joinText.getBoundingClientRect();
      return {
        top: `${rect.top + window.scrollY - 20}px`,
        left: `${rect.left + window.scrollX}px`,
        transform: 'none'
      };
    }
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  if (!isVisible) return null;

  return createPortal(
    <div 
      ref={containerRef} 
      className="hcaptcha-container"
      style={{ 
        position: 'absolute',
        ...getPosition(),
        pointerEvents: 'auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 10000,
        maxWidth: '90%',
        width: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />,
    document.getElementById('captcha-portal-container') || document.body
  );
}; 