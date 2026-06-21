// DEMO MODE — activated by adding ?demo=1 to the URL.
(function () {
  const params = new URLSearchParams(location.search);
  window.DEMO_MODE = params.get('demo') === '1';
  if (!window.DEMO_MODE) return;

  const role = 'driver';
  window.DEMO_PROFILE = {
    id: `demo-${role}`,
    role,
    full_name: 'Sam Hyera',
    first_name: 'Sam',
    last_name: 'Hyera',
    phone: '+27813756494',
    avatar_url: null,
  };

  const STORE_KEY = 'extro_demo_store_v1';
  function seed() {
    const now = Date.now();
    const d1 = new Date(now - 2 * 86400000).toISOString();
    const d2 = new Date(now - 86400000).toISOString();
    const d3 = new Date(now - 4 * 3600000).toISOString();
    const d4 = new Date(now - 2 * 3600000).toISOString();
    return {
      restaurants: [
        { id: 'r1', owner_id: 'demo-restaurant', name: "Mama's Kitchen", category: 'Home-style', address: '12 Oak St, Pretoria', lat: -25.746, lng: 28.188, is_open: true, created_at: new Date().toISOString() },
      ],
      menu_items: [],
      drivers: [
        { id: 'demo-driver', vehicle_type: 'bicycle', is_online: false, current_lat: -25.75, current_lng: 28.19, onboarded_at: new Date().toISOString(), id_verified: true, updated_at: new Date().toISOString() },
      ],
      orders: [
        { id: 'o1', customer_id: 'demo-customer', restaurant_id: 'r1', driver_id: null, status: 'ready', payment_status: 'paid', items: [{ id: 'm1', name: 'Beef Burger & Chips', price: 89, qty: 2 }], subtotal: 178, delivery_fee: 25, total: 203, delivery_address: '11 Flora Rd, Valhalla', delivery_lat: -25.7512, delivery_lng: 28.1884, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'o-h1', customer_id: 'demo-cx', restaurant_id: 'r1', driver_id: 'demo-driver', status: 'delivered', payment_status: 'paid', items: [], delivery_fee: 35, total: 165, delivery_address: '5 Oak Ave, Pretoria', delivery_lat: -25.748, delivery_lng: 28.19, created_at: d1, updated_at: d1 },
        { id: 'o-h2', customer_id: 'demo-cx', restaurant_id: 'r1', driver_id: 'demo-driver', status: 'delivered', payment_status: 'paid', items: [], delivery_fee: 30, total: 145, delivery_address: '22 Maple St, Pretoria', delivery_lat: -25.75, delivery_lng: 28.192, created_at: new Date(now - 2 * 86400000 + 3600000).toISOString(), updated_at: d1 },
        { id: 'o-h3', customer_id: 'demo-cx', restaurant_id: 'r1', driver_id: 'demo-driver', status: 'delivered', payment_status: 'paid', items: [], delivery_fee: 40, total: 195, delivery_address: '8 Pine Rd, Centurion', delivery_lat: -25.762, delivery_lng: 28.195, created_at: new Date(now - 2 * 86400000 + 7200000).toISOString(), updated_at: d1 },
        { id: 'o-h4', customer_id: 'demo-cx', restaurant_id: 'r1', driver_id: 'demo-driver', status: 'delivered', payment_status: 'paid', items: [], delivery_fee: 25, total: 115, delivery_address: '15 Cedar Lane, Pretoria', delivery_lat: -25.755, delivery_lng: 28.185, created_at: d2, updated_at: d2 },
        { id: 'o-h5', customer_id: 'demo-cx', restaurant_id: 'r1', driver_id: 'demo-driver', status: 'delivered', payment_status: 'paid', items: [], delivery_fee: 45, total: 220, delivery_address: '9 Willow Ave, Pretoria', delivery_lat: -25.752, delivery_lng: 28.187, created_at: new Date(now - 86400000 + 5400000).toISOString(), updated_at: d2 },
        { id: 'o-h6', customer_id: 'demo-cx', restaurant_id: 'r1', driver_id: 'demo-driver', status: 'delivered', payment_status: 'paid', items: [], delivery_fee: 30, total: 140, delivery_address: '27 Birch Rd, Centurion', delivery_lat: -25.762, delivery_lng: 28.193, created_at: d3, updated_at: d3 },
        { id: 'o-h7', customer_id: 'demo-cx', restaurant_id: 'r1', driver_id: 'demo-driver', status: 'delivered', payment_status: 'paid', items: [], delivery_fee: 25, total: 115, delivery_address: '3 Rose St, Pretoria', delivery_lat: -25.749, delivery_lng: 28.191, created_at: d4, updated_at: d4 },
      ],
      withdrawals: [
        { id: 'wd1', driver_id: 'demo-driver', amount: 200, bank_name: 'Capitec Bank', account_number: '****4521', account_holder: 'Sam Hyera', status: 'paid', created_at: d1 },
      ],
      addresses: [],
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
    upsert(obj) { this.type = 'upsert'; this.data = obj; return this; }
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
      if (this.type === 'upsert') {
        const items = Array.isArray(this.data) ? this.data : [this.data];
        items.forEach(item => {
          const existing = rows.find(r => r.id === item.id);
          if (existing) Object.assign(existing, item);
          else rows.push({ created_at: new Date().toISOString(), ...item });
        });
        saveStore(store);
        return { data: null, error: null };
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
    storage: {
      from() {
        return {
          async upload(path, file, opts) { return { data: { path }, error: null }; },
          getPublicUrl(path) { return { data: { publicUrl: `demo://storage/${path}` } }; },
        };
      },
    },
  };
})();
