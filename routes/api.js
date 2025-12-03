// routes/api.js
const express = require("express");
const router = express.Router();

// GET /api/books – return all books as JSON
router.get("/books", function (req, res, next) {
  // Read query params from URL
  const search = req.query.search; // e.g. ?search=world
  const minprice = req.query.minprice; // e.g. ?minprice=5
  const maxPrice = req.query.max_price; // e.g. &max_price=10
  const sort = req.query.sort;

  // Base query
  let sqlquery = "SELECT * FROM books";
  const params = [];
  const conditions = [];

  // Search filter
  if (search) {
    conditions.push("name LIKE ?");
    params.push("%" + search + "%");
  }

  // Minimum price filter
  if (minprice) {
    conditions.push("price >= ?");
    params.push(parseFloat(minprice));
  }

  // Maximum price filter
  if (maxPrice) {
    conditions.push("price <= ?");
    params.push(parseFloat(maxPrice));
  }

  // If we have any conditions, add WHERE clause
  if (conditions.length > 0) {
    sqlquery += " WHERE " + conditions.join(" AND ");
  }

  // Decide how to sort, if at all
  let orderBy = null;
  if (sort === "name") {
    orderBy = "name";
  } else if (sort === "price") {
    orderBy = "price";
  }

  if (orderBy) {
    sqlquery += " ORDER BY " + orderBy;
  }

  // Run the query with collected params
  db.query(sqlquery, params, (err, results) => {
    if (err) {
      res.json({ error: err });
      return next(err);
    }

    // Return JSON with some context
    res.json({
      search: search || null,
      minprice: minprice ? Number(minprice) : null,
      max_price: maxPrice ? Number(maxPrice) : null,
      sort: sort || null,
      count: results.length,
      results: results,
    });
  });
});

// GET /api/books/search?keyword=xxx
router.get("/books/search", function (req, res, next) {
  // Read keyword from query string
  const keyword = req.query.keyword;

  // If keyword missing -> return an error message
  if (!keyword) {
    return res.json({
      error: "Please provide a search keyword using ?keyword=...",
    });
  }

  // Use LIKE with wildcards
  let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

  const searchTerm = "%" + keyword + "%";

  db.query(sqlquery, [searchTerm], (err, results) => {
    if (err) {
      res.json({ error: err });
      return next(err);
    }

    // Return results as JSON
    res.json({
      keyword: keyword,
      count: results.length,
      results: results,
    });
  });
});

module.exports = router;
