const centerCoords_div = document.getElementById('center-coords')
const servoListElem = document.querySelector('.servo-list')
const servoStats = document.querySelector('.servo-stats')
const spotLight = document.querySelector('.spotlight')
const starDiv = document.querySelector('.star')


const clockWrapper = document.querySelector('.clock-temperature-wrapper')
const clockDiv = document.getElementById('clock')
const temperatureDiv = document.getElementById('temperature')
const suburb_Container = document.getElementById('postcodeSearch')
const postcodeResults = document.getElementById('postcodeResults')
const meterToggleBtn = document.querySelector('.meter-toggle-btn')
let counter = 0 

fetch('/api/stations/favourites')
.then(res => res.json())
.then(result => {
    starDiv.innerText = `${result.length} ⭐️`
})


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



// fetch('/api/stations')
//     .then(result => result.json())
//     .then(stations => {
//         for (let i = 0; i < 10; i++) {
//             servoListElem.appendChild(createStation(stations[i]))
//         }
//     })

// const createStation = station => {
//     let elem = document.createElement('div')
//     elem.className = 'servo-item'

//     let img = document.createElement('img')

//     let content = document.createElement('div')

//     let name = document.createElement('h4')
//     name.textContent = `${station.name}`

//     let address = document.createElement('h4')
//     address.textContent = `${station.address}`

//     let distance = document.createElement('span')
//     distance.textContent = '0m'

//     elem.appendChild(img)

//     content.appendChild(name)
//     content.appendChild(address)

//     elem.appendChild(content)
//     elem.appendChild(distance)

//     return elem
// }


function toggleClock() {
    temperatureDiv.classList.toggle('hidden')
    clockDiv.classList.toggle('hidden')
}

clockWrapper.addEventListener('click', toggleClock)



