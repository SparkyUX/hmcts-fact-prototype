const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()

// Add your routes here - above the module.exports line

// 0.1 what do you want to know about the CorT?

router.post('/search-route', function (req, res) {

  let searchRoute = req.session.data['what-do-you-want-to-know']
 
  if (searchRoute == 'find-a-court') {
    res.redirect('/location/location-search')
  }
  else
  {
    res.redirect('/service/service-start-or-continue')
   }
})

// 2.0 start or continue a service journey

router.post('/start-or-continue', function (req, res) {

  let startOrContinue = req.session.data['start-or-continue-service']
 
  if (startOrContinue == 'start-a-service') {
    req.app.locals.serviceStartOrContinue = "start"
    req.app.locals.continueService = false
  }
  else 
  {
    req.app.locals.serviceStartOrContinue = "continue"
    req.app.locals.continueService = true
  } 

  res.redirect('/service/service-category')

})

// 2.1, 2.2 Choose category

router.post('/choose-service-category', function (req, res) {

  let serviceCategory = req.session.data['choose-service-category']
  let pageServiceCategory = ""

  switch (serviceCategory) {
    case 'money-tax':
//      displayCategory = 'Money and tax'
      pageServiceCategory = 'service-area-money-tax'
      break
    case 'deaths-marriages-civil-partnerships':
//      displayCategory = 'Deaths, marriages and civil partnerships'
      pageServiceCategory = 'service-area-deaths-marriages-civil-partnerships'
    break
    case 'childcare-parenting':
//      displayCategory = 'Childcare and parenting'
      pageServiceCategory = 'service-area-childcare-parenting'
      break
    case 'crime':
//      displayCategory = 'Crime'
      pageServiceCategory = 'service-area-crime'
      break
    case 'high-courts':
//      displayCategory = 'High Courts'
      pageServiceCategory = ''
      break
    default:
//      displayCategory = ''     
// TO:DO check his  
      pageServiceCategory = 'unknown-service'
      break

  }

//  req.app.locals.displayAoL = displayAoL

  res.redirect('/service/' + pageServiceCategory)


})

// 2.x.a second level service area

router.post('/choose-area', function (req, res) {

  let serviceArea = req.session.data['choose-service-area'] 
  let serviceAreaQuery = ""
  serviceAreaQuery = serviceArea.replace(/ /g,"").toLowerCase()
  console.log('serviceAreaQuery ' + serviceAreaQuery)

  req.app.locals.displayArea = serviceArea
  console.log('define req.app.locals.displayArea ' + req.app.locals.displayArea)

  if (req.app.locals.serviceStartOrContinue == 'start') {
    res.redirect('/service/service-start?service=' + serviceAreaQuery)
  }
  else
  {
    res.redirect('/service/service-continue?service=' + serviceAreaQuery)
  }

})

// 2.1.1 How to start service online / paper / in-person

router.post('/how-to-start-service', function (req, res) {

  let howStartService = req.session.data['how-start-service']
  let redirectPage = ""
  console.log('req.app.locals.displayAoL ' + req.app.locals.displayAoL)
 
  if (howStartService == 'apply-online') {

    switch (req.app.locals.displayAoL) {

      case 'Adoption':
        redirectPage = 'service-online'
        break
      case 'Appealing a criminal sentence or verdict':
        redirectPage = 'service-online'
        break
      case 'Bankruptcy':
        redirectPage = 'service-online'
        break
      case 'Child arrangements':
        redirectPage = 'service-online'
        break
      case 'Civil Partnership':
        redirectPage = 'service-online'
        break
      case 'Crime':
        redirectPage = 'service-online'
        break
      case 'Divorce':
        redirectPage = 'service-online'
        break
      case 'Domestic Abuse':
        redirectPage = 'service-online'
        break
      case 'Employment':
        redirectPage = 'service-online'
        break
      case 'Female Genital Mutilation':
        redirectPage = 'service-online'
        break
      case 'Forced marriage':
        redirectPage = 'service-online'
        break
      case 'Giving evidence':
        redirectPage = 'service-online'
        break
      case 'High Court registry':
        redirectPage = 'service-online'
        break
      case 'Housing possession':
        redirectPage = 'service-online'
        break
      case 'Immigration and Asylum':
        redirectPage = 'service-online'
        break
      case 'Money Claims':
        redirectPage = 'online-money-claims'
        break
      case 'Probate':
        redirectPage = 'service-online'
        break
      case 'Benefits':
        redirectPage = 'service-online'
        break
      case 'Tax':
        redirectPage = 'service-online'
        break
      default:
        redirectPage = 'service-online'
        break
    }
  }

  else if (howStartService == 'apply-on-paper') {
    switch (req.app.locals.displayAoL) {
       case 'Adoption':
        redirectPage = 'service-paper'
        break
      case 'Appealing a criminal sentence or verdict':
        redirectPage = 'service-paper'
        break
      case 'Bankruptcy':
        redirectPage = 'service-paper'
        break
      case 'Child arrangements':
        redirectPage = 'service-paper'
        break
      case 'Civil Partnership':
        redirectPage = 'service-paper'
        break
      case 'Crime':
        redirectPage = 'service-paper'
        break
      case 'Divorce':
        redirectPage = 'service-paper'
        break
      case 'Domestic Abuse':
        redirectPage = 'service-paper'
        break
      case 'Employment':
        redirectPage = 'service-paper'
        break
      case 'Female Genital Mutilation':
        redirectPage = 'service-paper'
        break
      case 'Forced marriage':
        redirectPage = 'service-paper'
        break
      case 'Giving evidence':
        redirectPage = 'service-paper'
        break
      case 'High Court registry':
        redirectPage = 'service-paper'
        break
      case 'Housing possession':
        redirectPage = 'service-paper'
        break
      case 'Immigration and Asylum':
        redirectPage = 'service-paper'
        break
      case 'Money Claims':
        redirectPage = 'form-n1-money-claim'
        break
      case 'Probate':
        redirectPage = 'service-paper'
        break
      case 'Benefits':
        redirectPage = 'service-paper'
        break
      case 'Tax':
        redirectPage = 'service-paper'
        break
      default:
        redirectPage = 'service-paper'
        break
   
   }
  }
  else if (howStartService == 'in-person') {
    redirectPage = '/service/service-search-postcode'
  }
  
  console.log('redirectPage ' + redirectPage)
  console.log('howStartService ' + howStartService)
  res.redirect('/service/' + redirectPage)
})

