const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()

// Add your routes here - above the module.exports line


router.get('/area-of-law/search-aol-results-multiple', function(req, res) {
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
        displayAoL = ' '
        break

    }
    req.app.locals.displayAoL = displayAoL
    req.app.locals.aolPostcode = req.session.data['aol-postcode'].toUpperCase(); 
    res.render('area-of-law/search-aol-results-multiple')

})


router.get('/area-of-law/search-aol-results-multiple-div-centre', function(req, res) {
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
  res.render('area-of-law/search-aol-results-multiple-div-centre')

})

router.get('/area-of-law/search-aol-results-multiple-ET', function(req, res) {
  var areaOfLaw = req.query.aol
  if (areaOfLaw == 'employment') {
    displayAoL = 'Employment'
  }
  else {
        displayAoL = ' '
  }
  req.app.locals.displayAoL = displayAoL
  req.app.locals.aolPostcode = req.session.data['aol-postcode'].toUpperCase(); 
  res.render('area-of-law/search-aol-results-multiple-ET')

})

router.get('/area-of-law/search-aol-results-single-ccmcc', function(req, res) {
  var areaOfLaw = req.query.aol
  if (areaOfLaw == 'moneyClaims') {
      displayAoL = 'Money Claims'
  }
  else {
        displayAoL = ' '
  }
  req.app.locals.displayAoL = displayAoL
  req.app.locals.aolPostcode = req.session.data['aol-postcode'].toUpperCase(); 
  res.render('area-of-law/search-aol-results-single-ccmcc')

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