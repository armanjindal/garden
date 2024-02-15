> This isn't a comprehensive or final. It's a first pass with some of my points of interest (POIs) and an evolving note as I explore digital mapping & geolocation. 

Last Edit: February 15th, 2024. [History]()

Maps are beautiful. I could wax poetic, but a quick scan of early maps on the Wikipedia page on the [History of Cartography](https://en.wikipedia.org/wiki/History_of_cartography) does more than words ever could. [Never Lost Again](https://www.goodreads.com/en/book/show/35820393) tells the incredible story of Keyhole — the startup that became the web-based browser we've known as Google Maps. It gave me goosebumps. 

Instead of a traditional market analysis, this is a first principles look at mapping. By "first principles," I mean problem-first and jargon-free. I want to find where it's going and join the people who are building the future. 
# Maps

> Maps are a User Interface that displays data with a geospatial index. 

Maps are made of layers. The magic of digital maps is the ability to overlay these layers. It is a testament to standardization and interoperability that different data sources can work together. 

Geo-location is a dynamic map layer that shows where moving objects are. I am most interested in the interaction between dynamic and static map elements. How can we make maps more responsive to the change in the world that it attempts to model? 

## Problems 
- 1. Sourcing data 
- 2. Keeping it up to date
- 3. Stitching together multiple data sets. 
- 4. Precision 
- 5. Analyzing data
- 6. Developers tools to integrate maps/geolocation
- 7. Maps have historically been about the world: localized maps/indoor maps. 

These problems are faced in different ways across industries that rely on maps.

## Companies: 
- [Felt](https://felt.com/) 
	- Mission: Making map making "fun"
	- Problem: Map mapping software/Geospatial Information System (GIS) software is overpowered, hard to get started with, and Desktop first. 
	- Solution: Collaborative (web-based). Simple (upload anything). Accessible to a new generation of map makers. 
	- Customers:
		1. GIS professionals
		2. New to Maps - (i.e ME!) 
		3. Consumers - planning a hike,
	- Open Source: 
		- [Protomaps](https://protomaps.com/)
		- Tippecanoe
		- QGIS 

- Radar: 
	- Problem: Building geo-location (geofencing/location-fraud detection/mapping/tracking) is spread across different services and APIs. 
	- Solution - Standard API that works cross-platforms and developers love to use. 
	- Latest product - location spoofing detection (i.e VPNs)

- Uber: 
	- Problem: Maps are the first class objects (63% of screen real estate) and are hard to work with. 
	- Solution: Vis. gl - a set of Javascript / React tooling that makes building Map UI less difficult (it's still pretty hard). However, their open-source efforts have taken a back seat. 

- Esri - ArcGis
	- Problem: Accessing, visualizing and extracting insight from location data is complex
	- Solution: Software (primarily ArcGis)
	- Proprietary & Difficult to use for beginners. Well-established tool for "GIS professionals".

- KeyPlace.io
	- Problem: Joining Point of Interest datasets is difficult because of duplications. Since addresses 
	- Solution: Primary keys by creating a what@where string that uniquely identifies a place. 

- Bean.ai.
- SkyFi
### Open Source Players / Initiatives: 
- MapLibre - Forked from Mapbox V1 before they changed their license. Tries to maintain API parity with Mapbox. 
- OpenStreetMaps - Crowd sourced map data that is free to use and publicly accessible. 
- Overture - data partnership between everyone but Google to develop a standardized data schema. Helps with data joining and sharing. 


### Observations / Opportunities — Unbundle Discovery for Events
- The metaverse-sized failure of metaverse showed us we need to build tech that is immersive but not invasive (i.e, not compete with the real world). 
- Vision PRO => Spatial Computing? Whatever that means. 
- AI, misinformation, and screen fatigue will only contribute to our need to be outside of our screens with people.
- Google Maps is the leader in maps, and the primary way consumers interact with maps. There is an opportunity to unbundle.
- Localization & Real Time
- UI maps that are not based around the screen and the paper map. 
- Semantic querying — why can't I overlay many different layers and semantically query them? 

Building the [BlueSyncMaps](BlueSyncMaps) - an open source, tech collaborative mapping project to create a map UI that helps:
1. Crowdsource events — concerts, street performances, farmers markets, gigs.. 
2. Search them on a map — like "Chinese restaurants near me" except for the events. Adding a semantic layer. 

Waze meets Resident Advisor meets NYC local event board. 

Industry Terms:
- [Simultaneous localization and mapping - Wikipedia](https://en.m.wikipedia.org/wiki/Simultaneous_localization_and_mapping) - SLAM 
- Tiling: The process of breaking up a map into smaller pieces. Done to improve performance and make the experience smoother. 


Thanks for reading. If you have any thoughts and would be open to chat, please reach out! arman.jindal@hey.com

Acknowledgments: 
- Thanks [Christopher Beddow](https://www.linkedin.com/in/cbed/overlay/about-this-profile/) for being incredibly helpful and writing his awesome blog - [**worldbuilder.ch**](https://worldbuilder.substack.com/)
