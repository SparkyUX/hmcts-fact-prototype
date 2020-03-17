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
        case 'civilPartnership':
          displayAoL = 'Civil Partnership'
          break
        case 'crime':
          displayAoL = 'Crime'
          break
        case 'divorce':
          displayAoL = 'Divorce'
          break
        case 'domesticViolence':
          displayAoL = 'Domestic Violence'
          break
        case 'employment':
          displayAoL = 'Employment'
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
         case 'moneyClaims':
          displayAoL = 'Money Claims'
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
          displayCourtName = 'East Berskshire Magistrates Court'
          break
       case 'slough':
          displayCourtName = 'Slough County and Family Court'
          break
        case 'watford':
          displayCourtName = 'Watford Tribunal Hearing Centre'
          break
        case 'centralLonET':
          displayCourtName = 'Central London Employment Tribunal'
          break
        case 'croydon':
          displayCourtName = 'Croydon Employment Tribunal'
          break
        case 'eastLonTHC':
          displayCourtName = 'East London Tribunal Hearing Centre'
          break
        case 'westHantsMC':
          displayCourtName = 'West Hampshire Magistrates Court'
          break
        case 'southampton':
          displayCourtName = 'Southampton Combined Court Centre'
          break
        case 'cambridge':
          displayCourtName = 'Cambridge Magistrates Court'
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