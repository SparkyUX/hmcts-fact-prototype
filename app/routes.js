const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()
const lunr = require('lunr')
const cheerio = require('cheerio')
const $ = cheerio.load('body')
const fuzzySearch = require('fuzzy-search')
const courtDetails = require('./court_details.json')
const courtSearch = require('./court_search.json')
let searchList = []
const lunrStopWords = require('./views/includes/lunr-stop-words.json')
// function to generate the list of courts based on the serviceArea
const createCorTList = require('./routes_functions.js');

// Add your routes here - above the module.exports line
// 0.1 do you know the name of the CorT?

router.post('/search-route', function (req, res) {

  let knowLocation = req.session.data['know-location']

    if (knowLocation == 'yes') {
      req.app.locals.locationSearch = ""
      req.app.locals.searchListNames = []
      req.app.locals.firstPageLoad = true

      res.redirect('/location/location-search')
    }
    else 
    {
      if (req.app.locals.omitPage === 'Y') { 
        
      req.app.locals.continueService = true
      res.redirect('/service/service-category')
      }
      else
      {      
        res.redirect('/service/service-choose-action')
      }
    }
 
})

// 1.0 Search


// Using lunr for the search but only works for whole words, cannot make it work with wildcards '*''

router.post('/search-for-location', function (req, res) {
  req.app.locals.firstPageLoad = false
  let searchList = []
  let searchListNames = []
  let locationSearchValue = req.session.data['location-search-value']
  req.app.locals.locationSearch = locationSearchValue
  let documents = courtSearch.courts_search
  //error if no value entered
  if (locationSearchValue == "") {
    console.log('no data entered')
    req.app.locals.errorString = "Field is blank - Enter a court name, address, town or city"
    req.app.locals.errorFormClass = "govuk-form-group--error"  
    req.app.locals.errorInputClass = "govuk-input--error" 
    res.render('location/location-search')
  }
  else {
    req.app.locals.errorString = ""
    req.app.locals.errorFormClass = ""
    req.app.locals.errorInputClass = "" 

// create lunr index and search fields
    let idx = lunr(function(){
      this.ref('slug')
      this.field('name')
      this.field('address')
      this.field('town_name')
      this.field('postcode')
      this.field('number')

      documents.forEach(function(doc) {
        this.add(doc)
      }, this)
    })
    // lunr ignores certain words and returns no results, so remove from the search term
    for (i = 0; i < lunrStopWords.lunrWords.length; i++) {
      let stopWord = lunrStopWords.lunrWords[i].toLowerCase()
      let searchValue = locationSearchValue
      if (searchValue.includes(' ' + stopWord + ' ')) {
        locationSearchValue = searchValue.replace(' ' + stopWord, '' )
        console.log('locationSearchValue ' + locationSearchValue)
      }
    }

    // if more than one term entered make them both required to narrow down the search

    if (locationSearchValue !== null) {
      locationSearchTerm = '+' + locationSearchValue.trim().replace(/ /g, ' +')
      console.log('locationSearchTerm ' + locationSearchTerm)

        searchList = idx.search(locationSearchTerm)

      if (searchList.length > 1) {
        req.app.locals.courtsOrTribunals = 'courts or tribunals'
      }
      else {
        req.app.locals.courtsOrTribunals = 'court or tribunal'
      }
    }

    // loop through search results and add the slug to the searchlistnames
    for (let i=0 ; i < searchList.length; i++) {
      for (j=0; j < documents.length; j++) {
        if (searchList[i].ref == documents[j].slug) {
          let courtNameSlug = {
            name: documents[j].name,
            slug: documents[j].slug.toLowerCase()
          }
          searchListNames.push(courtNameSlug)
        }
      }
    }
    // make the list of slugs a global variable and sort at the same time
    req.app.locals.searchListNames = searchListNames.sort(function(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
    })

    res.render('location/location-search')
  }

})


// 2.0 Choose action


