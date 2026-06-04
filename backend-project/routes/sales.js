const express = require('express');
const router = express.Router();
const db = require('../db');

const authGuard = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

// GET all sales
router.get('/', authGuard, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, p.ProductName, p.Category 
      FROM sales s 
      JOIN product p ON s.ProductID = p.ProductID 
      ORDER BY s.SalesDate DESC, s.CreatedAt DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET daily sales report
router.get('/report/daily', authGuard, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  try {
    const [rows] = await db.query(`
      SELECT s.SaleID, p.ProductName, p.Category, s.SoldQuantity, 
             s.SoldUnitPrice, s.SoldTotalPrice, s.SalesDate
      FROM sales s
      JOIN product p ON s.ProductID = p.ProductID
      WHERE s.SalesDate = ?
      ORDER BY s.CreatedAt DESC
    `, [date]);
    const [total] = await db.query(
      'SELECT SUM(SoldTotalPrice) as GrandTotal FROM sales WHERE SalesDate = ?', [date]
    );
    res.json({ date, sales: rows, grandTotal: total[0].GrandTotal || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create sale
router.post('/', authGuard, async (req, res) => {
  const { ProductID, SoldQuantity, SoldUnitPrice, SalesDate } = req.body;
  if (!ProductID || !SoldQuantity || !SoldUnitPrice || !SalesDate)
    return res.status(400).json({ message: 'All fields are required.' });

  const SoldTotalPrice = parseFloat(SoldQuantity) * parseFloat(SoldUnitPrice);
  try {
    // Check stock
    const [stock] = await db.query('SELECT * FROM stockstatus WHERE ProductID = ?', [ProductID]);
    if (stock.length === 0 || stock[0].RemainingQuantity < SoldQuantity)
      return res.status(400).json({ message: 'Insufficient stock.' });

    const [result] = await db.query(
      'INSERT INTO sales (ProductID, SoldQuantity, SoldUnitPrice, SoldTotalPrice, SalesDate) VALUES (?, ?, ?, ?, ?)',
      [ProductID, SoldQuantity, SoldUnitPrice, SoldTotalPrice, SalesDate]
    );
    // Update stock
    await db.query(`
      UPDATE stockstatus 
      SET SoldQuantity = SoldQuantity + ?, RemainingQuantity = RemainingQuantity - ?
      WHERE ProductID = ?
    `, [SoldQuantity, SoldQuantity, ProductID]);

    res.status(201).json({ message: 'Sale recorded', SaleID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update sale
router.put('/:id', authGuard, async (req, res) => {
  const { SoldQuantity, SoldUnitPrice, SalesDate } = req.body;
  const SoldTotalPrice = parseFloat(SoldQuantity) * parseFloat(SoldUnitPrice);
  try {
    await db.query(
      'UPDATE sales SET SoldQuantity=?, SoldUnitPrice=?, SoldTotalPrice=?, SalesDate=? WHERE SaleID=?',
      [SoldQuantity, SoldUnitPrice, SoldTotalPrice, SalesDate, req.params.id]
    );
    res.json({ message: 'Sale updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE sale
router.delete('/:id', authGuard, async (req, res) => {
  try {
    await db.query('DELETE FROM sales WHERE SaleID = ?', [req.params.id]);
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
