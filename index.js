require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// [GET] Fetch Recursive Tree
app.get('/api/tree', async (req, res) => {
  const { data, error } = await supabase.rpc('get_family_tree');
  if (error) return res.status(400).json(error);
  res.json(data);
});

// [POST] Save new member
app.post('/api/members', async (req, res) => {
  const { first_name, last_name, parent_id, birth_date } = req.body;
  const { data, error } = await supabase
    .from('members')
    .insert([{ first_name, last_name, parent_id, birth_date }])
    .select();

  if (error) return res.status(400).json(error);
  res.status(201).json(data[0]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
