USE upizz;
CREATE TABLE ingredients (
ingredients_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
ingredients_name VARCHAR(255) NOT NULL,
ingredients_imgaddress VARCHAR(255) NOT NULL,
ingredients_imglayer VARCHAR(255) NOT NULL,
ingredients_ingr VARCHAR(255) NOT NULL,
ingredients_category VARCHAR(255) NOT NULL,
ingredients_price FLOAT(10, 2) CHECK(ingredients_price >=0) NOT NULL,
ingredients_serving INT CHECK(ingredients_serving >=0) NOT NULL,
ingredients_kcal100 INT CHECK(ingredients_kcal100 >=0) NOT NULL
);


INSERT INTO ingredients (ingredients_name, ingredients_imgaddress, ingredients_imglayer, ingredients_ingr, 
ingredients_category, ingredients_price, ingredients_serving, ingredients_kcal100) 
VALUES
( 'Pâte à pizza', 'unite-fond-pate.png', 'unite-fond-pate.png', 'pizza%20dough', 'Base', 2, 228, 0 ),
( 'Sauce tomate', 'unite-fond-sauce.png', 'unite-fond-sauce.png', 'tomato%20sauce', 'Base', 2, 50 , 0),
( 'Tomates', 'unite-tomate.png', 'tomates.png', 'tomato', 'Ingredient', 2, 200 , 0),
( 'Chorizo', 'unite-chorizo.png', 'chorizos.png', 'chorizo', 'Ingredient', 3, 50 , 0),
( 'Fromage', 'unite-fromage.png', 'fromage.png', 'emmental', 'Ingredient', 4, 100 , 0),
( 'Oignons', 'unite-oignon.png', 'oignon.png', 'onion', 'Ingredient', 1, 200, 0 ),
( 'Olives', 'unite-olive.png', 'olives.png', 'olive', 'Ingredient', 2, 200, 0 ),
( 'Poivrons', 'unite-poivron.png', 'poivrons.png', 'peppers', 'Ingredient', 2, 200, 0 ),
( 'Champignons', 'unite-champignon.png', 'champignons.png', 'mushroom', 'Ingredient', 2, 200, 0 ),
( 'Jambon', 'unite-jambon.png', 'jambon.png', 'ham', 'Ingredient', 2, 200, 0 ),
( 'Anchois', 'unite-anchois.png', 'anchois.png', 'anchovies', 'Ingredient', 2, 200, 0 ),
( 'Mozzarella', 'unite-mozzarella.png', 'mozzarella.png', 'mozzarella', 'Ingredient', 2, 200, 0 ),
( 'Roquette', 'unite-roquette.png', 'roquette.png', 'arugula', 'Ingredient', 2, 200, 0 ),
( 'Ananas', 'unite-ananas.png', 'ananas.png', 'pineapple', 'Ingredient', 2, 200, 0 )
;


