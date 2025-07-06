import React from 'react';
import { HCaptcha } from './HCaptcha';

interface CaptchaContainerProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: (error: any) => void;
}

export const CaptchaContainer: React.FC<CaptchaContainerProps> = ({
  onVerify,
  onExpire,
  onError,
}) => {
  return (
    <div id="captcha-container" className="mb-4">
      <HCaptcha
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onError}
      />
    </div>
  );
}; 