from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit
import subprocess
import psutil
import threading
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

def start_process(script_name):
    try:
        print(f"Starting {script_name}...")
        subprocess.Popen(["node", f"{script_name}.js"])
        return f"{script_name.capitalize()} started"
    except Exception as e:
        return jsonify(error=str(e)), 500

def stop_processes():
    try:
        print("Stopping server and bot...")
        subprocess.run(["taskkill", "/F", "/IM", "node.exe", "/T"])
        return "Processes stopped"
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_server")
def start_server():
    return start_process("server")

@app.route("/start_bot")
def start_bot():
    return start_process("bot")

@app.route("/stop_processes")
def stop_processes_route():
    return stop_processes()

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)