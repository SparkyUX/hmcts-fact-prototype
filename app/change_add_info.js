const courtDetails = require('./courtDetailsAll.json')
const fs = require('fs')
const courtDetailsPlus = []
function addDetails () {
  for (let i=0; i < courtDetails.courts.length; i++) {      
//    courtDetails.courts[i].ctsc = false
    courtDetails.courts[i].info = ""
//    courtDetails.courts[i].puas = false
    console.log(courtDetails.courts[i].name + ' ' + courtDetails.courts[i].catchment_area + ' ' +  courtDetails.courts[i].catchment_type)
    courtDetailsPlus.push(courtDetails.courts[i])
  }
    fs.writeFile('courtDetailsAll_no_info.json', JSON.stringify(courtDetailsPlus, null, 2), function (err) {
    if (err) throw err
  })
}
addDetails()