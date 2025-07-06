import * as React from "react"
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { GoogleAuth } from "@/components/GoogleAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignIn1() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Login successful", description: "Welcome back!" });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Centered glass card */}
        <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-6 shadow-lg">
            <img src="/logo.svg" alt="CapitalExchange" className="h-8 w-8" />
          </div>
          {/* Title */}
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow text-center">
            Welcome back to CapitalExchange
          </h1>
          <p className="text-white drop-shadow text-center">
            Join thousands of investors who are already using CapitalExchange.
          </p>
          {/* Form */}
          <div className="mt-8 space-y-6">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="w-full flex flex-col gap-3">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm text-center">
                <span className="px-2 bg-[#121212] text-white drop-shadow text-center">Or continue with</span>
              </div>
            </div>

            <GoogleAuth />
            
            <div className="w-full text-center mt-4">
              <Button
                variant="ghost"
                className="w-full text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => navigate("/signup")}
              >
                <span className="text-sm text-white drop-shadow text-center">
                  Don&apos;t have an account?{" "}
                  <span className="font-semibold underline">Sign up, it&apos;s free!</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
        {/* User count and avatars */}
        <div className="relative z-10 mt-12 flex flex-col items-center text-center">
          <p className="text-white text-sm mb-2 drop-shadow text-center">
            Join <span className="font-medium text-white">thousands</span> of
            developers who are already using DevExchange.
          </p>
          <div className="flex">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
            <img
              src="https://randomuser.me/api/portraits/men/54.jpg"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 