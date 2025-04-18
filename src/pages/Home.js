import styles from "../styles/pages/Home.module.css";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { useAuthenticationStatus } from "@nhost/react";
import Spinner from "../components/Spinner";
import { Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

const Home = () => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" state={{ from: location }} replace />;
  }

  return (
    <>
      <Helmet>
        <title>Mailsbe - Track your emails</title>
      </Helmet>

      <div className={styles.homeDiv}>
        <Hero styles={styles} />
        <div className={styles.videoNav} id="video-container">
          <iframe
            className={styles.bGIframe}
            src="https://www.youtube.com/embed/spfi8hGXjrA?rel=0"
            frameBorder="0"
            title="Email Tracking Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <Features styles={styles} />
        <Footer styles={styles} />
      </div>
    </>
  );
};

export default Home;
