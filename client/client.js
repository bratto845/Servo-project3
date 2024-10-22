const centerCoords_div = document.getElementById('center-coords')
const servoListElem = document.querySelector('.servo-list')

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

    let content = document.createElement('h4')
    content.innerHTML = `<h4>${station.name}<br>${station.address}</h4>`

    let distance = document.createElement('span')
    distance.textContent = '0m'

    elem.appendChild(img)
    elem.appendChild(content)
    elem.appendChild(distance)

    return elem
}



let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    console.log(Map);

    map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    });

    let center = map.getCenter()
    centerCoords_div.textContent = center

    google.maps.event.addListener(map, 'dragend', () => {
        const newCenter = map.getCenter();
        centerCoords_div.textContent = newCenter

        console.log('New center:', newCenter.toJSON());
    });
}

initMap();

