const serviceDetails = require('./service_details')
const courtDetails = require('./court_details')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function getServiceCourtDetails() { 
	let courtServiceAreaDetails = []
	console.log('courtDetails.courts.length ' + courtDetails.courts.length)
	console.log('courtDetails.courts' + JSON.stringify(courtDetails.courts))

	for (let i=0; i < serviceDetails.length; i++ ) {
		console.log('courtDetails.courts.length ' + courtDetails.courts.length)
		let service_area_local = ""
		let service_area_regional = ""
		let service_area_national = ""

		for (let j=0; j < courtDetails.courts.length; j++) {
			for (let k=0; k<courtDetails.courts[j].areas_of_law.length; k++) {
				if (courtDetails.courts[j].areas_of_law[k] === serviceDetails[i].aol) {

					if (serviceDetails[i].catchment_type.includes("local")) {
						service_area_local = "yes"
					}
					if (serviceDetails[i].catchment_type.includes("regional")) {
						service_area_regional = "yes"
					}  						
					if (serviceDetails[i].catchment_type.includes("national")) {
						 service_area_national = "yes"
					}
//					console.log('catchment_method ' + catchment_method)
					details = {
						"service_area" : serviceDetails[i].service,
						"areas_of_law" : serviceDetails[i].aol,
						"service_area_local" : service_area_local,
						"service_area_regional" : service_area_regional,
						"service_area_national" : service_area_national,
						"court_catchment" : courtDetails.courts[j].catchment_type,						
						"catchment_method" : serviceDetails[i].catchment_method,
						"court_slug" : courtDetails.courts[j].slug
					}
					courtServiceAreaDetails.push(details)
				}
			}
		}
	}
	const csvWriter = createCsvWriter({
	    path: 'service_area_court_aol.csv',
	    header: [
	        {id: 'service_area', title: 'Service area'},
	       	{id: 'areas_of_law', title: 'Area of Law equivalent'},
	        {id: 'service_area_local', title: 'Local service catchment'},
	        {id: 'service_area_regional', title: 'Regional service catchment'},
	        {id: 'service_area_national', title: 'National service catchment'},
	        {id: 'court_catchment', title: 'Court catchment'},
	       	{id: 'catchment_method', title: 'Catchment method'},
	        {id: 'court_slug', title: 'Court slug'}
	    ]
	})
	console.log('details' + JSON.stringify(courtServiceAreaDetails))
	const records = courtServiceAreaDetails

	csvWriter.writeRecords(records)       // returns a promise
	    .then(() => {
	        console.log('...Done');
	    });
}


getServiceCourtDetails()




