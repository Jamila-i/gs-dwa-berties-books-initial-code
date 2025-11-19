# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, firstname, lastname, email, hashedPassword)
VALUES
('gold', 'Gold', 'User', 'gold@example.com', '$2b$10$w6i9.dMfH.C7pY3bvYknveEXkc7SMQIqCYwX0ZKKOlrdp/mi2Chj.');
