import { connectToDatabase } from "../../utils/mongodb";
import ProjectsSchema from '../../models/Projects'
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


export async function getPostConfig() {
  const { db } = await connectToDatabase();

  const posts = await db
  .collection("homeconfigs")
  .find({})
  .sort({ "_id":1 })
  .limit(20)
  .toArray();

  return posts
}


export async function getAllUserList() {
  const { db } = await connectToDatabase();

  const user = await db
  .collection("accounts")
  .find({})
  .sort({ "_id":-1 })
  .limit(40)
  .toArray();

  return user
}

export async function getAllPosts(number) {
  if(number === "" || number === undefined){
    number = 40
  }
  const { db } = await connectToDatabase();

  const posts = await db
  .collection("projects")
  .find({})
  .sort({ "_id":-1 })
  .limit(number)
  .toArray();

  return posts
}

export async function getAllCategories(number) {
  if(number === "" || number === undefined){
    number = 40
  }
  const { db } = await connectToDatabase();

  const categories = await db
  .collection("categories")
  .find({})
  .sort({ "_id":-1 })
  .limit(number)
  .toArray();

  return categories
}

export async function getSinglePost(id) {
  const { db } = await connectToDatabase();

  const posts = await ProjectsSchema.findOne({_id: id})

  return posts
}
