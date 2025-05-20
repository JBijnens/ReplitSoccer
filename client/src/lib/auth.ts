import { apiRequest } from "./queryClient";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  providerId: string;
  isAdmin: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Mock OAuth providers for development without real OAuth credentials
const mockOAuthLogin = async (provider: "google" | "microsoft", callback: () => void) => {
  let mockUser: UserProfile;
  
  if (provider === "google") {
    mockUser = {
      id: 1,
      email: "alex@example.com",
      name: "Alex Johnson",
      picture: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
      provider: "google",
      providerId: "google-123456",
      isAdmin: true
    };
  } else {
    mockUser = {
      id: 2,
      email: "emma@example.com",
      name: "Emma Wilson",
      picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
      provider: "microsoft",
      providerId: "microsoft-123456",
      isAdmin: false
    };
  }
  
  // Simulate server delay
  setTimeout(() => {
    localStorage.setItem("auth_user", JSON.stringify(mockUser));
    localStorage.setItem("is_authenticated", "true");
    callback();
  }, 1000);
};

// Initialize auth state from localStorage
export const initAuthState = (): AuthState => {
  const storedUser = localStorage.getItem("auth_user");
  const isAuthenticated = localStorage.getItem("is_authenticated") === "true";
  
  return {
    isAuthenticated,
    user: storedUser ? JSON.parse(storedUser) : null,
    isLoading: false,
    error: null
  };
};

// Login with Google
export const loginWithGoogle = (callback: () => void) => {
  mockOAuthLogin("google", callback);
};

// Login with Microsoft
export const loginWithMicrosoft = (callback: () => void) => {
  mockOAuthLogin("microsoft", callback);
};

// Logout
export const logout = async (callback: () => void) => {
  try {
    await apiRequest("POST", "/api/auth/logout", {});
    localStorage.removeItem("auth_user");
    localStorage.removeItem("is_authenticated");
    callback();
  } catch (error) {
    console.error("Logout failed:", error);
    // Fallback to local logout if server request fails
    localStorage.removeItem("auth_user");
    localStorage.removeItem("is_authenticated");
    callback();
  }
};
