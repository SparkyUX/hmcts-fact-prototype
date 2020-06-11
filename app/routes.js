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
      req.app.locals.serviceStartOrContinue = "continue"
      req.app.locals.continueService = true
      res.redirect('/service/service-category') 
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

      pageServiceCategory = 'service-search-postcode?serviceArea=highcourts'
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
  console.log('serviceAreaQuery ' + serviceAreaQuery)

  req.app.locals.displayArea = serviceArea
  console.log('define req.app.locals.displayArea ' + req.app.locals.displayArea)
  console.log('serviceAreaQuery ' + serviceAreaQuery)

  switch (serviceAreaQuery) {
    case 'childarrangements':
      req.app.locals.childService = true
      console.log('childService ' + req.app.locals.childService)

      break
    case 'probate':
      req.app.locals.serviceCentre = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break
    case 'divorce':
      req.app.locals.serviceCentre = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break    
    case 'civilPartnership':
      req.app.locals.serviceCentre = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break
    case 'moneyclaims':
      req.app.locals.serviceCentre = true
      console.log('serviceCentre ' + req.app.locals.serviceCentre)
      break
    default:
      req.app.locals.childService = false
      req.app.locals.serviceCentre = false

      break
  }


  if (req.app.locals.serviceStartOrContinue == 'start') {
    res.redirect('/service/service-start?serviceArea=' + serviceAreaQuery)
  }
  else
  {
    res.redirect('/service/service-search-postcode?serviceArea=' + serviceAreaQuery)
  }

})

