-- ─────────────────────────────────────────────────────────────────
-- Extro — Restaurant seed: Sam's Cafe, Leo's Cafe, Hyera Supermarket
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ─────────────────────────────────────────────────────────────────

-- 1. Add columns that the customer app expects but the base schema lacks
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS photo_url    text,
  ADD COLUMN IF NOT EXISTS rating       numeric(3,2),
  ADD COLUMN IF NOT EXISTS delivery_time text;

ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS extras    jsonb DEFAULT '[]'::jsonb;

-- 2. Insert restaurants and capture their IDs via CTEs
WITH sams AS (
  INSERT INTO public.restaurants
    (name, category, address, lat, lng, photo_url, rating, delivery_time, is_open)
  VALUES (
    'Sam''s Cafe', 'Burgers',
    'Shop 42, Mall @ Reds, Wierdapark, Centurion',
    -25.8742, 28.1889,
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=240&fit=crop',
    4.6, '35–50 min', true
  )
  RETURNING id
),
leos AS (
  INSERT INTO public.restaurants
    (name, category, address, lat, lng, photo_url, rating, delivery_time, is_open)
  VALUES (
    'Leo''s Cafe', 'Pizza',
    'Shop 114, Centurion Mall, Centurion Drive, Centurion',
    -25.8651, 28.1899,
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=240&fit=crop',
    4.4, '40–55 min', true
  )
  RETURNING id
),
hyera AS (
  INSERT INTO public.restaurants
    (name, category, address, lat, lng, photo_url, rating, delivery_time, is_open)
  VALUES (
    'Hyera Supermarket', 'Groceries',
    'Castlegate Shopping Centre, John Vorster Drive, Centurion',
    -25.8557, 28.1618,
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=240&fit=crop',
    4.5, '45–60 min', true
  )
  RETURNING id
),

-- 3. Insert Sam's Cafe menu items
sams_menu AS (
  INSERT INTO public.menu_items
    (restaurant_id, name, description, price, photo_url, available, extras)
  SELECT
    sams.id, m.name, m.description, m.price, m.photo_url, true, m.extras::jsonb
  FROM sams, (VALUES
    ('Big Sam Burger',
     'Two beef patties, special sauce, lettuce, cheese, pickles and onion on a sesame bun',
     64.90,
     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=320&h=200&fit=crop',
     '[{"name":"Extra patty","price":20},{"name":"Extra cheese","price":10},{"name":"Bacon","price":18}]'),
    ('Sam''s McChicken',
     'Crispy fried chicken fillet, mayonnaise and shredded lettuce on a toasted bun',
     54.90,
     'https://images.unsplash.com/photo-1562802378-063ec186a863?w=320&h=200&fit=crop',
     '[{"name":"Extra mayo","price":5},{"name":"Add cheese","price":10},{"name":"Jalapeños","price":8}]'),
    ('Quarter Pounder',
     'A quarter-pound beef patty with onions, pickles, mustard, ketchup and cheese',
     74.90,
     'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=320&h=200&fit=crop',
     '[{"name":"Double patty","price":30},{"name":"Extra cheese","price":10},{"name":"Bacon","price":18}]'),
    ('Chicken McNuggets (10pc)',
     'Crispy golden chicken nuggets. Choose your dipping sauce: BBQ, Sweet & Sour or Tomato',
     64.90,
     'https://images.unsplash.com/photo-1598679253544-2c97992403ea?w=320&h=200&fit=crop',
     '[{"name":"Extra dipping sauce","price":6}]'),
    ('Large Fries',
     'Golden crispy fries, lightly salted. A Sam''s Cafe classic',
     34.90,
     'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=320&h=200&fit=crop',
     '[{"name":"Cheese sauce","price":12},{"name":"Peri-peri spice","price":4}]'),
    ('Strawberry Milkshake',
     'Thick and creamy milkshake made with real strawberry flavouring. Also in chocolate and vanilla',
     44.90,
     'https://images.unsplash.com/photo-1572490122747-3a3c4f9d9cda?w=320&h=200&fit=crop',
     '[]'),
    ('Soft Serve Cone',
     'Classic creamy vanilla soft serve in a crispy waffle cone',
     18.90,
     'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=320&h=200&fit=crop',
     '[]'),
    ('Apple Pie',
     'Warm baked pastry filled with cinnamon-spiced apple. A Sam''s favourite since day one',
     22.90,
     'https://images.unsplash.com/photo-1568624650859-7c1a7d2dfe2f?w=320&h=200&fit=crop',
     '[]')
  ) AS m(name, description, price, photo_url, extras)
  RETURNING id
),

