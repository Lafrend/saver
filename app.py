from flask import Flask, render_template
import subprocess

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_server")
def start_server():
    print("Starting server...")
    subprocess.run(["node", "server.js"])
    return "Server started"

@app.route("/start_bot")
def start_bot():
    print("Starting bot...")
    subprocess.run(["node", "bot.js"])
    return "Bot started"

@app.route("/stop_processes")
def stop_processes():
    print("Stopping server and bot...")
    subprocess.run(["taskkill", "/F", "/IM", "node.exe", "/T"])
    return "Processes stopped"

if __name__ == "__main__":
    app.run(debug=True)
