// DEMO MODE — activated by adding ?demo=1 to the URL.
(function () {
  const params = new URLSearchParams(location.search);
  window.DEMO_MODE = params.get('demo') === '1';
  if (!window.DEMO_MODE) return;

  const role = 'restaurant';
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
    return {
      restaurants: [
        { id: 'r1', owner_id: 'demo-restaurant', name: "Mama's Kitchen", category: 'Home-style', address: '12 Oak St, Pretoria', lat: -25.746, lng: 28.188, is_open: true, created_at: new Date().toISOString() },
      ],
      menu_items: [
        { id: 'm1', restaurant_id: 'r1', name: 'Beef Burger & Chips', description: 'Flame-grilled beef patty, cheddar, chips', price: 89, available: true, created_at: new Date().toISOString() },
        { id: 'm2', restaurant_id: 'r1', name: 'Veggie Wrap', description: 'Grilled vegetables, hummus, whole-wheat wrap', price: 65, available: true, created_at: new Date().toISOString() },
        { id: 'm3', restaurant_id: 'r1', name: 'Chicken Mayo Roll', description: 'Shredded chicken, mayo, fresh roll', price: 55, available: true, created_at: new Date().toISOString() },
      ],
      drivers: [],
      orders: [
        { id: 'o1', customer_id: 'demo-customer', restaurant_id: 'r1', driver_id: null, status: 'pending', payment_status: 'paid', items: [{ id: 'm1', name: 'Beef Burger & Chips', price: 89, qty: 2 }, { id: 'm3', name: 'Chicken Mayo Roll', price: 55, qty: 1 }], subtotal: 233, delivery_fee: 25, total: 258, delivery_address: '11 Flora Rd, Valhalla', delivery_lat: -25.7512, delivery_lng: 28.1884, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
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
