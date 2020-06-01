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

  req.app.locals.displayArea = serviceArea
  console.log('define req.app.locals.displayArea ' + req.app.locals.displayArea)

  if (req.app.locals.serviceStartOrContinue == 'start') {
    res.redirect('/service/service-start')
  }
  else
  {
    res.redirect('/service/service-continue')
  }

})

// 2.1.1 How to start service online / paper /in-person

router.post('/how-to-start-service', function (req, res) {

  let howStartService = req.session.data['how-start-service']
  let redirectPage = ""
  console.log('req.app.locals.displayAoL ' + req.app.locals.displayAoL)
 
  if (howStartService == 'apply-online') {

    switch (req.app.locals.displayAoL) {

      case 'Adoption':
        redirectPage = 'Adoption'
        break
      case 'Appealing a criminal sentence or verdict':
        redirectPage = 'Bankruptcy'
        break
      case 'Bankruptcy':
        redirectPage = 'Bankruptcy'
        break
      case 'Child arrangements':
        redirectPage = 'Child arrangements'
        break
      case 'Civil Partnership':
        redirectPage = 'Civil partnership'
        break
      case 'Crime':
        redirectPage = 'Crime'
        break
      case 'Divorce':
        redirectPage = 'Divorce'
        break
      case 'Domestic Abuse':
        redirectPage = 'Domestic abuse'
        break
      case 'Employment':
        redirectPage = 'Employment'
        break
      case 'Female Genital Mutilation':
        redirectPage = 'Forced marriage and FGM'
        break
      case 'Forced marriage':
        redirectPage = 'Forced marriage and FGM'
        break
      case 'Giving evidence':
        redirectPage = 'High Court registry'
        break
      case 'High Court registry':
        redirectPage = 'High Court registry'
        break
      case 'Housing possession':
        redirectPage = 'Housing possession'
        break
      case 'Immigration and Asylum':
        redirectPage = 'Immigration and asylum'
        break
      case 'Money Claims':
        redirectPage = 'Money claims'
        break
      case 'Probate':
        redirectPage = 'Probate'
        break
      case 'Benefits':
        redirectPage = 'Social security'
        break
      case 'Tax':
        redirectPage = 'Tax'
        break
      default:
        redirectPage = ''
        break
    }
  }

  else if (howStartService == 'apply-on-paper') {
    switch (req.app.locals.displayAoL) {
      case 'Adoption':
        redirectPage = 'Adoption'
        break
      case 'Appealing a criminal sentence or verdict':
        redirectPage = 'Bankruptcy'
        break
      case 'Bankruptcy':
        redirectPage = 'Bankruptcy'
        break
      case 'Child arrangements':
        redirectPage = 'Child arrangements'
        break
      case 'Civil Partnership':
        redirectPage = 'Civil partnership'
        break
      case 'Crime':
        redirectPage = 'Crime'
        break
      case 'Divorce':
        redirectPage = 'Divorce'
        break
      case 'Domestic Abuse':
        redirectPage = 'Domestic abuse'
        break
      case 'Employment':
        redirectPage = 'Employment'
        break
      case 'Female Genital Mutilation':
        redirectPage = 'Forced marriage and FGM'
        break
      case 'Forced marriage':
        redirectPage = 'Forced marriage and FGM'
        break
      case 'Giving evidence':
        redirectPage = 'High Court registry'
        break
      case 'High Court registry':
        redirectPage = 'High Court registry'
        break
      case 'Housing possession':
        redirectPage = 'Housing possession'
        break
      case 'Immigration and Asylum':
        redirectPage = 'Immigration and asylum'
        break
      case 'Money Claims':
        redirectPage = 'Money claims'
        break
      case 'Probate':
        redirectPage = 'Probate'
        break
      case 'Benefits':
        redirectPage = 'Social security'
        break
      case 'Tax':
        redirectPage = 'Tax'
        break
      default:
        redirectPage = ''
        break
   
   }
  }
  else if (howStartService == 'in-person') {
    redirectPage = '/service/search-aol-postcode'
  }
  
  console.log('redirectPage ' + redirectPage)
  console.log('howStartService ' + howStartService)
  res.redirect(redirectPage)
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
    req.app.locals.aolPostcode = req.session.data['aol-postcode'].toUpperCase(); 
    res.render('service/search-aol-results-multiple')

})

router.post('/visit-send-other', function (req, res) {

  let whatInfoWant = req.session.data['what-info-want']
 
  if (whatInfoWant == 'other') {
    // TO:DO determined by AoL will be owning court or CTSC or regional centre
    res.redirect('../exit')
  }
  else {
        res.redirect('/service/search-aol-postcode')
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
  req.app.locals.aolPostcode = req.session.data['aol-postcode'].toUpperCase(); 
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
  req.app.locals.aolPostcode = req.session.data['aol-postcode'].toUpperCase(); 
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
  req.app.locals.aolPostcode = req.session.data['aol-postcode'].toUpperCase(); 
  res.render('service/search-aol-results-single-ccmcc')

})

router.post('/search-for-location', function (req, res) {

  let locationSearchValue = req.session.data['location-search-value'].toLowerCase();
  req.app.locals.locationSearch = locationSearchValue

  if ( locationSearchValue.includes("crown")) {
  	 res.redirect('/location/search-loc-results-single')
  }
  else 
  {
    res.redirect('/location/search-loc-results-multiple')

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