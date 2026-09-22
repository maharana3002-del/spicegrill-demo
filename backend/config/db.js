const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH 
  ? path.resolve(__dirname, '../../', process.env.DB_PATH)
  : path.join(__dirname, '../data/spice_grill.db');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDatabase() {
  // 1. Admins Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT DEFAULT 'Demo Concept Manager',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT DEFAULT 'utensils',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Menu Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image_url TEXT,
      badge TEXT,
      is_available INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT,
      order_type TEXT DEFAULT 'delivery',
      subtotal REAL NOT NULL,
      delivery_fee REAL DEFAULT 0,
      grand_total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Order Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      menu_item_id INTEGER,
      item_name TEXT NOT NULL,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal REAL NOT NULL
    );
  `);

  // 6. Reservations Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      guests_count TEXT NOT NULL,
      seating_type TEXT NOT NULL,
      special_requests TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Clean and reset to Demo Admin
  db.prepare('DELETE FROM admins').run();
  const defaultUser = process.env.ADMIN_USERNAME || 'demo_admin';
  const defaultPass = process.env.ADMIN_PASSWORD || 'DemoPass2026!';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(defaultPass, salt);
  
  db.prepare('INSERT INTO admins (username, password_hash, name) VALUES (?, ?, ?)').run(
    defaultUser,
    hash,
    'Demo Concept Admin'
  );
  console.log(`[Database] Demo Admin Ready -> Username: ${defaultUser} | Password: ${defaultPass}`);

  // Reset Categories with Sample Data
  db.prepare('DELETE FROM categories').run();
  const seedCategories = [
    { name: '🔥 Charcoal Grills (Demo)', slug: 'bbq', icon: 'flame', sort_order: 1 },
    { name: '🍲 Signature Specialties', slug: 'karahi', icon: 'soup', sort_order: 2 },
    { name: '🍔 Burgers & Pizzas', slug: 'fastfood', icon: 'pizza', sort_order: 3 },
    { name: '👨‍👩‍👧‍👦 Sample Feast Deals', slug: 'deals', icon: 'sparkles', sort_order: 4 },
    { name: '🥤 Chilled Beverages', slug: 'drinks', icon: 'cup-soda', sort_order: 5 }
  ];

  const insertCat = db.prepare('INSERT INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)');
  seedCategories.forEach(cat => insertCat.run(cat.name, cat.slug, cat.icon, cat.sort_order));

  // Reset Menu Items with Sample Demo Data & Royalty-Free Photos
  db.prepare('DELETE FROM menu_items').run();
  const getCatId = (slug) => db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)?.id;

  const bbqId = getCatId('bbq');
  const karahiId = getCatId('karahi');
  const fastFoodId = getCatId('fastfood');
  const dealsId = getCatId('deals');
  const drinksId = getCatId('drinks');

  const seedItems = [
    {
      category_id: karahiId,
      name: 'Artisan Cream Karahi (Sample)',
      price: 18.99,
      description: 'Velvet cream gravy prepared with fresh aromatic spices, crushed pepper, and pure culinary butter.',
      image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      badge: 'Chef Concept',
      is_featured: 1
    },
    {
      category_id: karahiId,
      name: 'Peshawari Herb Stew (Sample)',
      price: 17.50,
      description: 'Traditional slow-simmered culinary specialty with vine tomatoes, fresh ginger, and coriander.',
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      is_featured: 1
    },
    {
      category_id: bbqId,
      name: 'Smoked Herb Skewers (4 Pcs)',
      price: 14.50,
      description: 'Hand-minced tender chicken seasoned with coriander, cumin, and slow-smoked over glowing charcoal coals.',
      image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      badge: 'Charcoal Grilled',
      is_featured: 1
    },
    {
      category_id: bbqId,
      name: 'Tender Glazed Bites (10 Pcs)',
      price: 16.00,
      description: 'Melt-in-mouth boneless chicken marinated in mild cheese glaze, aromatic herbs, and gentle smoke.',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      badge: 'Tender',
      is_featured: 1
    },
    {
      category_id: dealsId,
      name: 'Spice Grill Concept Feast',
      price: 39.99,
      description: '1 Large Artisan Pizza + 2 Crisp Chicken Burgers + 2 Herb Wraps + Loaded Fries + Beverage.',
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      badge: 'Sample Deal',
      is_featured: 1
    },
    {
      category_id: fastFoodId,
      name: 'Crunch Fillet Burger',
      price: 8.99,
      description: 'Golden crunchy double-breaded chicken fillet with crisp iceberg lettuce and house specialty aioli sauce.',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Crispy',
      is_featured: 1
    },
    {
      category_id: fastFoodId,
      name: 'Signature Crust Pizza (Large)',
      price: 19.50,
      description: 'Topped with wood-smoked chicken chunks, mushrooms, sliced olives, melted mozzarella, and seasoned crust.',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
      badge: 'Family Size',
      is_featured: 1
    },
    {
      category_id: drinksId,
      name: 'Fresh Mint Cooler',
      price: 4.50,
      description: 'Chilled refreshing mint lemon cooler blended with crushed ice and citrus zest.',
      image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      badge: 'Chilled',
      is_featured: 0
    }
  ];

  const insertItem = db.prepare(`
    INSERT INTO menu_items (category_id, name, price, description, image_url, badge, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  seedItems.forEach(item => {
    insertItem.run(
      item.category_id,
      item.name,
      item.price,
      item.description,
      item.image_url,
      item.badge,
      item.is_featured
    );
  });

  // Reset Orders & Order Items with Sample Demo Records
  db.prepare('DELETE FROM order_items').run();
  db.prepare('DELETE FROM orders').run();

  const insertOrder = db.prepare(`
    INSERT INTO orders (order_number, customer_name, customer_phone, delivery_address, order_type, subtotal, delivery_fee, grand_total, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const sampleOrder1 = insertOrder.run(
    'SG-DEMO-101',
    'Sample Customer (Jane)',
    '+1 (555) 019-2834',
    '123 Demo Avenue, Apt 4B, USA',
    'delivery',
    33.49,
    2.50,
    35.99,
    'completed',
    'Simulated test order for portfolio demonstration'
  );

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertOrderItem.run(sampleOrder1.lastInsertRowid, 1, 'Artisan Cream Karahi (Sample)', 18.99, 1, 18.99);
  insertOrderItem.run(sampleOrder1.lastInsertRowid, 3, 'Smoked Herb Skewers (4 Pcs)', 14.50, 1, 14.50);

  const sampleOrder2 = insertOrder.run(
    'SG-DEMO-102',
    'Alex Smith (Demo)',
    '+1 (555) 012-9876',
    '456 Sample Blvd, Food District, USA',
    'takeaway',
    39.99,
    0.00,
    39.99,
    'preparing',
    'Simulated pickup demonstration'
  );

  insertOrderItem.run(sampleOrder2.lastInsertRowid, 5, 'Spice Grill Concept Feast', 39.99, 1, 39.99);

  // Reset Reservations with Sample Demo Records (Removed any old real names)
  db.prepare('DELETE FROM reservations').run();
  const insertRes = db.prepare(`
    INSERT INTO reservations (customer_name, customer_phone, reservation_date, reservation_time, guests_count, seating_type, special_requests, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRes.run(
    'Emma Watson (Sample Guest)',
    '+1 (555) 014-5678',
    '2026-10-15',
    '19:00',
    '5-8 Persons',
    'Private Dining Booth',
    'Simulated reservation for concept demonstration',
    'confirmed'
  );

  console.log('[Database] Reset and seeded with 100% fictional demo data and demo admin successfully.');
}

initDatabase();

module.exports = db;
