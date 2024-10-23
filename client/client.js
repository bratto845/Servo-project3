const centerCoords_div = document.getElementById('center-coords')
const servoListElem = document.querySelector('.servo-list')
const servoStats = document.querySelector('.servo-stats')

const clockWrapper = document.querySelector('.clock-temperature-wrapper')
const clockDiv = document.getElementById('clock')
const temperatureDiv = document.getElementById('temperature')
const suburb_Container = document.getElementById('suburbs')



function updateTime() {
    const date = new Date()
    let hours = date.getHours()

    const day = date.toLocaleDateString([], { weekday: 'long' })
    let time = date.toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })



    if (hours > 5 && hours < 18) {
        const clockString = `${day}, ${time} 🌞`
        clockDiv.textContent = clockString
    } else if (hours > 18 && hours < 24) {
        const clockString = `${day}, ${time} 🌝`
        clockDiv.textContent = clockString
    } else {
        const clockString = `${day}, ${time} 🌝`
        clockDiv.textContent = clockString
    }
    
}
setInterval(updateTime, 1000) 



fetch('/api/stations')
    .then(result => result.json())
    .then(stations => {
        for (let i = 0; i < 10; i++) {
            servoListElem.appendChild(createStation(stations[i]))
        }
    })

const createStation = station => {
    let elem = document.createElement('div')
    elem.className = 'servo-item'

    let img = document.createElement('img')

    let content = document.createElement('div')

    let name = document.createElement('h4')
    name.textContent = `${station.name}`

    let address = document.createElement('h4')
    address.textContent = `${station.address}`

    let distance = document.createElement('span')
    distance.textContent = '0m'

    elem.appendChild(img)

    content.appendChild(name)
    content.appendChild(address)

    elem.appendChild(content)
    elem.appendChild(distance)

    return elem
}


function toggleClock(){ 
    temperatureDiv.classList.toggle('hidden')
    clockDiv.classList.toggle('hidden')
}

clockWrapper.addEventListener('click', toggleClock)



function fetchTemperature(latitude, longitude){
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&forecast_days=1`)
    .then(response => response.json())
    .then(result => {
        console.log(result.hourly.temperature_2m)
        let date = new Date()
        let hours = date.getHours()
        let temperature = result.hourly.temperature_2m[hours]
        temperatureDiv.innerText = temperature
    })

}



function getGeoLocation() {
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)
        initMap(latitude, longitude)
        fetchTemperature(latitude, longitude)
    }
    navigator.geolocation.getCurrentPosition(success)
}
getGeoLocation()

let map;

async function initMap(latitude, longitude) {
    const { Map } = await google.maps.importLibrary("maps");
    // console.log(Map);
    let zoom = 13;

    map = new Map(document.getElementById("map"), {
        center: { lat: latitude, lng: longitude },
        zoom: 13,
        minZoom: zoom - 5,
        maxZoom: zoom,
        mapId: "servoSpaMapId",
    });

    let center = map.getCenter()
    centerCoords_div.textContent = center

    google.maps.event.addListener(map, 'dragend', () => {
        const newCenter = map.getCenter();
        centerCoords_div.textContent = newCenter

        // console.log('New center:', newCenter);
    });

    createMarkers()
}


async function createMarkers() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    let res = await fetch('/api/stations/all')

    let test = await res.json()

    for (station of test) {
        const marker = new AdvancedMarkerElement({
            map,
            position: { lat: Number(station.latitude), lng: Number(station.longitude) },
            title: `${station.name}`,
        });


        const contentString = `
        <div id="content">
         <h3 id="firstHeading" class="first-heading">${marker.title}</h1>
            <div id="bodyContent">
                <p>Address: ${station.address}</p>
                <p>Owner: ${station.owner}</p>
                <p>Lat: ${station.latitude}</p>
                <p>Lng: ${station.longitude}</p>
            </div>
        </div>"`

        const infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: `${marker.title}`,
        });

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
            });
        });

    }
}



function submitPostcodeSearch(event) {
    event.preventDefault()

    let input = document.getElementById('postcodeSearch')

    let postcode = input.value

    fetch(`/api/postcode/${postcode}`)
        .then(response => response.json())
        .then(data => {
            suburb_Container.innerHTML = ''
            for (let suburb of data) {
                let buttonElem = document.createElement('button')
                buttonElem.textContent = suburb.name
                suburb_Container.appendChild(buttonElem)

            }
        })
}


async function showStats() {
    await fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
            const stationList = data.owners
            stationList.sort((a, b) => b.count - a.count)

            let h3Elem = document.createElement('h3')
            let ulElem = document.createElement('ul')
    

            h3Elem.innerHTML = `<h3>total station: ${data.total_stations}<br>total owners: ${data.total_owners}</h3>`
            for (let station of stationList) {
                let statsDiv = document.createElement('div')
                stationList.className = 'servo-brand'
                const contentString = `                            
                    <li>${station.owner}</li>
                    <span>${station.count}</span>                                            
                `
                statsDiv.innerHTML = contentString
                ulElem.appendChild(statsDiv)                       

            }
            servoStats.appendChild(h3Elem)
            servoStats.appendChild(ulElem)
        })   
    
    
}
showStats()



// initMap();
