const centerCoords_div = document.getElementById('center-coords')
const servoListElem = document.querySelector('.servo-list')
const servoStats = document.querySelector('.servo-stats')
const spotLight = document.querySelector('.spotlight')

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
    
    google.maps.event.addListenerOnce(map, 'idle', () => {
        let bounds = map.getBounds()
        createMarkers(bounds)
    })

    google.maps.event.addListener(map, 'zoom_changed', () => {
        let bounds = map.getBounds()
        // createMarkers(bounds)

    }) 
    
    google.maps.event.addListener(map, 'dragend', () => {
        const newCenter = map.getCenter()
        centerCoords_div.textContent = newCenter
        let bounds = map.getBounds()
            
        createMarkers(bounds)
    })
}


async function createMarkers(bounds) {
    // delete everything made from google map markers

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    let lat1 = bounds.di.lo
    let lat2 = bounds.di.hi

    let long1 = bounds.Hh.lo
    let long2 = bounds.Hh.hi

    let res = await fetch(`/api/stations/bounds?lat1=${lat1}&lat2=${lat2}&long1=${long1}&long2=${long2}`)

    let statio = await res.json()

    let markerArr = []

    for (let i = 0; i < statio.length; i++) {
        const servoBrandImg = document.createElement("img");

        switch (statio[i].owner) {
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
            position: { lat: Number(statio[i].latitude), lng: Number(statio[i].longitude) },
            title: `${statio[i].name}`,
            content: servoBrandImg,
        });

        markerArr.push(marker)

        const contentString = `
        <div id="content">
         <h3 id="firstHeading" class="first-heading">${marker.title}</h1>
            <div id="bodyContent">
                <p>Address: ${statio[i].address}</p>
                <p>Owner: ${statio[i].owner}</p>
                <p>Lat: ${statio[i].latitude}</p>
                <p>Lng: ${statio[i].longitude}</p>
            </div>
        </div>"`

        const infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: `${marker.title}`,
        });
        // if (spotLightStationBool) {
        //     infowindow.open({
        //         anchor: marker,
        //         map,
        //     });
        // }

        markerArr[i].addListener("click", () => {
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

async function showSpotlight() {

    let currentSpotlight = document.querySelector('.current-spotlight')

    if (currentSpotlight) {
        currentSpotlight.remove()

    }



    await fetch('/api/stations/random')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            
            let spotlight_div = document.createElement('div')
            let spotlightTitle = document.createElement('a')
            let spotlightAddress = document.createElement('span')

            spotlightTitle.addEventListener('click',() => initMap(parseFloat(data.latitude), parseFloat(data.longitude)))
            spotlightTitle.innerHTML = data.name
            spotlightAddress.innerHTML = data.address

            spotlight_div.appendChild(spotlightTitle)
            spotlight_div.appendChild(spotlightAddress)
            spotlight_div.className = 'current-spotlight'
            spotLight.appendChild(spotlight_div)
        })

}
showSpotlight()

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
