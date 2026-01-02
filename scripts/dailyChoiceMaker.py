import json
import random
import os
from dotenv import load_dotenv

load_dotenv()


data = ""

with open(os.getenv("DATA_FILE"), "r") as json_data:
    data = json.load(json_data)

classic = random.choice(list(data.keys()))
splash = random.choice(list(data.keys())) 
while splash == classic:
    splash = random.choice(list(data.keys()))
detective = random.choice(list(data.keys()))
while detective == classic or detective == splash:
    detective = random.choice(list(data.keys()))

dict_to_dump = {"classic":classic, "splash":splash, "detective":detective}
dict_to_dump = json.dumps(dict_to_dump)


with open(os.getenv("DAILY_FILE"), "w") as daily:
    daily.write(dict_to_dump)