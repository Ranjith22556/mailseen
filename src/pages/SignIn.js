import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSignInEmailPassword, useAuthenticationStatus } from "@nhost/react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Divider,
  Alert,
} from "@mui/material";
import GoogleSignIn from "../components/GoogleSignIn";
import Spinner from "../components/Spinner";
import { Helmet } from "react-helmet";

const SignIn = ({ nhost }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    signInEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error,
  } = useSignInEmailPassword();

  const { isAuthenticated } = useAuthenticationStatus();

  const handleSubmit = (e) => {
    e.preventDefault();
    signInEmailPassword(email, password);
  };

  if (isSuccess || isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const disableForm = isLoading || needsEmailVerification;

  return (
    <>
      <Helmet>
        <title>Sign In - Mailsbe</title>
      </Helmet>
      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>

          {isError && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error?.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={disableForm}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={disableForm}
              minLength={6}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={disableForm}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>or</Divider>
            
            {/* Google Sign-In Button */}
            <GoogleSignIn nhost={nhost} />

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link to="/sign-up" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignIn;
