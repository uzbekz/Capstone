import express from 'express';
import multer from 'multer';
import Product from './models/Product.js';
import sequelize from './db.js';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { authenticate, authorize } from './middleware/auth.js';
import User from './models/User.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// DB check connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('DB error:', err));

  //creats the users table if not exits and connects to the table
sequelize.sync()
  .then(() => console.log("All models synced (tables created)"))
  .catch(err => console.error("Sync error:", err))

// Public routes
app.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

// Protected routes
app.post(
  '/products/add',
  authenticate,
  authorize('product_manager'),
  upload.single('image'),
  async (req, res) => {
    const { name, description, category, price, quantity, weight } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      category,
      price,
      quantity,
      weight,
      image: req.file ? req.file.buffer : null
    });

    res.status(201).json(newProduct);
  }
);

app.put(
  '/products/:id',
  authenticate,
  authorize('product_manager'),
  upload.single('image'),
  async (req, res) => {
    const updateData = { ...req.body };

    if (req.file) updateData.image = req.file.buffer;

    await Product.update(updateData, { where: { id: req.params.id } });
    res.json({ message: "Product updated" });
  }
);

app.delete(
  '/products/:id',
  authenticate,
  authorize('product_manager'),
  async (req, res) => {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  }
);

app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
