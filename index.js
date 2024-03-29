import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());
const URL = process.env.URL;
const PORT = process.env.PORT;

const createConnection = async () => {
  const client = new MongoClient(URL);
  await client.connect();
  console.log("MongoDB connected successfully...!");
  return client;
};
const client = await createConnection();

app.get("/", async (req, res) => {
  const data = await client
    .db("Todo")
    .collection("todo-list")
    .find({})
    .toArray();
  res.send(data);
});

app.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client
      .db("CRUD")
      .collection("data")
      .updateOne(
        { _id: new ObjectId(id) },

        {
          $set: {
            title: req.body.title,
          },
        }
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

app.post("/", async (req, res) => {
  try {
    await client.db("Todo").collection("todo-list").insertOne({
      title: req.body.title,
      id: req.body.id,
    });
    res.status(200).send("Added successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});
app.delete("/user/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const del = await client
      .db("CRUD")
      .collection("data")
      .deleteOne({ _id: new ObjectId(id) });
    res.send(del);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () =>
  console.log(`server established successfully On the PORT:${PORT}`)
);
