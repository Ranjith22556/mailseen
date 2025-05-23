import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { NhostClient, NhostReactProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import ProtectedDashboard from "./components/ProtectedDashboard";
import Overview from "./pages/Overview";
import { clearAuthStorage, processAuthError } from "./utils/tokenHelper";

const App = () => {
  const [authError, setAuthError] = useState(null);
  
  // Initialize the Nhost client with robust token handling
  const nhostClient = new NhostClient({
    subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
    region: process.env.REACT_APP_NHOST_REGION,
    refreshIntervalTime: 300000, // 5 minutes (more frequent refresh)
    autoRefreshToken: true,
    clientStorage: typeof window !== 'undefined' ? localStorage : null,
    clientStorageType: 'localStorage',
    onTokenChanged: (session) => {
      // Reset error state when we get a valid token
      if (session?.accessToken) {
        setAuthError(null);
      }
    }
  });

  // Set up auth error listener
  useEffect(() => {
    const handleAuthChange = ({ event, session, error }) => {
      console.log("Auth state changed:", event);
      
      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED' && !session) {
        setAuthError('TOKEN_REFRESH_FAILED');
        
        // Process and display appropriate error message
        const processedError = processAuthError({ error: 'TOKEN_REFRESH_FAILED' });
        toast.error(processedError.message);
      }
      
      // Handle authentication errors
      if (error) {
        const processedError = processAuthError(error);
        toast.error(processedError.message);
        console.error("Auth error:", error);
      }
      
      // Other auth state changes
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    };

    // Subscribe to auth state changes
    const unsubscribe = nhostClient.auth.onAuthStateChanged(handleAuthChange);
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [nhostClient]);

  // Log environment for debugging
  console.log("Nhost config:", {
    subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
    region: process.env.REACT_APP_NHOST_REGION,
  });

  // Handle token errors based on Google OAuth documentation
  useEffect(() => {
    if (authError === 'TOKEN_REFRESH_FAILED') {
      // Clear all auth storage
      clearAuthStorage();
      
      // Redirect to sign-in page if not already there
      if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
        // Use a small delay to avoid immediate navigation issues
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 1500);
      }
    }
  }, [authError]);

  const handleSignOut = () => {
    // Clear all auth storage
    clearAuthStorage();
    
    // Sign out using the client
    nhostClient.auth.signOut();
  };

  return (
    <NhostReactProvider nhost={nhostClient}>
      <NhostApolloProvider nhost={nhostClient}>
        <BrowserRouter>
          <Routes>
            <Route path="sign-up" element={<SignUp nhost={nhostClient} />} />
            <Route path="sign-in" element={<SignIn nhost={nhostClient} />} />
            <Route path="/" element={<Home />} />

            <Route path="/app" element={
              <ProtectedDashboard 
                onSignOut={handleSignOut} 
                authError={authError}
              />
            }>
              <Route index element={<Overview />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>

        <Toaster />
      </NhostApolloProvider>
    </NhostReactProvider>
  );
};

export default App;
