import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { AuthContext, type AuthContextType } from "@/App";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  CalendarDays, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Menu,
  ChevronDown
} from "lucide-react";

const Header = () => {
  const { user, setAuthState } = useContext(AuthContext) as AuthContextType;
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout(() => {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
      setLocation("/login");
    });
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <>
      <header className="bg-primary shadow-md z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2">
              <svg 
                className="text-white h-5 w-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512" 
                fill="currentColor"
              >
                <path d="M177.1 228.6L207.9 320h96.5l29.62-91.38L256 172.1L177.1 228.6zM255.1 0C114.6 0 .0001 114.6 .0001 256S114.6 512 256 512s255.1-114.6 255.1-255.1S397.4 0 255.1 0zM416.6 360.9l-85.4-1.297l-25.15 81.59C290.1 445.5 273.4 448 256 448s-34.09-2.523-50.09-6.797L180.8 359.6l-85.4 1.297c-18.12-27.66-29.15-60.27-30.88-95.31L137.8 233.3L109.5 147.2C134.2 104.8 171.8 71.21 217.7 55.34L256 125.9l38.3-70.53c45.95 15.87 83.54 49.45 108.2 91.86l-28.28 86.1l73.31 32.37C446.1 300.6 434.7 333.2 416.6 360.9z" />
              </svg>
              <h1 className="text-white font-heading font-bold text-xl">TeamPresence</h1>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/"
                className={`text-white font-medium hover:text-accent-light ${isActive("/") ? "text-accent" : ""}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/matches"
                className={`text-white font-medium hover:text-accent-light ${isActive("/matches") ? "text-accent" : ""}`}
              >
                Matches
              </Link>
              <Link 
                href="/team"
                className={`text-white font-medium hover:text-accent-light ${isActive("/team") ? "text-accent" : ""}`}
              >
                Team
              </Link>
              
              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 text-white hover:bg-primary-light"
                  >
                    <span className="font-medium">{user?.name}</span>
                    <Avatar className="h-8 w-8">
                      {user?.picture ? (
                        <AvatarImage src={user.picture} alt={user.name} />
                      ) : (
                        <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden bg-white shadow-lg absolute w-full z-20 transform transition-all duration-300 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="container mx-auto px-4 py-3">
          <div className="space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <div className={`block py-2 px-3 rounded-md font-medium hover:bg-muted text-primary ${isActive("/") ? "bg-muted" : ""}`}>
                <Home className="inline-block mr-2 h-4 w-4" /> Dashboard
              </div>
            </Link>
            <Link href="/matches" onClick={() => setMobileMenuOpen(false)}>
              <div className={`block py-2 px-3 rounded-md font-medium hover:bg-muted text-primary ${isActive("/matches") ? "bg-muted" : ""}`}>
                <CalendarDays className="inline-block mr-2 h-4 w-4" /> Matches
              </div>
            </Link>
            <Link href="/team" onClick={() => setMobileMenuOpen(false)}>
              <div className={`block py-2 px-3 rounded-md font-medium hover:bg-muted text-primary ${isActive("/team") ? "bg-muted" : ""}`}>
                <Users className="inline-block mr-2 h-4 w-4" /> Team
              </div>
            </Link>
            <div className="border-t border-neutral-light my-2"></div>
            <div className="block py-2 px-3 rounded-md font-medium hover:bg-muted text-primary">
              <User className="inline-block mr-2 h-4 w-4" /> Profile
            </div>
            <div className="block py-2 px-3 rounded-md font-medium hover:bg-muted text-primary">
              <Settings className="inline-block mr-2 h-4 w-4" /> Settings
            </div>
            <div 
              className="block py-2 px-3 rounded-md font-medium hover:bg-muted text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="inline-block mr-2 h-4 w-4" /> Logout
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
