import React, { useState, useEffect } from 'react';
import Garden from './components/Garden';
import TaskInput from './components/TaskInput';
import axios from 'axios';
import Plant from './components/Plant';


function App() {
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    axios
      .get(`${API_URL}/tasks`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addTask = (description) => {
    axios
      .post(`${API_URL}/tasks`, { description })
      .then((response) => {
        setTasks([response.data, ...tasks])
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  };

  const fetchDailyReport = () => {
    axios
      .get(`${API_URL}/tasks/report/daily`)
      .then((response) => setReport(response.data))
      .catch((error) => console.error(error));
  };

  const fetchWeeklyReport = () => {
    axios
      .get(`${API_URL}/tasks/report/weekly`)
      .then((response) => setReport(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Reverse Todo List</h1>
      <TaskInput addTask={addTask} />
      <button onClick={fetchDailyReport}>Daily Report</button>
      <button onClick={fetchWeeklyReport}>Weekly Report</button>
      {report && (
        <div>
          <h2>Report</h2>
          <p>Total Tasks: {report.totalTasks}</p>
          <p>Completed Tasks: {report.completedTasks}</p>
          <p>Pending Tasks: {report.pendingTasks}</p>
        </div>
      )}
      <Garden tasks={tasks} />
      <Plant taskCount={tasks.length} />
    </div>
  );
}

export default App;
