const express = require('express');
const router = express.Router();
const db = require('../db');

const authGuard = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

// GET all products
router.get('/', authGuard, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product ORDER BY CreatedAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', authGuard, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product WHERE ProductID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product
router.post('/', authGuard, async (req, res) => {
  const { ProductName, Category, Quantity, UnitPrice } = req.body;
  if (!ProductName || !Category || !Quantity || !UnitPrice)
    return res.status(400).json({ message: 'All fields are required.' });

  const TotalPrice = parseFloat(Quantity) * parseFloat(UnitPrice);
  try {
    const [result] = await db.query(
      'INSERT INTO product (ProductName, Category, Quantity, UnitPrice, TotalPrice) VALUES (?, ?, ?, ?, ?)',
      [ProductName, Category, Quantity, UnitPrice, TotalPrice]
    );
    // Auto-create stock status entry
    await db.query(
      'INSERT INTO stockstatus (ProductID, AvailableQuantity, SoldQuantity, RemainingQuantity) VALUES (?, ?, 0, ?)',
      [result.insertId, Quantity, Quantity]
    );
    res.status(201).json({ message: 'Product created', ProductID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update product
router.put('/:id', authGuard, async (req, res) => {
  const { ProductName, Category, Quantity, UnitPrice } = req.body;
  const TotalPrice = parseFloat(Quantity) * parseFloat(UnitPrice);
  try {
    await db.query(
      'UPDATE product SET ProductName=?, Category=?, Quantity=?, UnitPrice=?, TotalPrice=? WHERE ProductID=?',
      [ProductName, Category, Quantity, UnitPrice, TotalPrice, req.params.id]
    );
    await db.query(
      'UPDATE stockstatus SET AvailableQuantity=?, RemainingQuantity=AvailableQuantity-SoldQuantity WHERE ProductID=?',
      [Quantity, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', authGuard, async (req, res) => {
  try {
    await db.query('DELETE FROM product WHERE ProductID = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
