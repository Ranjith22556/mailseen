import { NhostClient } from "@nhost/nhost-js";

const backendUrl = process.env.NHOST_BACKEND_URL;

const nhost = new NhostClient({
  backendUrl: backendUrl,
});

export default async (req, res) => {
  // get the data from the request
  const imgText = req.query.text;
  console.log("imgText", imgText);

  if (!imgText) {
    return res.status(500).json({ error: "No image token provided" });
  }

  // make a get query to get email id using imgText
  const GET_ID = `
  query getId($id: String) {
    Tracker(where: {img_id: {_eq: $id}}) {
      id
    }
  }`;

  // update query with the email id
  const UPDATE_QUERY = `
    mutation updateSeenDate($id: Int, $date: timestamptz) {
      update_Tracker(where: {id: {_eq: $id}}, _set: {seen_at: $date}) {
        affected_rows
      }
    }`;

  try {
    const { data, error } = await nhost.graphql.request(GET_ID, {
      id: imgText,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(500).json({ error: "No row found" });
    }

    // extract the row id from the response
    const id = data.Tracker[0].id;

    //update the column in tracker table
    const { data: updatedData, error: updateError } =
      await nhost.graphql.request(UPDATE_QUERY, {
        id: id,
        date: new Date(),
      });

    if (updateError) {
      return res.status(500).json({ error: error.message });
    }

    res.status(404).send({ error: "Bye bye" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
