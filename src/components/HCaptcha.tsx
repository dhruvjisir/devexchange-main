import React, { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface HCaptchaProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    hcaptcha: {
      render: (container: HTMLElement, options: any) => number;
      reset: (widgetId: number) => void;
      execute: (widgetId: number) => void;
    };
  }
}

export const HCaptcha: React.FC<HCaptchaProps> = ({ onVerify, onExpire, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadHCaptcha = async () => {
      try {
        if (!window.hcaptcha) {
          const script = document.createElement('script');
          script.src = 'https://js.hcaptcha.com/1/api.js';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        if (containerRef.current && !widgetIdRef.current) {
          widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
            sitekey: '1c8ed136-3aac-4b52-a004-c220e056b676',
            theme: 'light',
            callback: onVerify,
            'expired-callback': onExpire,
            'error-callback': onError,
          });
        }
      } catch (error) {
        console.error('Error loading hCaptcha:', error);
        toast({
          title: "Error",
          description: "Failed to load captcha. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    loadHCaptcha();

    return () => {
      if (widgetIdRef.current) {
        window.hcaptcha.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, onExpire, onError, toast]);

  return <div ref={containerRef} className="hcaptcha-container" />;
}; 