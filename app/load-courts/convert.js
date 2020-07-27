// uplaod court data from courts csv file to a JSON file for the search facility
const CSVToJSON = require('csvtojson')
const fs = require('fs')


CSVToJSON().fromFile('court-visit-addresses.csv')
.then(courts => {
  fs.writeFile('courts-search.json', JSON.stringify(courts, null, 4), (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON array is saved.")
  })
}).catch(err => {

    console.log(err)
})
