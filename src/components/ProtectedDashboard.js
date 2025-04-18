import Sidebar from "../components/Sidebar";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import styles from "../styles/pages/Dashboard.module.css";
import { useAuthenticationStatus, useUserData } from "@nhost/react";
import Spinner from "./Spinner";
import { useState, useEffect } from "react";
import PopUp from "./PopUp";
import { Alert, Snackbar } from "@mui/material";

function ProtectedDashboard({ onSignOut, authError }) {
  const user = useUserData();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const location = useLocation();
  const [popUp, setPopUp] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  
  // Handle session warnings when token refresh might be problematic
  useEffect(() => {
    // Check session token age
    const checkTokenAge = () => {
      const nhostSession = localStorage.getItem('nhost.auth.session');
      if (nhostSession) {
        try {
          const session = JSON.parse(nhostSession);
          if (session?.accessTokenExpiresAt) {
            const expiresAt = new Date(session.accessTokenExpiresAt);
            const now = new Date();
            const timeRemaining = expiresAt.getTime() - now.getTime();
            
            // Show warning when less than 5 minutes remain
            if (timeRemaining > 0 && timeRemaining < 300000) {
              setSessionWarning(true);
            } else {
              setSessionWarning(false);
            }
          }
        } catch (e) {
          console.error("Error parsing session:", e);
        }
      }
    };
    
    // Check token age on mount and every 30 seconds
    checkTokenAge();
    const interval = setInterval(checkTokenAge, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle auth errors
  useEffect(() => {
    if (authError === 'TOKEN_REFRESH_FAILED') {
      // Force sign out if we have a token refresh failure
      onSignOut && onSignOut();
    }
  }, [authError, onSignOut]);

  const handleRefreshSession = () => {
    // Manually trigger a token refresh
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return (
    <div className={styles.dashboardDiv}>
      <Sidebar styles={styles} user={user} setPopUp={setPopUp} onSignOut={onSignOut} />
      <Outlet context={{ user }} />
      {popUp && <PopUp setPopUp={setPopUp} />}
      
      {/* Session warning alert */}
      <Snackbar 
        open={sessionWarning} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="warning" 
          variant="filled"
          action={
            <button 
              onClick={handleRefreshSession}
              style={{
                background: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Refresh
            </button>
          }
        >
          Your session is about to expire. Please refresh to continue.
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ProtectedDashboard;
