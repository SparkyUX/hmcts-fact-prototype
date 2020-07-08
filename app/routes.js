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

// 1.0 Search

router.post('/search-for-location', function (req, res) {


  let locationSearchValue = req.session.data['location-search-value'].toLowerCase();
  req.app.locals.locationSearch = req.session.data['location-search-value']
  req.app.locals.serviceCentre = false   


  let searchCourt = locationSearchValue.trim()
  req.app.locals.locationCCMCC = false
  req.app.locals.locationProbate = false
  req.app.locals.locationWycombe = false
  req.app.locals.locationReading = false
  req.app.locals.locationWatford = false
  req.app.locals.locationSlough = false
  req.app.locals.locationBirmingham = false
  console.log('searchCourt ' + searchCourt.toLowerCase())

  if (searchCourt.toLowerCase().includes('money')) {
    req.app.locals.serviceCentre = true  
    req.app.locals.locationCCMCC = true
    res.redirect('/location/location-search-results-single?courtname=ccmcc')
  }
  else if (searchCourt.toLowerCase().includes('probate')) {
    req.app.locals.serviceCentre = true   
    req.app.locals.locationProbate = true
    res.redirect('/location/location-search-results-single?courtname=probatesc')
  }
  else if (searchCourt.toLowerCase().includes('divorce')) {
    req.app.locals.serviceCentre = true   
    req.app.locals.locationDivorce = true
    res.redirect('/location/location-search-results-single?courtname=divorcesc')
  }

  else if (searchCourt.toLowerCase().includes('wycombe')) {
    req.app.locals.locationWycombe = true
    res.redirect('/location/location-search-results-single?courtname=wycombeccfc')
  }
  else if (searchCourt.toLowerCase().includes('reading')) {
    req.app.locals.locationReading = true
    res.redirect('/location/location-search-results-single?courtname=readingccfc')
  }
  else if (searchCourt.toLowerCase().includes('watford')) {
    req.app.locals.locationWatford = true
    res.redirect('/location/location-search-results-single?courtname=watfordccfc')
  }
  else if (searchCourt.toLowerCase().includes('slough')) {
    req.app.locals.locationSlough = true
    res.redirect('/location/location-search-results-single?courtname=sloughccfc')
  }
  else if (searchCourt.toLowerCase().includes('birmingham')) {
    req.app.locals.locationBirmingham = true
    res.redirect('/location/location-search-results-single?courtname=birminghamcfjc')
  }
  else {
  res.redirect('/location/location-search-results-multiple')
  }
})

// 2.0 Choose action


router.post('/choose-action', function (req, res) {

  let chooseAction = req.session.data['choose-action']
  req.app.locals.serviceActionType = ""
  req.app.locals.continueService = false

    switch (chooseAction) {

      case 'send-docs':
        req.app.locals.serviceActionType = "start"
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
      default :
        res.redirect('/service/service-category?action=notlisted')
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
      req.app.locals.immigrationService = true
      req.app.locals.serviceArea = "immigration and asylum"
      req.app.locals.serviceAreaCapitalised = "Immigration and asylum"


      pageServiceCategory = 'service-search-postcode?servicearea=immigration'
      break

    case 'high-courts':
      req.app.locals.childService = false
      req.app.locals.serviceCentre = false
      req.app.locals.highCourtService = true
      req.app.locals.serviceArea = "High Courts"
      req.app.locals.serviceAreaCapitalised = "High Courts"



      pageServiceCategory = 'service-search-postcode?servicearea=highcourts'
      break
    default:
      pageServiceCategory = 'unknown-service'
      break

  }

  res.redirect('/service/' + pageServiceCategory)


})

// 2.1.a choose service area

