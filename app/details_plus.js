const courtDetails = require('./courtDetailsAll.json')
const fs = require('fs')
const courtDetailsPlus = []
function addDetails () {
  for (let i=0; i < courtDetails.courts.length; i++) {      
    courtDetails.courts[i].ctsc = false
    courtDetails.courts[i].puas = false
    console.log('courtdetails ' + courtDetails.courts[i].name + ' ' + courtDetails.courts[i].puas)
    courtDetailsPlus.push(courtDetails.courts[i])
  }
    fs.writeFile('courtDetailsPlus.json', JSON.stringify(courtDetailsPlus, null, 2), function (err) {
    if (err) throw err
  })
}
addDetails()