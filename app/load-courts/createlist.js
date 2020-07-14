// uplaod court data to locations file from CTF
const courtDetails = require('../court_details.json')
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
    console.log('name ' + courtName)
// loop through addresses
    for (let j=0; j < courtDetails.courts[i].addresses.length; j++) {
      let searchDetails = ""
//ignore the write to us address
  console.log('courtDetails.courts[i].ctsc_flag ' + courtDetails.courts[i].ctsc_flag)
      if (courtDetails.courts[i].addresses[j].type == "Visit us or write to us" || courtDetails.courts[i].addresses[j].type == "Visiting" || (courtDetails.courts[i].addresses[j].type == "Postal" && courtDetails.courts[i].ctsc_flag == "Y")) {
          console.log('address' + courtDetails.courts[i].addresses[j].address)
          let address = courtDetails.courts[i].addresses[j].address.replace(/!/g," ")
          let townName = courtDetails.courts[i].addresses[j].town
          let postCode = courtDetails.courts[i].addresses[j].postcode

          let searchDetails = [courtName, address, townName, postCode, courtCode]

          let additionalSearchDetails = 
            '\n\t"' + courtCode + '": {\n' +
            '\t\t"postCode": "' + postCode + '",\n' + 
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
// write html macro for select element 
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