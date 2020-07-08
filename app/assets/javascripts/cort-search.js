/* global XMLHttpRequest */
import accessibleAutocomplete from 'accessible-autocomplete'

const candts = {
  "courts": [{
      "name": "Reading Crown Court",
      "crown_location_code": 449,
      "county_location_code": null,
      "magistrates_location_code": null,
      "addresses": {
        "address": "Old Shire Hall The Forbury",
        "town": "Reading",
        "postcode": "RG1 3EH"
      }
    },
    {
      "name": "Reading County Court and Family Court",
      "crown_location_code": null,
      "county_location_code": 305,
      "magistrates_location_code": null,
      "addresses": {
        "address": "Hearing Centre160-163 Friar Street",
        "town": "Reading",
        "postcode": "RG1 1HE"
      }
    },
    {
      "name": "Reading Tribunal Hearing Centre",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": null,
      "addresses": {
        "address": "Watford Employment Tribunal,Radius House 51 Clarendon Road",
        "town": "Watford",
        "postcode": "WD17 1HP"
      }
    },
    {
      "name": "Reading Magistrates' Court and Family Court",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": 1076,

      "addresses": {
        "address": "Castle Street",
        "town": "Reading",
        "postcode": "RG1 7TQ"
      }
    },
    {
      "name": "High Wycombe County Court and Family Court",
      "crown_location_code": null,
      "county_location_code": 223,
      "magistrates_location_code": null,
      "addresses": {
        "type": "Visiting",
        "address": "The Law Courts,Ground Floor,Easton Street",
        "town": "High Wycombe",
        "postcode": "HP11 1LR"
      }
    },
    {
      "name": "High Wycombe Magistrates' Court and Family Court",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": 1117,
      "addresses": {
        "type": "Visiting",
        "address": "Law Courts,Easton Street,",
        "town": "High Wycombe",
        "postcode": "HP11 1LR"
      }
    },
    {
      "name": "East Berkshire Magistrates' Court, Slough",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": 1920,

      "addresses": {
        "type": "Visiting",
        "address": "Law Courts,Chalvey Park,Off Windsor Road,",
        "town": "Slough",
        "postcode": "SL1 2HJ"
      }
    },
    {
      "name": "Slough County Court and Family Court",
      "crown_location_code": null,
      "county_location_code": 327,
      "magistrates_location_code": null,
      "addresses": {
        "type": "Visiting",
        "address": "The Law Courts,Windsor Road",
        "town": "Slough",
        "postcode": "SL1 2HE"
      }
    },
    {
      "name": "Staines County Court and Family Court",
      "crown_location_code": null,
      "county_location_code": 334,
      "magistrates_location_code": null,
      "addresses": {
        "type": "Visiting",
        "address": "The Law Courts,Knowle Green",
        "town": "Staines",
        "postcode": "TW18 1XH"
      }
    },
    {
      "name": "Staines Magistrates' Court and Family Court",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": 2849,
      "addresses": {
        "type": "Postal",
        "address": "PO Box 36,The Law Courts,Mary Road",
        "town": "Guildford",
        "postcode": "GU1 4AS"
      }
    },
    {
      "name": "Watford County Court and Family Court",
      "crown_location_code": null,
      "county_location_code": 362,
      "magistrates_location_code": null,
      "addresses": {
        "type": "Visit us or write to us",
        "address": "3rd Floor,Cassiobury House,11-19 Station Road,",
        "town": "Watford",
        "postcode": "WD17 1EZ"
      }
    },
    {
      "name": "Harmondsworth Tribunal Hearing Centre", 
      "crown_location_code": null, 
      "county_location_code": null, 
      "magistrates_location_code": null, 
       "addresses": {"address": "Colnbrook Bypass\n\n\n", "town": "Harmondsworth", "postcode": "UB7 0HD"}
    },

    {
      "name": "Birmingham Civil and Family Justice Centre", 
      "crown_location_code": null, 
      "county_location_code": 127, 
      "magistrates_location_code": null, 
      "addresses": {
        "address": "Priory Courts 33 Bull Street", 
        "town": "Birmingham", 
      "postcode": "B4 6DS"}
    },

    {
      "name": "County Court Money Claims Centre (CCMCC)",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": null,

      "addresses": {
        "type": "Postal",
        "address": "County Court Money Claims Centre,PO Box 527,,",
        "town": "Salford",
        "postcode": "M5 0BY"
      }
    },

    {
      "name": "Probate Service Centre",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": null,
      "addresses": {
        "address": "HMCTS Probate,PO Box 12625",
        "town": "Harlow",
        "postcode": "CM20 9QE"
      }
    },
    {
      "name": "Bury St Edmunds Regional Divorce Centre",
      "crown_location_code": null,
      "county_location_code": null,
      "magistrates_location_code": null,

      "addresses": {
        "address": "2nd Floor,Triton House,St Andrews Street North",
        "town": "Bury St Edmunds",
        "postcode": "IP33 1TR"
      }
    },
    {"name": "Oxford District Probate Registry","crown_location_code": null, "county_location_code": null, "magistrates_location_code": null, "addresses": 
      {"address": "Combined Court Building,St Aldates", "town": "Oxford", "postcode": "OX1 1LY"}},
    {"name": "London Probate Department", "crown_location_code": null, "county_location_code": null, "magistrates_location_code": null,  
      "addresses": {"address": "42-49 High Holborn,First Avenue House", "town": "Holborn", "postcode": "WC1V 6NP"}},
    {"name": "Winchester District Probate Registry",  "crown_location_code": null, "county_location_code": null, "magistrates_location_code": null, 
      "addresses": { "address": "1st Floor,Southside Offices,The Law Courts", "town": "Winchester", "postcode": "SO23 9EL"}},
    {"court_code": "administrativecourt","name": "Administrative Court", "slug": "administrative-court", "specialist_court":"Administrative Court","link":"https://www.gov.uk/courts-tribunals/administrative-court","info": "", "open": true, "directions": null, "lat": 51.5136453784373, "lon": -0.113546081010873, "crown_location_code": null, "county_location_code": null, "magistrates_location_code": null,
     "addresses": {"type": "Visit us or write to us", "address": "Administrative Court Office,The Royal Courts of Justice,Strand", "town": "London", "postcode": "WC2A 2LL"}}
]
}

  accessibleAutocomplete({
    element: document.querySelector('#cort-search-container'),
    id: 'cort-search-container',
    source: cants
  })