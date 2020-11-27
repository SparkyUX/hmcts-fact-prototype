const courtDetails = require('./court_details.json')
const actionOrder = [
    {"action": "findNearest", "order": ["local","regional","national"]},
    {"action": "sendDocs", "order": ["regional","national","local"]},
    {"action": "getUpdate", "order": ["national","regional","local"]},
    {"action": "notListed", "order": ["national","regional","local"]}
  ]
const createCorTList = function(serviceArea, searchOrder, actionType) { 
  let searchListNames = []
  let distance = 0
  let searchOrderFound = false
  let regionalFlag =false
  let nationalFlag = false
  let searchResults = []
  let searchOrderAction = []
  // loop through the searchOrder
  for (let i=0; i < actionOrder.length; i++) {
    if (actionOrder[i].action == actionType) {
      for (let j=0; j < actionOrder[i].order.length; j++) {
        for (let k=0; k < searchOrder.length; k++) {
          if (actionOrder[i].order[j] == searchOrder[k]) {
            searchOrderAction.push(searchOrder[k])
          }     
        }       
      }
    }
  }
  console.log('searchOrderAction ' + JSON.stringify(searchOrderAction))
  for (i = 0; i < searchOrderAction.length; i++) {
    // loop through the courts and match the searchOrder catchment type to the court catchment type
    // if not found exit and try the next searchOption
    // if null skip it and try the next searchOption
    if (searchOrderAction[i] !== null) {
      // loop through courts
      for (let j=0; j < courtDetails.courts.length; j++) {
        // find courts with the same catchment type
        if (courtDetails.courts[j].catchment_type == searchOrderAction[i] ) { 
          if (typeof courtDetails.courts[j].distance == 'undefined') {
            distance = 0
          }
          else {
            distance = courtDetails.courts[j].distance
          }
          // does the court handle the service area 
          for (let k=0; k < courtDetails.courts[j].areas_of_law.length; k++) {

            if (courtDetails.courts[j].areas_of_law[k] == serviceArea) {    
              searchOrderFound = true
              let locationDetails = {
                name: courtDetails.courts[j].name,
                slug: courtDetails.courts[j].slug,
                distance: distance.toFixed(1),
                catchment_area : courtDetails.courts[j].catchment_area,
                catchment_type : courtDetails.courts[j].catchment_type
              }
              // if a regional or national we only want the first one
              searchListNames.push(locationDetails)
            }
          }
        }

        // if the searchOrder has courts then stop - we only want the first type
        
      }
    }        
    if (searchOrderFound) {
      break
    }
  }
  //  sort and return the results
  let searchListNamesSorted = searchListNames.sort(function(a, b) {
    return a.distance - b.distance
  })      
  if (searchListNamesSorted[0].catchment_type == "regional") {
     regionalFlag = true
  }
  if (searchListNamesSorted[0].catchment_type == "national") {
    nationalFlag = true
  }
  if (nationalFlag || regionalFlag) {
    searchResults = [searchListNamesSorted[0]]
  }
  else {
    searchResults = searchListNamesSorted
  }
  return {  
    "list": searchResults, 
    "regionalFlag": regionalFlag,
    "nationalFlag": nationalFlag
  }
} 

module.exports = createCorTList;