// 2.2.2 service postcode search

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
      // contacts phone
      for (let j=0; j < courtDetails.courts[i].contacts.length; j++) {
        if (courtDetails.courts[i].contacts[j].description = "Enquiries") {
          req.app.locals.courtPhoneEnquiries = courtDetails.courts[i].contacts[j].number
        }
        if (courtDetails.courts[i].contacts[j].description = "DX") {
          req.app.locals.courtDXNumber = courtDetails.courts[i].contacts[j].number

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
}

/*
    switch (courtName) {
        case 'readingccfc':
          displayCourtName = 'Reading County Court and Family Court'
          displayCourtAddressVisitBuilding ='Hearing Centre'
          displayCourtAddressVisitStreet1 ='160-163 Friar Street'
          displayCourtAddressVisitStreet2 =''
          displayCourtAddressVisitTown = 'Reading'
          displayCourtAddressVisitPostcode = 'RG1 1HE'

          displayCourtAddressWriteBuilding =''
          displayCourtAddressWriteStreet1 =''
          displayCourtAddressWriteStreet2 =''
          displayCourtAddressWriteTown = ''
          displayCourtAddressWritePostcode = ''

        break
          case 'wycombe':
          displayCourtName = 'High Wycombe County Court and Family Court'
          displayCourtAddressVisitBuilding ='The Law Courts'
          displayCourtAddressVisitStreet1 ='Ground Floor'
          displayCourtAddressVisitStreet2 ='Easton Street'
          displayCourtAddressVisitTown = 'High Wycombe'
          displayCourtAddressVisitPostcode = 'HP11 1LR'

          displayCourtAddressWriteBuilding ='Administration Centre'
          displayCourtAddressWriteStreet1 ='Reading Count Court'
          displayCourtAddressWriteStreet2 ='160-163 Friar Street'
          displayCourtAddressWriteTown = 'Reading'
          displayCourtAddressWritePostcode = 'RG1 1HE'


        break
        case 'eastBerks':
          displayCourtName = "East Berkshire Magistrates' Court"
          displayCourtAddressVisitBuilding ='Hearing Centre'
          displayCourtAddressVisitStreet1 ='160-163 High Street'
          displayCourtAddressVisitStreet2 =''
          displayCourtAddressVisitTown = 'Slough'
          displayCourtAddressVisitPostcode = 'SL1 1BM'

          displayCourtAddressWriteBuilding =''
          displayCourtAddressWriteStreet1 =''
          displayCourtAddressWriteStreet2 =''
          displayCourtAddressWriteTown = ''
          displayCourtAddressWritePostcode = ''
        break
        case 'slough':
          displayCourtName = 'Slough County and Family Court'
          displayCourtAddressVisitBuilding ='Hearing Centre'
          displayCourtAddressVisitStreet1 ='160-163 High Street'
          displayCourtAddressVisitStreet2 =''
          displayCourtAddressVisitTown = 'Slough'
          displayCourtAddressVisitPostcode = 'PP1 1BM'

          displayCourtAddressWriteBuilding ='Administration Centre'
          displayCourtAddressWriteStreet1 ='Reading Count Court'
          displayCourtAddressWriteStreet2 ='160-163 Friar Street'
          displayCourtAddressWriteTown = 'Reading'
          displayCourtAddressWritePostcode = 'RG1 1HE'
        break
        case 'watford':
          displayCourtName = 'Watford County Court and Family Court'
          displayCourtAddressVisitBuilding ='Radius Hoiuse'
          displayCourtAddressVisitStreet1 ='51 Clarendon Road'
          displayCourtAddressVisitStreet2 =''
          displayCourtAddressVisitTown = 'Watford'
          displayCourtAddressVisitPostcode = 'WD17 1HP'
          
          displayCourtAddressWriteBuilding =''
          displayCourtAddressWriteStreet1 =''
          displayCourtAddressWriteStreet2 =''
          displayCourtAddressWriteTown = ''
          displayCourtAddressWritePostcode = ''
        break
        case 'ccmcc':
          displayCourtName = 'County Court Money Claims Centre (CCMCC)'
          displayCourtAddressVisitBuilding =''
          displayCourtAddressVisitStreet1 =''
          displayCourtAddressVisitStreet2 =''
          displayCourtAddressVisitTown = ''
          displayCourtAddressVisitPostcode = ''
          
          displayCourtAddressWriteBuilding ='County Court Money Claims'
          displayCourtAddressWriteStreet1 ='PO Box 527'
          displayCourtAddressWriteStreet2 =''
          displayCourtAddressWriteTown = 'Salford'
          displayCourtAddressWritePostcode = 'M5 0BY'
        break
        case 'watfordCcfc':
          displayCourtName = 'Watford County Court and Family Court'
        break          
        case 'centralLonET':
          displayCourtName = 'Central London Employment Tribunal'
        break
        case 'croydon':
          displayCourtName = 'Croydon Employment Tribunal'
        break
        case 'croydonCcfc':
          displayCourtName = 'Croydon County Court and Family Court'
        break
        case 'eastLonTHC':
          displayCourtName = 'East London Tribunal Hearing Centre'
        break
        case 'eastLonCcfc':
          displayCourtName = 'East London County Court and Family Court'
        break
        case 'westHantsMC':
          displayCourtName = "West Hampshire Magistrates' Court"
        break
        case 'westHantsCcfc':
          displayCourtName = 'West Hampshire County Court and Family Court'
        break
        case 'southampton':
          displayCourtName = 'Southampton Combined Court Centre'
        break
        case 'cambridge':
          displayCourtName = "Cambridge Magistrates' Court"
        break
        case 'cambridgeCcfc':
          displayCourtName = 'Cambridge County Court and Family Court'
        break
        case 'bristol':
          displayCourtName = 'Bristol Civil and Family Justice Centre'
        break
        case 'ashford':
          displayCourtName = 'Ashford Tribunal Hearing Centre'
        break
         default:
          displayCourtName = 'Central London County Court '
        break

    }
  
    req.app.locals.displayCourtName = displayCourtName
    req.app.locals.displayCourtAddressVisitBuilding = displayCourtAddressVisitBuilding
    req.app.locals.displayCourtAddressVisitStreet1 = displayCourtAddressVisitStreet1
    req.app.locals.displayCourtAddressVisitStreet2 = displayCourtAddressVisitStreet2
    req.app.locals.displayCourtAddressVisitTown = displayCourtAddressVisitTown
    req.app.locals.displayCourtAddressVisitPostcode = displayCourtAddressVisitPostcode

    req.app.locals.displayCourtAddressWriteBuilding = displayCourtAddressWriteBuilding
    req.app.locals.displayCourtAddressWriteStreet1 = displayCourtAddressWriteStreet1
    req.app.locals.displayCourtAddressWriteStreet2 = displayCourtAddressWriteStreet2
    req.app.locals.displayCourtAddressWriteTown = displayCourtAddressWriteTown
    req.app.locals.displayCourtAddressWritePostcode = displayCourtAddressWritePostcode
*/
    res.render('individual-location-pages/generic')

})
module.exports = router