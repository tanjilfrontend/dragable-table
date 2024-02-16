
import { useEffect, useState } from 'react';
import './App.css'
import TableData from './components/Table'
import TableModal from './components/TableModal';
import Button from 'react-bootstrap/Button';

function App() {
  const [data, setData] = useState([]);
  const [totalProjectValue, setTotalProjectValue] = useState(0);
  const [totalProjectCount, setTotalProjectCount] = useState(0);
  const [columns, setColumns] = useState();
  const fetchData = async () => {
    try {
      const response = await fetch('https://retoolapi.dev/cV9K7f/predefined_cycle');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      // Assuming jsonData is an array of objects where each object represents a row in the table
      setData(jsonData);

    //   // Extract column keys from the first row (assuming all rows have the same structure)
      if (jsonData.length > 0) {
        const firstRow = jsonData[0];
        const columnKeys = Object.keys(firstRow).map(key => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter of key for label
          visible: true,
        }));
        setColumns(columnKeys);
        calculateTotals(jsonData);
      }
    } catch (error) {
       console.error('Error fetching data:', error);
    }
  }

  const calculateTotals = (jsonData) => {
    let totalValue = 0;
    let totalCount = 0;

    jsonData.forEach(item => {
      totalValue += parseFloat(item.total_project_value_minimum_ideal_8000_usd.replace('$', '').replace(',', ''));
      totalCount += parseInt(item.no_of_projects_minimum_ideal_18);
    });

    setTotalProjectValue(totalValue);
    setTotalProjectCount(totalCount);
  }

useEffect(() => {
  fetchData();
}, []);
  return (
    <>
    <TableData data={data} totalProjectValue={totalProjectValue} totalProjectCount={totalProjectCount}/>
    </>
  )
}

export default App
