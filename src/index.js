import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from 'dotenv';
import { Blog } from "./models/Blog.mjs";

// Initialize Environment Variables
dotenv.config()

// Initialize Express App (Base)
const app = express();

/* Middleware */
// Use Body Parsing Middle (Requests with JSON-body)
app.use(express.json());

// Use Logging Middleware (All Requests)
app.use(morgan("dev"));

const PORT = process.env.PORT || 4051;
const MONGODB_USERNAME = process.env.MONGODB_USERNAME || "";
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || "";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "";

// MongoDB PRODUCTION
const url =
  `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@blogzombiecluster0.ka5gu.mongodb.net/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

console.log(url)

// Understanding why we don't close connections
// https://stackoverflow.com/questions/52917081/should-i-close-my-mongoose-node-js-connection-after-saving-into-database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Base route
app.get("/", (req, res) => {
  res.send("BlogZombie's Blog Microservice - Hello");
});

// GET - Blogs by All
app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.send(`Here are all the blogs: ${JSON.stringify(blogs)}`);
});

// GET - Blog by blogId
app.get(
  "/blogs/:blogId",

  async (req, res, next) => {
    if (mongoose.isValidObjectId(req.params.blogId)) {
      next();
    } else {
      return res
        .status(400)
        .send(
          "BlogId must be a single String of 12 bytes or a string of 24 hex characters"
        );
    }
  },
  async (req, res, next) => {
    await Blog.findById(req.params.blogId)
      .exec()
      .then((blogs) => {
        return res.send(
          `Here is a blog with id: ${req.params.blogId}\n${JSON.stringify(
            blogs
          )}`
        );
      })
      .catch((error) => next(error));
  }
);

// GET - Blogs by publicationId
app.get("/blogs/publications/:publicationId", async (req, res) => {
  var blogs = await Blog.find({ _id_publication: req.params.publicationId });
  res.send(
    `Here are blogs for the publication with id: ${
      req.params.publicationId
    }\n${JSON.stringify(blogs)}`
  );
});

// GET - Blogs by authorId
app.get("/blogs/authors/:authorId", async (req, res) => {
  const blogs = await Blog.find({ _id_author: req.params.authorId }).exec();
  res.send(
    `Here are blogs belonging to the author with id: ${
      req.params.authorId
    }\n${JSON.stringify(blogs)}`
  );
});

// POST - Blog Created
app.post("/blogs", (req, res) => {
  new Blog(req.body).save((error, document) => {
    if (error) {
      console.error(error);
    }
    res.send(`Blog post created successfully: ${document}`);
  });
});

// DELETE - Blog Deleted by blogId
app.delete("/blogs/:blogId", async (req, res) => {
  const result = await Blog.deleteOne({ _id: req.params.blogId }).exec();
  res.send(`Blog post deleted successfully.`);
});

// PUT - Blog Updated by blogId
app.put("/blogs/:blogId", async (req, res) => {
  const result = await Blog.updateOne({ _id: req.params.blogId }, req.body);
  res.send(`Blog post updated successfully. ${JSON.stringify(result)}`);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
