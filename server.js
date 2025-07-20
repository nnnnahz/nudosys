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

// Supabase 初始化
const supabaseUrl = 'https://puldiaqtuypozwrqatex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bGRpYXF0dXlwb3p3cnFhdGV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkxMTE0NSwiZXhwIjoyMDY4NDg3MTQ1fQ.tsItweZI0Hj5k4F-k75aFuIQ9ccUQEXcVw6F95O6oJM';
const supabase = createClient(supabaseUrl, supabaseKey);

// /order  新增訂單
app.post('/order', async (req, res) => {
  const { name, flavor, time, brand } = req.body;
  const { data, error } = await supabase
    .from('nudosys')   
    .insert([{ name, flavor, time, brand }]);

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


app.patch('/done/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('nudosys')
    .update({ done: true })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ message: '已完成訂單' });
});
