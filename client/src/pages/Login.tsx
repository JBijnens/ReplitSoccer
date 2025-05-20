import { useContext } from "react";
import { useLocation } from "wouter";
import { AuthContext, type AuthContextType } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loginWithGoogle, loginWithMicrosoft } from "@/lib/auth";
import { SiMicrosoft, SiGoogle } from "react-icons/si";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { setAuthState, isLoading } = useContext(AuthContext) as AuthContextType;
  const [_, setLocation] = useLocation();
  
  const handleGoogleLogin = () => {
    setAuthState((prev: any) => ({ ...prev, isLoading: true }));
    loginWithGoogle(() => {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(localStorage.getItem("auth_user")!),
        isLoading: false,
        error: null
      });
      setLocation("/");
    });
  };
  
  const handleMicrosoftLogin = () => {
    setAuthState((prev: any) => ({ ...prev, isLoading: true }));
    loginWithMicrosoft(() => {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(localStorage.getItem("auth_user")!),
        isLoading: false,
        error: null
      });
      setLocation("/");
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold text-neutral-dark">TeamPresence</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to manage your soccer team attendance
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent className="space-y-6 py-8 px-4 sm:px-10">
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleMicrosoftLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SiMicrosoft className="mr-2 h-4 w-4" />
                  )}
                  Sign in with Microsoft
                </Button>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SiGoogle className="mr-2 h-4 w-4" />
                  )}
                  Sign in with Google
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Team management made simple
                  </span>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
