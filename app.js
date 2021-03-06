const axios = require('axios');
const express = require('express');

const cors = require('cors');
const Joi = require('joi');
const {
  PORT,
  CORS_ALLOWED_ORIGINS,
  inTestEnv,
  EDAMAM_API_ID,
  EDAMAM_SECRET_API_KEY,
} = require('./env');
const emailer = require('./emailer');
const connection = require('./db-config');

const app = express();
app.use(express.json());

const delayInMilliseconds = 60 * 60 * 1000;

/* ********************** connection to database ********************** */
connection.connect((err) => {
  if (err) {
    console.error('error connecting to db');
  } else {
    console.log('connected to db');
  }
});

/* ********************** app settings ********************** */
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

/* ********************** Connection & request to API periodically ********************** */
const edamamRequest = () => {
  const firstRequest = connection
    .promise()
    .query(
      'SELECT ingredients_id AS id, ingredients_ingr AS ingr FROM ingredients'
    )
    .catch((err) => {
      console.log(err);
    });

  firstRequest
    .then((reqresult) => {
      const listOfIngredients = Object.values(
        JSON.parse(JSON.stringify(reqresult[0]))
      );
      listOfIngredients.forEach((ingredient) =>
        axios
          .get(
            `https://api.edamam.com/api/food-database/v2/parser?app_id=${EDAMAM_API_ID}&app_key=${EDAMAM_SECRET_API_KEY}&category=generic-foods&ingr=${ingredient.ingr}`
          )
          .then((response) => response.data)
          .then((data) => {
            connection
              .promise()
              .query(
                `UPDATE ingredients SET ingredients_kcal100 = ? WHERE ingredients_id = ?;`,
                [data.parsed[0].food.nutrients.ENERC_KCAL, ingredient.id]
              );
          })
      );
    })
    .catch((err) => console.log(err));
  console.log(`Request to API done at ${new Date().toLocaleString()}`);
};

edamamRequest();
setInterval(edamamRequest, delayInMilliseconds);

/* ********************** Router for orders ********************** */
const orderRouter = express.Router();
app.use('/orders', orderRouter);

orderRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM orders ORDER BY id DESC')
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

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

/* ********************** Router for messages ********************** */
const messagesRouter = express.Router();
app.use('/contact', messagesRouter);

messagesRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM messages ORDER BY id DESC LIMIT 4')
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

messagesRouter.post('/', (req, res) => {
  const { user, input } = req.body;
  const { error: validationErrors } = Joi.object({
    user: Joi.string().max(30).required(),
    input: Joi.string().required(),
  }).validate({ user, input }, { abortEarly: false });

  if (validationErrors) {
    res.status(422).send({ validationErrors });
  } else {
    connection
      .promise()
      .query('INSERT INTO messages (user, input) VALUES (?, ?)', [user, input])
      .then(([result]) => {
        res.send({ id: result.insertId, user, input });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  }
});

/* ********************** Router for ingredients ********************** */
const ingredientsRouter = express.Router();
app.use('/order/create-pizza', ingredientsRouter);

ingredientsRouter.get('/', (req, res) => {
  connection
    .promise()
    .query(
      'SELECT ingredients_category AS category, ingredients_id AS id, ingredients_imgaddress AS imgsrc, ingredients_imglayer AS imglayer, ingredients_ingr AS ingr,ingredients_kcal100 AS kcal100, ingredients_name AS name, ingredients_price AS price, ingredients_serving AS serving FROM ingredients'
    )
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

ingredientsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  connection
    .promise()
    .query(
      'SELECT ingredients_category AS category, ingredients_id AS id, ingredients_imgaddress AS imgsrc, ingredients_imglayer AS imglayer, ingredients_ingr AS ingr,ingredients_kcal100 AS kcal100, ingredients_name AS name, ingredients_price AS price, ingredients_serving AS serving  FROM ingredients WHERE id = ?',
      [id]
    )
    .then(([results]) => {
      if (results.length) res.send(results[0]);
      else res.sendStatus(404);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/* ********************** Router for predefined pizzas ********************** */
const predefRouter = express.Router();
app.use('/order/pizza-list', predefRouter);

predefRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM pizzas')
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// route for contact mail

app.post('/contactmail', (req, res) => {
  const { email, name, subject, description } = req.body;
  // error handlings joi
  emailer.sendMail(
    {
      from: 'joris-maupied_student2021@wilder.school',
      to: 'maupied69@hotmail.com',
      subject,
      text: `${name} tried to reach you with this message : ${description} from this email : ${email}`,
      html: `${name} tried to reach you with this message : ${description} from this email : ${email}`,
    },
    (err, info) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else console.log(info);
      res.sendStatus(200);
    }
  );
});

/* ********************** server setup ********************** */ app.listen(
  PORT,
  () => {
    if (!inTestEnv) {
      console.log(`Server running on port ${PORT}`);
    }
  }
);

/* ********************** process setup : improves error reporting ********************** */
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
