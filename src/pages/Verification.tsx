import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';

const Verification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  
  // Timer for resend code
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  // Handle input change and move focus
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // If non-digit, ignore
    if (!/^\d*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);
    
    // If input filled, move to next
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };
  
  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input
      inputRefs[index - 1].current?.focus();
    }
  };
  
  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus last input
      inputRefs[5].current?.focus();
    }
  };
  
  const handleResend = () => {
    // Reset timer
    setTimeLeft(30);
    // In a real app, you would call an API to resend the code
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if OTP is complete
    if (otp.some(digit => !digit)) {
      setError('Please enter the complete verification code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, you would verify OTP with the backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, any code will work
      navigate('/chat');
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      heading="Verification required" 
      subheading="We sent a 6-digit code to your email"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Enter verification code
          </label>
          
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            ))}
          </div>
        </div>
        
        <Button type="submit" fullWidth isLoading={isLoading}>
          Verify
        </Button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Didn't receive a code?
          </p>
          
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Resend code in {timeLeft} seconds
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Resend code
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
};

export default Verification;