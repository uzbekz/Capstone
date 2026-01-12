import express from 'express';
import multer from 'multer';
import Product from './models/Product.js';
import sequelize from './db.js';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// DB connection check
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('DB error:', err));

// View all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product WITH image
app.post('/products/add', upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price, quantity, weight } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      category,
      price,
      quantity,
      weight,
      image: req.file ? req.file.buffer : null   // Store image as BLOB
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update product (with optional new image)
app.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, quantity, weight } = req.body;

    const updateData = {
      name,
      description,
      category,
      price,
      quantity,
      weight
    };

    if (req.file) {
      updateData.image = req.file.buffer;
    }

    const [updatedRows] = await Product.update(updateData, {
      where: { id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
