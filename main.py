from flask import Flask, request
import json
from geolib import geohash
import requests

app = Flask(__name__)

# API 
ticketmaster_API = ''

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/search", methods = ["GET"])
def search():
    values = request.args
    values = values.to_dict()
    
    mappings = {'Music' : 'KZFzniwnSyZfZ7v7nJ', 'Sports': 'KZFzniwnSyZfZ7v7nE','Arts': 'KZFzniwnSyZfZ7v7na', 'Theatre': 'KZFzniwnSyZfZ7v7na', 'Film': 'KZFzniwnSyZfZ7v7nn', 'Miscellaneous':'KZFzniwnSyZfZ7v7n1', 'Default': ''}

    keyword = values['keyword']
    distance = values['distance_miles']
    segmentId = mappings[values['category']]
    geo_hash = geohash.encode(values['latitude'], values['longitude'], 7)
     
    ticketmaster_url = f'https://app.ticketmaster.com/discovery/v2/events.json?apikey={ticketmaster_API}&keyword={keyword}&segmentId={segmentId}&radius={distance}&unit=miles&geoPoint={geo_hash}'
    
    response = requests.get(ticketmaster_url)
    response = response.json()
    response = json.dumps(response)
    return response

@app.route("/search/id", methods = ["GET"])
def searchEventDetails():
    values = request.args
    values = values.to_dict()
    event_id = values['eventid'] 
    
    ticketmaster_url = f'https://app.ticketmaster.com/discovery/v2/events/{event_id}?apikey={ticketmaster_API}&'
    
    response = requests.get(ticketmaster_url)
    response = response.json()
    response = json.dumps(response)
    return response

@app.route("/search/venue", methods = ["GET"])
def searchVenueDetails():
    values = request.args
    values = values.to_dict()
    name = values['name'] 
    
    ticketmaster_url = f'https://app.ticketmaster.com/discovery/v2/venues?apikey={ticketmaster_API}&keyword={name}'
    
    response = requests.get(ticketmaster_url)
    response = response.json()
    response = json.dumps(response)
    return response

if __name__ == "__main__":
    app.run(debug = True)