const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()
const courtDetails =require('./locations.json')

// Add your routes here - above the module.exports line


// 0.1 what do you want to know about the CorT?


router.post('/search-route', function (req, res) {

  let knowLocation = req.session.data['know-location']
    
    if (knowLocation == 'yes') {
      res.redirect('/location/location-search')
    }
    else
    {    
      req.app.locals.continueService = true
      res.redirect('/service/service-choose-action') 
    }
 
})

// 2.0 Choose action


router.post('/choose-action', function (req, res) {

  let chooseAction = req.session.data['choose-action']
    switch (chooseAction) {
      case 'other':
        res.redirect('../exit')
      break
      case 'send-docs':
        req.app.locals.serviceActionType = "start"
        req.app.locals.continueService = false
        res.redirect('/service/service-category?action=start')
        break
      case 'case-update':
        req.app.locals.serviceActionType = "continueUpdate"
        req.app.locals.continueService = true
        res.redirect('/service/service-category?action=continueupdate')
      break
      case 'find-nearest':
        req.app.locals.serviceActionType = "continueFindHearingCentre"
        req.app.locals.continueService = true
        res.redirect('/service/service-category?action=continuehearingcentre')
      break
    }   

})

// 2.1, 2.2 Choose category

router.post('/choose-service-category', function (req, res) {

  let serviceCategory = req.session.data['choose-service-category']
  let pageServiceCategory = ""

  switch (serviceCategory) {
    case 'money':
      pageServiceCategory = 'service-area-money'
      break
    case 'deaths-marriages-civil-partnerships':
      pageServiceCategory = 'service-area-deaths-marriages-civil-partnerships'
    break
    case 'childcare-parenting':
      pageServiceCategory = 'service-area-childcare-parenting'
      break
    case 'high-courts':
      req.app.locals.childService = false
      req.app.locals.serviceCentre = false

      pageServiceCategory = 'service-search-postcode?servicearea=highcourts'
      break
    default:
      pageServiceCategory = 'unknown-service'
      break

  }

  res.redirect('/service/' + pageServiceCategory)


})

// 2.x.a second level service area

router.post('/choose-area', function (req, res) {

  let serviceArea = req.session.data['choose-service-area'] 
  serviceAreaQuery = serviceArea.replace(/ /g,"").toLowerCase()

  req.app.locals.serviceCentreProbate = false
  req.app.locals.serviceCentreDivorce = false
  req.app.locals.serviceCentreCivilPartnership = false
  req.app.locals.serviceCentreMoneyClaims = false
  req.app.locals.childService = false
  req.app.locals.serviceCentre = false

  console.log('serviceAreaQuery ' + serviceAreaQuery)

  switch (serviceAreaQuery) {
    case 'childarrangements':
      req.app.locals.childService = true
      console.log('childService ' + req.app.locals.childService)

      break
    case 'probate':
      req.app.locals.serviceCentre = true
      req.app.locals.serviceCentreProbate = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break
    case 'divorce':
      req.app.locals.serviceCentre = true
      req.app.locals.serviceCentreDivorce = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break    
    case 'civilPartnership':
      req.app.locals.serviceCentre = true
      req.app.locals.serviceCentreCivilPartnership = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break
    case 'moneyclaims':
      req.app.locals.serviceCentre = true
      req.app.locals.serviceCentreMoneyClaims = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break

  }
  if (req.app.locals.serviceCentre == true) {
    req.app.locals.serviceCentreSearch = serviceArea
    if (serviceAreaQuery == 'moneyclaims' && req.app.locals.serviceActionType == 'continueFindHearingCentre') {
        res.redirect('/service/service-search-postcode?servicearea=' + serviceAreaQuery)
    }
    res.redirect('/service/service-search-results-service-centre?servicearea=' + serviceAreaQuery)
  }
})

// 2.1.2 service postcode search

router.post('/service-postcode', function (req, res) {

  let serviceSearchPostcode = req.session.data['service-search-value'].toUpperCase();
  req.app.locals.serviceSearchPostcode = serviceSearchPostcode

  if ( serviceSearchPostcode.toLowerCase().includes("rg10") ) {
    res.redirect('/service/service-search-results-multiple')
  }
  else 
  {
     res.redirect('/service/service-search-results-single')

   }
})


