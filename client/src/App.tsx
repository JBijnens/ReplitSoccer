import { useState, useEffect } from "react";
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

export const AuthContext = React.createContext<AuthContextType | null>(null);

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

import React from "react";
