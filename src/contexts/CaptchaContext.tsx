import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CaptchaPortal } from '@/components/CaptchaPortal';

interface CaptchaContextType {
  captchaToken: string | null;
  resetCaptcha: () => void;
  CaptchaComponent: ReactNode;
  showCaptcha: () => void;
  hideCaptcha: () => void;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

export function CaptchaProvider({ children }: { children: ReactNode }) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset captcha token when component mounts
    setCaptchaToken(null);
    setIsInitialized(true);
  }, []);

  const handleCaptchaVerify = (token: string) => {
    if (token) {
      setCaptchaToken(token);
      setIsVisible(false);
      toast({
        title: "Success",
        description: "Captcha verification completed",
      });
    }
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    toast({
      title: "Captcha Expired",
      description: "Please complete the captcha verification again",
      variant: "destructive",
    });
  };

  const handleCaptchaError = (error: any) => {
    setCaptchaToken(null);
    console.error('Captcha error:', error);
    toast({
      title: "Captcha Error",
      description: "There was an error with the captcha. Please try again.",
      variant: "destructive",
    });
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setIsVisible(false);
    // Force a re-render of the captcha component
    setIsInitialized(false);
    setTimeout(() => setIsInitialized(true), 100);
  };

  const showCaptcha = () => {
    setIsVisible(true);
  };

  const hideCaptcha = () => {
    setIsVisible(false);
  };

  const CaptchaComponent = isInitialized ? (
    <CaptchaPortal
      onVerify={handleCaptchaVerify}
      onExpire={handleCaptchaExpire}
      onError={handleCaptchaError}
      isVisible={isVisible}
    />
  ) : null;

  return (
    <CaptchaContext.Provider value={{ 
      captchaToken, 
      resetCaptcha, 
      CaptchaComponent,
      showCaptcha,
      hideCaptcha
    }}>
      {children}
    </CaptchaContext.Provider>
  );
}

export function useCaptcha() {
  const context = useContext(CaptchaContext);
  if (context === undefined) {
    throw new Error('useCaptcha must be used within a CaptchaProvider');
  }
  return context;
} 