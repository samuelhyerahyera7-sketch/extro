// DEMO MODE — activated by adding ?demo=1 to the URL.
(function () {
  const params = new URLSearchParams(location.search);
  window.DEMO_MODE = params.get('demo') === '1';
  if (!window.DEMO_MODE) return;

  const role = 'restaurant';
  window.DEMO_PROFILE = {
    id: 'demo-restaurant',
    role,
    full_name: "Mama's Kitchen",
    first_name: 'Mama',
    last_name: 'Dlamini',
    phone: '+27712345678',
    avatar_url: null,
  };

  const ITEMS = [
    { id: 'm1', name: 'Beef Burger & Chips', price: 89 },
    { id: 'm2', name: 'Veggie Wrap', price: 65 },
    { id: 'm3', name: 'Chicken Mayo Roll', price: 55 },
    { id: 'm4', name: 'Boerewors Roll', price: 49 },
    { id: 'm5', name: 'Pap & Wors', price: 75 },
  ];

  const STATUSES = ['delivered', 'delivered', 'delivered', 'delivered', 'picked_up', 'pending'];

  function randomItems() {
    const count = Math.floor(Math.random() * 3) + 1;
    const picked = [];
    for (let i = 0; i < count; i++) {
      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const existing = picked.find(p => p.id === item.id);
      if (existing) existing.qty += 1;
      else picked.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    }
    return picked;
  }

  function buildOrders() {
    const orders = [];
    const now = new Date();
    for (let d = 0; d < 30; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() - d);
      const ordersThisDay = Math.floor(Math.random() * 10) + 3 + (d < 7 ? 4 : 0);
      for (let i = 0; i < ordersThisDay; i++) {
        const items = randomItems();
        const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
        const delivery_fee = 25;
        const ts = new Date(date);
        ts.setHours(Math.floor(Math.random() * 12) + 9);
        ts.setMinutes(Math.floor(Math.random() * 60));
        orders.push({
          id: crypto.randomUUID(),
          restaurant_id: 'r1',
          customer_id: 'demo-customer-' + Math.floor(Math.random() * 40),
          driver_id: 'demo-driver',
          status: d === 0 ? STATUSES[Math.floor(Math.random() * STATUSES.length)] : 'delivered',
          payment_status: 'paid',
          total: subtotal + delivery_fee,
          delivery_fee,
          items: JSON.stringify(items),
          delivery_address: '11 Flora Rd, Valhalla',
          created_at: ts.toISOString(),
          updated_at: ts.toISOString(),
        });
      }
    }
    return orders;
  }

  const SEED = {
    restaurants: [
      { id: 'r1', owner_id: 'demo-restaurant', name: "Mama's Kitchen", category: 'Home-style', address: '12 Oak St, Pretoria', is_open: true },
    ],
    menu_items: ITEMS.map(i => ({ ...i, restaurant_id: 'r1', available: true, created_at: new Date().toISOString() })),
    orders: buildOrders(),
  };

  window.DEMO_SB = {
    from(table) {
      const rows = SEED[table] || [];
      const filters = [];
      let _single = false;
      const q = {
        select() { return q; },
        eq(col, val) { filters.push(r => String(r[col]) === String(val)); return q; },
        in(col, vals) { filters.push(r => vals.includes(r[col])); return q; },
        gte(col, val) { filters.push(r => r[col] >= val); return q; },
        order() { return q; },
        single() { _single = true; return q; },
        maybeSingle() { _single = true; return q; },
        then(resolve) {
          const result = rows.filter(r => filters.every(f => f(r)));
          resolve({ data: _single ? (result[0] || null) : result, error: null });
        },
      };
      return q;
    },
    channel() {
      return { on() { return this; }, subscribe() { return this; }, unsubscribe() {} };
    },
    removeChannel() {},
    auth: {
      async getUser() { return { data: { user: { id: window.DEMO_PROFILE.id } } }; },
      async signOut() {},
      async signInWithOtp() { return { data: {}, error: null }; },
      async verifyOtp() { return { data: { user: { id: window.DEMO_PROFILE.id } }, error: null }; },
    },
    functions: { async invoke() { return { data: {}, error: null }; } },
  };
})();