-- 4. Insert Leo's Cafe menu items
leos_menu AS (
  INSERT INTO public.menu_items
    (restaurant_id, name, description, price, photo_url, available, extras)
  SELECT
    leos.id, m.name, m.description, m.price, m.photo_url, true, m.extras::jsonb
  FROM leos, (VALUES
    ('Margherita (Medium)',
     'Classic tomato base, buffalo mozzarella and fresh basil on a thin, hand-stretched crust',
     109.90,
     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=320&h=200&fit=crop',
     '[{"name":"Extra mozzarella","price":20},{"name":"Add pepperoni","price":25},{"name":"Add mushrooms","price":15},{"name":"Chilli oil drizzle","price":8}]'),
    ('Pepperoni Feast (Medium)',
     'Loaded with double pepperoni, mozzarella and a rich tomato base. A Leo''s bestseller',
     129.90,
     'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=320&h=200&fit=crop',
     '[{"name":"Extra pepperoni","price":25},{"name":"Extra cheese","price":20},{"name":"BBQ drizzle","price":10}]'),
    ('BBQ Chicken (Medium)',
     'Succulent chicken strips, red onion, mixed peppers, BBQ sauce and mozzarella',
     139.90,
     'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=320&h=200&fit=crop',
     '[{"name":"Extra chicken","price":30},{"name":"Add pineapple","price":10},{"name":"Extra BBQ sauce","price":8}]'),
    ('Spaghetti Bolognese',
     'Al dente spaghetti in a slow-cooked beef and pork mince ragù, finished with parmesan',
     119.90,
     'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=320&h=200&fit=crop',
     '[{"name":"Extra parmesan","price":12}]'),
    ('Penne Arrabiata',
     'Penne pasta in a spicy tomato, garlic and chilli sauce, topped with fresh herbs',
     109.90,
     'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=320&h=200&fit=crop',
     '[{"name":"Add chicken","price":35},{"name":"Add prawns","price":55},{"name":"Extra parmesan","price":12}]'),
    ('Beef Lasagna',
     'Layers of pasta sheets, rich beef ragù, béchamel and melted mozzarella, oven baked',
     139.90,
     'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=320&h=200&fit=crop',
     '[]'),
    ('Garlic Bread (4 slices)',
     'Toasted ciabatta slathered with herb butter and roasted garlic. Perfect to share',
     39.90,
     'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=320&h=200&fit=crop',
     '[{"name":"Add mozzarella","price":20}]')
  ) AS m(name, description, price, photo_url, extras)
  RETURNING id
)

-- 5. Insert Hyera Supermarket menu items
INSERT INTO public.menu_items
  (restaurant_id, name, description, price, photo_url, available, extras)
SELECT
  hyera.id, m.name, m.description, m.price, m.photo_url, true, '[]'::jsonb
FROM hyera, (VALUES
  ('Full Cream Milk 2L',
   'Clover Fresh full cream pasteurised milk. Rich and creamy. Best before on pack',
   29.99,
   'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=320&h=200&fit=crop'),
  ('Albany Superior White Bread 700g',
   'Soft, sliced white bread. Great for sandwiches, toast and more. No preservatives',
   20.99,
   'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=320&h=200&fit=crop'),
  ('Free Range Eggs 6pk',
   'Farm-fresh, free range eggs. Grade A large. Rich golden yolks. Proudly South African',
   32.99,
   'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=320&h=200&fit=crop'),
  ('Chicken Portions 1kg',
   'Fresh IQF chicken mixed portions. No added hormones. Reared on South African farms',
   84.99,
   'https://images.unsplash.com/photo-1604503468506-a8da13d11560?w=320&h=200&fit=crop'),
  ('Pink Lady Apples 1kg',
   'Crisp, sweet and tangy Pink Lady apples. Sourced from the Western Cape',
   34.99,
   'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=320&h=200&fit=crop'),
  ('Clover Gouda Cheese 400g',
   'Mild and creamy Gouda-style sliced cheese. Perfect for sandwiches, melting and snacking',
   64.99,
   'https://images.unsplash.com/photo-1486297678162-eb2a19b0a2d0?w=320&h=200&fit=crop'),
  ('Tastic Parboiled Rice 2kg',
   'South Africa''s favourite rice. Light, fluffy and never sticky. Every grain separate',
   44.99,
   'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=320&h=200&fit=crop'),
  ('Sunfoil Sunflower Oil 750ml',
   'Pure sunflower oil with light, clean taste. Suitable for frying, baking and dressing',
   44.99,
   'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=320&h=200&fit=crop'),
  ('Dannon Orange Juice 1.5L',
   '100% pure squeezed orange juice. No added sugar, no concentrate. Chilled and fresh',
   34.99,
   'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=320&h=200&fit=crop'),
  ('Simba Chips 100g',
   'South Africa''s iconic crisps. Available in Original, BBQ, Salt & Vinegar and Cheese & Onion',
   19.99,
   'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=320&h=200&fit=crop'),
  ('Ricoffy Coffee 250g',
   'South Africa''s number one coffee. Rich and smooth blend of coffee and chicory',
   54.99,
   'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=320&h=200&fit=crop')
) AS m(name, description, price, photo_url);
