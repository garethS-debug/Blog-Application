// create a new router
const app = require("express").Router();

// import the models
const { Post, Category } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    console.log('POST /api/posts received body:', req.body);
    const { title, content, categoryId, postedBy } = req.body;

    console.log('Parsed categoryId:', categoryId);

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      console.log('Found category for id', categoryId, ':', !!category);
      if (!category) {
        return res.status(400).json({ error: "Invalid categoryId" });
      }
    }

    const post = await Post.create({ title, content, categoryId, postedBy });

    res.status(201).json(post);
  } catch (error) {
    console.error('POST /api/posts error:', error);
    res.status(500).json({ error: "Error adding post", details: error.message });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();

    res.json(posts);
  } catch (error) {
    console.error('GET /api/posts error:', error);
    res.status(500).json({ error: "Error retrieving posts", details: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    res.json(post);
  } catch (error) {
    console.error('GET /api/posts/:id error:', error);
    res.status(500).json({ error: "Error retrieving post", details: error.message });
  }
});

// Route to update a post
app.put("/:id", async (req, res) => {
  try {
    const { title, content, postedBy } = req.body;
    const post = await Post.update(
      { title, content, postedBy },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    console.error('PUT /api/posts/:id error:', error);
    res.status(500).json({ error: "Error updating post", details: error.message });
  }
});

// Route to delete a post
app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });
    res.json(post);
  } catch (error) {
    console.error('DELETE /api/posts/:id error:', error);
    res.status(500).json({ error: "Error deleting post", details: error.message });
  }
});

// export the router
module.exports = app;
