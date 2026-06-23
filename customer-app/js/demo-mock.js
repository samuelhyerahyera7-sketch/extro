// DEMO MODE — activated by adding ?demo=1 to the URL.
(function () {
  const params = new URLSearchParams(location.search);
  window.DEMO_MODE = params.get('demo') === '1';
  if (!window.DEMO_MODE) return;

  const role = 'customer';
  window.DEMO_PROFILE = {
    id: `demo-${role}`,
    role,
    full_name: 'Sam Hyera',
    first_name: 'Sam',
    last_name: 'Hyera',
    phone: '+27813756494',
    avatar_url: null,
  };

  const STORE_KEY = 'extro_demo_store_v2';
  function seed() {
    const t = new Date().toISOString();
    return {
      restaurants: [
        {
          id: 'r1', owner_id: 'demo-r1',
          name: "Sam's Cafe",
          category: 'Burgers',
          address: 'Shop 42, Mall @ Reds, Wierdapark, Centurion',
          lat: -25.8742, lng: 28.1889,
          is_open: true, rating: 4.6,
          delivery_time: '35–50 min', distance: 13.6,
          photo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=240&fit=crop',
          created_at: t,
        },
        {
          id: 'r2', owner_id: 'demo-r2',
          name: "Leo's Cafe",
          category: 'Pizza',
          address: 'Shop 114, Centurion Mall, Centurion Drive, Centurion',
          lat: -25.8651, lng: 28.1899,
          is_open: true, rating: 4.4,
          delivery_time: '40–55 min', distance: 12.7,
          photo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=240&fit=crop',
          created_at: t,
        },
        {
          id: 'r3', owner_id: 'demo-r3',
          name: 'Hyera Supermarket',
          category: 'Groceries',
          address: 'Castlegate Shopping Centre, John Vorster Drive, Centurion',
          lat: -25.8557, lng: 28.1618,
          is_open: true, rating: 4.5,
          delivery_time: '45–60 min', distance: 11.6,
          photo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=240&fit=crop',
          created_at: t,
        },
      ],
      menu_items: [
        // ── Sam's Cafe (Burgers) ────────────────────────────────────────
        {
          id: 'm1', restaurant_id: 'r1',
          name: 'Big Sam Burger',
          description: 'Two beef patties, special sauce, lettuce, cheese, pickles and onion on a sesame bun',
          price: 64.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Extra patty', price: 20 },
            { name: 'Extra cheese', price: 10 },
            { name: 'Bacon', price: 18 },
          ],
        },
        {
          id: 'm2', restaurant_id: 'r1',
          name: 'Sam\'s McChicken',
          description: 'Crispy fried chicken fillet, mayonnaise and shredded lettuce on a toasted bun',
          price: 54.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Extra mayo', price: 5 },
            { name: 'Add cheese', price: 10 },
            { name: 'Jalapeños', price: 8 },
          ],
        },
        {
          id: 'm3', restaurant_id: 'r1',
          name: 'Quarter Pounder',
          description: 'A quarter-pound beef patty with onions, pickles, mustard, ketchup and cheese',
          price: 74.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Double patty', price: 30 },
            { name: 'Extra cheese', price: 10 },
            { name: 'Bacon', price: 18 },
          ],
        },
        {
          id: 'm4', restaurant_id: 'r1',
          name: 'Chicken McNuggets (10pc)',
          description: 'Crispy golden chicken nuggets. Choose your dipping sauce: BBQ, Sweet & Sour or Tomato',
          price: 64.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1598679253544-2c97992403ea?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Extra dipping sauce', price: 6 },
          ],
        },
        {
          id: 'm5', restaurant_id: 'r1',
          name: 'Large Fries',
          description: 'Golden crispy fries, lightly salted. A Sam\'s Cafe classic',
          price: 34.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Cheese sauce', price: 12 },
            { name: 'Peri-peri spice', price: 4 },
          ],
        },
        {
          id: 'm6', restaurant_id: 'r1',
          name: 'Strawberry Milkshake',
          description: 'Thick and creamy milkshake made with real strawberry flavouring. Available in chocolate and vanilla too',
          price: 44.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1572490122747-3a3c4f9d9cda?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm7', restaurant_id: 'r1',
          name: 'Soft Serve Cone',
          description: 'Classic creamy vanilla soft serve in a crispy waffle cone',
          price: 18.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm8', restaurant_id: 'r1',
          name: 'Apple Pie',
          description: 'Warm baked pastry filled with cinnamon-spiced apple. A Sam\'s favourite since day one',
          price: 22.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1568624650859-7c1a7d2dfe2f?w=320&h=200&fit=crop',
          created_at: t,
        },

        // ── Leo's Cafe (Pizza & Pasta) ──────────────────────────────────
        {
          id: 'm9', restaurant_id: 'r2',
          name: 'Margherita (Medium)',
          description: 'Classic tomato base, buffalo mozzarella and fresh basil on a thin, hand-stretched crust',
          price: 109.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Extra mozzarella', price: 20 },
            { name: 'Add pepperoni', price: 25 },
            { name: 'Add mushrooms', price: 15 },
            { name: 'Chilli oil drizzle', price: 8 },
          ],
        },
        {
          id: 'm10', restaurant_id: 'r2',
          name: 'Pepperoni Feast (Medium)',
          description: 'Loaded with double pepperoni, mozzarella and a rich tomato base. A Leo\'s bestseller',
          price: 129.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Extra pepperoni', price: 25 },
            { name: 'Extra cheese', price: 20 },
            { name: 'BBQ drizzle', price: 10 },
          ],
        },
        {
          id: 'm11', restaurant_id: 'r2',
          name: 'BBQ Chicken (Medium)',
          description: 'Succulent chicken strips, red onion, mixed peppers, BBQ sauce and mozzarella',
          price: 139.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Extra chicken', price: 30 },
            { name: 'Add pineapple', price: 10 },
            { name: 'Extra BBQ sauce', price: 8 },
          ],
        },
        {
          id: 'm12', restaurant_id: 'r2',
          name: 'Spaghetti Bolognese',
          description: 'Al dente spaghetti in a slow-cooked beef and pork mince ragù, finished with parmesan',
          price: 119.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Extra parmesan', price: 12 },
            { name: 'Garlic bread side', price: 39.90 },
          ],
        },
        {
          id: 'm13', restaurant_id: 'r2',
          name: 'Penne Arrabiata',
          description: 'Penne pasta in a spicy tomato, garlic and chilli sauce, topped with fresh herbs',
          price: 109.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Add chicken', price: 35 },
            { name: 'Add prawns', price: 55 },
            { name: 'Extra parmesan', price: 12 },
          ],
        },
        {
          id: 'm14', restaurant_id: 'r2',
          name: 'Beef Lasagna',
          description: 'Layers of pasta sheets, rich beef ragù, béchamel and melted mozzarella, oven baked',
          price: 139.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Side salad', price: 39.90 },
            { name: 'Garlic bread side', price: 39.90 },
          ],
        },
        {
          id: 'm15', restaurant_id: 'r2',
          name: 'Garlic Bread (4 slices)',
          description: 'Toasted ciabatta slathered with herb butter and roasted garlic. Perfect to share',
          price: 39.90, available: true,
          photo_url: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=320&h=200&fit=crop',
          created_at: t,
          extras: [
            { name: 'Add mozzarella', price: 20 },
          ],
        },

        // ── Hyera Supermarket (Groceries) ───────────────────────────────
        {
          id: 'm16', restaurant_id: 'r3',
          name: 'Full Cream Milk 2L',
          description: 'Clover Fresh full cream pasteurised milk. Rich and creamy. Best before on pack',
          price: 29.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm17', restaurant_id: 'r3',
          name: 'Albany Superior White Bread 700g',
          description: 'Soft, sliced white bread. Great for sandwiches, toast and more. No preservatives',
          price: 20.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm18', restaurant_id: 'r3',
          name: 'Free Range Eggs 6pk',
          description: 'Farm-fresh, free range eggs. Grade A large. Rich golden yolks. Proudly South African',
          price: 32.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm19', restaurant_id: 'r3',
          name: 'Chicken Portions 1kg',
          description: 'Fresh IQF chicken mixed portions. No added hormones. Reared on South African farms',
          price: 84.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d11560?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm20', restaurant_id: 'r3',
          name: 'Pink Lady Apples 1kg',
          description: 'Crisp, sweet and tangy Pink Lady apples. Sourced from the Western Cape. Perfect snack',
          price: 34.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm21', restaurant_id: 'r3',
          name: 'Clover Gouda Cheese 400g',
          description: 'Mild and creamy Gouda-style sliced cheese. Perfect for sandwiches, melting and snacking',
          price: 64.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a2d0?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm22', restaurant_id: 'r3',
          name: 'Tastic Parboiled Rice 2kg',
          description: 'South Africa\'s favourite rice. Light, fluffy and never sticky. Every grain separate',
          price: 44.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm23', restaurant_id: 'r3',
          name: 'Sunfoil Sunflower Oil 750ml',
          description: 'Pure sunflower oil with light, clean taste. Suitable for frying, baking and dressing',
          price: 44.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm24', restaurant_id: 'r3',
          name: 'Dannon Orange Juice 1.5L',
          description: '100% pure squeezed orange juice. No added sugar, no concentrate. Chilled and fresh',
          price: 34.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm25', restaurant_id: 'r3',
          name: 'Simba Chips Assorted 100g',
          description: 'South Africa\'s iconic crisps. Available in Original, BBQ, Salt & Vinegar and Cheese & Onion',
          price: 19.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=320&h=200&fit=crop',
          created_at: t,
        },
        {
          id: 'm26', restaurant_id: 'r3',
          name: 'Ricoffy Coffee 250g',
          description: 'South Africa\'s number one coffee. Rich and smooth blend of coffee and chicory',
          price: 54.99, available: true,
          photo_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=320&h=200&fit=crop',
          created_at: t,
        },
      ],
      drivers: [
        { id: 'demo-driver', vehicle_type: 'car', is_online: true, current_lat: -25.75, current_lng: 28.19, updated_at: new Date().toISOString() },
      ],
      orders: [],
      addresses: [
        { id: 'addr-demo', customer_id: 'demo-customer', street_address: '11 Flora Rd, Valhalla, Centurion', lat: -25.7512, lng: 28.1884, is_default: true, type: 'home', label: 'Home', created_at: t },
      ],
      subscriptions: [],
    };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const fresh = seed();
    localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  function saveStore(store) { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
  window.DEMO_RESET = function () { localStorage.removeItem(STORE_KEY); location.reload(); };

  function matches(row, filters) {
    return filters.every(([type, col, val]) => {
      if (type === 'eq') return row[col] === val;
      if (type === 'in') return val.includes(row[col]);
      if (type === 'is') return val === null ? row[col] == null : row[col] === val;
      return true;
    });
  }

  function attachRelations(table, row, store) {
    const out = { ...row };
    if (table === 'orders') {
      out.restaurants = store.restaurants.find(r => r.id === row.restaurant_id) || null;
    }
    return out;
  }

  class MockQuery {
    constructor(table, store) {
      this.table = table; this.store = store; this.filters = [];
      this.type = 'select'; this.data = null; this.singleMode = null; this.orderBy = null;
    }
    select() { return this; }
    eq(col, val) { this.filters.push(['eq', col, val]); return this; }
    in(col, val) { this.filters.push(['in', col, val]); return this; }
    is(col, val) { this.filters.push(['is', col, val]); return this; }
    order(col, opts) { this.orderBy = { col, asc: !(opts && opts.ascending === false) }; return this; }
    single() { this.singleMode = 'single'; return this; }
    maybeSingle() { this.singleMode = 'maybe'; return this; }
    update(obj) { this.type = 'update'; this.data = obj; return this; }
    insert(obj) { this.type = 'insert'; this.data = obj; return this; }
    delete() { this.type = 'delete'; return this; }
    then(resolve) { resolve(this._exec()); }
    _exec() {
      const store = this.store;
      const rows = store[this.table] || (store[this.table] = []);
      if (this.type === 'select') {
        let result = rows.filter(r => matches(r, this.filters)).map(r => attachRelations(this.table, r, store));
        if (this.orderBy) result.sort((a, b) => { const av = a[this.orderBy.col], bv = b[this.orderBy.col]; return this.orderBy.asc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1); });
        if (this.singleMode === 'single') return { data: result[0] || null, error: result[0] ? null : { message: 'Not found' } };
        if (this.singleMode === 'maybe') return { data: result[0] || null, error: null };
        return { data: result, error: null };
      }
      if (this.type === 'insert') {
        const items = Array.isArray(this.data) ? this.data : [this.data];
        const inserted = items.map(item => {
          const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), status: 'pending', payment_status: this.table === 'orders' ? 'paid' : undefined, is_open: true, available: true, driver_id: null, ...item };
          rows.push(row); return row;
        });
        saveStore(store);
        if (this.table === 'orders') {
          const orderId = inserted[0].id;
          setTimeout(() => {
            const s = loadStore();
            const o = (s.orders || []).find(o => o.id === orderId);
            if (o) { o.status = 'picked_up'; o.driver_id = 'demo-driver'; o.updated_at = new Date().toISOString(); }
            saveStore(s);
          }, 2000);
        }
        const result = inserted.map(r => attachRelations(this.table, r, store));
        return this.singleMode ? { data: result[0], error: null } : { data: result, error: null };
      }
      if (this.type === 'update') {
        const matched = rows.filter(r => matches(r, this.filters));
        matched.forEach(r => Object.assign(r, this.data));
        saveStore(store);
        const result = matched.map(r => attachRelations(this.table, r, store));
        if (this.singleMode) return { data: result[0] || null, error: result[0] ? null : { message: 'No match' } };
        return { data: result, error: null };
      }
      if (this.type === 'delete') {
        const toRemove = rows.filter(r => matches(r, this.filters));
        store[this.table] = rows.filter(r => !toRemove.includes(r));
        saveStore(store); return { data: toRemove, error: null };
      }
    }
  }

  function makeChannel() {
    const handlers = []; const lastSeen = new Map(); let interval = null;
    return {
      on(event, opts, cb) { handlers.push({ opts, cb }); return this; },
      subscribe() {
        interval = setInterval(() => {
          const store = loadStore();
          handlers.forEach((h, idx) => {
            const m = /([a-z_]+)=eq\.(.+)/.exec(h.opts.filter || '');
            if (!m) return;
            const [, col, val] = m;
            const rows = (store[h.opts.table] || []).filter(r => String(r[col]) === val);
            rows.forEach(row => {
              const key = idx + ':' + row.id;
              const snapshot = JSON.stringify(row);
              if (lastSeen.get(key) !== snapshot) { lastSeen.set(key, snapshot); h.cb({ new: row }); }
            });
          });
        }, 1500);
        return this;
      },
      unsubscribe() { if (interval) clearInterval(interval); },
    };
  }

  window.DEMO_SB = {
    from(table) { return new MockQuery(table, loadStore()); },
    channel() { return makeChannel(); },
    removeChannel() {},
    auth: {
      async getUser() { return { data: { user: { id: window.DEMO_PROFILE.id } } }; },
      async signOut() {},
      async signInWithOtp() { return { data: {}, error: null }; },
      async verifyOtp() { return { data: { user: { id: window.DEMO_PROFILE.id } }, error: null }; },
    },
    functions: {
      async invoke(name) {
        if (name === 'order-notify') return { data: { sent: true }, error: null };
        return { data: {}, error: null };
      },
    },
  };
})();
