let getCoordinates = {}; 

 function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  getCoordinates = {latitude:position.coords.latitude,longitude:position.coords.longitude};
}
getLocation();

export {getCoordinates}
