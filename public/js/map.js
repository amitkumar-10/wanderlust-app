mapboxgl.accessToken = mapToken;
	   
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 11
});

    console.log(coordinates);
    const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25}).setHTML(
                "<p>Exct Location will be provided after booking</p>"
            )
        )
        .addTo(map);

    
