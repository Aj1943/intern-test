// src/components/TransactionsDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'chart.js/auto';

const TransactionsTable = ({ transactions }) => (
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          {/* Add more headers based on your transaction properties */}
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction._id}>
            <td>{transaction.title}</td>
            <td>{transaction.description}</td>
            <td>{transaction.price}</td>
            {/* Add more table data based on your transaction properties */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TransactionsStatistics = ({ stats }) => (
  <div className="statistics-container">
    <h2>Transactions Statistics</h2>
    <p>Total Sale Amount: {stats.total_sale_amount}</p>
    <p>Total Sold Items: {stats.total_sold_items}</p>
    <p>Total Not Sold Items: {stats.total_not_sold_items}</p>
  </div>
);

const TransactionsBarChart = ({ barChartData }) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (chart) {
      chart.destroy();
    }

    const newChart = new Chart('bar-chart-canvas', {
      type: 'bar',
      data: {
        labels: Object.keys(barChartData),
        datasets: [
          {
            label: 'Number of Items',
            data: Object.values(barChartData),
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'category',
          },
        },
      },
    });

    setChart(newChart);

    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [barChartData]);

  return <canvas id="bar-chart-canvas" />;
};

const TransactionsDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [selectedMonth, searchText, page]);

  const fetchTransactions = () => {
    axios.get(`http://localhost:3001/list-transactions?month=${selectedMonth}&search=${searchText}&page=${page}`)
      .then(response => {
        setTransactions(response.data.transactions);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
        setError('Error fetching transactions. Please try again.');
      });
  };

  const fetchStatistics = () => {
    // cja
    axios.get(`http://localhost:3001/statistics?month=${selectedMonth}`)
      .then(response => {
        setStats(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
        setStats({});
        setError('Error fetching statistics. Please try again.');
      });
  };

  const fetchBarChartData = () => {
    axios.get(`http://localhost:3001/bar-chart?month=${selectedMonth}`)
      .then(response => {
        setBarChartData(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching bar chart data:', error);
        setBarChartData({});
        setError('Error fetching bar chart data. Please try again.');
      });
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date.toLocaleString('en-US', { month: 'long' }));
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Transactions Dashboard</h1>

      <div className="datepicker-container">
        <label>Select Month:</label>
        <DatePicker
          selected={new Date()}
          onChange={handleMonthChange}
          dateFormat="MMMM"
          showMonthYearPicker
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <TransactionsTable transactions={transactions} />

      <div className="pagination-container">
        <button onClick={handlePrevPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>

      <TransactionsStatistics stats={stats} />

      <TransactionsBarChart barChartData={barChartData} />
    </div>
  );
};

export default TransactionsDashboard;
