USE p2_g1;
CREATE TABLE orders (
id INT NOT NULL AUTO_INCREMENT,
ingredients VARCHAR(255) NOT NULL,
quantity INT CHECK(quantity >=0) NOT NULL,
price FLOAT(10, 2) CHECK(price >=0) NOT NULL,
PRIMARY KEY (id)
);