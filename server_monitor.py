import os
import subprocess
from tkinter import Tk, Button, Label

def start_server():
    print("Starting server...")
    subprocess.run(["node", "server.js"])

def start_bot():
    print("Starting bot...")
    subprocess.run(["node", "bot.js"])

def stop_processes():
    print("Stopping server and bot...")
    os.system("pkill -f 'node server.js'")
    os.system("pkill -f 'node bot.js'")

# GUI
root = Tk()
root.title("Управление сервером и ботом")

start_server_button = Button(root, text="Запустить сервер", command=start_server)
start_server_button.pack(pady=10)

start_bot_button = Button(root, text="Запустить бота", command=start_bot)
start_bot_button.pack(pady=10)

stop_button = Button(root, text="Остановить все", command=stop_processes)
stop_button.pack(pady=10)

status_label = Label(root, text="Статус: ожидание действий")
status_label.pack()

root.mainloop()