function fetchTemperature(latitude, longitude) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&forecast_days=1`)
        .then(response => response.json())
        .then(result => {
            // console.log(result.hourly.temperature_2m)
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


let centerLatitude_label = document.getElementById('center-latitude')
let centerLongitude_label = document.getElementById('center-longitude')

async function initMap(latitude, longitude, spotlight_name = '') {
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

    let [lat, lng] = center.toString().slice(1, -1).split(',')

    

    centerLatitude_label.textContent = lat
    centerLongitude_label.textContent = lng


    google.maps.event.addListenerOnce(map, 'idle', () => {
        let bounds = map.getBounds()
        createMarkers(bounds, spotlight_name)

        const newCenter = map.getCenter();
        let [lat, lng] = newCenter.toString().slice(1, -1).split(',')

        centerLatitude_label.textContent = lat
        centerLongitude_label.textContent = lng

        findNearestStations(lat, lng)
    })

    google.maps.event.addListener(map, 'zoom_changed', () => {
        let bounds = map.getBounds()
        createMarkers(bounds, spotlight_name)

    })

    google.maps.event.addListener(map, 'dragend', () => {
        const newCenter = map.getCenter();
        let [lat, lng] = newCenter.toString().slice(1, -1).split(',')

        centerLatitude_label.textContent = lat
        centerLongitude_label.textContent = lng

        let bounds = map.getBounds()
        createMarkers(bounds, spotlight_name)

        findNearestStations(lat, lng)
    });
}

let markerArr = []


async function createMarkers(bounds, spotlight_name) {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    let lat1 = bounds.bi.lo
    let lat2 = bounds.bi.hi

    let long1 = bounds.Gh.lo
    let long2 = bounds.Gh.hi

    let res = await fetch(`/api/stations/bounds?lat1=${lat1}&lat2=${lat2}&long1=${long1}&long2=${long2}`)

    let station = await res.json()

    removeAllMarkers(markerArr)

    for (let i = 0; i < station.length; i++) {
        const servoBrandImg = document.createElement("img");

        switch (station[i].owner) {
            case 'Caltex':
                servoBrandImg.src = './images/Caltex.png'
                break;
            case 'BP':
                servoBrandImg.src = './images/BP.png'
                break;
            case '7-Eleven Pty Ltd':
                servoBrandImg.src = './images/7-Eleven.svg'
                break;
            case 'Shell':
                servoBrandImg.src = './images/Shell.png'
                break;
            default:
                servoBrandImg.src = './images/Default.png'
                break;
        }

        servoBrandImg.style.width = "40px"
        servoBrandImg.style.height = "40px"

        let marker = new AdvancedMarkerElement({
            map,
            position: { lat: Number(station[i].latitude), lng: Number(station[i].longitude) },
            title: `${station[i].name}`,
            content: servoBrandImg,
        });
        
        let isWithinLat = lat1 <= marker.position.Fg && marker.position.Fg <= lat2
        let isWithingLong = long1 <= marker.position.Hg && marker.position.Hg <= long2
        let isWithinBounds = isWithinLat && isWithingLong

        if(!isWithinBounds) {
            markerArr.push(marker)
        }
     

        const contentString = `
        <div id="content">
         <h3 id="firstHeading" class="first-heading">${marker.title}</h1>
            <div id="bodyContent">
                <p>Address: ${station[i].address}</p>
                <p>Owner: ${station[i].owner}</p>
                <p>Lat: ${station[i].latitude}</p>
                <p>Lng: ${station[i].longitude}</p>
                <button class="save-btn" value="${station[i].id}">save</button>
            </div>
        </div>`

        const infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: `${marker.title}`,
        });

        if (spotlight_name === station[i].name) {
            infowindow.open({
                anchor: marker,
                map,
            });
        }

        infowindow.addListener('visible', (event) => {
            const saveBtn = document.querySelector('.save-btn');
                saveBtn.addEventListener('click', () => {
                    fetch(`/api/stations/${saveBtn.value}/save`, {
                        method: 'PATCH'                                       

                    })
                .then(res => res.json())
                .then(data => {
                    if (data[0].is_saved) {
                        fetch('/api/stations/favourites')
                            .then(res => res.json())
                            .then(result => {
                                starDiv.innerText = `${result.length} ⭐️`
                            })
                    }
                })  
            })
        })

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
            })
        })
    }
}

function removeAllMarkers(markerArr) {
    for (let i = 0; i < markerArr.length; i++) {
        markerArr[i].setMap(null)
    }

    markerArr = []
}


function submitPostcodeSearch(event) {
    event.preventDefault()

    let input = document.getElementById('postcodeSearch')

    let postcode = input.value

    fetch(`/api/postcode/${postcode}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            postcodeResults.innerHTML = ''
            for (let suburb of data) {
                let buttonElem = document.createElement('button')
                buttonElem.textContent = suburb.name
                postcodeResults.appendChild(buttonElem)

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


            h3Elem.innerHTML = `<h3>Total Station: ${data.total_stations}<br>Total Owners: ${data.total_owners}</h3>`
            for (let station of stationList) {
                let statsDiv = document.createElement('div')
                stationList.className = 'servo-brand'
                const contentString = `                            
                    <li class="stats-lines">
                        <span>${station.owner}</span> <span id= "stats-count">${station.count}</span> 
                    </li>                                           
                `
                statsDiv.innerHTML = contentString
                ulElem.appendChild(statsDiv)

            }
            servoStats.appendChild(h3Elem)
            servoStats.appendChild(ulElem)
        })


}
showStats()

async function showSpotlight() {

    let currentSpotlight = document.querySelector('.current-spotlight')

    if (currentSpotlight) {
        currentSpotlight.remove()

    }

    await fetch('/api/stations/random')
        .then(res => res.json())
        .then(data => {

            let spotlight_div = document.createElement('div')
            let spotlightTitle = document.createElement('a')
            let spotlightAddress = document.createElement('span')

            spotlightTitle.addEventListener('click', () => initMap(parseFloat(data.latitude), parseFloat(data.longitude), data.name))
            spotlightTitle.innerHTML = data.name
            spotlightAddress.innerHTML = data.address

            spotlight_div.appendChild(spotlightTitle)
            spotlight_div.appendChild(spotlightAddress)
            spotlight_div.className = 'current-spotlight'
            spotLight.appendChild(spotlight_div)
        })

}
showSpotlight()


async function lookupAddress(event) {
    event.preventDefault()

    const geocoder = new google.maps.Geocoder();

    let latlng = {
        lat: Number(centerLatitude_label.textContent),
        lng: Number(centerLongitude_label.textContent)
    }

    geocoder
        .geocode({ location: latlng })
        .then((response) => {
        if (response.results[0]) {

            let address = document.getElementById('center-address')
            address.textContent = response.results[0].formatted_address
        }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e))

}

