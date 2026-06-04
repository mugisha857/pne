const express = require('express');
const router = express.Router();
const db = require('../db');

const authGuard = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

// GET all stock status
router.get('/', authGuard, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ss.*, p.ProductName, p.Category
      FROM stockstatus ss
      JOIN product p ON ss.ProductID = p.ProductID
      ORDER BY p.ProductName ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single stock
router.get('/:id', authGuard, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT ss.*, p.ProductName FROM stockstatus ss JOIN product p ON ss.ProductID=p.ProductID WHERE ss.StockID=?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Stock record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create stock
router.post('/', authGuard, async (req, res) => {
  const { ProductID, AvailableQuantity, SoldQuantity } = req.body;
  const RemainingQuantity = parseInt(AvailableQuantity) - parseInt(SoldQuantity);
  try {
    const [result] = await db.query(
      'INSERT INTO stockstatus (ProductID, AvailableQuantity, SoldQuantity, RemainingQuantity) VALUES (?, ?, ?, ?)',
      [ProductID, AvailableQuantity, SoldQuantity, RemainingQuantity]
    );
    res.status(201).json({ message: 'Stock status created', StockID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update stock
router.put('/:id', authGuard, async (req, res) => {
  const { AvailableQuantity, SoldQuantity } = req.body;
  const RemainingQuantity = parseInt(AvailableQuantity) - parseInt(SoldQuantity);
  try {
    await db.query(
      'UPDATE stockstatus SET AvailableQuantity=?, SoldQuantity=?, RemainingQuantity=? WHERE StockID=?',
      [AvailableQuantity, SoldQuantity, RemainingQuantity, req.params.id]
    );
    res.json({ message: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE stock
router.delete('/:id', authGuard, async (req, res) => {
  try {
    await db.query('DELETE FROM stockstatus WHERE StockID = ?', [req.params.id]);
    res.json({ message: 'Stock record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
