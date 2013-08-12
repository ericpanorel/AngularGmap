'use strict';
gApp.controller('CtrlGMap',
    function CtrlGMap($scope) {
        // defaults for your business location and blurb
        var streetAddress = "5111 47 St NE  Calgary, AB T3J 3R2",
            Location = new google.maps.LatLng(51.098945, -113.970889),
            businessWriteup = "<b>Calgary Police Service</b><br/>Calgary's Finest<br/>",
            defaultFromAddress = 'Calgary',
            businessTitle = "Calgary Police Service",
            directionsService = new google.maps.DirectionsService(),
            directionsDisplay = new google.maps.DirectionsRenderer({
                draggable: true
            }),

            mapOptions = {
                center: Location,
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        // add your fixed business marker
        var contentString = businessWriteup + streetAddress,
          marker = new google.maps.Marker({
              position: Location,
              map: map,
              title: businessTitle,
              animation: google.maps.Animation.DROP
          });
        // show info Window
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directions'));


        $scope.fromAddress = defaultFromAddress;
        $scope.selectedOption = 'Driving';
        $scope.options = ['Driving', 'Walking', 'Bicycling', 'Transit'];
        $scope.totalKm = 0;

        $scope.setDirections = function () {
            var selectedMode = $scope.selectedOption.toUpperCase() || 'DRIVING',
                from = $scope.fromAddress || defaultFromAddress,
                request = {
                    origin: from,
                    destination: streetAddress,
                    travelMode: selectedMode,
                    provideRouteAlternatives: true,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    optimizeWaypoints: true
                };
            if (selectedMode === 'TRANSIT') {
                request.transitOptions = {
                    departureTime: new Date()
                };
            }

            directionsService.route(request, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    toastr.error(status);
                }
            });
        }

        // Try HTML5 geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude,
                                                 position.coords.longitude);
                //map.setCenter(Location);
                $scope.$apply(function () {
                    $scope.fromAddress = pos;
                });
                $scope.setDirections();
            });
        }







        google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {

            computeTotalDistance(directionsDisplay.directions);
            try {
                if (directionsDisplay.directions.routes[0].legs[0]) {

                    $scope.$apply(function () {
                        $scope.fromAddress = directionsDisplay.directions.routes[0].legs[0].start_address;
                    });
                }
            } catch (e) { }
        });

        // fire it up initially
        $scope.setDirections();
        // watch if the mode has changed
        $scope.$watch('selectedOption', function (newValue, oldValue) { $scope.setDirections(); });

        function computeTotalDistance(result) {
            var total = 0, i,
                myroute = result.routes[0];
            for (i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
            }
            total = total / 1000;
            $scope.$apply(function () {
                $scope.totalKm = total;
            });
        }

    }
);