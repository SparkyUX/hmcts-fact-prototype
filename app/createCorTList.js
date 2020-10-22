const courtDetails = require('./court_details.json')
const createCorTList = function(serviceArea, singleLocation) { 
  console.log('serviceArea ' + serviceArea)
  console.log('singleLocation ' + singleLocation)
  let searchListNames = []

  for (let i=0; i < courtDetails.courts.length; i++) {   
    
    for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
      // does the court handle the service area 
      if (courtDetails.courts[i].areas_of_law[j] == serviceArea) {    
        // if the court is a CTSC or regional centre return it

        if (singleLocation && (courtDetails.courts[i].catchment_type == 'national' || courtDetails.courts[i].catchment_type == 'regional')) {  
          console.log('details ' + JSON.stringify(courtDetails.courts[i].name))
          let locationDetails = {
          name: courtDetails.courts[i].name,
          slug: courtDetails.courts[i].slug.toLowerCase(),
          distance: 0,
          catchment_area : courtDetails.courts[i].catchment_area,
          catchment_type : courtDetails.courts[i].catchment_type
          }
          console.log('*** single Location *** ' + JSON.stringify(locationDetails)) 
          
          searchListNames.push(locationDetails)
          break
        }
        else {
        // otherwise add to the array
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

  return searchListNamesSorted;

};

module.exports = createCorTList;