// create the search list for I know the name search

const courtDetails = require('../court_details.json')
const courtsSearch = require('../court_search.json')
const fs = require('fs')

let courtLocationDetails = []
let courtAdditionalDetails = []
let searchDetails = []
let courtCode = ""
let courtLocationCode = ""
let additionalSearchDetails = ""



function main() {
// loop through courts

  for (let i=0; i < courtDetails.courts.length; i++) {
// fetch the court code
    let courtLocationCode = courtDetails.courts[i].crown_location_code || courtDetails.courts[i].county_location_code || courtDetails.courts[i].magistrates_location_code
    let courtName = courtDetails.courts[i].name
    let courtCode = courtDetails.courts[i].court_code
// loop through addresses
    for (let j=0; j < courtDetails.courts[i].addresses.length; j++) {
      let searchDetails = ""
//ignore the write to us address
      if (courtDetails.courts[i].addresses[j].type == "Visit us or write to us" || courtDetails.courts[i].addresses[j].type == "Visiting" || (courtDetails.courts[i].addresses[j].type == "Postal" && courtDetails.courts[i].ctsc)) {
          let address = courtDetails.courts[i].addresses[j].address.replace(/!/g," ")
          let townName = courtDetails.courts[i].addresses[j].town
          let postCode = courtDetails.courts[i].addresses[j].postcode

          let searchDetails = [courtName, address, townName, postCode, courtCode]

          let additionalSearchDetails = 
            '\n\t"' + courtCode + '": {\n' +
            '\t\t"locationCode": "' + courtLocationCode + '"\n\t},'

          courtLocationDetails.push(searchDetails)
          courtAdditionalDetails.push(additionalSearchDetails)
      }
// remove the last comma
      if (i === courtDetails.courts.length - 1) {
        courtAdditionalDetails[i] = courtAdditionalDetails[i].substring(0, courtAdditionalDetails[i].length - 1)

      }
    }
  }
// repeat for all other courts in the search list
  console.log('courtLocationDetails ' + courtLocationDetails)

  for (let i=0; i < courtsSearch.courts_search.length; i++) {
    console.log('courtsSearch.courts_search ' + courtsSearch.courts_search[i].name)

    if (courtLocationDetails[0].includes(courtsSearch.courts_search[i].name)) {
      // do nothing
      console.log('courtsSearch.courts_search[i].name ' + courtsSearch.courts_search[i].name)
    } 
    else
    {
  
  // fetch the court code
      let courtLocationCode = courtsSearch.courts_search[i].number
      let courtName = courtsSearch.courts_search[i].name
      let courtCode = courtsSearch.courts_search[i].slug
      let searchDetails = ""
  // address
      let address = courtsSearch.courts_search[i].address.replace(/!/g," ")
      let townName = courtsSearch.courts_search[i].town_name
      let postCode = courtsSearch.courts_search[i].postcode

      let searchDetailsAllCourts = [courtName, address, townName, postCode, courtCode]

      let additionalSearchDetails = 
        '\n\t"' + courtCode + '": {\n' +
        '\t\t"locationCode": "' + courtLocationCode + '"\n\t},'

      courtLocationDetails.push(searchDetailsAllCourts)
      courtAdditionalDetails.push(additionalSearchDetails)
  // remove the last comma
      if (i === courtsSearch.courts_search.length - 1) {
        courtAdditionalDetails[i] = courtAdditionalDetails[i].substring(0, courtAdditionalDetails[i].length - 1)

      }
    }
  }
// write html for select element 
  var stream = fs.createWriteStream('../views/includes/court-location-details.html', {flags: 'w'});
  stream.write('<option value="" disabled selected></option>\n')
  let courtLocationDetailsSorted = courtLocationDetails.sort()
  for (i=0; i < courtLocationDetailsSorted.length; i++) {
    stream.write(' <option value="' + courtLocationDetailsSorted[i][4] + '">' 
      + courtLocationDetailsSorted[i][0] +  ', ' + courtLocationDetailsSorted[i][1] + ', ' + courtLocationDetailsSorted[i][2] + ', ' + courtLocationDetails[i][3] + '</option>\n')
  }  
  stream.end();
// write json for additional search items
  var stream = fs.createWriteStream('additional-Search-Details.json', {flags: 'w'});
  stream.write('{')

  for (i=0; i < courtAdditionalDetails.length; i++) {
    stream.write(courtAdditionalDetails[i])
  }   
  stream.write('\n}')
 
  stream.end();


}
main()