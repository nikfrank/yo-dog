const express = require('express');
const app = express();

app.use(express.json());

const port = 4000;

const inMemMessages = [
  { id: 0, from: 'nik', to: 'chico', content: 'woof', time: 1623166099515 },
  { id: 1, from: 'chico', to: 'nik', content: 'woof [tail wag]', time: 1623166102515 },
  { id: 2, from: 'yoyo', to: 'nik', content: '[tail wag] * 3', time: 1623166112515 },
  { id: 3, from: 'yoyo', to: 'chico', content: '[tail wag] * 5', time: 1623166212515 },
];

app.get('/messages', (req, res) => {
  res.json({
    messages: inMemMessages.filter(msg => [msg.to, msg.from].includes(req.query.username)),
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
