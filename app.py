from flask import Flask, request, jsonify
from datetime import date
import requests
from bs4 import BeautifulSoup as bs
import requests
from googlesearch import search
import csv

app = Flask(__name__)
f = open('theme_db.csv', 'w')
writer = csv.writer(f)
writer.writerow(['Motion', 'Theme'])
f.close()

@app.get("/ping")
def get_ping():
    return "success"

@app.post("/theme")
def theme():
    s = request.get_json(force=True)
    f = open('theme_db.csv', 'w')
    writer = csv.writer(f)
    writer.writerow([s["motion"], s["theme"]])
    f.close()
    return "theme saved successfully"

@app.post("/thbt")
def scrape():
    s = request.get_json(force=True)
    print(s)
    
    # extract actor
    inp1 = ' '.join(s[0][1:])
    # extract action
    inp2 = ' '.join(s[3][1:])

    # code to scrape the information about actor
    query1 =  "wikipedia goals of" + inp1
    url = []
    for j in search(query1, tld="co.in", num=4, stop=4, pause=2):
        url.append(j)     
    print(url)
    for item in url:
        page = requests.get(item)
        soup = bs(page.content, 'html.parser')
        list(soup.children)
        for i in soup.find_all('p'):
            print(i.get_text())
    
    print("----------------------------------------------------------------------------------------------------------------------")

    # code to scrape the information about action
    query2 =  "wikipedia " + inp2
    url = []
    for j in search(query2, tld="co.in", num=4, stop=4, pause=2):
        url.append(j)     
    print(url)
    for item in url:
        page = requests.get(item)
        soup = bs(page.content, 'html.parser')
        list(soup.children)
        for i in soup.find_all('p'):
            print(i.get_text())

    return ("Successfully scraped information.")
