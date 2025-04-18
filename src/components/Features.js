import React from "react";

function Features({ styles }) {
  return (
    <div className={styles.featureDiv}>
      <div className={styles.contentDiv1}>
        <b className={styles.useEmailLikeAGeek}>Use email like a geek</b>
        <div className={styles.exploreTheUnexploredPotenti}>
          Explore the unexplored potentials.
        </div>
      </div>
      <div className={styles.listDiv}>
        <div className={styles.div}>
          <div className={styles.sendB}>Send</div>
          <div className={styles.sendEmailDirectlyFromTheD}>
            Send email directly from the dashboard, or just copy the tracking
            code
          </div>
          <img className={styles.sendIcon} alt="" src="/send@2x.png" />
        </div>
        <div className={styles.div1}>
          <div className={styles.statusB}>Status</div>
          <div className={styles.knowIfTheUserReadTheEmai}>
            Know if the user read the email and at what time
          </div>
          <img className={styles.vectorIcon} alt="" src="/vector.svg" />
        </div>
        <div className={styles.div2}>
          <div className={styles.statusB}>Exact Time</div>
          <div className={styles.findOutExactlyWhenTheRece}>
            Find out exactly when the receiver opened your email
          </div>
          <img className={styles.vectorIcon1} alt="" src="/vector1.svg" />
        </div>
      </div>
    </div>
  );
}

export default Features;
