import React from "react";
import { Link } from "react-router-dom";

function Footer({ styles }) {
  return (
    <div className={styles.footer}>
      <div className={styles.widgetsDiv}>
        <div className={styles.widget0Div}>
          <div className={styles.hELPMENUB}>Welcome to Mailsbe</div>
          <div className={styles.weAreHereToHelpYouSuceed}>
            Track your emails and find out if someone has read your message.
          </div>

          <div className={styles.socialDiv}>
            <a
              className={styles.a}
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className={styles.logoTwitter2Icon}
                alt="Twitter"
                src="/logotwitter-2.svg"
              />
            </a>
            <a
              className={styles.a1}
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className={styles.logoFbSimple2Icon}
                alt="Facebook"
                src="/logofbsimple-2.svg"
              />
            </a>
            <a
              className={styles.a2}
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className={styles.logoInstagram1Icon}
                alt="Instagram"
                src="/logoinstagram-1.svg"
              />
            </a>
            <a
              className={styles.a3}
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className={styles.logoGithub1Icon}
                alt="GitHub"
                src="/logogithub-1.svg"
              />
            </a>
          </div>
        </div>

        <div className={styles.widget1Div}>
          <div className={styles.hELPMENUB1}>MENU</div>
          <a className={styles.worksA} href="#video-container">
            How it works
          </a>
          <Link className={styles.features} to="/#">
            Features
          </Link>
          <Link className={styles.about} to="/#">
            About
          </Link>
        </div>

        <div className={styles.widget2Div}>
          <div className={styles.hELPMENUB1}>HELP</div>
          <div className={styles.aboutFeaturesWorks}>
            <p className={styles.customerSupport}>Customer Support</p>
            <p className={styles.serviceDetails}>Service Details</p>
            <p className={styles.privacyPolicy}>Privacy Policy</p>
          </div>
        </div>
      </div>

      <div className={styles.contentDiv}>
        <div className={styles.pricingPlans}>
          © 2023 <span style={{ color: "#1570EF" }}>Mailsbe</span>. All rights
          reserved.
        </div>
      </div>
    </div>
  );
}

export default Footer;
