
const serviceDetails = require('./service_details.json')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './service_details.csv',
    header: [
        {id: 'service', title: 'Service'},
        {id: 'aol', title: 'AoL equivalent'},
        {id: 'catchment_type', title: 'Catchment type'},
        {id: 'catchment_method', title: 'Catchment method'},
        {id: 'link_text', title: 'Service link text'},
        {id: 'service_url', title: 'Service link URL'},
        {id: 'onlineUrl', title: 'Online URL'},
        {id: 'onlineText', title: 'Online link text'}

    ]
})

const records = serviceDetails.map(function(serviceDetail) {
  let serviceRecord = {
    name: serviceDetail.name, 
    info: serviceDetail.info,
    service: serviceDetail.service,    
    aol: serviceDetail.aol,
    catchment_type: serviceDetail.catchment_type,
    catchment_method: serviceDetail.catchment_method,
    link_text: serviceDetail.link_text,
    service_url: serviceDetail.service_url,
    onlineUrl: serviceDetail.onlineUrl,
    onlineText: serviceDetail.onlineText
}
    return serviceRecord
})
console.log('records' + JSON.stringify(records))

csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done')
    })
    .catch(function(err) {
      console.log('error ' + err)
    }) 