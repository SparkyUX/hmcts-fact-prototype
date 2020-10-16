const courtDetails = require('./court_details.json')
const rp = require('request-promise')
const apiKey = "hDOqrwaXbAHkpCIcElJ3b7nuVWvJX5FAPx8myuSW"
const mapit = 'https://mapit.mysociety.org/postcode/'
const geolib = require('geolib')
let courtCount = 10


const createCorTList = function(serviceArea, postcode, regionalFlag) { 
  console.log('serviceArea ' + serviceArea)
  console.log('postcode ' + postcode)
  if (regionalFlag) {
    courtCount = 1
  }

// find the coordinates of the entered postcode
  let urlMapit = mapit + postcode + '?api_key=' + apiKey
  let options = {
    uri:urlMapit,
    resolveWithFullResponse: true,
    simple: false,
    json: false
  } 
  rp(options)
  .then(function(response) {
    let mapitJson = JSON.parse(response.body)
    console.log('response.wg84_lat ' + JSON.stringify(response.wgs84_lat))
    if (typeof mapitJson.error  == 'undefined') {
      return coordsPostcode = {"latitude": response.wgs84_lat,"longitude": response.wgs84_lon}
//      console.log('coordsPostcode ' + JSON.stringify(coordsPostcode))
    }
    else {
      return mapitJson.error
    }
  })
  .then(function(postcodeCoords) {
    let searchListNames = []
    for (let i=0; i < courtDetails.courts.length; i++) {      
      for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {

        if (courtDetails.courts[i].areas_of_law[j] == serviceArea) {
          let courtCoords = {"latitude": courtDetails.courts[i].lat,"longitude": courtDetails.courts[i].lon}
          let courtDistance = geolib.convertDistance(geolib.getDistance(postcodeCoords, courtCoords), 'mi')

          let courtList = {
            name: courtDetails.courts[i].name,
            slug: courtDetails.courts[i].slug.toLowerCase(),
            distance: courtDistance.toFixed(1)
          }
          searchListNames.push(courtList)
        }
      }
    }
    searchListNamesSorted = searchListNames.sort(function(a, b) {
      return a.distance - b.distance
    });


    return searchListNamesSorted.slice(0, 10)
  })
  
};

module.exports = createCorTList;