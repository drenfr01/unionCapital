/* global Geolocation:true */
/* global navigator */
/* global Promise */

Geolocation = function() {
  // Options for HTML5 navigator
  this.positionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 30000,
  };
};

Geolocation.prototype.getCurrentLocation = function getCurrentLocation() {
  const { positionOptions } = this;

  return new Promise((resolve) => {
    function success(position) {
      const coords = {
        userLat: position.coords.latitude,
        userLng: position.coords.longitude,
      };
      resolve(coords);
    }

    function error(err) {
      console.log(err);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, positionOptions);
    } else {
      error('Could not geolocate. navigator not available');
    }
  });
};
