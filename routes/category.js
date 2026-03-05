// create a new router
const app = require("express").Router();

// import the models
const { Category } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    // Accept either `category_name` or `categoryName` from client
    const category_name = req.body.category_name || req.body.categoryName;
    if (!category_name) {
      return res.status(400).json({ message: "Missing category_name" });
    }
    const category = await Category.create({ category_name });
    res.status(201).json(category);
  } catch (error) {
    console.error('POST /api/categories error:', error);
    res.status(500).json({ message: "Error adding category", error: error });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    console.log("Getting all categories");
    const categories = await Category.findAll();
    console.log(categories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error adding categories", error: error });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    res.json(category);
  } catch (error) {
    console.error('GET /api/categories/:id error:', error);
    res.status(500).json({ error: "Error retrieving category" });
  }
});

// Route to update a category
app.put("/:id", async (req, res) => {
  try {
    const category_name = req.body.category_name || req.body.categoryName || req.body.name;
    if (!category_name) {
      return res.status(400).json({ error: "Missing category_name" });
    }
    const result = await Category.update(
      { category_name },
      { where: { id: req.params.id } }
    );
    res.json(result);
  } catch (error) {
    console.error('PUT /api/categories/:id error:', error);
    res.status(500).json({ error: "Error updating category" });
  }
});

// Route to delete a category
app.delete("/:id", async (req, res) => {
  try {
    const category = await Category.destroy({ where: { id: req.params.id } });
    res.json(category);
  } catch (error) {
    console.error('DELETE /api/categories/:id error:', error);
    res.status(500).json({ error: "Error deleting category" });
  }
});

// export the router
module.exports = app;