// 2.2.1 Continue service

router.post('/visit-send-other', function (req, res) {

  let whatInfoWant = req.session.data['what-info-want']
  console.log('req.query.service ' + req.query['service'])
  console.log()
 
  if (whatInfoWant == 'other') {
    // TO:DO determined by AoL will be owning court or CTSC or regional centre
    res.redirect('../exit')
  }
  else {
        res.redirect('/service/service-search-postcode?service=' + req.query.service)
  }

})

// 2.2.2 service postcode search

router.post('/service-postcode', function (req, res) {

  let serviceSearchPostcode = req.session.data['service-search-value'].toLowerCase();
  req.app.locals.serviceSearchPostcode = serviceSearchPostcode

  if ( serviceSearchPostcode.includes("rg10") ) {
     res.redirect('/service/service-search-results-single-ccmc')
  }
  else 
  {
    res.redirect('/service/service-search-results-multiple')

   }
})


router.get('/service/search-aol-results-multiple', function(req, res) {
  var areaOfLaw = req.query.aol

    switch (areaOfLaw) {
      case 'adoption':
        displayAoL = 'Adoption'
        break
      case 'bankruptcy':
        displayAoL = 'Bankruptcy'
        break
     case 'children':
        displayAoL = 'Children'
        break
      case 'crime':
        displayAoL = 'Crime'
        break
      case 'domesticAbuse':
        displayAoL = 'Domestic Abuse'
        break
      case 'forcedMarriageFGM':
        displayAoL = 'Forced Marriage and FGM'
        break
       case 'highCourtRegistry':
        displayAoL = 'High Court Registry'
        break
       case 'housingPossession':
        displayAoL = 'Housing Possession'
        break
       case 'immigration':
        displayAoL = 'Immigration'
        break
       case 'probate':
        displayAoL = 'Probate and Wills'
        break
       case 'sscs':
        displayAoL = 'Social Security'
        break
       case 'tax':
        displayAoL = 'Tax'
        break
      default:
        displayAoL = ''
        break

    }
    req.app.locals.displayAoL = displayAoL
    req.app.locals.aolPostcode = req.session.data['service-postcode'].toUpperCase(); 
    res.render('service/search-aol-results-multiple')

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
  req.app.locals.locationSearch = locationSearchValue

  if ( locationSearchValue.includes("crown")) {
  	 res.redirect('/location/location-search-results-single')
  }
  else 
  {
    res.redirect('/location/location-search-results-multiple')

   }
})


router.get('/individual-location-pages/generic', function(req, res) {
  var courtName = req.query.courtName
  console.log('courtName query string ' + courtName)

    switch (courtName) {
        case 'wycombe':
          displayCourtName = 'High Wycombe County Court and Family Court'
          break
        case 'eastBerks':
          displayCourtName = "East Berkshire Magistrates' Court"
          break
       case 'slough':
          displayCourtName = 'Slough County and Family Court'
          break
        case 'watford':
          displayCourtName = 'Watford Tribunal Hearing Centre'
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
    res.render('individual-location-pages/generic')

})
module.exports = router