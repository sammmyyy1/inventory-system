const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET: Inventory Dashboard (list all products)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('inventory', { products });
    } catch (err) {
        console.log(err);
        res.send('Error loading inventory');
    }
});

// GET: Add Product Form
router.get('/add', (req, res) => {
    res.render('add_product');
});

// POST: Add New Product
router.post('/add', async (req, res) => {
    const { name, sku, quantity, price, supplier } = req.body;

    try {
        const product = new Product({ name, sku, quantity, price, supplier });
        await product.save();
        res.redirect('/inventory');
    } catch (err) {
        console.log(err);
        res.send('Error adding product');
    }
});

// GET: Edit Product Form
router.get('/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('edit_product', { product });
});

// POST: Update Product
router.post('/edit/:id', async (req, res) => {
    const { name, sku, quantity, price, supplier } = req.body;

    try {
        await Product.findByIdAndUpdate(req.params.id, {
            name, sku, quantity, price, supplier
        });
        res.redirect('/inventory');
    } catch (err) {
        console.log(err);
        res.send('Error updating product');
    }
});

// GET: Delete Product
router.get('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/inventory');
    } catch (err) {
        console.log(err);
        res.send('Error deleting product');
    }
});

module.exports = router;