router.get('/service/search-aol-results-multiple-div-centre', function(req, res) {
  var areaOfLaw = req.query.aol
  if (areaOfLaw == 'divorce') {
    displayAoL = 'Divorce'
  }
  else if (areaOfLaw == 'civilPartnership') { 
      displayAoL = 'Civil Partnership'
  }
  else {
        displayAoL = ' '
  }
  req.app.locals.displayAoL = displayAoL
  req.app.locals.aolPostcode = req.session.data['service-postcode'].toUpperCase(); 
  res.render('service/search-aol-results-multiple-div-centre')

})

router.get('/service/search-aol-results-multiple-ET', function(req, res) {
  var areaOfLaw = req.query.aol
  if (areaOfLaw == 'employment') {
    displayAoL = 'Employment'
  }
  else {
        displayAoL = ' '
  }
  req.app.locals.displayAoL = displayAoL
  req.app.locals.aolPostcode = req.session.data['service-postcode'].toUpperCase(); 
  res.render('service/search-aol-results-multiple-ET')

})

router.get('/service/search-aol-results-single-ccmcc', function(req, res) {
  var areaOfLaw = req.query.aol
  if (areaOfLaw == 'moneyClaims') {
      displayAoL = 'Money Claims'
  }
  else {
        displayAoL = ' '
  }
  req.app.locals.displayAoL = displayAoL
  req.app.locals.aolPostcode = req.session.data['service-postcode'].toUpperCase(); 
  res.render('service/search-aol-results-single-ccmcc')

})

router.post('/search-for-location', function (req, res) {

  let locationSearchValue = req.session.data['location-search-value'].toLowerCase();
  req.app.locals.locationSearch = req.session.data['location-search-value']

  let searchCourt = locationSearchValue.trim()
  req.app.locals.locationReading = ''
  req.app.locals.locationSlough = ''
  req.app.locals.locationWycombe = ''
  req.app.locals.locationWatford = ''
  req.app.locals.locationCCMCC = ''

  if (searchCourt.toLowerCase().includes('money','claims','salford','m5 oby')) {
    req.app.locals.locationCCMCC = 'ccmcc'
    res.redirect('/location/location-search-results-single?courtName=ccmcc')
  }

  switch(searchCourt) {
    case 'reading county court and family court' :
      req.app.locals.locationReading = 'readingccfc'
      res.redirect('/location/location-search-results-single?courtName=readingccfc')
    break
    case 'slough county court and family court' :
      req.app.locals.locationSlough = 'slough'
      res.redirect('/location/location-search-results-single?courtName=slough')
    break
    case 'high wycombe county court and family court' :
      req.app.locals.locationWycombe = 'wycombe'
      res.redirect('/location/location-search-results-single?courtName=wycombe')
    break
        case 'watford county court and family court' :
      req.app.locals.locationWatford = 'watford'
      res.redirect('/location/location-search-results-single?courtName=watford')
    break
    default :
      res.redirect('/location/location-search-results-multiple')
    break

  }

})


