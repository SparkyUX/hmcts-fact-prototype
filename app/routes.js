const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()
const lunr = require('lunr')
const fs = require('fs')
// const serviceDetails = require('./service_details.json')

// const cheerio = require('cheerio')
// const $ = cheerio.load('body')
// const fuzzySearch = require('fuzzy-search')
const courtDetailsAll = require('./courtDetailsAll.json')
const courtDetails = require('./court_details.json')
// const courtSearch = require('./court_search.json')
let searchList = []
// const re = /(<([^>]+)>)/ig

const lunrStopWords = require('./views/includes/lunr-stop-words.json')
// function to generate the list of courts based on the serviceArea
// const createCorTList = require('./createCorTList.js')
const getServiceDetails = require('./getServiceDetails.js')
const getCourtDetails = require('./getCourtDetails.js')

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
  let documents = courtDetailsAll.courts
  //error if no value entered
  if (locationSearchValue == "") {
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
      this.field('addresses')
      this.field('town_name')
      this.field('postcode')
      this.field('crown_location_code')
      this.field('county_location_code')
      this.field('magistrates_location_code')      

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
      }
    }

    // if more than one term entered make them both required to narrow down the search

    if (locationSearchValue !== null) {
      locationSearchTerm = '+' + locationSearchValue.trim().replace(/ /g, ' +')

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


// 2.0 Choose action - don't know the name of the court


router.post('/choose-action', function (req, res) {

  let chooseAction = req.session.data['choose-action']
  req.app.locals.serviceActionType = ""
  req.app.locals.level = 2
//  req.app.locals.continueService = false

  switch (chooseAction) {

    case 'find-nearest':
      req.app.locals.serviceActionType = "findNearest"
    break    
    case 'send-docs':
      req.app.locals.serviceActionType = "sendDocs"
      break
    case 'case-update':
     req.app.locals.serviceActionType = "getUpdate"
    break

    default :
      req.app.locals.serviceActionType = "notListed"
    break
  }   
  res.redirect('/service/service-category')

})

// 2.1 choose category

router.post('/choose-service-category', function (req, res) {
  // iniitialise the start pages
  
  let serviceCategory = req.session.data['choose-service-category']
  let pageServiceCategory = ""
  let courtList = []

// set default to plural and change if only one court or tribunal found
  req.app.locals.courtsOrTribunals = 'courts or tribunals' 

  req.app.locals.divorceService = false
  req.app.locals.civilPartnershipService = false
  req.app.locals.childService = false
  req.app.locals.sjsService = false
  req.app.locals.crimeService = false
  req.app.locals.nationalDisplayFlag = false
  req.app.locals.regionalDisplayFlag = false
  req.app.locals.serviceArea = false
  req.app.locals.catchmentArea = ""
  req.app.locals.searchListNames = []

  req.app.locals.ctscFlag = false
  req.app.locals.nationalDisplayFlag = false

// determine the next page
  switch (serviceCategory) {

    case 'money':
      pageServiceCategory = 'service-area-money'
      break

    case 'probate-divorce-civil-partnerships':
      pageServiceCategory = 'service-area-probate-divorce-civil-partnerships'
    break

    case 'childcare-parenting':
      pageServiceCategory = 'service-area-childcare-parenting'
      break

    case 'harm-abuse':
      pageServiceCategory = 'service-area-harm-abuse'
      break

    case 'crime':       
      pageServiceCategory = 'service-area-crime'
      break

    // service areas without a sub page
    case 'immigration-asylum':
      req.app.locals.serviceArea = "Immigration and asylum"
      pageServiceCategory = 'service-search-postcode?servicearea=immigrationandasylum'
      req.app.locals.serviceDetails = getServiceDetails(req.app.locals.serviceArea,null)

      courtList = getCourtDetails(req.app.locals.serviceDetails, req.app.locals.serviceActionType)
      req.app.locals.nationalDisplayFlag = courtList.nationalFlag
      req.app.locals.regionalDisplayFlag = courtList.regionalFlag
      req.app.locals.searchListNames = courtList.searchListNames

      if (courtList.postcodePage) {
        res.redirect('/service/service-search-postcode?servicearea=' + req.app.locals.serviceDetails.aol)
      }
      else {
        res.redirect('/service/service-search-results')
      }
      break

    case 'high-courts':
      req.app.locals.serviceArea = "High Court district registry"
      pageServiceCategory = 'service-search-postcode?servicearea=highcourts'
      req.app.locals.serviceDetails = getServiceDetails(req.app.locals.serviceArea,null)

      courtList = getCourtDetails(req.app.locals.serviceDetails, req.app.locals.serviceActionType)
      req.app.locals.nationalDisplayFlag = courtList.nationalFlag
      req.app.locals.regionalDisplayFlag = courtList.regionalFlag
      req.app.locals.searchListNames = courtList.searchListNames
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
  if (serviceArea === "other") {
    res.redirect('/service/service-category')
  }
  else {
    let searchListNames =[]
    let courtList = []

    serviceAreaQuery = serviceArea.replace(/ /g,"").toLowerCase()
    req.app.locals.ctscFlag = false
    req.app.locals.nationalDisplayFlag = false

    // child service used for message on postcode page

    req.app.locals.childService = false
    req.app.locals.nationalDisplayFlag = false 
    req.app.locals.regionalDisplayFlag = false

    // need to be reset again in case only goes back one page to the service area and not the service category
    req.app.locals.divorceService = false
    req.app.locals.civilPartnershipService = false
    req.app.locals.sjsService = false
    req.app.locals.crimeService = false


  // lower case for varaiables on front end pages
    req.app.locals.serviceArea = serviceArea.toLowerCase()

  // get the service information

    req.app.locals.serviceDetails = getServiceDetails(serviceArea,null)

    courtList = getCourtDetails(req.app.locals.serviceDetails, req.app.locals.serviceActionType)
    console.log('routes courtList ' + JSON.stringify(courtList))

    console.log('courtList.regionalFlag ' + courtList.regionalFlag)
    req.app.locals.regionalDisplayFlag = courtList.regionalFlag
    req.app.locals.nationalDisplayFlag = courtList.nationalFlag
    req.app.locals.searchListNames = courtList.searchListNames
    req.app.locals.postcodePage = courtList.postcodePage

    console.log('choose area req.app.locals.searchListNames ' + JSON.stringify(req.app.locals.searchListNames))
    console.log('choose area req.app.locals.regionalDisplayFlag ' + JSON.stringify(req.app.locals.regionalDisplayFlag))

    
    switch (serviceAreaQuery) {
      case 'childarrangements':        
        req.app.locals.childService = true
        break

      case 'civilpartnership':        
        req.app.locals.civilPartnershipService = true
        break    

      case 'divorce':            
        req.app.locals.divorceService = true
        break 

      case 'singlejusticeprocedure':
        req.app.locals.sjsService = true
        break
      
      case 'othercrime':     
        req.app.locals.crimeService = true
        break
    }
    
    console.log('courtList.postcodePage ' + courtList.postcodePage)

    if (courtList.postcodePage) {
      res.redirect('/service/service-search-postcode?servicearea=' + req.app.locals.serviceDetails.aol)
    }
    else {
      res.redirect('/service/service-search-results')
    }
  }
})

// 2.1.2 service postcode search


router.post('/service-postcode', function (req, res) {

  let serviceSearchPostcode = req.session.data['service-search-postcode'].toUpperCase()
  req.app.locals.serviceSearchPostcode = serviceSearchPostcode
  console.log('postcode req.app.locals.searchListNames ' + JSON.stringify(req.app.locals.searchListNames))
//  console.log('postcode req.app.locals.searchListNames.length ' + JSON.stringify(req.app.locals.searchListNames.length))

  req.app.locals.courtCount = req.app.locals.searchListNames.length
  if (req.app.locals.searchListNames.length === 1) {
    req.app.locals.courtsOrTribunals = 'court or tribunal' 
  }
  else {
    req.app.locals.courtsOrTribunals = 'courts or tribunals'
  }
  res.redirect('/service/service-search-results')

})

router.get('/service/service-search-results', function(req, res) { 
  console.log('req.app.locals.searchListNames ' + JSON.stringify(req.app.locals.searchListNames))
  res.render('service/service-search-results')
})

// 1.2a , 2.1.4a individual court

router.get('/individual-location-pages/generic', function(req, res) { 

  let courtShortName = req.query.courtname
// initialise display values 
  req.app.locals.courtVisitAddress1 = ""
  req.app.locals.courtVisitAddress2 = ""
  req.app.locals.courtVisitAddress3 = ""
  req.app.locals.courtWriteAddress1 = ""
  req.app.locals.courtWriteAddress2 = ""
  req.app.locals.courtWriteAddress3 = ""
  req.app.locals.courtAdditionalInfo = ""
  req.app.locals.courtUrgentInfo = ""
  req.app.locals.courtOpenBuilding = ""
  req.app.locals.courtOpenCounter = ""

  req.app.locals.courtAdditionalInfo = ""
  req.app.locals.courtUrgentInfo = ""

  req.app.locals.courtPhoneEnquiries = ""
  req.app.locals.courtWelshPhone = ""
  req.app.locals.courtWelshPhoneExplanation =""
  req.app.locals.courtScottishPhone = ""
  req.app.locals.courtScottishPhoneExplanation =""
  req.app.locals.courtPhoneCoP = ""
  req.app.locals.courtPhoneHighCourt = ""
  req.app.locals.courtDXNumber = ""

  req.app.locals.courtEmailEnquiries = ""
  req.app.locals.courtScottishEmailEnquiries = ""
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

  req.app.locals.ctscFlag = false


  req.app.locals.courtPhoneEnquiries = '01234 567 890'


  for (let i=0; i < courtDetailsAll.courts.length; i++) {  

    if (courtShortName == courtDetailsAll.courts[i].slug) {
//      console.log('courtDetailsAll.courts[i].slug ' + courtDetailsAll.courts[i].slug)
//      console.log('courtDetailsAll.courts[i] ' + courtDetailsAll.courts[i])
//      console.log('req.app.locals.nationalDisplayFlag ' + req.app.locals.nationalDisplayFlag )
     console.log('courtDetailsAll ' + JSON.stringify(courtDetailsAll.courts[i]))

      if ( courtDetailsAll.courts[i].catchment_type === "national" || courtDetailsAll.courts[i].catchment_type === "regional") {
        req.app.locals.ctscFlag = true
        req.app.locals.catchmentArea = courtDetailsAll.courts[i].catchment_area
      }
      // professional user access scheme
      req.app.locals.puasFlag = courtDetailsAll.courts[i].puas


      // name
      req.app.locals.courtName = courtDetailsAll.courts[i].name
      // court codes
      req.app.locals.courtCodeCounty = courtDetailsAll.courts[i].county_location_code
      req.app.locals.courtCodeCrown = courtDetailsAll.courts[i].crown_location_code
      req.app.locals.courtCodeMagistrates = courtDetailsAll.courts[i].magistrates_location_code

      // addresses

      for (let j=0; j < courtDetailsAll.courts[i].addresses.length; j++) {

        let addressSplit = courtDetailsAll.courts[i].addresses[j].address.split('\n')
        if (req.app.locals.ctscFlag == false) {

          if (courtDetailsAll.courts[i].addresses[j].type == "Visit us or write to us" ) {
            req.app.locals.courtVisitWriteAddress = true
            
            req.app.locals.courtVisitAddress1 = addressSplit[0]

            if (addressSplit[1]) {
              req.app.locals.courtVisitAddress2 = addressSplit[1]
            }
            if (addressSplit[2]) {
              req.app.locals.courtVisitAddress3 = addressSplit[2]
            }

            req.app.locals.courtVisitTown = courtDetailsAll.courts[i].addresses[j].town 
            req.app.locals.courtVisitPostcode = courtDetailsAll.courts[i].addresses[j].postcode
          }

          if (courtDetailsAll.courts[i].addresses[j].type == "Visiting") {
            req.app.locals.courtSeparateAddress = true
            req.app.locals.courtVisitAddress1 = addressSplit[0]

            if (addressSplit[1]) {
              req.app.locals.courtVisitAddress2 = addressSplit[1]
            }
            if (addressSplit[2]) {
              req.app.locals.courtVisitAddress3 = addressSplit[2]
            }

            req.app.locals.courtVisitTown = courtDetailsAll.courts[i].addresses[j].town 
            req.app.locals.courtVisitPostcode = courtDetailsAll.courts[i].addresses[j].postcode

          }
        } // end not ctsc
        if (courtDetailsAll.courts[i].addresses[j].type == "Postal" ) {
          req.app.locals.courtWriteAddress1 = addressSplit[0]
          if (addressSplit[1]) {
            req.app.locals.courtWriteAddress2 = addressSplit[1]
          }
          if (addressSplit[2]) {
            req.app.locals.courtWriteAddress3 = addressSplit[2]
          }

          req.app.locals.courtWriteTown = courtDetailsAll.courts[i].addresses[j].town 
          let enq_name = courtDetailsAll.courts[i].slug.substring(0, courtDetailsAll.courts[i].slug.indexOf('-'))

          req.app.locals.courtWritePostcode = courtDetailsAll.courts[i].addresses[j].postcode

        }
      } // end addresses

      // text fields
      req.app.locals.courtAdditionalInfo = courtDetailsAll.courts[i].info.replace(/(<([^>]+)>)/ig,"").replace("&nbsp;","").replace("&rsquo;","\'")
      req.app.locals.courtUrgentInfo = courtDetailsAll.courts[i].urgent

      // long and lat
      req.app.locals.courtGoogleMapsLocation = 'https://maps.google.com/maps?q=' + courtDetailsAll.courts[i].lat + ',' + courtDetailsAll.courts[i].lon

      // image src

      let courtImgLoc = '/public/images/' + courtShortName + '.jpg' 
        if (fs.existsSync('./' + courtImgLoc)) {
            console.log('*** image found ***')
            req.app.locals.courtImgLoc = courtImgLoc
        }
        else {
          console.log('*** image not found ***')
          req.app.locals.courtImgLoc = '/public/images/court.png' 
        }
      // opening times
      let openingTimesDetails = []

      for (let j=0; j < courtDetailsAll.courts[i].opening_times.length; j++) {
        let openingDescription = courtDetailsAll.courts[i].opening_times[j].description
        let openingHours =   courtDetailsAll.courts[i].opening_times[j].hours
        let openingDetails = {openingDescription,openingHours}
        openingTimesDetails.push(openingDetails) 
      }
      req.app.locals.openingTimes = openingTimesDetails

      // contacts phone
      let contactPhoneDetails = []

      for (let j=0; j < courtDetailsAll.courts[i].contacts.length; j++) {
        if (courtDetailsAll.courts[i].contacts[j].description == "DX") {
          console.log('DX code ' + courtDetailsAll.courts[i].contacts[j].number)
          req.app.locals.courtDXNumber = courtDetailsAll.courts[i].contacts[j].number
        }

        else {
          let phoneDescription = courtDetailsAll.courts[i].contacts[j].description
          let phoneNumber = courtDetailsAll.courts[i].contacts[j].number
          let phoneExplanation = courtDetailsAll.courts[i].contacts[j].explanation
          let phoneDetails = {phoneDescription,phoneNumber,phoneExplanation}
          contactPhoneDetails.push(phoneDetails) 
        }        
        if (courtDetailsAll.courts[i].contacts[j].description  == 'Fax') {
          req.app.locals.courtFax = courtDetailsAll.courts[i].contacts[j].number
          req.app.locals.courtFaxExplanation = courtDetailsAll.courts[i].contacts[j].explanation
        }
        if (courtDetailsAll.courts[i].contacts[j].description  == 'Enquiries') {
          req.app.locals.courtPhoneEnquiries = courtDetailsAll.courts[i].contacts[j].number
          req.app.locals.courtPhoneEnquiriesExplanation = courtDetailsAll.courts[i].contacts[j].explanation
        }
        if (courtDetailsAll.courts[i].contacts[j].description == 'Enquiries Scotland') {
          req.app.locals.courtScottishPhone = courtDetailsAll.courts[i].contacts[j].number
          req.app.locals.courtScottishPhoneExplanation = courtDetailsAll.courts[i].contacts[j].explanation
        }
        if (courtDetailsAll.courts[i].contacts[j].description  == 'Enquiries Welsh language') {
          req.app.locals.courtWelshPhone = courtDetailsAll.courts[i].contacts[j].number
          req.app.locals.courtWelshPhoneExplanation = courtDetailsAll.courts[i].contacts[j].explanation
        }
      }         
      req.app.locals.phoneDetails = contactPhoneDetails
      // contacts
      //  email
      let contactEmailDetails = []

      for (let j=0; j < courtDetailsAll.courts[i].emails.length; j++) {
        console.log('routes courtDetailsAll.courts[i].emails[j].description ' + courtDetailsAll.courts[i].emails[j].description)
        if (courtDetailsAll.courts[i].emails[j].description == 'Enquiries') {
          req.app.locals.courtEmailEnquiries = courtDetailsAll.courts[i].emails[j].address
        }
        if (courtDetailsAll.courts[i].emails[j].description == 'Enquiries Scotland') {
          req.app.locals.courtScottishEmailEnquiries = courtDetailsAll.courts[i].emails[j].address
        }
        let emailDescription = courtDetailsAll.courts[i].emails[j].description
        let emailAddress = courtDetailsAll.courts[i].emails[j].address
        let emailExplanation = courtDetailsAll.courts[i].emails[j].explanation
        let emailDetails = {emailDescription,emailAddress,emailExplanation}
        contactEmailDetails.push(emailDetails) 

      } // emails
      req.app.locals.emailDetails = contactEmailDetails

      //service areas to display in sidebar
      let serviceAreasAtCourt = []

      for (let j=0; j < courtDetailsAll.courts[i].areas_of_law.length; j++) {
//        console.log('courtDetailsAll.courts[i].areas_of_law[j] ' + courtDetailsAll.courts[i].areas_of_law[j])
        serviceDetails = getServiceDetails(null,courtDetailsAll.courts[i].areas_of_law[j])
        console.log('serviceStartDetails ' + JSON.stringify(serviceDetails ))
        if (req.app.locals.ctscFlag) {
          req.app.locals.serviceArea = serviceDetails.service
        }
        serviceAreasAtCourt.push(serviceDetails) 
      }

      req.app.locals.serviceAreasAtCourt = serviceAreasAtCourt
      console.log('serviceAreasAtCourt ' + JSON.stringify(serviceAreasAtCourt ))

    } // if court 
  }
  console.log('DX code ' + req.app.locals.courtDXNumber)
  res.render('individual-location-pages/generic')
})
module.exports = router