const startPageDetails = [
	{"service":"Adoption","url":"https://www.gov.uk/child-adoption/applying-for-an-adoption-court-order","online":"","onlineText":""},
	{"service":"Bankruptcy","url":"https://www.gov.uk/bankruptcy","online":"https://www.gov.uk/apply-for-bankruptcy","onlineText":""},
	{"service":"Benefits","url":"https://www.gov.uk/appeal-benefit-decision","online":"https://www.gov.uk/appeal-benefit-decision/submit-appeal","onlineText":"Appeal a benefits decision online"},
	{"service":"Child arrangements","url":"https://www.gov.uk/looking-after-children-divorce","online":"https://apply-to-court-about-child-arrangements.service.justice.gov.uk/","onlineText":""},
	{"service":"Civil partnership","url":"https://www.gov.uk/end-civil-partnership","online":"","onlineText":"Dissolve a civil partnership online"},
	{"service":"Claims against employers","url":"https://www.gov.uk/employment-tribunals","online":"","onlineText":""},
	{"service":"Divorce","url":"https://www.gov.uk/divorce","online":"https://www.gov.uk/apply-for-divorce","onlineText":"Apply for a divorce online"},
	{"service":"Domestic abuse","url":"https://www.gov.uk/injunction-domestic-violence","online":"","onlineText":""},
	{"service":"Forced marriage","url":"https://www.gov.uk/apply-forced-marriage-protection-order","online":"","onlineText":""},
	{"service":"Female Genital Mutilation","url":"https://www.gov.uk/government/collections/female-genital-mutilation","online":"","onlineText":""},
	{"service":"Housing possession","url":"https://www.gov.uk/evicting-tenants","online":"https://www.gov.uk/possession-claim-online-recover-property","onlineText":"Make or responding to a possession claim online"},
	{"service":"Immigration and asylum","url":"https://www.gov.uk/immigration-asylum-tribunal","online":"","onlineText":""},
	{"service":"Money claims","url":"https://www.gov.uk/make-court-claim-for-money","online":"https://www.gov.uk/make-money-claim","onlineText":"Make a money claim online"},
	{"service":"Probate","url":"https://www.gov.uk/applying-for-probate","online":"https://www.gov.uk/applying-for-probate/apply-for-probate","onlineText":"Apply for probate online"},
	{"service":"Tax","url":"https://www.gov.uk/tax-tribunal","online":""}
	]

const getServiceUrls = function(serviceArea) { 
	let startPageRecord = []
	// initialise 
  	if (serviceArea === null) {
	}
	else {
	  for (let i=0; i < startPageDetails.length; i++ ) {
	    if (serviceArea === startPageDetails[i].service) {

	      console.log('fn startPageDetails[i].service ' + startPageDetails[i].service)          
	      startPageRecord = startPageDetails[i]
	    }
	  }
	}
  return startPageRecord;
};

module.exports = getServiceUrls;