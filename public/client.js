console.log('let us go on lunch');

let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    console.log(Map);

    map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    });
}

initMap();