router.post('/choose-action', function (req, res) {

  let chooseAction = req.session.data['choose-action']
  req.app.locals.serviceActionType = ""
//  req.app.locals.continueService = false

    switch (chooseAction) {

      case 'send-docs':
        req.app.locals.serviceActionType = "sendDocs"
        break
      case 'case-update':
       req.app.locals.serviceActionType = "getUpdate"
      break
      case 'find-nearest':
        req.app.locals.serviceActionType = "findNearest"
      break
      default :
      break
        req.app.locals.serviceActionType = null

    }   
        res.redirect('/service/service-category')

})

// 2.1 choose category

router.post('/choose-service-category', function (req, res) {
  let actionChosen = req.query.action

  let serviceCategory = req.session.data['choose-service-category']
  let pageServiceCategory = ""

// set default to plural and change if only one court or tribunal found
  req.app.locals.courtsOrTribunals = 'courts or tribunals' 

  req.app.locals.moneyClaimsService = false
  req.app.locals.probateService = false
  req.app.locals.divorceService = false
  req.app.locals.civilPartnershipService = false
  req.app.locals.childService = false
  req.app.locals.serviceCentre = false

// determine the next page
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

    case 'harm-abuse':
      pageServiceCategory = 'service-area-harm-abuse'
      break
// service areas without a sub page
    case 'immigration-asylum':
      req.app.locals.serviceAreaStartPage = 'https://www.gov.uk/immigration-asylum-tribunal'
      req.app.locals.serviceArea = "Immigration and asylum"
      pageServiceCategory = 'service-search-postcode?servicearea=immigrationandasylum'
      req.app.locals.searchListNames = createCorTList(req.app.locals.serviceArea)
      req.app.locals.courtCount = req.app.locals.searchListNames.length
      break

    case 'crime':
      req.app.locals.serviceAreaStartPage = ""
      req.app.locals.serviceArea = "Crime"
      pageServiceCategory = 'service-search-postcode?servicearea=crime'
      req.app.locals.searchListNames = createCorTList(req.app.locals.serviceArea)
      req.app.locals.courtCount = req.app.locals.searchListNames.length
      break    

    case 'high-courts':
      req.app.locals.serviceAreaStartPage = ""
      req.app.locals.serviceArea = "High Court"
      pageServiceCategory = 'service-search-postcode?servicearea=highcourts'
      req.app.locals.searchListNames = createCorTList(req.app.locals.serviceArea)
      req.app.locals.courtCount = req.app.locals.searchListNames.length
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
  let searchListNames =[]

  serviceAreaQuery = serviceArea.replace(/ /g,"").toLowerCase()

  // used to determine messages
  /*
  req.app.locals.serviceCentreProbate = false
  req.app.locals.serviceCentreDivorce = false
  req.app.locals.serviceCentreCivilPartnership = false
  req.app.locals.serviceCentreMoneyClaims = false
*/
  // child service used for message on postcode page
  req.app.locals.childService = false

  // used for display on individual court page
  req.app.locals.serviceCentre = false 

  // need to be reset again in case only goes back one page to the service area and not the service category
  req.app.locals.moneyClaimsService = false
  req.app.locals.probateService = false
  req.app.locals.divorceService = false
  req.app.locals.civilPartnershipService = false

// lower case for varaiables on front end pages
  req.app.locals.serviceArea = serviceArea.toLowerCase()

// allocate service start pages
  req.app.locals.serviceAreaStartPage = ""

  adoptionStartPage = 'https://www.gov.uk/child-adoption/applying-for-an-adoption-court-order'
  bankruptcyStartPage = 'https://www.gov.uk/bankruptcy'
  childcareStartPage = 'https://www.gov.uk/looking-after-children-divorce'      
  divorceStartPage = 'https://www.gov.uk/divorce'
  civilPartnershipStartPage = 'https://www.gov.uk/divorce'
  domesticAbuseStartPage = 'https://www.gov.uk/injunction-domestic-violence'
  employmentStartPage = 'https://www.gov.uk/employment-tribunals'
  forcedMarriageStartPage = 'https://www.gov.uk/apply-forced-marriage-protection-order'
  FGMStartPage = 'https://www.gov.uk/government/collections/female-genital-mutilation'
  housingPossessionStartPage = 'https://www.gov.uk/evicting-tenants'
  immigrationAsylumStartPage = 'https://www.gov.uk/immigration-asylum-tribunal'
  moneyClaimsStartPage = 'https://www.gov.uk/make-money-claim'
  probateStartPage = 'https://www.gov.uk/applying-for-probate'
  benefitsStartPage = 'https://www.gov.uk/appeal-benefit-decision'
  taxStartPage = 'https://www.gov.uk/tax-tribunal'

  switch (serviceAreaQuery) {

    case 'adoption':            
      req.app.locals.serviceAreaStartPage = adoptionStartPage
      break

    case 'bankruptcy':            
      req.app.locals.serviceAreaStartPage = bankruptcyStartPage
      break

    case 'childarrangements':            
      req.app.locals.serviceAreaStartPage = childcareStartPage
      req.app.locals.childService = true
      break

    case 'civilpartnership':            
      req.app.locals.serviceAreaStartPage = civilPartnershipStartPage
      req.app.locals.civilPartnershipService = true
      req.app.locals.serviceCentre = true  
      break    

    case 'divorce':            
      req.app.locals.serviceAreaStartPage = divorceStartPage
      req.app.locals.divorceService = true
      req.app.locals.serviceCentre = true
      break

    case 'domesticabuse':
      req.app.locals.serviceAreaStartPage = domesticAbuseStartPage
      break

    case 'claimsagainstemployers':
      req.app.locals.serviceAreaStartPage = employmentStartPage
      break

    case 'forcedmarriage':
      req.app.locals.serviceAreaStartPage = forcedMarriageStartPage
      break

    case 'femalegenitalmutilation':            
      req.app.locals.serviceAreaStartPage = FGMStartPage
      break

    case 'housingpossession':
      req.app.locals.serviceAreaStartPage = housingPossessionStartPage
     break

    case 'immigrationandasylum':      
      req.app.locals.serviceAreaStartPage = immigrationAsylumStartPage
      break

    case 'moneyclaims':
      req.app.locals.serviceAreaStartPage = moneyClaimsStartPage
      req.app.locals.serviceCentre = true
      req.app.locals.moneyClaimsService = true
      break   

    case 'probate':
      req.app.locals.serviceAreaStartPage = probateStartPage
      req.app.locals.serviceCentre = true
      req.app.locals.probateService = true
      break

    case 'benefits':
      req.app.locals.serviceAreaStartPage = benefitsStartPage
      break

    case 'tax':
      req.app.locals.serviceAreaStartPage = taxStartPage
      break

  }

  if (req.app.locals.divorceService || req.app.locals.civilPartnershipService ||
    (req.app.locals.serviceCentre == true && req.app.locals.serviceActionType !== 'findNearest')) {
  }  
  else {
    req.app.locals.searchListNames = createCorTList(serviceArea)

    console.log('req.app.locals.searchListNames.length ' + req.app.locals.searchListNames.length)
    req.app.locals.courtCount = req.app.locals.searchListNames.length
    if (req.app.locals.searchListNames.length == 1) {
      req.app.locals.courtsOrTribunals = 'court or tribunal' 
    }
    else {
      req.app.locals.courtsOrTribunals = 'courts or tribunals'
    }
  }
  console.log('req.app.locals.searchListNames ' + JSON.stringify(req.app.locals.searchListNames))



  if (req.app.locals.divorceService || req.app.locals.civilPartnershipService) {
    res.redirect('/service/service-search-postcode')
  }
  else if (req.app.locals.serviceCentre == true && req.app.locals.serviceActionType !== 'findNearest') {
    res.redirect('/service/service-search-results-ctsc')
  }
  else
  {  
    res.redirect('/service/service-search-postcode')
  }

})

