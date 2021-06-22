const express = require('express');
const app = express();
const crypto = require('crypto');
const util = require('util');

const scryptPromise = util.promisify(crypto.scrypt);

const Sequelize = require('sequelize');

// do not ever commit passwords to git
// do as I say, not as I do.
const orm = new Sequelize('postgres://yodog:woof@localhost:5432/yodog', { logging: false });

const { User } = require('./models')(orm);

orm.authenticate()
   .then(()=>{
     console.log('db works');
   }).catch(()=>{
     console.log('db no worky');
   });


app.use(express.json());

app.get('/', (req, res)=>{
  res.json({ great: 'success' });
});

app.get('/user', (req, res)=>{
  User.findAll()
      .then(users=> res.json(users));
});

app.post('/user', (req, res)=>{
  scryptPromise(req.body.password, 'why are there no limes in Israel?', 64)
    .then(derivedKey => derivedKey.toString('hex'))
    .catch(()=> Promise.reject('hashing failed'))
  
    .then(hashPassword=> User.create({ name: req.body.name, hashPassword }))
    .then(createdUser=> res.status(201).json({ createdUser }))
    .catch((err)=> {
      res.status(
        err === 'hashing failed' ? 500 : 409
      ).json({ message: 'no user created' })
    });
});

app.get('/hydrate', (req, res)=>{
  User.sync({ alter: true })
      .then(()=>
        User.create({
          name: 'nik'+ (''+Math.random()).slice(2),
          hashPassword: 'guest'
        })
      ).then(()=>{
        res.json({ great: 'success' });
      });
});

app.listen(4200, ()=> console.log('running at 4200'));
