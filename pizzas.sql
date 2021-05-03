USE upizz;
CREATE TABLE pizzas (
  pizzas_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  pizzas_name VARCHAR(255) NOT NULL,
  pizzas_imgaddress VARCHAR(255) NOT NULL,
  pizzas_ingredients VARCHAR(255) NOT NULL,
  pizzas_price FLOAT(10, 2) CHECK(pizza_price >= 0) NOT NULL,
  pizzas_kcal INT CHECK(pizza_kcal >= 0) NOT NULL
);
INSERT INTO
  pizzas (
    pizzas_name,
    pizzas_imgaddress,
    pizzas_ingredients,
    pizzas_price,
    pizzas_kcal
  )
VALUES
  (
    'Margarita',
    'margarita.png',
    'Tomates, Mozzarella, Olives, Roquette',
    9,
    0
  ),
  (
    'Regina',
    'regina.png',
    'Tomates, Fromage, Jambon, Champignons, Olives, Roquette',
    12,
    0
  ),
  (
    'Diavola',
    'diavola.png',
    'Tomates, Fromage, Chorizo, Oignons, Poivrons',
    11,
    0
  ); 