// uplaod court data to locations file from CTF
const courtDetails = require('./court_details.json')
const fs = require('fs')

let courtLocationDetails = []
let searchDetails = ""


function main() {

  for (let i=0; i < courtDetails.courts.length; i++) {

    let courtName = courtDetails.courts[i].name
    console.log('name ' + courtName)


    for (let j=0; j < courtDetails.courts[i].addresses.length; j++) {
      let searchDetails = ""
      if (courtDetails.courts[i].addresses[j].type == "Visit us or write to us" || courtDetails.courts[i].addresses[j].type == "Postal") {
          let address = courtDetails.courts[i].addresses[j].address.replace(/!/g,", ")
          let townName = courtDetails.courts[i].addresses[j].town
          let postCode = courtDetails.courts[i].addresses[j].postcode

          let searchDetails = courtName + ', ' + address + ', ' + townName + ', ' + postCode
          courtLocationDetails.push(searchDetails)
        }
      }
    }
  var stream = fs.createWriteStream('courtSearchDetails.txt', {flags: 'a'});

  for (i=0; i < courtLocationDetails.length; i++) {
    stream.write(courtLocationDetails[i] + "\n")
  }    
  stream.end();

}
main()