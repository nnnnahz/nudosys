// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const ORDER_FILE = 'orders.json';

// 如果檔案不存在就創一個空陣列
if (!fs.existsSync(ORDER_FILE)) fs.writeFileSync(ORDER_FILE, '[]');

// 使用者送訂單
app.post('/order', (req, res) => {
  const order = req.body;
  const orders = JSON.parse(fs.readFileSync(ORDER_FILE));
  orders.push(order);
  fs.writeFileSync(ORDER_FILE, JSON.stringify(orders, null, 2));
  res.json({ success: true });
});

// 管理端取得訂單
app.get('/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDER_FILE));
  res.json(orders);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
