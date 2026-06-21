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

  const STORE_KEY = 'zoom_demo_store_v1';
  function seed() {
    const t = new Date().toISOString();
    return {
      restaurants: [
        { id: 'r1', owner_id: 'demo-restaurant', name: "Mama's Kitchen",  category: 'Home-style',  address: '12 Oak St, Pretoria',         lat: -25.746, lng: 28.188, is_open: true,  rating: 4.8, delivery_time: '25–40 min', distance: 1.2, photo_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=240&fit=crop', created_at: t },
        { id: 'r2', owner_id: 'demo-r2',        name: 'Burger Republic',  category: 'Burgers',     address: '5 Church St, Centurion',      lat: -25.861, lng: 28.189, is_open: true,  rating: 4.5, delivery_time: '20–35 min', distance: 2.4, photo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=240&fit=crop', created_at: t },
        { id: 'r3', owner_id: 'demo-r3',        name: 'Pizza Palace',     category: 'Pizza',       address: '88 Boom St, Pretoria CBD',    lat: -25.754, lng: 28.191, is_open: true,  rating: 4.3, delivery_time: '30–45 min', distance: 3.1, photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=240&fit=crop', created_at: t },
        { id: 'r4', owner_id: 'demo-r4',        name: 'Sushi Express',    category: 'Sushi',       address: '22 Waterkloof Rd, Pretoria',  lat: -25.779, lng: 28.233, is_open: true,  rating: 4.7, delivery_time: '35–50 min', distance: 4.8, photo_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=240&fit=crop', created_at: t },
        { id: 'r5', owner_id: 'demo-r5',        name: 'Kota Corner',      category: 'Street Food', address: '3 Vilakazi St, Soweto',       lat: -25.797, lng: 28.121, is_open: true,  rating: 4.9, delivery_time: '15–25 min', distance: 0.8, photo_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=240&fit=crop', created_at: t },
        { id: 'r6', owner_id: 'demo-r6',        name: 'Green Bowl',       category: 'Healthy',     address: '17 Menlyn Park, Pretoria East',lat: -25.782, lng: 28.277, is_open: false, rating: 4.4, delivery_time: '30–45 min', distance: 5.3, photo_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=240&fit=crop', created_at: t },
      ],
      menu_items: [
        // Mama's Kitchen
        { id: 'm1',  restaurant_id: 'r1', name: 'Pap & Wors',           description: 'Traditional maize pap with grilled boerewors and chakalaka',    price: 75,  available: true, photo_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=320&h=200&fit=crop', created_at: t },
        { id: 'm2',  restaurant_id: 'r1', name: 'Chicken Stew & Rice',  description: 'Slow-cooked chicken in rich tomato and onion gravy',             price: 85,  available: true, photo_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=320&h=200&fit=crop', created_at: t },
        { id: 'm3',  restaurant_id: 'r1', name: 'Vetkoek & Mince',      description: 'Deep-fried dough filled with spiced beef mince',                 price: 55,  available: true, photo_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=320&h=200&fit=crop', created_at: t },
        { id: 'm4',  restaurant_id: 'r1', name: 'Samp & Beans',         description: 'Slow-cooked samp with sugar beans and smoked pork',              price: 65,  available: true, photo_url: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=320&h=200&fit=crop', created_at: t },
        // Burger Republic
        { id: 'm5',  restaurant_id: 'r2', name: 'Classic Smash Burger', description: 'Double smash patty, American cheese, pickles, special sauce',    price: 115, available: true, photo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=320&h=200&fit=crop', created_at: t },
        { id: 'm6',  restaurant_id: 'r2', name: 'BBQ Bacon Stack',      description: 'Triple patty, streaky bacon, BBQ sauce, crispy onion rings',     price: 145, available: true, photo_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=320&h=200&fit=crop', created_at: t },
        { id: 'm7',  restaurant_id: 'r2', name: 'Loaded Cheese Fries',  description: 'Golden fries smothered in cheese sauce, jalapeños, spring onion', price: 65, available: true, photo_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=320&h=200&fit=crop', created_at: t },
        { id: 'm8',  restaurant_id: 'r2', name: 'Chicken Burger',       description: 'Crispy fried chicken, coleslaw, chipotle mayo, brioche bun',     price: 105, available: true, photo_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=320&h=200&fit=crop', created_at: t },
        // Pizza Palace
        { id: 'm9',  restaurant_id: 'r3', name: 'Margherita',           description: 'San Marzano tomato, buffalo mozzarella, fresh basil, EVOO',      price: 95,  available: true, photo_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=320&h=200&fit=crop', created_at: t },
        { id: 'm10', restaurant_id: 'r3', name: 'Pepperoni Feast',      description: 'Double pepperoni, mozzarella, chilli flakes, tomato base',       price: 120, available: true, photo_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=320&h=200&fit=crop', created_at: t },
        { id: 'm11', restaurant_id: 'r3', name: 'BBQ Chicken Pizza',    description: 'Pulled chicken, BBQ sauce, red onion, mozzarella',               price: 125, available: true, photo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=320&h=200&fit=crop', created_at: t },
        // Sushi Express
        { id: 'm12', restaurant_id: 'r4', name: 'Spicy Tuna Roll (8pc)',description: 'Fresh tuna, sriracha mayo, cucumber, sesame seeds',              price: 135, available: true, photo_url: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=320&h=200&fit=crop', created_at: t },
        { id: 'm13', restaurant_id: 'r4', name: 'Salmon Nigiri (6pc)', description: 'Premium Atlantic salmon on hand-pressed sushi rice',              price: 145, available: true, photo_url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=320&h=200&fit=crop', created_at: t },
        { id: 'm14', restaurant_id: 'r4', name: 'Prawn Tempura Roll',  description: 'Crispy tempura prawn, avo, cucumber, unagi sauce',               price: 155, available: true, photo_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=320&h=200&fit=crop', created_at: t },
        // Kota Corner
        { id: 'm15', restaurant_id: 'r5', name: 'Original Kota',       description: 'Quarter loaf, polony, cheese, atchar, egg and chips',             price: 45,  available: true, photo_url: 'https://images.unsplash.com/photo-1604908550534-e6e4d3effd70?w=320&h=200&fit=crop', created_at: t },
        { id: 'm16', restaurant_id: 'r5', name: 'Kota Special',        description: 'Quarter loaf, steak, cheese, fried egg, atchar, slap chips',     price: 75,  available: true, photo_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=320&h=200&fit=crop', created_at: t },
        { id: 'm17', restaurant_id: 'r5', name: 'Bunny Chow',          description: 'Half loaf filled with spicy Durban-style chicken curry',          price: 85,  available: true, photo_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=320&h=200&fit=crop', created_at: t },
        // Green Bowl
        { id: 'm18', restaurant_id: 'r6', name: 'Açaí Power Bowl',     description: 'Açaí base, banana, granola, berries, honey drizzle',             price: 95,  available: true, photo_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=320&h=200&fit=crop', created_at: t },
        { id: 'm19', restaurant_id: 'r6', name: 'Harvest Grain Bowl',  description: 'Quinoa, roasted veg, feta, hummus, tahini dressing',              price: 110, available: true, photo_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=320&h=200&fit=crop', created_at: t },
      ],
      drivers: [
        { id: 'demo-driver', vehicle_type: 'car', is_online: true, current_lat: -25.75, current_lng: 28.19, updated_at: t },
      ],
      orders: [
        { id: 'order-demo-1', customer_id: 'demo-customer', restaurant_id: 'r2', driver_id: 'demo-driver', status: 'picked_up', payment_status: 'paid', items: JSON.stringify([{ name: 'Classic Smash Burger', price: 115, qty: 1 }, { name: 'Loaded Cheese Fries', price: 65, qty: 1 }]), total_amount: 205, delivery_fee: 25, delivery_address: '11 Flora Rd, Valhalla, Centurion', delivery_lat: -25.7512, delivery_lng: 28.1884, created_at: t },
      ],
      addresses: [
        { id: 'addr-demo', customer_id: 'demo-customer', street_address: '11 Flora Rd, Valhalla, Centurion', lat: -25.7512, lng: 28.1884, is_default: true, type: 'home', created_at: t },
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
        // Simulate driver picking up the order after a short delay
        if (this.table === 'orders') {
          const orderId = inserted[0].id;
          setTimeout(() => {
            const s = loadStore();
            const o = (s.orders || []).find(o => o.id === orderId);
            if (o) { o.status = 'picked_up'; o.driver_id = 'demo-driver'; o.updated_at = new Date().toISOString(); }
            saveStore(s);
          }, 5000);
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
