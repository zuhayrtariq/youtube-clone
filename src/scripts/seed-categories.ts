import { db } from "@/db";
import { categoriesTable } from "@/db/schema";
// const categoriesTable = require('../db/schema')
// const db = require("../db")
const categoryNames = [
  "Cars and vehicle",
  "Travel",
  "Comedy",
  "Kids",
  "Education",
  "Gaming",
  "Music",
  "News and Politics",
  "Sports",
  "Science and technology",
  "Pets and animals",
  "People and blogs",
  "Entertainment",
  "How-to and style",
  "Film and animation",
];

const main = async () => {
  console.log("Seeding Categories....");
  try {
    const values = categoryNames.map((name) => ({
      name,
      description: "Videos related to " + name,
    }));
    await db.insert(categoriesTable).values(values);
    console.log("Categories Seeded.");
  } catch (e) {
    console.log(<ErrorSkeleton />, e);
    process.exit(1);
  }
};
main();