router.get('/individual-location-pages/generic', function(req, res) {
  var courtShortName = req.query.courtName
  console.log('courtName query string ' + courtShortName)
//    initialise display va;ues  
  req.app.locals.courtAddress1 = ""
  req.app.locals.courtAddress2 = "" 
  req.app.locals.courtAddress3 = ""
  req.app.locals.courtTown = ""
  req.app.locals.courtPostcode = ""
  req.app.locals.courtAddressVisit = ""
  req.app.locals.courtAddressWrite = ""
  req.app.locals.courtVisitWriteAddress = false
  req.app.locals.courtSeparateAddress = false
  req.app.locals.courtAdditionalInfo = ""
  req.app.locals.courtUrgentInfo = ""
  req.app.locals.courtOpenBuilding = ""
  req.app.locals.courtOpenCounter = ""



  for (let i=0; i < courtDetails.courts.length; i++) {
    if (courtShortName == courtDetails.courts[i].courtCode) {

      // name and address
      req.app.locals.courtName = courtDetails.courts[i].name
      for (let j=0; j < courtDetails.courts[i].addresses.length; j++) {
        console.log('type ' + courtDetails.courts[i].addresses[j].type)

        if (courtDetails.courts[i].addresses[j].type == "Visit us or write to us" ) {

          req.app.locals.courtVisitWriteAddress = true
          
          req.app.locals.courtVisitAddress1 = courtDetails.courts[i].addresses[j].address1 

          if (courtDetails.courts[i].addresses[j].address2) {
            req.app.locals.courtVisitAddress2 = courtDetails.courts[i].addresses[j].address2  
          }
          if (courtDetails.courts[i].addresses[j].address3) {
            req.app.locals.courtVisitAddress3 = courtDetails.courts[i].addresses[j].address3 
          }
          req.app.locals.courtVisitTown = courtDetails.courts[i].addresses[j].town 
          req.app.locals.courtVisitPostcode = courtDetails.courts[i].addresses[j].postcode
        }

        if (courtDetails.courts[i].addresses[j].type == "Visiting" ) {
          req.app.locals.courtSeparateAddress = true

          req.app.locals.courtVisitAddress1 = courtDetails.courts[i].addresses[j].address1 

          if (courtDetails.courts[i].addresses[j].address2) {
            req.app.locals.courtVisitAddress2 = courtDetails.courts[i].addresses[j].address2  
          }
          if (courtDetails.courts[i].addresses[j].address3) {
            req.app.locals.courtVisitAddress3 = courtDetails.courts[i].addresses[j].address3 
          }
          req.app.locals.courtVisitTown = courtDetails.courts[i].addresses[j].town 
          req.app.locals.courtVisitPostcode = courtDetails.courts[i].addresses[j].postcode

        }
        if (courtDetails.courts[i].addresses[j].type == "Postal" ) {
          req.app.locals.courtWriteAddress1 = courtDetails.courts[i].addresses[j].address1 

          if (courtDetails.courts[i].addresses[j].address2) {
            req.app.locals.courtWriteAddress2 = courtDetails.courts[i].addresses[j].address2  
          }
          if (courtDetails.courts[i].addresses[j].address3) {
            req.app.locals.courtWriteAddress3 = courtDetails.courts[i].addresses[j].address3 
          }
          req.app.locals.courtWriteTown = courtDetails.courts[i].addresses[j].town 
          req.app.locals.courtWritePostcode = courtDetails.courts[i].addresses[j].postcode

        }
      }
      // text fields
      req.app.locals.courtAdditionalInfo = courtDetails.courts[i].info
      req.app.locals.courtUrgentInfo = courtDetails.courts[i].urgent

      
      // opening times
      for (let j=0; j < courtDetails.courts[i].opening_times.length; j++) {
        if (courtDetails.courts[i].opening_times[j].description = "Court building open") {
          req.app.locals.courtOpenBuilding = courtDetails.courts[i].opening_times[j].hours
        }
        if (courtDetails.courts[i].opening_times[j].description = "Court counter open") {
          req.app.locals.courtOpenCounter = courtDetails.courts[i].opening_times[j].hours

        }
      }
      // contacts phone
      for (let j=0; j < courtDetails.courts[i].contacts.length; j++) {
        if (courtDetails.courts[i].contacts[j].description = "Enquiries") {
          req.app.locals.courtPhoneEnquiries = courtDetails.courts[i].contacts[j].number
        }
        if (courtDetails.courts[i].contacts[j].description = "DX") {
          req.app.locals.courtDXNumber = courtDetails.courts[i].contacts[j].number

        }
      }
      // contacts email
      for (let j=0; j < courtDetails.courts[i].emails.length; j++) {
        if (courtDetails.courts[i].emails[j].description = "Enquiries") {
          req.app.locals.courtEmailEnquiries = courtDetails.courts[i].emails[j].address
        }
        if (courtDetails.courts[i].emails[j].description = "Listing") {
          req.app.locals.courtEmailListing = courtDetails.courts[i].emails[j].address
        }
        if (courtDetails.courts[i].emails[j].description = "Bailiffs") {
          req.app.locals.courtEmailBaillifs = courtDetails.courts[i].emails[j].address
        }        
        if (courtDetails.courts[i].emails[j].description = "Family querie") {
          req.app.locals.courtEmailFamily = courtDetails.courts[i].emails[j].address
        }
      }
      // facilities
      for (let j=0; j < courtDetails.courts[i].facilities.length; j++) {
        if (courtDetails.courts[i].facilities[j].description = "Enquiries") {
          req.app.locals.courtEmailEnquiries = courtDetails.courts[i].facilities[j].description
        }
        if (courtDetails.courts[i].facilities[j].description = "Listing") {
          req.app.locals.courtEmailListing = courtDetails.courts[i].facilities[j].description
        }
        if (courtDetails.courts[i].facilities[j].description = "Bailiffs") {
          req.app.locals.courtEmailBaillifs = courtDetails.courts[i].facilities[j].description
        }        
        if (courtDetails.courts[i].facilities[j].description = "Family querie") {
          req.app.locals.courtEmailFamily = courtDetails.courts[i].facilities[j].description
        }
      }
    }
  }
    res.render('individual-location-pages/generic')

})
module.exports = router