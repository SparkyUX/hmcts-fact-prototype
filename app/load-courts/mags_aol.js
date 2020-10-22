// uplaod court data to locations file from CTF
const courtDetails = require('../courtDetailsPlusOld.json')
const fs = require('fs')

for (let i=0; i < courtDetails.courts.length; i++) {
  if (courtDetails.courts[i].types.indexOf("Magistrates' Court")>-1) {
    console.log('courtDetails.courts[i].name ' + courtDetails.courts[i].name)
    courtDetails.courts[i].areas_of_law.push('Minor crimes')
  }
}
fs.writeFile('../courtDetailsPlus.json', JSON.stringify(courtDetails, null,2), function (err) {
    if (err) throw err;
  })