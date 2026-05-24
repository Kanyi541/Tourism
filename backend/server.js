const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to SQLite DB
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Tables
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS destinations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          country TEXT,
          region TEXT,
          image TEXT,
          budget TEXT,
          type TEXT,
          description TEXT
        )
      `);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS tours (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          duration INTEGER,
          price REAL,
          rating REAL,
          image TEXT,
          destinationId INTEGER
        )
      `);

      // Create table for multiple images per destination
      db.run(`
        CREATE TABLE IF NOT EXISTS destination_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          destination_id INTEGER,
          image_url TEXT,
          display_order INTEGER DEFAULT 0,
          FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
        )
      `);
    }
    // Create bookings table if not exists
    const bookingsTableExists = await new Promise((resolve) => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='bookings'", [], (err, row) => {
        resolve(!!row);
      });
    });
    if (!bookingsTableExists) {
      db.run(`
        CREATE TABLE bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_id TEXT,
          item_type TEXT,
          item_title TEXT,
          item_image TEXT,
          full_name TEXT,
          email TEXT,
          phone TEXT,
          num_travelers INTEGER,
          travel_date TEXT,
          special_requests TEXT,
          total_price REAL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
  }
});

// Helper function to get images for a destination
const getDestinationImages = (destinationId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT image_url FROM destination_images WHERE destination_id = ? ORDER BY display_order ASC',
      [destinationId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => row.image_url));
      }
    );
  });
};

// GET endpoints
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM destinations', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    // Get images for each destination
    const destinationsWithImages = await Promise.all(
      destinations.map(async (dest) => {
        const images = await getDestinationImages(dest.id);
        return { ...dest, images: images.length > 0 ? images : [dest.image] };
      })
    );
    
    res.json(destinationsWithImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tours', (req, res) => {
    db.all('SELECT * FROM tours', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

// Get single destination with images
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM destinations WHERE id = ?', [req.params.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const images = await getDestinationImages(destination.id);
    res.json({ ...destination, images: images.length > 0 ? images : [destination.image] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoints (For Dashboard admin)
app.post('/api/destinations', (req, res) => {
  const { name, country, region, image, images, budget, type, description } = req.body;
  const sql = `INSERT INTO destinations (name, country, region, image, budget, type, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, country, region, image, budget, type, description];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    
    const destinationId = this.lastID;
    
    // Insert additional images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const imageInsert = db.prepare('INSERT INTO destination_images (destination_id, image_url, display_order) VALUES (?, ?, ?)');
      images.forEach((imgUrl, index) => {
        imageInsert.run(destinationId, imgUrl, index);
      });
      imageInsert.finalize();
    }
    
    res.status(201).json({ id: destinationId, ...req.body });
  });
});

app.post('/api/tours', (req, res) => {
    const { title, duration, price, rating, image, destinationId } = req.body;
    const sql = `INSERT INTO tours (title, duration, price, rating, image, destinationId) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [title, duration, price, rating || 5.0, image, destinationId || 0];
    
    db.run(sql, params, function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    });
});

// Add images to existing destination
app.post('/api/destinations/:id/images', (req, res) => {
  const { images } = req.body; // array of image URLs
  const destinationId = req.params.id;
  
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'images array required' });
  }
  
  const imageInsert = db.prepare('INSERT INTO destination_images (destination_id, image_url, display_order) VALUES (?, ?, ?)');
  
  images.forEach((imgUrl, index) => {
    imageInsert.run(destinationId, imgUrl, index);
  });
  
  imageInsert.finalize((err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ message: 'Images added successfully' });
  });
});

// DELETE destination
app.delete('/api/destinations/:id', (req, res) => {
  const destinationId = req.params.id;
  
  // Use transaction to ensure atomicity
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Delete images first
    db.run('DELETE FROM destination_images WHERE destination_id = ?', [destinationId], (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to delete images: ' + err.message });
      }
      
      // Set tours' destinationId to NULL (or delete them)
      db.run('UPDATE tours SET destinationId = NULL WHERE destinationId = ?', [destinationId], (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to update tours: ' + err.message });
        }
        
        // Delete destination
        db.run('DELETE FROM destinations WHERE id = ?', [destinationId], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to delete destination: ' + err.message });
          }
          
          if (this.changes === 0) {
            db.run('ROLLBACK');
            return res.status(404).json({ error: 'Destination not found' });
          }
          
          db.run('COMMIT');
          res.json({ message: 'Destination deleted successfully' });
        });
      });
    });
  });
});

// UPDATE destination
app.put('/api/destinations/:id', (req, res) => {
  const destinationId = req.params.id;
  const { name, country, region, image, budget, type, description, images } = req.body;
  
  const sql = `UPDATE destinations SET name = ?, country = ?, region = ?, image = ?, budget = ?, type = ?, description = ? WHERE id = ?`;
  const params = [name, country, region, image, budget, type, description, destinationId];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Destination not found' });
    
    // Update additional images if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      db.run('DELETE FROM destination_images WHERE destination_id = ?', [destinationId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Insert new images
        if (images.length > 0) {
          const imageInsert = db.prepare('INSERT INTO destination_images (destination_id, image_url, display_order) VALUES (?, ?, ?)');
          images.forEach((imgUrl, index) => {
            imageInsert.run(destinationId, imgUrl, index);
          });
          imageInsert.finalize();
        }
      });
    }
    
    res.json({ message: 'Destination updated successfully' });
  });
});

// DELETE tour
app.delete('/api/tours/:id', (req, res) => {
  const tourId = req.params.id;
  
  db.run('DELETE FROM tours WHERE id = ?', [tourId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Tour not found' });
    res.json({ message: 'Tour deleted successfully' });
  });
});

// UPDATE tour
app.put('/api/tours/:id', (req, res) => {
  const tourId = req.params.id;
  const { title, duration, price, rating, image, destinationId } = req.body;
  
  const sql = `UPDATE tours SET title = ?, duration = ?, price = ?, rating = ?, image = ?, destinationId = ? WHERE id = ?`;
  const params = [title, duration, price, rating || 5.0, image, destinationId || 0, tourId];
  
  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Tour not found' });
    res.json({ message: 'Tour updated successfully' });
  });
});

// Debug endpoint - list all tables and data
app.get('/api/debug', async (req, res) => {
  try {
    const destinations = await new Promise((resolve, reject) => {
      db.all('SELECT id, name, country, region FROM destinations ORDER BY id', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    const tours = await new Promise((resolve, reject) => {
      db.all('SELECT id, title, destinationId FROM tours ORDER BY id', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json({ destinations, tours, message: `Found ${destinations.length} destinations, ${tours.length} tours` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings API Endpoints

// Get all bookings
app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new booking
app.post('/api/bookings', (req, res) => {
  const { item_id, item_type, item_title, item_image, full_name, email, phone, num_travelers, travel_date, special_requests, total_price } = req.body;
  
  db.run(
    `INSERT INTO bookings (item_id, item_type, item_title, item_image, full_name, email, phone, num_travelers, travel_date, special_requests, total_price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [item_id, item_type, item_title, item_image, full_name, email, phone, num_travelers, travel_date, special_requests, total_price],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Booking created successfully' });
    }
  );
});

// Update booking status
app.put('/api/bookings/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  db.run(
    'UPDATE bookings SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Booking updated successfully' });
    }
  );
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM bookings WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Booking deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