router.post('/choose-area', function (req, res) {

  let serviceArea = req.session.data['choose-service-area'] 

  serviceAreaCapitalised = serviceArea

  serviceAreaQuery = serviceArea.replace(/ /g,"").toLowerCase()
  // serviceAreaLower = serviceArea.toLowerCase()

  req.app.locals.serviceAreaCapitalised = serviceAreaCapitalised

  req.app.locals.serviceArea = serviceAreaCapitalised.toLowerCase()
  
  req.app.locals.courtsOrTribunals = 'courts or tribunals'

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

  req.app.locals.adoptionStartPage = 'https://www.gov.uk/child-adoption/applying-for-an-adoption-court-order'
  req.app.locals.bankruptcyStartPage = 'https://www.gov.uk/bankruptcy'
  req.app.locals.childcareStartPage = 'https://www.gov.uk/looking-after-children-divorce'      
  req.app.locals.divorceStartPage = 'https://www.gov.uk/divorce'
  req.app.locals.civilPartnershipStartPage = 'https://www.gov.uk/divorce'
  req.app.locals.domesticAbuseStartPage = 'https://www.gov.uk/injunction-domestic-violence'
  req.app.locals.employmentStartPage = 'https://www.gov.uk/employment-tribunals'
  req.app.locals.forcedMarriageStartPage = 'https://www.gov.uk/apply-forced-marriage-protection-order'
  req.app.locals.FGMStartPage = 'https://www.gov.uk/government/collections/female-genital-mutilation'
  req.app.locals.housingPossessionStartPage = 'https://www.gov.uk/evicting-tenants'
  req.app.locals.moneyClaimsPage = 'https://www.gov.uk/make-money-claim'
  req.app.locals.ProbateStartPage = 'https://www.gov.uk/applying-for-probate'
  req.app.locals.benefitsStartPage = 'https://www.gov.uk/appeal-benefit-decision'
  req.app.locals.taxStartPage = 'https://www.gov.uk/tax-tribunal'

//  console.log('serviceAreaQuery ' + serviceAreaQuery)

  switch (serviceAreaQuery) {

    case 'adoption':
      req.app.locals.adoptionService = true
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 3
      break

    case 'bankruptcy':
      req.app.locals.bankruptcyService = true
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 2
      break

    case 'childarrangements':
      req.app.locals.childService = true
      req.app.locals.childArrangementsService = true
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 7
      break

    case 'civilpartnership':
      req.app.locals.civilPartnershipService = true
      req.app.locals.courtsOrTribunals = 'court or tribunal'
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 1
      break    

    case 'divorce':
      req.app.locals.serviceCentre = true
      req.app.locals.divorceService = true
      req.app.locals.courtCount = 5

      break

    case 'domesticabuse':
      req.app.locals.domesticAbuseService = true
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 7
      break

    case 'claimsagainstemployers':
      req.app.locals.employmentService = true
      req.app.locals.courtsOrTribunals = 'court or tribunal'        
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 1
      break

    case 'forcedmarriage':
      req.app.locals.forcedMarriageService = true
      req.app.locals.courtsOrTribunals = 'court or tribunal'
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 1
      break

    case 'femalegenitalmutilation':
      req.app.locals.FGMService = true
      req.app.locals.courtsOrTribunals = 'court or tribunal'  
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 1
      break

    case 'housingpossession':
      req.app.locals.housingPossessionService = true  
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 4
      break

    case 'immigrationasylum':
      req.app.locals.immigrationService = true  
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 1
      break

    case 'moneyclaims':
      req.app.locals.serviceCentre = true
      req.app.locals.moneyClaimsService = true
      req.app.locals.courtCount = 2
      break   

    case 'probate':
      req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/applying-for-probate'
      req.app.locals.serviceCentre = true
      req.app.locals.probateService = true
      req.app.locals.courtCount = 3
      break

    case 'benefits':
      req.app.locals.benefitsService = true
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 1
      break

    case 'tax':
      req.app.locals.taxService = true
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 0
      break

    default:
      req.app.locals.serviceAreaStartPage = ''
      req.app.locals.crimeService = true
      req.app.locals.serviceCentre = false   
      req.app.locals.courtCount = 0

  }

  if (req.app.locals.serviceCentre == true) {
    req.app.locals.serviceCentreSearch = serviceArea.toLowerCase()
  }

/*
    if (((serviceAreaQuery == 'moneyclaims' || serviceAreaQuery == 'probate') && req.app.locals.serviceActionType == 'continueFindHearingCentre' )
      || req.app.locals.divorceService || req.app.locals.civilPartnershipService ) {
      console.log('serviceAreaQuery ' + serviceAreaQuery)
      console.log('req.app.locals.divorceService ' + req.app.locals.divorceService)
      console.log('req.app.locals.serviceActionType ' + req.app.locals.serviceActionType)
        res.redirect('/service/service-search-postcode?servicearea=' + serviceAreaQuery)
    }
    else {
      res.redirect('/service/service-search-results-ctsc?servicearea=' + serviceAreaQuery)
    }
  }
  else {
    */ 
  res.redirect('/service/service-search-postcode?servicearea=' + serviceAreaQuery)
 

})

