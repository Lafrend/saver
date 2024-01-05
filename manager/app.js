const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const outputQueue = [];

let bridgeProcess, botProcess;

async function sendFileToServer() {
  const serverEndpoint = "http://localhost:3000/sendToTelegram";
  const filePath = path.join(__dirname, "./icons/file.png");

  // Чтение файла в виде буфера
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    // Создание Blob из данных файла
    const fileBlob = new Blob([data]);

    // Отправка файла на сервер
    const formData = new FormData();
    formData.append("file", fileBlob, { filename: "file.png" });

    fetch(serverEndpoint, { method: "POST", body: formData })
      .then(handleResponse)
      .catch(handleError);
  });
}
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}
function handleError(error) {
  console.error("Error sending data to server:", error.message);
  handleNetworkError(error);
}
function handleNetworkError(error) {
  if (error.message.includes("ENOTFOUND")) {
    console.error(
      "Ошибка: Не удалось разрешить DNS. Возможно, проблемы с интернет-соединением."
    );
  } else {
    console.error("Другая ошибка сети:", error.message);
  }
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
      const process = spawn("node", [`./manager/${scriptName}.js`]);
      process.stdout.on("data", (data) => {
        const output = data.toString();
        outputQueue.push({ output });
        emitTerminalOutput();
      });

      process.stderr.on("data", (data) => {
        const output = data.toString();
        outputQueue.push({ output });
        emitTerminalOutput();
      });

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
      outputQueue.push({ output: `${
        scriptName.charAt(0).toUpperCase() + scriptName.slice(1)
      } ${action}ed` });
    } else if (action === "restart") {
      if (scriptName === "bridge") {
        stopProcess(bridgeProcess);
        bridgeProcess = startProcess();
      } else if (scriptName === "bot") {
        stopProcess(botProcess);
        botProcess = startProcess();
      }
      outputQueue.push({ output: `${
        scriptName.charAt(0).toUpperCase() + scriptName.slice(1)
      } ${action}ed` });
    } else if (action === "stop") {
      if (scriptName === "bridge") {
        stopProcess(bridgeProcess);
      } else if (scriptName === "bot") {
        stopProcess(botProcess);
      }
      outputQueue.push({ output: "Processes stopped" });
    } else if (action === "send") {
        await sendFileToServer();
        outputQueue.push({ output: "File sending initiated" });
      }
  } catch (error) {
    outputQueue.push({ output: { error: error.toString() } });
  }
}

function emitTerminalOutput() {
  const outputLine = outputQueue.shift();
  if (outputLine) {
    io.emit("terminal_output", outputLine);
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
  setInterval(emitTerminalOutput, 1000);
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
