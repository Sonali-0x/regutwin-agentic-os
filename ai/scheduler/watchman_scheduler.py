import schedule
import time

def heartbeat():
    print("Watchman running...")

schedule.every(6).hours.do(heartbeat)

while True:
    schedule.run_pending()
    time.sleep(1)