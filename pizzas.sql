USE upizz;
CREATE TABLE pizzas (
  pizzas_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  pizzas_userid VARCHAR(255) NOT NULL,
  pizzas_name VARCHAR(100) NOT NULL,
  pizzas_imgaddress VARCHAR(255) NOT NULL,
  pizzas_ingredients VARCHAR(255) NOT NULL,
  pizzas_price FLOAT(10, 2) CHECK(pizzas_price >= 0) NOT NULL,
  pizzas_kcal INT CHECK(pizzas_kcal >= 0) NOT NULL
);
INSERT INTO
  pizzas (
    pizzas_userid,
    pizzas_name,
    pizzas_imgaddress,
    pizzas_ingredients,
    pizzas_price,
    pizzas_kcal
  )
VALUES
  (
    'admin',
    'Margarita',
    'margarita.png',
    '{"Pâte à pizza":1,"Sauce tomate":1,"Tomates":3,"Mozzarella":1,"Olives":3,"Roquette":2}',
    10.5,
    947
  ),
  (
    'admin',
    'Regina',
    'regina.png',
    '{"Pâte à pizza":1,"Sauce tomate":1,"Tomates":2,"Fromage":1,"Jambon":1,"Champignons":1,"Olives":2,"Roquette":2}',
    10.5,
    974
  ),
  (
    'admin',
    'Diavola',
    'diavola.png',
    '{"Pâte à pizza":1,"Sauce tomate":1,"Tomates":3,"Fromage":1,"Chorizo":2,"Oignons":2,"Poivrons":2}',
    11,
    1177
  );