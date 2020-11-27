// use the service area to determine the courts to display
const createCorTList = require('./createCorTList.js')
const getCourtDetails = function(serviceDetails, serviceActionType) {
  
  let postcodePage = true
  let nationalDisplayFlag = false
  let regionalDisplayFlag = false
  let ctscFlag = false
  let courtList = []
  let searchListNames = []
  let listNames = []
  let catchmentWeighting = 0
  let singleCourtDisplay = false
  let searchOrder =[]

  if (serviceDetails.catchment_type.indexOf('national') > -1) {
    nationalDisplayFlag = true
    catchmentWeighting = catchmentWeighting + 4
  }  
  if (serviceDetails.catchment_type.indexOf('regional') > -1) {
    regionalDisplayFlag = true 
    catchmentWeighting = catchmentWeighting + 2

  }
  if (serviceDetails.catchment_type.indexOf('local') > -1) {
    localDisplayFlag = true 
    catchmentWeighting = catchmentWeighting + 1

  }

  // this is the in-person type of court and will be held against the court in the DB
  if (nationalDisplayFlag || regionalDisplayFlag) {
    ctscFlag = true
  }

  switch(catchmentWeighting) {
    case 1:
    searchOrder = ["local",null,null]
    break
    case 2:
    searchOrder = [null,"regional",null]
    break
    case 3:
    searchOrder = ["local","regional",null]
    break
    case 4:
    searchOrder = ["national",null,null]
    break      
    case 5:
    searchOrder = ["local",null,"national"]
    break
    case 6:
    searchOrder = [null,"regional","national"]
    break
    case 7:
    searchOrder = ["local","regional","national"]
    break
    default:
    console.log('error: invalid catchment combination')
  }

  switch(serviceActionType) {
    case 'findNearest':
      if (catchmentWeighting == 4) {
        postcodePage = false
      }
      break
    case 'sendDocs':
      if (catchmentWeighting == 4 || catchmentWeighting == 5) {
        postcodePage = false
      }
      break
    default:
      if (catchmentWeighting > 3 ) {
        postcodePage = false
      }
      break
  }

  searchListNames = createCorTList(serviceDetails.aol,searchOrder,serviceActionType)
  return {
    "searchListNames": searchListNames.list, 
    "postcodePage": postcodePage, 
    "nationalFlag": searchListNames.nationalFlag, 
    "regionalFlag": searchListNames.regionalFlag
  }
}
module.exports = getCourtDetails