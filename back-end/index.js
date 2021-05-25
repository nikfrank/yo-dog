const express = require('express');
const app = express();

app.use(express.json());

const port = 4000;

const inMemMessages = [
  { id: 0, from: 'nik', to: 'chico', content: 'woof' },
  { id: 1, from: 'chico', to: 'nik', content: 'sniff sniff woof [tail wag]' },
];

app.get('/messages', (req, res) => {
  res.json({
    messages: inMemMessages,
  });
});

app.post('/message', (req, res)=>{

  // pretend to update the db
  inMemMessages.push({ ...req.body, id: inMemMessages.length });
  
  // pretend to succeed

  res.status(201).json({ great: 'success!' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
