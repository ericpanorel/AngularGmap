'use strict';
gApp.controller('CtrlGMap2',
    function CtrlGMap2($scope) {
        $scope.gmap = {
            fromAddress: 'Calgary',
            streetAddress: "5111 47 St NE  Calgary, AB T3J 3R2",
            businessWriteup: "<b>Calgary Police Service</b><br/>Calgary's Finest<br/>",
            businessTitle: "Calgary Police Service",
            Lon: -113.970889,
            Lat: 51.098945,
            showError: function (status) {
                toastr.error(status);
            }
        };
    });