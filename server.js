// const express = require('express');
// const mongoose = require('mongoose');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const cors = require('cors');
//
// const app = express();
// // const PORT = process.env.PORT || 3001;
//
// // Connect to MongoDB (replace the connection string with your actual MongoDB connection)
// mongoose.connect('mongodb://localhost:27017/intern_task', { useNewUrlParser: true, useUnifiedTopology: true });
// app.use(cors());
// // Define MongoDB Schema and Model based on your data structure
// const transactionSchema = new mongoose.Schema({
//   // Define your schema here
//
//   // Example: title, description, price, dateOfSale, category, etc.
//     title:String,
//     price:Number,
//     description:String,
//     category:String
//
// });
//
// const Transaction = mongoose.model('Transaction', transactionSchema);
//
// app.use(bodyParser.json());
//
// // Initialize Database with seed data from the third-party API
// app.get('/initialize-database', async (req, res) => {
//   try {
//     const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
//     const data = response.data;
//
//     // Insert data into MongoDB
//     await Transaction.insertMany(data);
//
//     res.json({ message: 'Database initialized successfully', data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
//
// // List all transactions with search and pagination
// app.get('/list-transactions', async (req, res) => {
//   // Extract month and other parameters from the request query
//   const { month, search, page = 1, perPage = 10 } = req.query;
//
//   try {
//     // Implement your logic to filter transactions based on the provided criteria
//     const query = { /* Your query conditions here */ };
//     const transactions = await Transaction.find(query)
//       .skip((page - 1) * perPage)
//       .limit(perPage);
//
//     res.json({ transactions });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
// //
// // // Implement other APIs (statistics, bar-chart, pie-chart, combined-response)
// //
// // // ... (Define your APIs here)
// //
// // app.listen(3001, () => {
// //   console.log(`Server is running on port 3001`);
// // });
//
// // Import necessary libraries
// // const express = require('express');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const mongoose = require('mongoose');
// // const axios = require('axios');
// //
// //
// // // Create an instance of Express
// // const app = express();
// // mongoose.connect('mongodb://localhost:27017/intern_task', { useNewUrlParser: true, useUnifiedTopology: true });
// //
// // // Use middleware to parse JSON and enable CORS
// // app.use(bodyParser.json());
// // app.use(cors());
// //
// // // Example seed data
// // const seedData = [
// //   // ... (your seed data here)
// // ];
// //
// // // Initialize the database with seed data
// // let database = [...seedData];
// //
// // // API to list all transactions with search and pagination
// // app.get('/list-transactions', (req, res) => {
// //   const { month, search, page } = req.query;
// //
// //   // Logic to filter transactions based on month and search
// //   // Adjust this logic based on your data structure and filtering requirements
// //   const filteredTransactions = database.filter(transaction => {
// //     // Add your filtering logic here
// //     // Example: Check if the transaction's month matches the requested month
// //     // Example: Check if the transaction's title, description, or price matches the search query
// //     return (
// //       transaction.dateOfSale.includes(month) &&
// //       (search
// //         ? transaction.title.includes(search) ||
// //           transaction.description.includes(search) ||
// //           transaction.price.includes(search)
// //         : true)
// //     );
// //   });
// //
// //   // Pagination logic
// //   const perPage = 10;
// //   const startIndex = (page - 1) * perPage;
// //   const endIndex = startIndex + perPage;
// //   const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
// //
// //   res.json({ transactions: paginatedTransactions });
// // });
//
// // API for statistics
// app.get('/statistics', (req, res) => {
//   const { month } = req.query;
//
//   // Logic to calculate statistics based on the month
//   // Adjust this logic based on your data structure and calculation requirements
//   const totalSaleAmount = database
//     .filter(transaction => transaction.dateOfSale.includes(month))
//     .reduce((total, transaction) => total + parseFloat(transaction.price), 0);
//
//   const totalSoldItems = database
//     .filter(transaction => transaction.dateOfSale.includes(month))
//     .length;
//
//   const totalNotSoldItems = database
//     .filter(transaction => !transaction.dateOfSale.includes(month))
//     .length;
//
//   res.json({
//     total_sale_amount: totalSaleAmount.toFixed(2),
//     total_sold_items: totalSoldItems,
//     total_not_sold_items: totalNotSoldItems,
//   });
// });
//
// // API for bar chart data
// app.get('/bar-chart', (req, res) => {
//   const { month } = req.query;
//
//   // Logic to generate bar chart data based on the month
//   // Adjust this logic based on your data structure and chart requirements
//   const priceRanges = [
//     { min: 0, max: 100 },
//     { min: 101, max: 200 },
//     { min: 201, max: 300 },
//     { min: 301, max: 400 },
//     { min: 401, max: 500 },
//     { min: 501, max: 600 },
//     { min: 601, max: 700 },
//     { min: 701, max: 800 },
//     { min: 801, max: 900 },
//     { min: 901, max: Infinity },
//   ];
//
//   const barChartData = priceRanges.reduce((data, range) => {
//     const count = database.filter(
//       transaction =>
//         transaction.dateOfSale.includes(month) &&
//         parseFloat(transaction.price) >= range.min &&
//         parseFloat(transaction.price) <= range.max
//     ).length;
//
//     data[`${range.min}-${range.max === Infinity ? 'above' : range.max}`] = count;
//
//     return data;
//   }, {});
//
//   res.json(barChartData);
// });
//
// // Start the server
// const PORT=3001;
// app.listen(3001, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// Import necessary libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

