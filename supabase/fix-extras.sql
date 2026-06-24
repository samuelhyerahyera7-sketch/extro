UPDATE public.menu_items
SET extras = '[
  {"group":"Choose your dipping sauce","required":true,"max":1,"options":[
    {"name":"BBQ Sauce","price":0},
    {"name":"Sweet & Sour","price":0},
    {"name":"Tomato Sauce","price":0}
  ]},
  {"name":"Extra dipping sauce","price":6}
]'::jsonb
WHERE name = 'Chicken McNuggets (10pc)';

UPDATE public.menu_items
SET extras = '[
  {"group":"Choose your flavour","required":true,"max":1,"options":[
    {"name":"Strawberry","price":0},
    {"name":"Chocolate","price":0},
    {"name":"Vanilla","price":0}
  ]}
]'::jsonb
WHERE name = 'Strawberry Milkshake';

UPDATE public.menu_items
SET extras = '[
  {"group":"Patty doneness","required":true,"max":1,"options":[
    {"name":"Well done","price":0},
    {"name":"Medium","price":0}
  ]},
  {"name":"Double patty","price":30},
  {"name":"Extra cheese","price":10},
  {"name":"Bacon","price":18}
]'::jsonb
WHERE name = 'Quarter Pounder';

UPDATE public.menu_items
SET extras = '[
  {"name":"Garlic bread (4 slices)","price":25},
  {"name":"Side salad","price":30},
  {"name":"Extra parmesan","price":12},
  {"name":"Soft drink","price":20}
]'::jsonb
WHERE name = 'Beef Lasagna';

UPDATE public.menu_items
SET extras = '[
  {"name":"Extra parmesan","price":12},
  {"name":"Extra meat sauce","price":20},
  {"name":"Garlic bread (4 slices)","price":25},
  {"name":"Side salad","price":30}
]'::jsonb
WHERE name = 'Spaghetti Bolognese';

UPDATE public.menu_items
SET extras = '[
  {"group":"Add a protein","required":false,"max":1,"options":[
    {"name":"Grilled chicken","price":35},
    {"name":"Prawns","price":55},
    {"name":"None","price":0}
  ]},
  {"name":"Extra parmesan","price":12},
  {"name":"Side salad","price":30}
]'::jsonb
WHERE name = 'Penne Arrabiata';

SELECT name, extras FROM public.menu_items
WHERE name IN ('Chicken McNuggets (10pc)','Strawberry Milkshake','Quarter Pounder','Beef Lasagna','Spaghetti Bolognese','Penne Arrabiata');
