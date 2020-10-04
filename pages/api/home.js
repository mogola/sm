import { connectToDatabase } from "../../utils/mongodb";

export async function getPost() {
    const { db } = await connectToDatabase();

    const posts = await db
      .collection("newhomepages")
      .find({})
      .sort({ "_id": -1 })
      .limit(20)
      .toArray();

    return posts
}


export async function getOnePost(id) {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection("newhomepages")
    .findOne({_id:id})

  return posts
}