// 2.1.2 service postcode search


router.post('/service-postcode', function (req, res) {

  let serviceSearchPostcode = req.session.data['service-search-postcode'].toUpperCase();
  req.app.locals.serviceSearchPostcode = serviceSearchPostcode

  if (req.app.locals.serviceCentre == true) {     
    res.redirect('/service/service-search-results-ctsc?servicearea=' + req.app.locals.serviceCentreSearch)
  }
  else { 
    res.redirect('/service/service-search-results-multiple?servicearea=' + req.app.locals.serviceCentreSearch)
  }

/*
  if (req.app.locals.serviceCentre == true && req.app.locals.serviceActionType !== 'continueFindHearingCentre') {     
    res.redirect('/service/service-search-results-ctsc?servicearea=' + req.app.locals.serviceCentreSearch)
  }
  else if (req.app.locals.serviceCentre == true ) {
      res.redirect('/service/service-search-results-multiple?servicearea=' + req.app.locals.serviceCentreSearch)

  }
  else { 
    res.redirect('/service/service-search-results-multiple?servicearea=' + req.app.locals.serviceCentreSearch)
  }
*/

})


// 1.2a , 2.1.4a individual court

router.get('/individual-location-pages/generic', function(req, res) {  
  let courtShortName = req.query.courtname
  if (req.query.ctsc == "yes") {
      req.app.locals.ctscFlag = true
  }
  else {
      req.app.locals.ctscFlag = false
  }
// initialise display values 
  req.app.locals.courtVisitAddress1 = ""
  req.app.locals.courtVisitAddress2 = ""
  req.app.locals.courtVisitAddress3 = ""
  req.app.locals.courtAdditionalInfo = ""
  req.app.locals.courtUrgentInfo = ""
  req.app.locals.courtOpenBuilding = ""
  req.app.locals.courtOpenCounter = ""

  req.app.locals.courtAdditionalInfo = ""
  req.app.locals.courtUrgentInfo = ""

  req.app.locals.courtPhoneEnquiries = ""
  req.app.locals.courtPhoneCoP = ""
  req.app.locals.courtPhoneHighCourt = ""
  req.app.locals.courtDXNumber = ""

  req.app.locals.courtEmailEnquiries = ""
  req.app.locals.courtEmailListing = ""
  req.app.locals.courtEmailBaillifs = ""
  req.app.locals.courtEmailFamily = ""
  req.app.locals.courtEmailCoP = ""
  req.app.locals.courtEmailMCOL = ""
  req.app.locals.courtEmailCMC = ""

// initialise flags
  req.app.locals.courtVisitWriteAddress = false
  req.app.locals.courtSeparateAddress = false
  
  req.app.locals.immigrationServiceAtCourt = false
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
        if (req.app.locals.ctscFlag == false) {

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

          if (courtDetails.courts[i].addresses[j].type == "Visiting") {
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
      }
      // text fields
      req.app.locals.courtAdditionalInfo = courtDetails.courts[i].info
      req.app.locals.courtUrgentInfo = courtDetails.courts[i].urgent

      // long and lat
      req.app.locals.courtGoogleMapsLocation = 'https://maps.google.com/maps?q=' + courtDetails.courts[i].lat + ',' + courtDetails.courts[i].lon

      // image src
      req.app.locals.courtImgLoc = '/public/images/' + courtShortName + '.jpg' 
      // opening times

      for (let j=0; j < courtDetails.courts[i].opening_times.length; j++) {
        if (courtDetails.courts[i].opening_times[j].description == "Court building open") {
          req.app.locals.courtOpenBuilding = courtDetails.courts[i].opening_times[j].hours
        }
        if (courtDetails.courts[i].opening_times[j].description == "Court counter open") {
          req.app.locals.courtOpenCounter = courtDetails.courts[i].opening_times[j].hours

        }
      }

      // contacts phone

      for (let j=0; j < courtDetails.courts[i].contacts.length; j++) {
        if (courtDetails.courts[i].contacts[j].description == "Enquiries") {
          req.app.locals.courtPhoneEnquiries = courtDetails.courts[i].contacts[j].number
        }
        if (courtDetails.courts[i].contacts[j].description == "Urgent") {
          req.app.locals.courtPhoneUrgent = courtDetails.courts[i].contacts[j].number
        }
        if (courtDetails.courts[i].contacts[j].explanation == "Court of Protection") {
          req.app.locals.courtPhoneCoP = courtDetails.courts[i].contacts[j].number
        }
        if (courtDetails.courts[i].contacts[j].description == "High Court") {
          req.app.locals.courtPhoneHighCourt = courtDetails.courts[i].contacts[j].number
        }
        if (courtDetails.courts[i].contacts[j].description == "DX") {
          req.app.locals.courtDXNumber = courtDetails.courts[i].contacts[j].number

        }
      } // contacts
      //  email

      for (let j=0; j < courtDetails.courts[i].emails.length; j++) {
        if (courtDetails.courts[i].emails[j].description == "Enquiries") {
          req.app.locals.courtEmailEnquiries = courtDetails.courts[i].emails[j].address
        }
        if (courtDetails.courts[i].emails[j].description == "Urgent") {
          req.app.locals.courtEmailUrgent = courtDetails.courts[i].emails[j].address
        }
        if (courtDetails.courts[i].emails[j].description == "Listing") {
          req.app.locals.courtEmailListing = courtDetails.courts[i].emails[j].address
        }
        if (courtDetails.courts[i].emails[j].description == "Bailiffs") {
          req.app.locals.courtEmailBaillifs = courtDetails.courts[i].emails[j].address
        }        
        if (courtDetails.courts[i].emails[j].description == "Family queries") {
          req.app.locals.courtEmailFamily = courtDetails.courts[i].emails[j].address
        }
        if (courtDetails.courts[i].emails[j].explanation == "Court of Protection") {
          req.app.locals.courtEmailCoP = courtDetails.courts[i].emails[j].address
        }   
        if (courtDetails.courts[i].emails[j].description == "MCOL") {
          req.app.locals.courtEmailMCOL = courtDetails.courts[i].emails[j].address
        }         
        if (courtDetails.courts[i].emails[j].description == "Small claims") {
          req.app.locals.courtEmailCMC = courtDetails.courts[i].emails[j].address
        }
        if (courtDetails.courts[i].emails[j].description == "Small claims") {
          req.app.locals.courtEmailCMC = courtDetails.courts[i].emails[j].address
        }

      } // emails

      //service areas to display in sidebar
      
      for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
        let serviceAreasByCourt = courtDetails.courts[i].areas_of_law[j]
        

          if (serviceAreasByCourt == 'Money claims') {
            if (req.app.locals.ctscFlag == true) {
              req.app.locals.serviceArea = "money claims"
            }
            req.app.locals.moneyClaimsServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Probate') {
            if (req.app.locals.ctscFlag == true) {
              req.app.locals.serviceArea = "probate"
            }
              req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/applying-for-probate'
              req.app.locals.probateServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Housing possession') {
            req.app.locals.housingPossessionServiceAtCourt = true
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/evicting-tenants'
          }

          if (serviceAreasByCourt == 'Bankruptcy') {
            req.app.locals.bankruptcyServiceAtCourt = true
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/bankruptcy'
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
            if (req.app.locals.ctscFlag == true) {
              req.app.locals.serviceArea = "divorce"
            }
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/divorce'
            req.app.locals.divorceServiceAtCourt = true
          }
          
          if (serviceAreasByCourt == 'Civil Partnership') {
            req.app.locals.civilPartnershipServiceAtCourt = true
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/end-civil-partnership'
          }

          if (serviceAreasByCourt == 'Domestic violence') {
            req.app.locals.domesticAbuseServiceAtCourt = true
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/injunction-domestic-violence'
          }

          if (serviceAreasByCourt == 'Forced marriage and FGM') {
            req.app.locals.forcedMarriageServiceAtCourt = true
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/stop-forced-marriage'
          }

          if (serviceAreasByCourt == 'Children') {
            req.app.locals.childArrangementsServiceAtCourt = true
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/looking-after-children-divorce'

          }

          if (serviceAreasByCourt == 'Adoption') {
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/child-adoption'
            req.app.locals.adoptionServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'FGM') {
            req.app.locals.FGMServiceAtCourt = true
            req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/female-genital-mutilation-protection-order'
          }

          if (serviceAreasByCourt == 'High Court') {
            req.app.locals.highCourtServiceAtCourt = true
          }
          
      } // for area of law
    } // if court 
  } // for loop

  res.render('individual-location-pages/generic')

})
module.exports = router