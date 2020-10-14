const startPageDetails = require('./service_details')

const getServiceUrls = function(serviceArea) { 
	let startPageRecord = []
	// initialise 
  	if (serviceArea === null) {
	}
	else {
	  for (let i=0; i < startPageDetails.length; i++ ) {
	    if (serviceArea === startPageDetails[i].service) {

	      startPageRecord = startPageDetails[i]
	    }
	  }
	}
  return startPageRecord;
};

module.exports = getServiceUrls;