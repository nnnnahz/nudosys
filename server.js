// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Supabase 初始化（填入你的 Supabase 網址和密鑰）
const supabaseUrl = 'https://puldiaqtuypozwrqatex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bGRpYXF0dXlwb3p3cnFhdGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTExNDUsImV4cCI6MjA2ODQ4NzE0NX0.MtvpjEStFWLvfuVMlQpt1dT7_PA0VbP2HqGkJROu_ek';
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /order - 新增訂單
app.post('/order', async (req, res) => {
  const { name, item, time } = req.body;
  const { data, error } = await supabase
    .from('nudosys')   // 改成你資料表名稱
    .insert([{ name, item, time }]);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.json({ success: false });
  }
  res.json({ success: true });
});

// GET /orders - 取得所有訂單
app.get('/orders', async (req, res) => {
  const { data, error } = await supabase
    .from('nudosys')  // 改成你資料表名稱
    .select('*')
    .order('time', { ascending: false });

  if (error) {
    console.error('Supabase select error:', error);
    return res.status(500).json({ error: '無法取得訂單資料' });
  }
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
  res.send('Hello from server!');
});
