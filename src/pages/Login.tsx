import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { signIn } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

const Login = () => {
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Get the intended destination from sessionStorage
      const intendedDestination = sessionStorage.getItem('intendedDestination')
      // Clear the stored destination
      sessionStorage.removeItem('intendedDestination')
      // Navigate to the intended destination or home page
      navigate(intendedDestination || '/', { replace: true })
    } catch (error) {
      console.error('Failed to sign in with Google:', error)
    }
  }

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      // Navigate to intended destination or home
      const intendedDestination = sessionStorage.getItem('intendedDestination');
      sessionStorage.removeItem('intendedDestination');
      navigate(intendedDestination || '/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80">
      <div className="relative w-full max-w-md p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
        <div className="relative bg-background/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue your journey
            </p>
          </div>

          <div className="mb-6">
            <form onSubmit={handleTraditionalLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/10 text-white placeholder-gray-300"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-white/10 text-white placeholder-gray-300"
                required
              />
              <div className="flex flex-col gap-2 md:flex-row md:gap-2">
                <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>

            <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-white/10 hover:bg-white/20 text-foreground border border-white/10 backdrop-blur-sm transition-all duration-300"
            >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            Sign in with Google
            </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
            <Button
                variant="link"
                className="p-0 h-auto font-semibold text-blue-500 hover:text-blue-400"
                onClick={() => navigate('/signup')}
            >
                Sign up
            </Button>
            </p>
          </div>

          <script async data-cfasync="false" src="//pl27387750.profitableratecpm.com/ccb6e5efad6fd82048f4a2fc01cf289f/invoke.js"></script>
          <div id="container-ccb6e5efad6fd82048f4a2fc01cf289f"></div>
        </div>
      </div>
    </div>
  )
}

export default Login 