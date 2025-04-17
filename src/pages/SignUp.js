import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSignUpEmailPassword, useAuthenticationStatus } from "@nhost/react";
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
import { Helmet } from "react-helmet";

const SignUp = ({ nhost }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    isError,
    error,
    needsEmailVerification,
  } = useSignUpEmailPassword();

  const { isAuthenticated } = useAuthenticationStatus();

  const handleSubmit = (e) => {
    e.preventDefault();
    signUpEmailPassword(email, password, {
      displayName: `${firstName} ${lastName}`.trim(),
      metadata: {
        firstName,
        lastName,
      },
    });
  };

  const handleGoogleSignUp = () => {
    nhost.auth.signIn({
      provider: "google",
    });
  };

  if (isSuccess || isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - Mailsbe</title>
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
            Sign Up
          </Typography>

          {needsEmailVerification ? (
            <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
              Please check your mailbox and follow the verification link to verify your email.
            </Alert>
          ) : (
            <>
              {isError && (
                <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                  {error?.message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                  />
                </Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  inputProps={{ minLength: 6 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>

                <Divider sx={{ my: 2 }}>or</Divider>
                
                {/* Google Sign-In Button */}
                <GoogleSignIn nhost={nhost} />

                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Link to="/sign-in" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" color="primary">
                      Already have an account? Sign In
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
