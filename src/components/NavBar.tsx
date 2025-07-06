import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRound, Compass, Tag, LogOut, ListPlus, Settings, Mail, Calculator, BarChart2, Edit, User, LineChart } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";

const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="StartupBazzar" className="h-8 w-auto" />
              <span className="font-bold text-xl">StartupBazzar</span>
            </Link>
            {user && (
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Explore
                </Link>
                <Link to="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Tools
                </Link>
                <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <UserRound className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/analytics')}>
                      <LineChart className="mr-2 h-4 w-4" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-listings')}>
                      <ListPlus className="mr-2 h-4 w-4" />
                      My Listings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
