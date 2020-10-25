const courtDetails = require('./court_details.json')
const createCorTList = function(serviceArea, singleLocation, centreType) { 
//  console.log('createCorTList serviceArea ' + serviceArea)
//  console.log('createCorTList singleLocation ' + singleLocation)
  let searchListNames = []

  if (singleLocation) {
    for (let i=0; i < courtDetails.courts.length; i++) {   
      if (courtDetails.courts[i].catchment_type === centreType ) { 

        for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
        // does the court handle the service area 
          if (courtDetails.courts[i].areas_of_law[j] == serviceArea) {    
//            console.log('createCorTList details ' + JSON.stringify(courtDetails.courts[i].name))
            let locationDetails = {
              name: courtDetails.courts[i].name,
              slug: courtDetails.courts[i].slug.toLowerCase(),
              distance: 0,
              catchment_area : courtDetails.courts[i].catchment_area,
              catchment_type : courtDetails.courts[i].catchment_type
            }
//            console.log('*** single Location *** ' + JSON.stringify(locationDetails)) 
            
            searchListNames.push(locationDetails)
          }
        }
      }
    }
  }
  else {
    for (let i=0; i < courtDetails.courts.length; i++) {   
      for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
      // does the court handle the service area 
        if (courtDetails.courts[i].areas_of_law[j] == serviceArea) {    
          let locationDetails = {
            name: courtDetails.courts[i].name,
            slug: courtDetails.courts[i].slug.toLowerCase(),
            distance: courtDetails.courts[i].distance.toFixed(1),
            catchment_area : courtDetails.courts[i].catchment_area,
            catchment_type : courtDetails.courts[i].catchment_type
          }
          searchListNames.push(locationDetails)
        }
      }      
    }
  }
  //  sort and return the results at the same time
  searchListNamesSorted = searchListNames.sort(function(a, b) {
    return a.distance - b.distance
  });
//  console.log('searchListNamesSorted ' + JSON.stringify(searchListNamesSorted))
  return searchListNamesSorted;

};

module.exports = createCorTList;
