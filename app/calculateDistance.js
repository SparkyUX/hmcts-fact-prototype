const courtDetails = require('./couertDetailsPlus.json')
const rp = require('request-promise')
const apiKey = "hDOqrwaXbAHkpCIcElJ3b7nuVWvJX5FAPx8myuSW"
const geolib = require('geolib')
const mapit = 'https://mapit.mysociety.org/postcode/'


const calculateDistance = function(postcode) {
  
  let urlMapit = mapit + postcode + '?api_key=' + apiKey
  let validPC = {}
  let options = {
    uri:urlMapit,
    resolveWithFullResponse: true,
    simple: false,
    json: false
  } 
  rp(options)
  .then(function(response) {
    let mapitJson = JSON.parse(response.body)
    if (typeof mapitJson.error  == 'undefined') {
      coordsPostcode = {"lat": wgs84_lat,"lon": wgs84_lon}
      console.log('coordsPostcode ' + JSON.stringify(coordsPostcode))
    }
  })
  .then(function(coordinates) {
  let allCourtCoords = []
    for (let i=0; i < courtDetails.courts.length; i++) {      
      distanceFromPC = geolib.getDistance(coordinates, {
        "latitude": courtDetails.courts[i].lon,
        "longitude": courtDetails.courts[i].lon},
      }
      distanceMiles = geolib.convertDistance(distanceFromPC, 'mi')
      
      let courtDistance = {"courtSlug":courtDetails.courts[i].slug,"distance": distanceMiles}
      
      allCourtCoords.push(courtDistance) 

  })
  .then(function(allDistances) {
    let sortedDistance = allDistances.sort(function(a, b){
      return a.distance - b.distance
    })
    console.log ('sortedDistance ' + sortedDistance)
    return var items = sortedDistance.slice(0, 10)
  })

  .catch(function(err) {
    console.log('error ' + err)
  })


};

module.exports = calculateDistance;


fetchPostcodefromCSV()
//
// check that the json postcodes are > 4 chars in length remove short PCs and save to json file
