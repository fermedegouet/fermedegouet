// ferme-map.js
var marker = L.latLng(latitude, longitude);
var map = L.map('fermemap').setView(marker, 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 18,
}).addTo(map);

var breadIcon = L.icon ({
  iconUrl: '/img/marker-icon.png',
  shadowUrl: '/img/marker-shadow.png',
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41]
});

L.marker(marker, {icon: breadIcon}).addTo(map);
