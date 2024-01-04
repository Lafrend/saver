import os
import time
import requests
from flask import Flask, render_template
from threading import Thread
from tkinter import Tk, Button, Label, StringVar

app = Flask(__name__)
server_status = StringVar()
bot_status = StringVar()

@app.route("/")
def index():
    return render_template("index.html")

def check_server():
    global server_status
    server_url = "http://localhost:3000"  # Замените на ваш реальный URL сервера
    while True:
        try:
            response = requests.get(server_url)
            if response.status_code == 200:
                server_status.set("Сервер: активен")
            else:
                server_status.set("Сервер: неактивен")
        except requests.ConnectionError:
            server_status.set("Сервер: неактивен")
        except Exception as e:
            print("Error checking server:", e)
        finally:
            # Пауза между проверками
            time.sleep(5)

def check_bot():
    global bot_status
    bot_token = "6383982436:AAG1RMbPvlSEmYVYqG1YeyaehxYrQyEaowg"  # Замените на ваш токен бота
    while True:
        try:
            bot_info = requests.get(f"https://api.telegram.org/bot{bot_token}/getMe").json()
            if bot_info.get("ok"):
                bot_status.set("Бот: активен")
            else:
                bot_status.set("Бот: неактивен")
        except Exception as e:
            print("Error checking bot:", e)
        finally:
            # Пауза между проверками
            time.sleep(5)

def start_monitoring():
    # Запуск потока для мониторинга сервера и бота
    Thread(target=check_server).start()
    Thread(target=check_bot).start()

if __name__ == "__main__":
    # Запуск Flask в отдельном потоке
    Thread(target=app.run, kwargs={"port": 5000}).start()

    # GUI
    root = Tk()
    root.title("Мониторинг сервера и бота")

    start_button = Button(root, text="Начать мониторинг", command=start_monitoring)
    start_button.pack(pady=10)

    server_label = Label(root, textvariable=server_status)
    server_label.pack()

    bot_label = Label(root, textvariable=bot_status)
    bot_label.pack()

    root.mainloop()
