import React, { useState } from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleSignIn = ({ nhost }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Hard-code the new subdomain to ensure it works
      const subdomain = "iilmhggnkfgwthovbcrf"; // Your new Nhost subdomain
      const region = "ap-south-1";
      
      // Get the current site URL for redirect_to parameter
      const currentURL = window.location.origin;
      
      // Build the OAuth URL with proper redirect
      const redirectUrl = `https://${subdomain}.auth.${region}.nhost.run/v1/signin/provider/google?redirect_to=${encodeURIComponent(currentURL)}/app`;
      console.log("Redirecting to:", redirectUrl);
      
      // Redirect to the Google sign-in page
      window.location.href = redirectUrl;
      
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An error occurred during Google sign-in');
      console.error("Google sign-in error:", err);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        fullWidth
        sx={{ mt: 2, mb: 2 }}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn; 