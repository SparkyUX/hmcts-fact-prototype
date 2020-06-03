const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()

// Add your routes here - above the module.exports line

// 0.1 what do you want to know about the CorT?

router.post('/search-route', function (req, res) {

  let searchRoute = req.session.data['what-do-you-want-to-know']

  switch (searchRoute) {
    case 'find-a-court' :
      res.redirect('/location/location-search')
    break
    case 'find-which-court':
      res.redirect('/service/service-start-or-continue')
    break
    case 'find-where-pay-fine':
      res.redirect('/service/service-search-postcode')
    default :
      res.redirect('/service/service-start-or-continue')
    break
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
      pageServiceCategory = 'unknown-service'
      break

  }

//  req.app.locals.displayAoL = displayAoL

// TODO add high court branch here
  res.redirect('/service/' + pageServiceCategory)


})

// 2.x.a second level service area

router.post('/choose-area', function (req, res) {

  let serviceArea = req.session.data['choose-service-area'] 
  serviceAreaQuery = serviceArea.replace(/ /g,"").toLowerCase()
  console.log('serviceAreaQuery ' + serviceAreaQuery)

  req.app.locals.displayArea = serviceArea
  console.log('define req.app.locals.displayArea ' + req.app.locals.displayArea)

  if (req.app.locals.serviceStartOrContinue == 'start') {
    res.redirect('/service/service-start?serviceArea=' + serviceAreaQuery)
  }
  else
  {
    res.redirect('/service/service-continue?serviceArea=' + serviceAreaQuery)
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
    //TODO add serviceArea
    redirectPage = '/service-search-postcode?serviceArea='
  }
  
  console.log('redirectPage ' + redirectPage)
  console.log('howStartService ' + howStartService)
  res.redirect('/service/' + redirectPage)
})

// 2.2.1 Continue service

router.post('/continue-service', function (req, res) {

  let whatInfoWant = req.session.data['what-info-want']
  console.log('req.query.serviceArea ' + req.query.serviceArea)
  console.log('req.param.serviceArea ' + req.param.serviceArea)
 
  if (whatInfoWant == 'other') {
    // TODO determined by AoL will be owning court or CTSC or regional centre
    res.redirect('../exit')
  }
  else {
        res.redirect('/service/service-search-postcode?serviceArea=' + req.param.serviceArea)
  }

})

// 2.2.2 service postcode search

router.post('/service-postcode', function (req, res) {

  let serviceSearchPostcode = req.session.data['service-search-value'].toUpperCase();
  req.app.locals.serviceSearchPostcode = serviceSearchPostcode

  if ( serviceSearchPostcode.toLowerCase().includes("rg10") ) {
     res.redirect('/service/service-search-results-single-ccmcc')
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
  var courtName = req.query.courtName
  console.log('courtName query string ' + courtName)

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
          displayCourtAddressVisitTown = 'Trumpton'
          displayCourtAddressVisitPostcode = 'PP1 1BM'

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
          displayCourtAddressVisitTown = 'Trumpton'
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

    res.render('individual-location-pages/generic')

})
module.exports = router