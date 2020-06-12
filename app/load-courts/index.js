// uplaod court data to locations file from CTF
const courtDetails = require('./court_details.json')

let courtLocationDetails = ( function(court) {

for (let i=0; i < courtDetails.length; i++) {
  for (let j=0; j < courtDetails.emails.length; j++) {

  }
  for (let j=0; j < courtDetails.contacts.length; j++) {
    
  }
  for (let j=0; j < courtDetails.addresses.length; j++) {
    
  }   
    for (let j=0; j < courtDetails.opening_times.length; j++) {
    
  } 


  let shortCourt = {
      "name": court.name,
      "address1": court.address
    }


    return shortCourt
}
})

console.log('shortcourt ' + shortCourt)
