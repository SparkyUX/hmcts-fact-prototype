const express = require('express')
const router = express.Router()
const url = require('url')
const app = express()
const lunr = require('lunr')
const fs = require('fs')

const courtDetails = require('./courtDetailsPlus.json')

const lunrStopWords = require('./views/includes/lunr-stop-words.json')
const createCorTList = require('./createCorTList.js');
const getServiceUrls = require('./getServiceUrls.js');

// Add your routes here - above the module.exports line
// 0.1 do you know the name of the CorT?

// 1.0 Search


// Using lunr for the search but only works for whole words, cannot make it work with wildcards '*''

router.post('/admin-list-location', function (req, res) {
  let searchList = []
  let searchListNames = []
  let locationSearchValue = req.session.data['location-search-value']
  req.app.locals.locationSearch = locationSearchValue
  let documents = courtDetails.courts 
  if locationSearchValue
// create lunr index and search fields
  let idx = lunr(function(){
    this.ref('slug')
    this.field('name')
    this.field('addresses')
    this.field('town_name')
    this.field('postcode')    

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
    else {
      searchList = courtDetails
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

    res.render('admin/list-courts')
  }

})

module.exports = router