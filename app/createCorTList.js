const courtDetails = require('./court_details.json')
const createCorTList = function(serviceArea) { 
  console.log('serviceArea ' + serviceArea)
  let searchListNames = []

  for (let i=0; i < courtDetails.courts.length; i++) {      
    for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
      if (courtDetails.courts[i].areas_of_law[j] == serviceArea) {
        let courtNameSlug = {
          name: courtDetails.courts[i].name,
          slug: courtDetails.courts[i].slug.toLowerCase(),
          distance: courtDetails.courts[i].distance
        }
        searchListNames.push(courtNameSlug)
      }
    }
  }

  // make the list a global variable and sort at the same time
 
  searchListNamesSorted = searchListNames.sort(function(a, b) {
  var distanceA = a.distance; 
  var distanceB = b.distance; 
  if (distanceA < distanceB) {
    return 1;
  }
  if (distanceA > distanceB) {
    return -1;
  }
  // distances must be equal
  return 0;
  })

  return searchListNamesSorted;

};

module.exports = createCorTList;