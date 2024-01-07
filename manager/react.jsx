import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chart from 'chart.js/auto';

const App = () => {
  const [output, setOutput] = useState([]);
  const [serverStatus, setServerStatus] = useState({});
  const [botStatus, setBotStatus] = useState({});
  const [memoryData, setMemoryData] = useState({
    labels: [],
    serverMemory: [],
    botMemory: [],
  });

  const socket = io.connect("http://localhost:5000");

  useEffect(() => {
    // Обработка вывода в терминал
    socket.on('terminal_output', (data) => {
      setOutput((prevOutput) => [...prevOutput, data.output]);
    });

    // Обработка статуса сервера
    socket.on('server_process_status', (data) => {
      setServerStatus(data);
      updateMemoryData(data.memory, 'server');
    });

    // Обработка статуса бота
    socket.on('bot_process_status', (data) => {
      setBotStatus(data);
      updateMemoryData(data.memory, 'bot');
    });

    // Очистка данных графика при размонтировании компонента
    return () => {
      socket.disconnect();
    };
  }, []);

  const updateMemoryData = (memory, type) => {
    setMemoryData((prevData) => ({
      labels: [...prevData.labels, new Date().toLocaleTimeString()],
      serverMemory: type === 'server' ? [...prevData.serverMemory, memory] : prevData.serverMemory,
      botMemory: type === 'bot' ? [...prevData.botMemory, memory] : prevData.botMemory,
    }));
  };

  useEffect(() => {
    // Отрисовка графика
    const ctx = document.getElementById('memoryChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: memoryData.labels,
        datasets: [
          {
            label: 'Server Memory (MB)',
            data: memoryData.serverMemory,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
          },
          {
            label: 'Bot Memory (MB)',
            data: memoryData.botMemory,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [memoryData]);

  const handleButtonClick = (action, script) => {
    fetch(`/${action}/${script}`).then((response) => console.log(response.text()));
  };

  return (
    <div>
      <div>
        <button onClick={() => handleButtonClick('start', 'bridge')}>Start bridge</button>
        <button onClick={() => handleButtonClick('restart', 'bridge')}>Restart bridge</button>
        <button onClick={() => handleButtonClick('stop', 'bridge')}>Stop bridge</button>
        <button onClick={() => handleButtonClick('send', 'file')}>Send file</button>
      </div>
      <div>
        <button onClick={() => handleButtonClick('start', 'bot')}>Start Bot</button>
        <button onClick={() => handleButtonClick('restart', 'bot')}>Restart Bot</button>
        <button onClick={() => handleButtonClick('stop', 'bot')}>Stop Bot</button>
      </div>
      <div>
        <div>
          <h2>Server Monitor</h2>
          <p>PID: {serverStatus.pid || 'Not running'}</p>
          <p>Status: {serverStatus.running ? 'Running' : 'Stopped'}</p>
          <p>CPU: {serverStatus.cpu || '0'}</p>
          <p>Memory: {serverStatus.memory || '0'}</p>
        </div>
        <div>
          <h2>Bot Monitor</h2>
          <p>PID: {botStatus.pid || 'Not running'}</p>
          <p>Status: {botStatus.running ? 'Running' : 'Stopped'}</p>
          <p>CPU: {botStatus.cpu || '0'}</p>
          <p>Memory: {botStatus.memory || '0'}</p>
        </div>
      </div>
      <div>
        <h2>Terminal Output</h2>
        <ul>
          {output.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Memory Usage Chart</h2>
        <canvas id="memoryChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
};

export default App;