let stationFilteredDetailList = []

function findNearestStations(lat, lng) {
    fetch(`http://localhost:4567/api/stations/nearest?lat=${lat}&long=${lng}&radius=3`)
        .then(res => res.json())
        .then(stations => {
            let destinations = ''

            stationFilteredDetailList = []

            for (let i = 0; i < 25 ; i++) {
                if(!stations[i]) {
                    break
                }

                destinations += `${stations[i].latitude},${stations[i].longitude}|`

                stationFilteredDetailList.push([stations[i].name, stations[i].owner, stations[i].latitude, stations[i].longitude])
            }
            console.log(`/api/stations/matrix?lat=${lat}&lng=${lng.trim()}&destinations=${destinations.slice(0, destinations.length - 1)}`)
            return fetch(`/api/stations/matrix?lat=${lat}&lng=${lng.trim()}&destinations=${destinations.slice(0, destinations.length - 1)}`)
        })
        .then(res => res.json())
        .then(data => {
            console.log('working')
            let stationDetails = []

            for (i = 0; i < stationFilteredDetailList.length; i++) {
                let [stationName, stationOwner, stationLatitude, stationLongitude] = stationFilteredDetailList[i]

                stationDetails.push(
                    {
                        name: stationName, 
                        owner: stationOwner,
                        latitude: stationLatitude,
                        longitude: stationLongitude,
                        address: data.destination_addresses[i],
                        distance: data.rows[0].elements[i].distance.text
                    }
                ) 
            }

            stationDetails.sort((a,b) => {
                const distanceA = parseFloat(a.distance);
                const distanceB = parseFloat(b.distance);

                return distanceA - distanceB;
            })
            
            servoListElem.innerHTML = ""

            console.log(stationDetails)

            for (let station of stationDetails) {
                // console.log("1")

                let stationImgSrc = ""

                switch (station.owner) {
                    case 'Caltex':
                        stationImgSrc = './images/Caltex.png'
                        break;
                    case 'BP':
                        stationImgSrc = './images/BP.png'
                        break;
                    case '7-Eleven Pty Ltd':
                        stationImgSrc = './images/7-Eleven.svg'
                        break;
                    case 'Shell':
                        stationImgSrc = './images/Shell.png'
                        break;
                    default:
                        stationImgSrc = './images/Default.png'
                        break;
                }
                
                let servoItem_Img = document.createElement('img')
                servoItem_Img.src = `${stationImgSrc}`
                servoItem_Img.className = 'servo-item-img'

                let servoItemDetails_Div = document.createElement('div')
                servoItemDetails_Div.className = "nearest-servo-details"

                let contentString = `
                                    <h4>${station.name}</h4>
                                    <p>${station.address}</p>
                                `
    
                let servoItem_Div = document.createElement('div')
                servoItem_Div.className = "servo-item"
                
                servoItemDetails_Div.innerHTML = contentString
                servoItem_Div.appendChild(servoItem_Img)
                servoItem_Div.appendChild(servoItemDetails_Div)

                let servoItem_Span = document.createElement('span')
                servoItem_Span.className = 'servo-distance'
                servoItem_Span.textContent = `${station.distance}`

                servoItem_Div.appendChild(servoItem_Span)

                servoListElem.appendChild(servoItem_Div)

                servoItemDetails_Div.addEventListener('click', () => initMap(parseFloat(station.latitude), parseFloat(station.longitude), station.name))
        
            }
        })
    }

meterToggleBtn.addEventListener('click', toggleDistance)

function toggleDistance() {
    const servoDistanceSpans = document.querySelectorAll('.servo-distance')

    for (span of servoDistanceSpans) {
        if (span.innerText.includes('km')) {
            span.innerText = parseFloat(span.innerText) * 1000 + ' m'
        } else {
            span.innerText = parseFloat(span.innerText) / 1000 + ' km'
        }
    }
}

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyB') {
        event.preventDefault();
        let sidebars = document.querySelectorAll('aside')

        for (let aside of sidebars) {
            if (aside.style.visibility === 'hidden') {
                aside.style.visibility = 'visible'
            } else {
                aside.style.visibility = 'hidden'
            }
        }
    }
});