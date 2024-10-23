function findDistance() {
    const origin = '-37.7880576,144.8050688'
    const destinations = '-37.796034000000,144.790355000000|-37.776064062000,144.817429768000|-37.803841100000,144.804298100000'

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=AIzaSyCJLO_VPUl-4awTUiBJwoGsVvtr_EGT2jc`

    fetch(url)
        .then(res => res.json())
        .then(data => console.log(data.rows[0].elements))
}

findDistance()