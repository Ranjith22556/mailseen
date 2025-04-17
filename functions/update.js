import { NhostClient } from "@nhost/nhost-js";

const backendUrl = process.env.NHOST_BACKEND_URL;
const adminSecret = process.env.NHOST_ADMIN_SECRET;

const nhost = new NhostClient({
  backendUrl: backendUrl,
});

// Set admin secret for the serverless function to have permission to update any email
if (adminSecret) {
  nhost.graphql.setAccessToken(adminSecret);
}

export default async (req, res) => {
  // get the data from the request
  const imgText = req.query.text;
  console.log("imgText", imgText);

  if (!imgText) {
    return res.status(500).json({ error: "No image token provided" });
  }

  // make a get query to get email id using imgText
  const GET_EMAIL = `
  query getEmail($imgText: String!) {
    emails(where: {img_text: {_eq: $imgText}}) {
      id
      seen
    }
  }`;

  // update query with the email id
  const UPDATE_EMAIL = `
    mutation updateEmailSeen($id: Int!, $date: timestamptz!) {
      update_emails(where: {id: {_eq: $id}}, _set: {seen: true, seen_at: $date}) {
        affected_rows
      }
    }`;

  try {
    console.log("Querying for email with img_text:", imgText);
    
    const { data, error } = await nhost.graphql.request(GET_EMAIL, {
      imgText: imgText,
    });

    if (error) {
      console.error("Error fetching email:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || !data.emails || data.emails.length === 0) {
      console.error("No email found with img_text:", imgText);
      return res.status(404).json({ error: "No email found" });
    }

    console.log("Found email:", data.emails[0]);

    // extract the email id from the response
    const emailId = data.emails[0].id;
    const alreadySeen = data.emails[0].seen;

    if (alreadySeen) {
      console.log("Email already marked as seen");
      return res.status(200).json({ message: "Email already seen" });
    }

    console.log("Updating email seen status for ID:", emailId);
    
    // update the seen status in emails table
    const { data: updatedData, error: updateError } =
      await nhost.graphql.request(UPDATE_EMAIL, {
        id: emailId,
        date: new Date().toISOString(),
      });

    if (updateError) {
      console.error("Error updating email:", updateError);
      return res.status(500).json({ error: updateError.message });
    }

    console.log("Successfully updated email seen status");
    
    // Return 1x1 transparent pixel GIF
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // 1x1 transparent GIF
    const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.end(transparentGif);
    
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message || "Unknown error occurred" });
  }
};
