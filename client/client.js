const centerCoords_div = document.getElementById('center-coords')

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