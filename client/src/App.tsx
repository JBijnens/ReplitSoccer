import { useState, useEffect, createContext } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initAuthState } from "./lib/auth";

// Pages
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Matches from "@/pages/Matches";
import Team from "@/pages/Team";
import MatchDetails from "@/pages/MatchDetails";
import AddEditMatch from "@/pages/AddEditMatch";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";

// Auth context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  setAuthState: (state: any) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  setAuthState: () => {}
});

// Initialize with mock data for testing
const mockMatches = [
  {
    id: 1,
    date: new Date("2025-06-10T18:00:00"),
    time: "6:00 PM",
    opponent: "FC Thunder",
    location: "Main Stadium",
    details: "Important match against our rivals",
    createdBy: 1,
    attendees: [],
    userAttendance: { status: "pending" },
    attendanceCount: { attending: 0, total: 2 }
  },
  {
    id: 2,
    date: new Date("2025-06-18T19:30:00"),
    time: "7:30 PM",
    opponent: "United FC",
    location: "Lincoln Park Field",
    details: "Away game - carpool available",
    createdBy: 1,
    attendees: [],
    userAttendance: { status: "pending" },
    attendanceCount: { attending: 0, total: 2 }
  },
  {
    id: 3,
    date: new Date("2025-06-25T17:00:00"),
    time: "5:00 PM",
    opponent: "City Warriors",
    location: "Community Field",
    details: "Season finale match",
    createdBy: 1,
    attendees: [],
    userAttendance: { status: "pending" },
    attendanceCount: { attending: 0, total: 2 }
  }
];

function App() {
  const [authState, setAuthState] = useState(initAuthState());
  const [location, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated && !location.startsWith("/login")) {
      setLocation("/login");
    } else if (authState.isAuthenticated && location === "/login") {
      setLocation("/");
    }
  }, [authState.isAuthenticated, location, setLocation]);
  
  // Force authentication for demo purposes 
  useEffect(() => {
    if (!authState.isAuthenticated) {
      // Set the auth state to authenticated for the demo
      const mockUser = {
        id: 1,
        email: "alex@example.com",
        name: "Alex Johnson",
        picture: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
        provider: "google",
        providerId: "google-123456",
        isAdmin: true
      };
      
      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        error: null
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/login" component={Login} />
            
            {/* Protected routes */}
            {authState.isAuthenticated && (
              <Route path="/">
                <Layout>
                  <Dashboard />
                </Layout>
              </Route>
            )}
            
            {authState.isAuthenticated && (
              <Route path="/matches">
                <Layout>
                  <Matches />
                </Layout>
              </Route>
            )}
            
            {authState.isAuthenticated && (
              <Route path="/matches/:id">
                {(params) => (
                  <Layout>
                    <MatchDetails id={parseInt(params.id)} />
                  </Layout>
                )}
              </Route>
            )}
            
            {authState.isAuthenticated && (
              <Route path="/add-match">
                <Layout>
                  <AddEditMatch />
                </Layout>
              </Route>
            )}
            
            {authState.isAuthenticated && (
              <Route path="/edit-match/:id">
                {(params) => (
                  <Layout>
                    <AddEditMatch id={parseInt(params.id)} />
                  </Layout>
                )}
              </Route>
            )}
            
            {authState.isAuthenticated && (
              <Route path="/team">
                <Layout>
                  <Team />
                </Layout>
              </Route>
            )}
            
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;


