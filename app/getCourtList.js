// use the service area to determine the courts to display
const createCorTList = require('./createCorTList.js')
const getCourtList = function(serviceDetails, serviceActionType) {
  
  let postcodePage = true
  let nationalDisplayFlag = false
  let regionalDisplayFlag = false
  let hasLocalOnly = false
  let ctscFlag = false
  let courtList = []
  let searchListNames = []
  let listNames = []

  
  console.log('serviceDetails ' + JSON.stringify(serviceDetails)) 
  if (serviceDetails.catchment_type.indexOf('national') > -1) {
    nationalDisplayFlag = true
  }  
  if (serviceDetails.catchment_type.indexOf('regional') > -1) {
   regionalDisplayFlag = true 
  }
  if (!nationalDisplayFlag && !regionalDisplayFlag) {
    hasLocalOnly = true
  }
  if (nationalDisplayFlag || regionalDisplayFlag) {
    ctscFlag = true
  }
  console.log('national ' + nationalDisplayFlag + ' regional ' + regionalDisplayFlag + ' local ' + hasLocalOnly)

  console.log('serviceActionType ' + serviceActionType)
// get the list of courts in distance order from the postcode
// prototype only logic - distance is held on the court record

  if (serviceActionType == 'notListed' || serviceActionType == 'findNearest') {
    console.log('*** not listed or find nearest ***')
  // don't display the ctsc in the list of courts in the results 
  // prototype only logic
    nationalDisplayFlag = false
    listNames = createCorTList(serviceDetails.aol,false,null)

  //if regional centre return the first found
  // prototype only logic
    if (regionalDisplayFlag) {
      for (i=0; i < listNames.length; i++) {
        if (listNames[i].catchment_type === 'regional') {
          courtList.push(listNames[i])
          searchListNames = courtList
          regionalDisplayFlag = true
          break
        }
      }
    }
    // exclude the national service centre (ctsc)
    else if (nationalDisplayFlag) {
      for (i=0; i < listNames.length; i++) {
        if (listNames[i].catchment_type === 'national') {
        }
        else {
          courtList.push(listNames[i])
        }
        searchListNames = courtList
      }
    }
    else {
      searchListNames = listNames
    }
    postcodePage = true
  }

  // if action send docs or get update 
  else {
    if (nationalDisplayFlag == false) {
      console.log('*** NOT CTSC ***')

      postcodePage = true
      if (regionalDisplayFlag) {
        console.log('*** NOT National but Regional Centre ***')
        listNames = createCorTList(serviceDetails.aol,true,"regional")
        searchListNames.push(listNames[0])
      }
      else {
      searchListNames = createCorTList(serviceDetails.aol,false,null)
      }
    }
    else {
      if (serviceActionType == 'getUpdate') {
        console.log('*** IS get update and IS national centre ***')
        nationalDisplayFlag = true
        postcodePage = false
        searchListNames = createCorTList(serviceDetails.aol,true,"national")
      }
      else if (regionalDisplayFlag) {
        console.log('*** send docs IS regional centre ***')
        postcodePage = true
        listNames = createCorTList(serviceDetails.aol,true,"regional")
        // use the first one found
        searchListNames.push(listNames[0])
      }
      else {
        console.log('*** send docs IS national centre and NOT regional centre ***')
        nationalDisplayFlag = true
        postcodePage = false
        searchListNames = createCorTList(serviceDetails.aol,true,"national")

      }
    }
  }
  console.log('getCourtList searchListNames ' + JSON.stringify(searchListNames))
  console.log('getCourtList postcodePage ' + JSON.stringify(postcodePage))
  console.log('getCourtList nationalDisplayFlag ' + JSON.stringify(nationalDisplayFlag))
  return {
    "searchListNames": searchListNames, 
    "postcodePage": postcodePage, 
    "nationalDisplayFlag": nationalDisplayFlag, 
    "regionalDisplayFlag": regionalDisplayFlag
  }
}
module.exports = getCourtList;