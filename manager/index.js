const socket = io.connect(`http://${document.domain}:${location.port}`);
const outputList = document.getElementById("terminalOutput");
const serverMemoryChart = document
  .getElementById("serverMemoryChart")
  .getContext("2d");
const botMemoryChart = document
  .getElementById("botMemoryChart")
  .getContext("2d");
let serverMemoryData = [];
let botMemoryData = [];
let events = [];
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 300;

socket.on("terminal_output", function (data) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(data.output));
  outputList.appendChild(li);
  outputList.scrollTop = outputList.scrollHeight;
});

socket.on("server_process_status", (data) => {
  updateMonitor(
    "serverMonitor",
    serverMemoryData,
    data,
    serverMemoryChart,
    "Server Memory Usage",
    "red"
  );
  drawChart(serverMemoryData, serverMemoryChart, "Server Memory Usage", "red");
});

socket.on("bot_process_status", (data) => {
  updateMonitor(
    "botMonitor",
    botMemoryData,
    data
  );
  drawChart(botMemoryData, botMemoryChart, "Bot Memory Usage", "blue");
});
function updateMonitor(monitorId, dataArray, data) {
  const monitor = document.getElementById(monitorId);
  monitor.innerHTML = `
    <p>PID: ${data.pid || "Not running"}</p>
    <p>Status: ${data.running ? "Running" : "Stopped"}</p>
    <p>CPU: ${data.cpu || "0"}</p>
    <p>Memory: ${data.memory || "0"}</p>
  `;
  updateMemoryData(dataArray, data.memory);
}

function updateMemoryData(dataArray, value) {
  dataArray.push(value);
  if (dataArray.length > 60) {
    dataArray.shift();
  }
}

function drawChart(dataArray, ctx, label, color) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawScale(ctx);

  ctx.beginPath();
  ctx.moveTo(0, CANVAS_HEIGHT);

  dataArray.forEach((value, i) => {
    const x = (i / (dataArray.length - 1)) * (CANVAS_WIDTH - 30) + 30;
    const y = CANVAS_HEIGHT - (value / 100) * CANVAS_HEIGHT;
    ctx.lineTo(x, y);
  });

  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "black";
  ctx.fillText(label, 300, 10);

  ctx.stroke();
}

function drawScale(ctx) {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.moveTo(40, 0);
  ctx.lineTo(40, CANVAS_HEIGHT);
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.fillText("100 MB", 20, 10);
  ctx.fillText("0 MB", 15, CANVAS_HEIGHT - 10);
}

async function startProcess(process) {
  fetch(`/start/${process}`);
  sendEvent(`Started ${process}`, process.toLowerCase());

  console.log(await response.text());
  console.log(eventResponse);
}

async function restartProcess(process) {
  fetch(`/restart/${process}`);
  sendEvent(`Restarted ${process}`, process.toLowerCase());

  console.log(await response.text());
  console.log(eventResponse);
}

async function stopProcess(process) {
  fetch(`/stop/${process}`);
  sendEvent(`Stopped ${process}`, process.toLowerCase());

  console.log(await response.text());
  console.log(eventResponse);
}

function sendFile() {
  fetch("/send/file").then((response) => {
    console.log(response.text());
    sendEvent("Server File Sent", "server");
  });
}

function sendEvent(eventName, target) {
  const event = { timestamp: Date.now(), label: eventName, color: "red" };
  events.push(event);
}
