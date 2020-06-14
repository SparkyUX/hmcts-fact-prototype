const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()
const courtDetails =require('./court_details.json')

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

// 2.1 choose category

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

// 2.1.a second level service area

router.post('/choose-area', function (req, res) {

  let serviceArea = req.session.data['choose-service-area'] 
  serviceAreaQuery = serviceArea.replace(/ /g,"").toLowerCase()
  req.app.locals.serviceArea = serviceArea

  req.app.locals.serviceCentreProbate = false
  req.app.locals.serviceCentreDivorce = false
  req.app.locals.serviceCentreCivilPartnership = false
  req.app.locals.serviceCentreMoneyClaims = false
  req.app.locals.childService = false
  req.app.locals.serviceCentre = false   
  
  req.app.locals.moneyClaimsService = false
  req.app.locals.probateService = false
  req.app.locals.housingPossessionService = true
  req.app.locals.bankruptcyService = false
  req.app.locals.benefitsService = false
  req.app.locals.employmentService = false
  req.app.locals.taxService = false
  req.app.locals.divorceService = false
  req.app.locals.civilPartnershipService = false
  req.app.locals.domesticAbuseService = false
  req.app.locals.forcedMarriageService = false
  req.app.locals.childService = false
  req.app.locals.childArrangementsService = false
  req.app.locals.adoptiionService = false
  req.app.locals.FGMService = false


  console.log('serviceAreaQuery ' + serviceAreaQuery)

  switch (serviceAreaQuery) {

    case 'moneyclaims':
      req.app.locals.serviceCentre = true
      req.app.locals.moneyClaimsService = true
      break   

    case 'probate':
      req.app.locals.serviceCentre = true
      req.app.locals.probateService = true
      break

    case 'housingpossession':
      req.app.locals.housingPossessionService = true
      break

    case 'bankruptcy':
      req.app.locals.bankruptcyService = true
      break

    case 'benefits':
      req.app.locals.benefitsService = true
      break

    case 'claimsagainstemployers':
      req.app.locals.employmentService = true
      break

    case 'tax':
      req.app.locals.taxService = true
      break

    case 'divorce':
      req.app.locals.serviceCentre = true
      req.app.locals.divorceService = true
      break
    
    case 'civilpartnership':
      req.app.locals.serviceCentre = true
      req.app.locals.civilPartnershipService = true
      break    

    case 'domesticabuse':
      req.app.locals.domesticAbuseService = true
      break

    case 'forcedmarriage':
      req.app.locals.forcedMarriageService = true
      break

    case 'childarrangements':
      req.app.locals.childService = true
      req.app.locals.childArrangementsService = true
      break

    case 'adoption':
      req.app.locals.adoptiionService = true
      break

    case 'femalegenitalmutilation':
      req.app.locals.FGMService = true
      break

  }
  if (req.app.locals.serviceCentre == true) {
    req.app.locals.serviceCentreSearch = serviceArea
    if ((serviceAreaQuery == 'moneyclaims' && req.app.locals.serviceActionType == 'continueFindHearingCentre' )
      || serviceAreaQuery == "divorce" || serviceAreaQuery == "civilpartnership" ) {
        res.redirect('/service/service-search-postcode?servicearea=' + serviceAreaQuery)
    }
    else {
      res.redirect('/service/service-search-results-service-centre?servicearea=' + serviceAreaQuery)
    }
  }
  res.redirect('/service/service-search-postcode?servicearea=' + serviceAreaQuery)

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


router.get('/service/service-search-results-multiple', function(req, res) {
  var serviceArea = req.query.serviceArea
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
  
  console.log('courtDetails.courts.length ' + courtDetails.courts.length)

  for (let i=0; i < courtDetails.courts.length; i++) {
    if (courtShortName == courtDetails.courts[i].court_code) {

      // name
      req.app.locals.courtName = courtDetails.courts[i].name
      // court codes
      req.app.locals.courtCodeCounty = courtDetails.courts[i].county_location_code
      req.app.locals.courtCodeCrown = courtDetails.courts[i].crown_location_code
      req.app.locals.courtCodeMagistrates = courtDetails.courts[i].magistrates_location_code

      // addresses
        console.log('courtDetails.courts[i].addresses.length ' + courtDetails.courts[i].addresses.length)

      for (let j=0; j < courtDetails.courts[i].addresses.length; j++) {
        console.log('type ' + courtDetails.courts[i].addresses[j].type)
        console.log('address ' + courtDetails.courts[i].addresses[j].address)

        let addressSplit = courtDetails.courts[i].addresses[j].address.split('!')
        console.log('addressSplit ' + addressSplit[0] + ' ' + addressSplit[1] + addressSplit[2])

        if (courtDetails.courts[i].addresses[j].type == "Visit us or write to us" ) {
          req.app.locals.courtVisitWriteAddress = true
          
          req.app.locals.courtVisitAddress1 = addressSplit[0]

          if (addressSplit[1]) {
            req.app.locals.courtVisitAddress2 = addressSplit[1]
          }
          if (addressSplit[2]) {
            req.app.locals.courtVisitAddress3 = addressSplit[2]
          }

          req.app.locals.courtVisitTown = courtDetails.courts[i].addresses[j].town 
          req.app.locals.courtVisitPostcode = courtDetails.courts[i].addresses[j].postcode
        }

        if (courtDetails.courts[i].addresses[j].type == "Visiting" ) {
          req.app.locals.courtSeparateAddress = true
          req.app.locals.courtVisitAddress1 = addressSplit[0]

          if (addressSplit[1]) {
            req.app.locals.courtVisitAddress2 = addressSplit[1]
          }
          if (addressSplit[2]) {
            req.app.locals.courtVisitAddress3 = addressSplit[2]
          }

          req.app.locals.courtVisitTown = courtDetails.courts[i].addresses[j].town 
          req.app.locals.courtVisitPostcode = courtDetails.courts[i].addresses[j].postcode

        }
        if (courtDetails.courts[i].addresses[j].type == "Postal" ) {
          req.app.locals.courtWriteAddress1 = addressSplit[0]

          if (addressSplit[1]) {
            req.app.locals.courtWriteAddress2 = addressSplit[1]
          }
          if (addressSplit[2]) {
            req.app.locals.courtWriteAddress3 = addressSplit[2]
          }
          req.app.locals.courtWriteTown = courtDetails.courts[i].addresses[j].town 
          req.app.locals.courtWritePostcode = courtDetails.courts[i].addresses[j].postcode

        }
        // text fields
        req.app.locals.courtAdditionalInfo = courtDetails.courts[i].info
        req.app.locals.courtUrgentInfo = courtDetails.courts[i].urgent

        
        // opening times

        console.log('courtDetails.courts[i].opening_times.length ' + courtDetails.courts[i].opening_times.length)

        for (let j=0; j < courtDetails.courts[i].opening_times.length; j++) {
          if (courtDetails.courts[i].opening_times[j].description = "Court building open") {
            req.app.locals.courtOpenBuilding = courtDetails.courts[i].opening_times[j].hours
          }
          if (courtDetails.courts[i].opening_times[j].description = "Court counter open") {
            req.app.locals.courtOpenCounter = courtDetails.courts[i].opening_times[j].hours

          }
        } 

        // contacts phone

        console.log('courtDetails.courts[i].contacts.length ' + courtDetails.courts[i].contacts.length)

        for (let j=0; j < courtDetails.courts[i].contacts.length; j++) {
          if (courtDetails.courts[i].contacts[j].description = "Enquiries") {
            req.app.locals.courtPhoneEnquiries = courtDetails.courts[i].contacts[j].number
          }
          if (courtDetails.courts[i].contacts[j].description = "DX") {
            req.app.locals.courtDXNumber = courtDetails.courts[i].contacts[j].number

          }
        }
        // contacts email

        console.log('courtDetails.courts[i].emails.length ' + courtDetails.courts[i].emails.length)

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
          if (courtDetails.courts[i].emails[j].description = "Family queries") {
            req.app.locals.courtEmailFamily = courtDetails.courts[i].emails[j].address
          }
          if (courtDetails.courts[i].emails[j].description = "Court of Protection") {
            req.app.locals.courtEmailCoP = courtDetails.courts[i].emails[j].address
          }   
        }
        //service areas to display in sidebar

        
        console.log('courtDetails.courts[i].areas_of_law.length ' + courtDetails.courts[i].areas_of_law.length)        

        for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
            
          switch (courtDetails.courts[i].areas_of_law[j]) {

            case 'Money claims':
              req.app.locals.moneyClaimsServiceAtCourt = "Money claims"

            case 'Probate':
              req.app.locals.probateServiceAtCourt = "Probate"

            case 'Housing possession':
              req.app.locals.housingPossessionServiceAtCourt = "Housing possession"

            case 'Bankruptcy':
              req.app.locals.bankruptcyServiceAtCourt = 'Bankruptcy'

            case 'Social Security':
              req.app.locals.benefitsServiceAtCourt = "Benefits"

            case 'Immigration':
              req.app.locals.benefitsServiceAtCourt = "Benefits"

            case 'Employment':
              req.app.locals.employmentServiceAtCourt = "Claims against employers"

            case 'Tax':
              req.app.locals.taxServiceAtCourt = "Tax"

            case 'Divorce':
              req.app.locals.divorceServiceAtCourt = "Divorce"
            
            case 'Civil Partnership':
              req.app.locals.civilPartnershipServiceAtCourt = "Civil partnership"

            case 'Domestic violence':
              req.app.locals.domesticAbuseServiceAtCourt = "Domestic Abuse"

            case 'Forced marriage and FGM':
              req.app.locals.forcedMarriageServiceAtCourt = "Forced marriage"

            case 'Children':
              req.app.locals.childArrangementsServiceAtCourt = 'Child Arrangements'

            case 'Adoption':
              req.app.locals.adoptionServiceAtCourt = "Adoption"

            case 'FGM':
              req.app.locals.FGMServiceAtCourt = "Female Genital Mutilation"

            case 'High Court':
              req.app.locals.highCourtServiceAtCourt = "High Court"
            
            default :
              req.app.locals.crimeServiceAtCourt = "Crime"

          }
        }
      }
    }
  }
  res.render('individual-location-pages/generic')

})
module.exports = router