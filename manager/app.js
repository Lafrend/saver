const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const pidusage = require('pidusage');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const outputQueue = [];

let bridgeProcess, botProcess;

async function sendFileToServer() {
  try {
    const serverEndpoint = "http://localhost:3000/sendToTelegram";
    const filePath = path.join(__dirname, "./icons/file.png");

    // Асинхронное чтение файла
    const data = await fs.promises.readFile(filePath);

    const fileBlob = new Blob([data]);
    const formData = new FormData();
    formData.append("file", fileBlob, { filename: "file.png" });

    const response = await fetch(serverEndpoint, {
      method: "POST",
      body: formData,
    });
    handleResponse(response);
  } catch (error) {
    handleError(error);
  }
}
function handleResponse(response) {
  if (!response.ok) {
    logOutput(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}
function handleError(error) {
  logOutput(`Error sending data to server:${error.message}`)
  handleNetworkError(error);
}
function handleNetworkError(error) {
  if (error.message.includes("ENOTFOUND")) {
    logOutput("Ошибка: Не удалось разрешить DNS. Возможно, проблемы с интернет-соединением.");
  } else {
    logOutput(`Другая ошибка сети:${error.message}`);
  }
}
function cfl(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function logOutput(output) {
  outputQueue.push({ output });
}
async function manageProcess(scriptName, action) {
  try {
    const actions = {
      start: `Starting ${scriptName}...`,
      restart: `Restarting ${scriptName}...`,
      stop: `Stopping ${scriptName}...`,
      send: `Sending file to server...`,
    };

    outputQueue.push({ output: actions[action] });

    const startProcess = () => {
      const process = spawn("node", [`${scriptName}.js`]);
      process.stdout.on("data", (data) => logOutput(data.toString()));
      process.stderr.on("data", (data) => logOutput(data.toString()));
      return process;
    };

    const stopProcess = (process) => {
      if (process) {
        process.kill();
        process.unref();
        process = null;
      }
    };

    if (action === "start") {
      if (scriptName === "bridge") {
        bridgeProcess = startProcess();
      } else if (scriptName === "bot") {
        botProcess = startProcess();
      }
      logOutput(`${cfl(scriptName)} ${action}ed`);
    } else if (action === "restart") {
      if (scriptName === "bridge") {
        stopProcess(bridgeProcess);
        bridgeProcess = startProcess();
      } else if (scriptName === "bot") {
        stopProcess(botProcess);
        botProcess = startProcess();
      }
      logOutput(`${cfl(scriptName)} ${action}ed`);
    } else if (action === "stop") {
      if (scriptName === "bridge") {
        stopProcess(bridgeProcess);
      } else if (scriptName === "bot") {
        stopProcess(botProcess);
      }
      logOutput("Processes stopped");
    } else if (action === "send") {
      await sendFileToServer();
      logOutput("File sending initiated");
    }
  } catch (error) {
    logOutput({ error: error.toString() });
  }
}
async function emitTerminalOutput() {
  const outputLine = outputQueue.shift();
  if (outputLine) {
    io.emit("terminal_output", outputLine);
  }
}
async function bridgeStatus() {
    const serverProcessStatus = await getProcessInfo(bridgeProcess);
    io.emit("server_process_status", serverProcessStatus);
}
async function botStatus() {
    const botProcessStatus = await getProcessInfo(botProcess);
    io.emit("bot_process_status", botProcessStatus);
}
async function getProcessInfo(process) {
  if (process) {
    try {
      const stats = await pidusage(process.pid);
      return {
        pid: process ? process.pid : null,
        running: process ? !process.killed : false,
        memory: stats.memory / (1024 * 1024),
        cpu: stats.cpu,
      };
    } catch (error) {
      logOutput(`Error getting process resources: ${error}`);
      return {
        pid: process ? process.pid : null,
        running: process ? !process.killed : false,
        memory: "-",
        cpu: "-",
      };
    }
  } else {
    return {
      pid: process ? process.pid : null,
      running: process ? !process.killed : false,
      memory: "-",
      cpu: "-",
    };
  }
}
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Новые роуты для управления скриптами
app.get("/:action/:script", async (req, res) => {
  const { action, script } = req.params;
  const result = await manageProcess(script, action);
  res.send(result);
});

io.on("connect", (socket) => {
  setInterval(async () => {
    await emitTerminalOutput();
    await botStatus();
    await bridgeStatus();
  }, 1000);
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
