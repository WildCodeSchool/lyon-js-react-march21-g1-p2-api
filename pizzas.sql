USE upizz;
CREATE TABLE pizzas (
  pizza_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  pizza_name VARCHAR(255) NOT NULL,
  pizza_imgaddress VARCHAR(255) NOT NULL,
  ingredients_list VARCHAR(255) NOT NULL,
  pizza_price FLOAT(10, 2) CHECK(pizza_price >= 0) NOT NULL,
  pizza_kcal INT CHECK(pizza_kcal >= 0) NOT NULL
);
INSERT INTO
  pizzas (
    pizza_name,
    pizza_imgaddress,
    ingredients_list,
    pizza_price,
    pizza_kcal
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