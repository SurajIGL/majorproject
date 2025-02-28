const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const itemController = require('../controllers/itemController');

// Create a new item - protected route
router.post('/', isAuthenticated, itemController.createItem);

// Get all items
router.get('/', itemController.getAllItems);

// Get a specific item
router.get('/:id', itemController.getItemById);

// Update an item - protected route
router.put('/:id', isAuthenticated, itemController.updateItem);

// Delete an item - protected route
router.delete('/:id', isAuthenticated, itemController.deleteItem);

// Add new search endpoint
router.get('/search', itemController.searchItems);

module.exports = router;
