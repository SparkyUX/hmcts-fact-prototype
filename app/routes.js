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

    case 'immigration-asylum':
      req.app.locals.childService = false
      req.app.locals.serviceCentre = false
      req.app.locals.imigrationService = true
      req.app.locals.serviceArea = "Immigration and asylum"


      pageServiceCategory = 'service-search-postcode?servicearea=immigration'
      break

    case 'high-courts':
      req.app.locals.childService = false
      req.app.locals.serviceCentre = false
      req.app.locals.highCourtService = true
      req.app.locals.serviceArea = "High Courts"


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
  req.app.locals.housingPossessionService = false
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
  req.app.locals.adoptionService = false
  req.app.locals.FGMService = false


  console.log('serviceAreaQuery ' + serviceAreaQuery)

  switch (serviceAreaQuery) {

    case 'adoption':
      req.app.locals.adoptionService = true
      req.app.locals.courtCount = 3
      break

    case 'bankruptcy':
      req.app.locals.bankruptcyService = true
      req.app.locals.courtCount = 2
      break

    case 'childarrangements':
      req.app.locals.childService = true
      req.app.locals.childArrangementsService = true
      req.app.locals.courtCount = 7
      break

    case 'civilpartnership':
      req.app.locals.civilPartnershipService = true
      req.app.locals.courtCount = 1
      break    

    case 'divorce':
      req.app.locals.serviceCentre = true
      req.app.locals.divorceService = true
      break

    case 'domesticabuse':
      req.app.locals.domesticAbuseService = true
      req.app.locals.courtCount = 7
      break

    case 'claimsagainstemployers':
      req.app.locals.employmentService = true
      req.app.locals.courtCount = 1
      break

    case 'forcedmarriage':
      req.app.locals.forcedMarriageService = true
      req.app.locals.courtCount = 1
      break

    case 'femalegenitalmutilation':
      req.app.locals.FGMService = true
      req.app.locals.courtCount = 1
      break

    case 'housingpossession':
      req.app.locals.housingPossessionService = true
      req.app.locals.courtCount = 4
      break

    case 'moneyclaims':
      req.app.locals.serviceCentre = true
      req.app.locals.moneyClaimsService = true
      break   

    case 'probate':
      req.app.locals.serviceCentre = true
      req.app.locals.probateService = true
      break

    case 'benefits':
      req.app.locals.benefitsService = true
      req.app.locals.courtCount = 1
      break

    case 'tax':
      req.app.locals.taxService = true
      req.app.locals.courtCount = 0
      break

    default:
      req.app.locals.crimeService = true
      req.app.locals.courtCount = 0

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
  console.log('req.app.locals.adoptionService ' + req.app.locals.adoptionService )
  console.log('req.app.locals.bankruptcyService ' + req.app.locals.bankruptcyService )
  console.log('req.app.locals.childArrangementsService ' + req.app.locals.childArrangementsService )
  console.log('req.app.locals.civilPartnershipService ' + req.app.locals.civilPartnershipService )   
  console.log('req.app.locals.divorceService ' + req.app.locals.divorceService )
  console.log('req.app.locals.domesticAbuseService ' + req.app.locals.domesticAbuseService )
  console.log('req.app.locals.employmentService ' + req.app.locals.employmentService )
  console.log('req.app.locals.forcedMarriageService ' + req.app.locals.forcedMarriageService )
  console.log('req.app.locals.FGMService ' + req.app.locals.FGMService )
  console.log('req.app.locals.housingPossessionService ' + req.app.locals.housingPossessionService )
  console.log('req.app.locals.moneyClaimsService ' + req.app.locals.moneyClaimsService )
  console.log('req.app.locals.probateService ' + req.app.locals.probateService )
  console.log('req.app.locals.benefitsService ' + req.app.locals.benefitsService )

  let serviceSearchPostcode = req.session.data['service-search-postcode'].toUpperCase();
  req.app.locals.serviceSearchPostcode = serviceSearchPostcode

  if (req.app.locals.serviceCentre == true) {     
    res.redirect('/service/service-search-results-single-ctsc')
  }

    res.redirect('/service/service-search-results-multiple')

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
  req.app.locals.moneyClaimsServiceAtCourt = false
  req.app.locals.probateServiceAtCourt = false
  req.app.locals.housingPossessionServiceAtCourt = false
  req.app.locals.bankruptcyServiceAtCourt = false
  req.app.locals.benefitsServiceAtCourt = false
  req.app.locals.employmentServiceAtCourt = false
  req.app.locals.taxServiceAtCourt = false
  req.app.locals.divorceServiceAtCourt = false
  req.app.locals.civilPartnershipServiceAtCourt = false
  req.app.locals.domesticAbuseServiceAtCourt = false
  req.app.locals.forcedMarriageServiceAtCourt = false
  req.app.locals.childArrangementsServiceAtCourt = false
  req.app.locals.adoptionServiceAtCourt = false
  req.app.locals.FGMServiceAtCourt = false
  req.app.locals.highCourtServiceAtCourt = false
  req.app.locals.crimeServiceAtCourt = false

  console.log('req.app.locals.adoptionServiceAtCourt ' + req.app.locals.adoptionServiceAtCourt )
  console.log('req.app.locals.bankruptcyServiceAtCourt ' + req.app.locals.bankruptcyServiceAtCourt )
  console.log('req.app.locals.childArrangementsServiceAtCourt ' + req.app.locals.childArrangementsServiceAtCourt )
  console.log('req.app.locals.civilPartnershipServiceAtCourt ' + req.app.locals.civilPartnershipServiceAtCourt )   
  console.log('req.app.locals.divorceServiceAtCourt ' + req.app.locals.divorceServiceAtCourt )
  console.log('req.app.locals.domesticAbuseServiceAtCourt ' + req.app.locals.domesticAbuseServiceAtCourt )
  console.log('req.app.locals.employmentServiceAtCourt ' + req.app.locals.employmentServiceAtCourt )
  console.log('req.app.locals.forcedMarriageServiceAtCourt ' + req.app.locals.forcedMarriageServiceAtCourt )
  console.log('req.app.locals.FGMServiceAtCourt ' + req.app.locals.FGMServiceAtCourt )
  console.log('req.app.locals.housingPossessionServiceAtCourt ' + req.app.locals.housingPossessionServiceAtCourt )
  console.log('req.app.locals.moneyClaimsServiceAtCourt ' + req.app.locals.moneyClaimsServiceAtCourt )
  console.log('req.app.locals.probateServiceAtCourt ' + req.app.locals.probateServiceAtCourt )
  console.log('req.app.locals.benefitsServiceAtCourt ' + req.app.locals.benefitsServiceAtCourt )

  
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
      for (let j=0; j < courtDetails.courts[i].addresses.length; j++) {

        let addressSplit = courtDetails.courts[i].addresses[j].address.split('!')

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
      } // addresses
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
      } // opening times

      // contacts phone

      for (let j=0; j < courtDetails.courts[i].contacts.length; j++) {
        if (courtDetails.courts[i].contacts[j].description = "Enquiries") {
          req.app.locals.courtPhoneEnquiries = courtDetails.courts[i].contacts[j].number
        }
        if (courtDetails.courts[i].contacts[j].description = "DX") {
          req.app.locals.courtDXNumber = courtDetails.courts[i].contacts[j].number

        }
      } // contacts
      //  email

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
      } // emails

      //service areas to display in sidebar
      
      for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
        console.log('courtDetails.courts[i].areas_of_law[j] ' + courtDetails.courts[i].areas_of_law[j])
        let serviceAreasByCourt = courtDetails.courts[i].areas_of_law[j]
        

          if (serviceAreasByCourt == 'Money claims') {
            req.app.locals.moneyClaimsServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Probate') {
            req.app.locals.probateServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Housing possession') {
            req.app.locals.housingPossessionServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Bankruptcy') {
            req.app.locals.bankruptcyServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Social Security') {
            req.app.locals.benefitsServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Immigration') {
            req.app.locals.immigrationServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Employment') {
            req.app.locals.employmentServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Tax') {
            req.app.locals.taxServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Divorce') {
            req.app.locals.divorceServiceAtCourt = true
          }
          
          if (serviceAreasByCourt == 'Civil Partnership') {
            req.app.locals.civilPartnershipServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Domestic violence') {
            req.app.locals.domesticAbuseServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Forced marriage and FGM') {
            req.app.locals.forcedMarriageServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Children') {
            req.app.locals.childArrangementsServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Adoption') {
            req.app.locals.adoptionServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'FGM') {
            req.app.locals.FGMServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'High Court') {
            req.app.locals.highCourtServiceAtCourt = true
          }
          
      } // for area of law
    } // if court 
  } // for loop
  console.log('req.app.locals.adoptionServiceAtCourt ' + req.app.locals.adoptionServiceAtCourt )
  console.log('req.app.locals.bankruptcyServiceAtCourt ' + req.app.locals.bankruptcyServiceAtCourt )
  console.log('req.app.locals.childArrangementsServiceAtCourt ' + req.app.locals.childArrangementsServiceAtCourt )
  console.log('req.app.locals.civilPartnershipServiceAtCourt ' + req.app.locals.civilPartnershipServiceAtCourt )   
  console.log('req.app.locals.divorceServiceAtCourt ' + req.app.locals.divorceServiceAtCourt )
  console.log('req.app.locals.domesticAbuseServiceAtCourt ' + req.app.locals.domesticAbuseServiceAtCourt )
  console.log('req.app.locals.employmentServiceAtCourt ' + req.app.locals.employmentServiceAtCourt )
  console.log('req.app.locals.forcedMarriageServiceAtCourt ' + req.app.locals.forcedMarriageServiceAtCourt )
  console.log('req.app.locals.FGMServiceAtCourt ' + req.app.locals.FGMServiceAtCourt )
  console.log('req.app.locals.housingPossessionServiceAtCourt ' + req.app.locals.housingPossessionServiceAtCourt )
  console.log('req.app.locals.moneyClaimsServiceAtCourt ' + req.app.locals.moneyClaimsServiceAtCourt )
  console.log('req.app.locals.probateServiceAtCourt ' + req.app.locals.probateServiceAtCourt )
  console.log('req.app.locals.benefitsServiceAtCourt ' + req.app.locals.benefitsServiceAtCourt )
  console.log('req.app.locals.crimeServiceAtCourt ' + req.app.locals.crimeServiceAtCourt )

  res.render('individual-location-pages/generic')

})
module.exports = router