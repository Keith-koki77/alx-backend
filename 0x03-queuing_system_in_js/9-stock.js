const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 1245;

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, stock: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, stock: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, stock: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, stock: 5 },
];

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.on('error', (err) => console.log('Redis Client Error', err));

const getItemById = (id) => {
  const item = listProducts.find((product) => product.itemId === id);
  return item ? item : null;
};

const reserveStockById = async (id, stock) => {
  const currentStock = await getCurrentReservedStockById(id);
  if (currentStock === null) {
    await client.set(`item.${id}`, stock);
  } else {
    await client.set(`item.${id}`, currentStock + stock);
  }
};

const getCurrentReservedStockById = async (id) => {
  const stock = await promisify(client.get).bind(client)(`item.${id}`);
  return stock ? parseInt(stock) : null;
};

app.get('/list_products', (req, res) => {
  res.json(listProducts.map((product) => ({ ...product, initialAvailableQuantity: product.stock })));
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return res.json({ status: 'Product not found' });
  }
  const currentQuantity = await getCurrentReservedStockById(itemId);
  res.json({ ...item, currentQuantity });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return res.json({ status: 'Product not found' });
  }
  const currentQuantity = await getCurrentReservedStockById(itemId);
  if (currentQuantity === null || currentQuantity >= item.stock) {
    return res.json({ status: 'Not enough stock available', itemId });
  }
  await reserveStockById(itemId, 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
