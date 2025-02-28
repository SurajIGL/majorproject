const Item = require('../models/Item');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { title, description, price, available } = req.body;
    let location = null;
    
    // Parse location if provided
    if (req.body.latitude && req.body.longitude) {
      location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
    }
    
    // Create new item with owner set to current user
    const newItem = new Item({
      title,
      description,
      price,
      available,
      location,
      owner: req.user._id,
      photos: req.body.photos || [] // Assumes photos are already uploaded and URLs are passed
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'username email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'username email');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Check if the current user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this item' });
    }
    
    // Update location if provided
    if (req.body.latitude && req.body.longitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
    }
    
    // Set updated timestamp
    req.body.updatedAt = Date.now();
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Check if the current user owns the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this item' });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // radius in meters, default 10km
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    // Validate parameters
    if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid parameters. Latitude, longitude and radius must be numbers' 
      });
    }

    const items = await Item.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // Note: GeoJSON uses [longitude, latitude]
          },
          $maxDistance: searchRadius
        }
      }
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
