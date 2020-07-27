/* global $ */
import Search from './components/search.js'

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

// Initialise search
var $searchContainer = document.querySelector('[data-module="cort-search"]')
new Search($searchContainer).init()