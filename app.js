const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const { PORT, CORS_ALLOWED_ORIGINS, inTestEnv } = require('./env');
const connection = require('./db-config');

const app = express();

app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error('error connecting to db');
  } else {
    console.log('connected to db');
  }
});

// app settings
app.set('x-powered-by', false); // for security

const allowedOrigins = CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

const orderRouter = express.Router();
app.use('/orders', orderRouter);

orderRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM orders')
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/* chatbox app
const orderRouter = express.Router();
app.use('/chat_messages', chat_messagesRouter);

orderRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM chat_messages')
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
*/

orderRouter.post('/', (req, res) => {
  const { ingredients, quantity, price } = req.body;
  const { error: validationErrors } = Joi.object({
    ingredients: Joi.string().max(255).required(),
    quantity: Joi.number().integer().min(0).required(),
    price: Joi.number().min(0).precision(2).required(),
  }).validate({ ingredients, quantity, price }, { abortEarly: false });

  if (validationErrors) {
    res.status(422).send({ validationErrors });
  } else {
    connection
      .promise()
      .query(
        'INSERT INTO orders (ingredients, quantity, price) VALUES (?, ?, ?)',
        [ingredients, quantity, price]
      )
      .then(([result]) => {
        res.send({ id: result.insertId, ingredients, quantity, price });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  }
});

/* chatbox app
chat_messageesRouter.post('/', (req, res) => {
  const { pseudos, messages } = req.body;
  const { error: validationErrors } = Joi.object({
    pseudos: Joi.string().max(255).required(),
    messages: Joi.string().required(),
  }).validate({ pseudos, messages }, { abortEarly: false });

  if (validationErrors) {
    res.status(422).send({ validationErrors });
  } else {
    connection
      .promise()
      .query(
        'INSERT INTO chat_messages (pseudos, messages) VALUES (?, ?)',
        [pseudo, messages]
      )
      .then(([result]) => {
        res.send({ id: result.insertId, pseudos, messages });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  }
});
*/

orderRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  connection
    .promise()
    .query('SELECT * FROM orders WHERE id = ?', [id])
    .then(([results]) => {
      if (results.length) res.send(results[0]);
      else res.sendStatus(404);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/* chatbox app
chatbox_messagesRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  connection
    .promise()
    .query('SELECT * FROM orders WHERE id = ?', [id])
    .then(([results]) => {
      if (results.length) res.send(results[0]);
      else res.sendStatus(404);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
*/

// server setup
app.listen(PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${PORT}`);
  }
});

// process setup : improves error reporting
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});