// Create an instance of Express
const app = express();

// Use middleware to parse JSON and enable CORS
app.use(bodyParser.json());
app.use(cors());

// Initialize the database with data from the third-party API
let database = [];

// API to initialize the database
app.get('/initialize-database', async (req, res) => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );

    // Assign the fetched data to the database variable
    database = response.data;

    res.json({ message: 'Database initialized successfully.' });
  } catch (error) {
    console.error('Error initializing database:', error.message);
    res.status(500).json({ error: 'Failed to initialize database.' });
  }
});

// API to list transactions
app.get('/list-transactions', (req, res) => {
  const { month, search, page } = req.query;

  // Logic to filter transactions based on month and search
  const filteredTransactions = database.filter(transaction => {
    return (
      transaction.dateOfSale.includes(month) &&
      (search
        ? transaction.title.includes(search) ||
          transaction.description.includes(search) ||
          transaction.price.includes(search)
        : true)
    );
  });

  // Pagination logic
  const perPage = 10;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  res.json({ transactions: paginatedTransactions });
});

// API for statistics
app.get('/statistics', (req, res) => {
  const { month } = req.query;

  // Logic to calculate statistics based on the month
  const filteredTransactions = database.filter(
    transaction => transaction.dateOfSale.includes(month)
  );

  const totalSaleAmount = filteredTransactions.reduce(
    (total, transaction) => total + parseFloat(transaction.price),
    0
  );

  const totalSoldItems = filteredTransactions.length;

  const totalNotSoldItems = database.filter(
    transaction => !transaction.dateOfSale.includes(month)
  ).length;

  res.json({
    total_sale_amount: totalSaleAmount.toFixed(2),
    total_sold_items: totalSoldItems,
    total_not_sold_items: totalNotSoldItems,
  });
});

// API for bar chart data
app.get('/bar-chart', (req, res) => {
  const { month } = req.query;

  // Logic to generate bar chart data based on the month
  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  const filteredTransactions = database.filter(transaction => {
    return (
      transaction.dateOfSale.includes(month) &&
      (search
        ? transaction.title.includes(search) ||
          transaction.description.includes(search) ||
          transaction.price.includes(search)
        : true)
    );
  });

  const barChartData = priceRanges.reduce((data, range) => {
    const count = filteredTransactions.filter(
      transaction =>
        parseFloat(transaction.price) >= range.min &&
        parseFloat(transaction.price) <= range.max
    ).length;

    data[`${range.min}-${range.max === Infinity ? 'above' : range.max}`] = count;

    return data;
  }, {});

  res.json(barChartData);
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
