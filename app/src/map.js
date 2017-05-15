(function(global) {
    var map1, map2;
    var marker1 = false, marker2 = false;

    function markerLocation(bool){
        //Get location.
        var currentLocation = bool ? marker1.getPosition() : marker2.getPosition();
        //Add lat and lng values to a field that we can save.
        document.getElementById(bool ? 'lat1' : 'lat2').value = currentLocation.lat(); //latitude
        document.getElementById(bool ? 'lng1' : 'lng2').value = currentLocation.lng(); //longitude
    }


    global.initMap = function initMap() {
        //The center location of our map.
        var centerOfMap = new google.maps.LatLng(48.899393389492054, 2.3291015625);
    
        //Map options.
        var options = {
            center: centerOfMap, //Set center.
            zoom: 7 //The zoom value.
        };
    
        //Create the map object.
        map1 = new google.maps.Map(document.getElementById('map1'), options);
        map2 = new google.maps.Map(document.getElementById('map2'), options);
    
        //Listen for any clicks on the map.
        google.maps.event.addListener(map1, 'click', function(event) {                
            //Get the location that the user clicked.
            var clickedLocation = event.latLng;
            //If the marker hasn't been added.
            if(marker1 === false){
                //Create the marker.
                marker1 = new google.maps.Marker({
                    position: clickedLocation,
                    map: map1,
                    draggable: true //make it draggable
                });
                //Listen for drag events!
                google.maps.event.addListener(marker1, 'dragend', function(event){
                    markerLocation(true);
                });
            } else{
                //Marker has already been added, so just change its location.
                marker1.setPosition(clickedLocation);
            }
            //Get the marker's location.
            markerLocation(true);
        });

        google.maps.event.addListener(map2, 'click', function(event) {                
            //Get the location that the user clicked.
            var clickedLocation = event.latLng;
            //If the marker hasn't been added.
            if(marker2 === false){
                //Create the marker.
                marker2 = new google.maps.Marker({
                    position: clickedLocation,
                    map: map2,
                    draggable: true //make it draggable
                });
                //Listen for drag events!
                google.maps.event.addListener(marker2, 'dragend', function(event){
                    markerLocation(false);
                });
            } else{
                //Marker has already been added, so just change its location.
                marker2.setPosition(clickedLocation);
            }
            //Get the marker's location.
            markerLocation(false);
        });
    };

    //Load the map when the page has finished loading.
    google.maps.event.addDomListener(window, 'load', initMap);
})(window);
        
        