// 2.1.2 service postcode search


router.post('/service-postcode', function (req, res) {

  let serviceSearchPostcode = req.session.data['service-search-postcode'].toUpperCase();
  req.app.locals.serviceSearchPostcode = serviceSearchPostcode

  if (req.app.locals.divorceService || req.app.locals.civilPartnershipService) {
    res.redirect('/service/service-search-results-ctsc')
  }
  else {
    res.redirect('/service/service-search-results-multiple?servicearea=' + req.app.locals.serviceArea)
  } 
})


// 1.2a , 2.1.4a individual court

router.get('/individual-location-pages/generic', function(req, res) {  
  let courtShortName = req.query.courtname
  // check if it's a CTSC
  if ( courtShortName.includes('probate-service') || courtShortName.includes('divorce') || courtShortName.includes('money')) {
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

    if (courtShortName == courtDetails.courts[i].slug) {

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

      } // emails

      //service areas to display in sidebar
      
      for (let j=0; j < courtDetails.courts[i].areas_of_law.length; j++) {
        let serviceAreasByCourt = courtDetails.courts[i].areas_of_law[j]
        

          if (serviceAreasByCourt == 'Money claims') {
            if (req.app.locals.ctscFlag == true) {
//              req.app.locals.serviceArea = "money claims"
            }
            req.app.locals.moneyClaimsServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Probate') {
            if (req.app.locals.ctscFlag == true) {
//              req.app.locals.serviceArea = "probate"
            }
              req.app.locals.probateServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Housing possession') {
            req.app.locals.housingPossessionServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Bankruptcy') {
            req.app.locals.bankruptcyServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Benefits') {
            req.app.locals.benefitsServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Immigration and asylum') {
            req.app.locals.immigrationServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Claims against employers') {
            req.app.locals.employmentServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Tax') {
            req.app.locals.taxServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Divorce') {
            if (req.app.locals.ctscFlag == true) {
//              req.app.locals.serviceArea = "divorce"
            }
            req.app.locals.divorceServiceAtCourt = true
          }
          
          if (serviceAreasByCourt == 'Civil Partnership') {
            req.app.locals.civilPartnershipServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Domestic abuse') {
            req.app.locals.domesticAbuseServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Forced marriage') {
            req.app.locals.forcedMarriageServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Female Genital Mutilation') {
            req.app.locals.FGMServiceAtCourt = true
          }
          if (serviceAreasByCourt == 'Crime') {
            req.app.locals.crimeServiceAtCourt = true
          }
          if (serviceAreasByCourt == 'Child arrangements') {
            req.app.locals.childArrangementsServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'Adoption') {
            req.app.locals.adoptionServiceAtCourt = true
          }

          if (serviceAreasByCourt == 'High Court') {
            req.app.locals.highCourtServiceAtCourt = true
          }
          
      } // for area of law
      res.render('individual-location-pages/generic')
      return
    } // if court 
  // unlisted court so use address details from courts_search list and defaults
  }
  console.log('started default ')


  for (let i=0; i < courtSearch.courts_search.length; i++) {

    if (courtShortName == courtSearch.courts_search[i].slug.toLowerCase()) {
      req.app.locals.courtName = courtSearch.courts_search[i].name
      // court codes
      req.app.locals.courtCodeCounty = courtSearch.courts_search[i].number
      // addresses
      req.app.locals.courtVisitWriteAddress = true
      let addressSplit = courtSearch.courts_search[i].address.split('!')
      console.log('address[0] ' +  addressSplit[0])

      if (courtShortName.includes('probate')) {

      }
            
      req.app.locals.courtVisitAddress1 = addressSplit[0]

      if (addressSplit[1]) {
        req.app.locals.courtVisitAddress2 = addressSplit[1]
      }
      if (addressSplit[2]) {
        req.app.locals.courtVisitAddress3 = addressSplit[2]
      }

      req.app.locals.courtVisitTown = courtSearch.courts_search[i].town_name 
      req.app.locals.courtVisitPostcode = courtSearch.courts_search[i].postcode        

      // long and lat
      req.app.locals.courtGoogleMapsLocation = 'https://maps.google.com/maps?q=' + courtSearch.courts_search[i].lat + ',' + courtSearch.courts_search[i].lon

      // image src
      req.app.locals.courtImgLoc = '/public/images/court.png' 

      // other fields

      // contacts 

          req.app.locals.courtPhoneEnquiries = '01234 567 890'
          req.app.locals.courtPhoneUrgent = '01234 567 890'
          req.app.locals.courtPhoneCoP = '01234 567 891'
          req.app.locals.courtPhoneHighCourt = '01234 567 892'
          req.app.locals.courtDXNumber = '01234 567 893'

          req.app.locals.courtEmailEnquiries = 'enquiries.' + courtSearch.courts_search[i].town_name.toLowerCase() + '@justice.gov.uk'
          req.app.locals.courtEmailUrgent = 'urgent.' + courtSearch.courts_search[i].town_name.toLowerCase() + '@justice.gov.uk'
          req.app.locals.courtEmailListing = 'listings.' + courtSearch.courts_search[i].town_name.toLowerCase() + '@justice.gov.uk'
          req.app.locals.courtEmailBaillifs = 'baillifs.' + courtSearch.courts_search[i].town_name.toLowerCase() + '@justice.gov.uk'
          req.app.locals.courtEmailFamily = 'family.' + courtSearch.courts_search[i].town_name.toLowerCase() + '@justice.gov.uk'
         

      //service areas to display in sidebar
    
        if (courtShortName.includes('civil')) {
          req.app.locals.moneyClaimsServiceAtCourt = true
        }
    
        if (courtShortName.includes('probate')) {
              req.app.locals.probateServiceAtCourt = true
          }

        if (courtShortName.includes('tribunal')) {
            req.app.locals.benefitsServiceAtCourt = true
          }

        if (courtShortName.includes('immigration')) {
            req.app.locals.immigrationServiceAtCourt = true
          }

        if (courtShortName.includes('employment')) {
            req.app.locals.employmentServiceAtCourt = true
            req.app.locals.civilPartnershipServiceAtCourt = true
          }

        if (courtShortName.includes('divorce')) {
            req.app.locals.divorceServiceAtCourt = true
            req.app.locals.civilPartnershipServiceAtCourt = true
          }
         
        if (courtShortName.includes('family')) {
            req.app.locals.domesticAbuseServiceAtCourt = true
            req.app.locals.forcedMarriageServiceAtCourt = true
            req.app.locals.childArrangementsServiceAtCourt = true
            req.app.locals.adoptionServiceAtCourt = true
            req.app.locals.FGMServiceAtCourt = true
          }

          if (courtShortName.includes('justice-centre')) {
            req.app.locals.domesticAbuseServiceAtCourt = true
            req.app.locals.forcedMarriageServiceAtCourt = true
            req.app.locals.childArrangementsServiceAtCourt = true
            req.app.locals.adoptionServiceAtCourt = true
            req.app.locals.FGMServiceAtCourt = true
            req.app.locals.moneyClaimsServiceAtCourt = true
            req.app.locals.crimeServiceAtCourt = true
          }

        if (courtShortName.includes('crown')) {
            req.app.locals.crimeServiceAtCourt = true
          }

        if (courtShortName.includes('magistrate')) {
            req.app.locals.crimeServiceAtCourt = true
          }

        if (courtShortName.includes('high-court')) {
            req.app.locals.highCourtServiceAtCourt = true
          }
 
    }
  }
   res.render('individual-location-pages/generic')
})
module.exports = router