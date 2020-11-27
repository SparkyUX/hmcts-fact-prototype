const serviceDetails = require('./service_details')
const getServiceDetails = function(serviceArea,areaOfLaw) { 
let serviceRecord = []
	// initialise 
  	if (serviceArea === null) {
//  		console.log('**** getServiceDetails areofLaw **** ' + areaOfLaw)

  		for (let i=0; i < serviceDetails.length; i++ ) {
		    if (areaOfLaw === serviceDetails[i].aol) {
		      serviceRecord = serviceDetails[i]
		    }
	  	}
	}
	else {
//  		console.log('**** getServiceDetails service **** ' + serviceArea)

	  	for (let i=0; i < serviceDetails.length; i++ ) {
		    if (serviceArea === serviceDetails[i].service) {

		      serviceRecord = serviceDetails[i]
		    }
		  }
	}
//	console.log('serviceRecord ' + JSON.stringify(serviceRecord))
  return serviceRecord;
};

module.exports = getServiceDetails;