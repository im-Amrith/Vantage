import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-urban-black font-sans text-white">
      {/* Left Side - Visuals */}
      <div className="hidden w-1/2 bg-[#1a1b1c] lg:block p-4">
        <div className="grid h-full grid-cols-2 grid-rows-3 gap-4 overflow-hidden rounded-3xl p-4">
           {/* Top Left Image */}
           <div className="col-span-1 row-span-1 rounded-3xl bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center shadow-sm opacity-80"></div>
           
           {/* Top Right - Orange Stat Card */}
           <div className="col-span-1 row-span-1 rounded-3xl bg-flame p-8 flex flex-col justify-center text-white shadow-sm">
              <h2 className="text-5xl font-bold tracking-tight">41%</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed">of recruiters say entry-level positions are the hardest to fill.</p>
           </div>

           {/* Middle Left - Portrait Image */}
           <div className="col-span-1 row-span-2 rounded-3xl bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center shadow-sm opacity-80"></div>

           {/* Middle Right - Green Stat Card */}
           <div className="col-span-1 row-span-1 rounded-3xl bg-[#2ECC71] p-8 flex flex-col justify-center text-white shadow-sm">
              <h2 className="text-5xl font-bold tracking-tight">76%</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed">of hiring managers admit attracting the right job candidates is their greatest challenge.</p>
           </div>

           {/* Bottom Right - Image */}
           <div className="col-span-1 row-span-1 rounded-3xl bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center shadow-sm opacity-80"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 relative">
        <div className="absolute right-8 top-8 text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <a href="#" className="font-semibold text-white hover:underline">Sign up</a>
        </div>

        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-bold text-white">Sign in to Vantage</h1>
          <p className="mt-2 text-sm text-gray-400">Welcome to Vantage, please enter your login details below to using the app.</p>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="sr-only" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="block w-full rounded-xl border border-gray-700 bg-[#2a2b2c] px-4 py-3.5 text-white placeholder-gray-500 focus:border-flame focus:bg-[#2a2b2c] focus:outline-none focus:ring-1 focus:ring-flame transition-all"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="block w-full rounded-xl border border-gray-700 bg-[#2a2b2c] px-4 py-3.5 text-white placeholder-gray-500 focus:border-flame focus:bg-[#2a2b2c] focus:outline-none focus:ring-1 focus:ring-flame transition-all"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm font-semibold text-flame hover:text-orange-400">Forgot the password?</a>
            </div>

            <Button className="w-full rounded-xl bg-flame py-6 text-base font-semibold text-white hover:opacity-90 shadow-lg shadow-orange-600/20 transition-all border-none">
              Login
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-urban-black px-2 text-gray-500">OR</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-700 bg-[#2a2b2c] py-6 text-base font-medium text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
