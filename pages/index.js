import Head from 'next/head'
import fs from 'fs'
import path from 'path'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/collection.module.sass'
import IconButton from '../components/icon-button'
import Icon from '../components/icon'
import Button from '../components/button'
import { fetchInscriptionNumber } from '@/lib/utils'

export async function getStaticProps() {
  let inscriptions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/inscriptions.json')))
  let config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/config.json')))

  // Generate trait counts (i.e. how many of each trait are there)
  let _traitCounts = {}
  for (let inscription of inscriptions) {
    let attributes = inscription.meta.attributes
    for (let attribute of attributes) {
      if (!(attribute.trait_type in _traitCounts)) {
        _traitCounts[attribute.trait_type] = {}
      }
      if (!(attribute.value in _traitCounts[attribute.trait_type])) {
        _traitCounts[attribute.trait_type][attribute.value] = 0
      }
      _traitCounts[attribute.trait_type][attribute.value]++
    }
    
    inscription.inscription_number = await fetchInscriptionNumber(inscription.id)
  }

  // Now we have trait counts, need to sort them so they are displayed correctly in the filter pane
  // Traits are sorted by their count, and properties are sorted alphabetically
  // Properties starting with numbers (e.g 1/1 are moved to the end)
  let traitCounts = {}
  let propertyNames = Object.keys(_traitCounts)
  propertyNames.sort()
  // Manually move numeric properties to end
  while (/\d/.test(propertyNames[0][0])) {
    propertyNames.push(propertyNames.splice(0, 1))
  }

  for (let property of propertyNames) {
    traitCounts[property] = {}
    // Sort trait names alphabetically first, then by count (that way, traits with same counts are sorted alphabetically)
    let traitNames = Object.keys(_traitCounts[property])
    traitNames.sort()
    traitNames.sort((a, b) => _traitCounts[property][b] - _traitCounts[property][a])
    for (let trait of traitNames) {
      traitCounts[property][trait] = _traitCounts[property][trait]
    }
  }

  return {
    props: {
      inscriptions,
      traitCounts,
      config
    }
  }
}

function setQuery(router, filterList) {
  var query = encodeURIComponent(filterList.map((filter) => `${filter.property}-${filter.trait}`).join('.'))
  query = `filters=${query}`
  
  // Check if query is different. No need to do anything if it is the same
  var currentQuery = router.asPath
  currentQuery = currentQuery.substring(currentQuery.indexOf('?') + 1)
  if (currentQuery == query) {
    return
  }

  if (query.length > 0) {
    router.push(`/?${query}`, undefined, {shallow: true})
  } else {
    router.push("/", undefined, {shallow: true})
  }
}

function parseFilters(router, traitCounts, sortSelection, sortReversed) {
  let filterQuery = router.query['filters']
  if (!filterQuery) {
    return []
  }
  var queryValid = true
  let filters = []

  let splitList = filterQuery.split('.')
  for (let filterString of splitList) {
    let params = filterString.split('-')
    if (params.length != 2) {
      queryValid = false
      continue
    }
    let filter = {property: params[0], trait: params[1]}
    if (filter.property in traitCounts && filter.trait in traitCounts[filter.property]) {
      filters.push(filter)
    } else {
      queryValid = false
    }
  }

  if (!queryValid) {
    setQuery(router, filters)
  }

  return filters
}

function generateTraitFilters(filters, traitCounts) {
  let traitFilters = {}
  for (let property of Object.keys(traitCounts)) {
    traitFilters[property] = {}
    for (let trait of Object.keys(traitCounts[property])) {
      traitFilters[property][trait] = false
    }
  }

  for (let filter of filters) {
    traitFilters[filter.property][filter.trait] = true
  }
  return traitFilters
}

function filterInscriptions(inscriptions, traitFilters) {
  let filteredInscriptions = []
  for (let inscription of inscriptions) {
    var inFilter = true
    
    for (let property of Object.keys(traitFilters)) {
      // If all filters are false, then we match everything, so skip this property
      if (!Object.values(traitFilters[property]).reduce((acc, val) => acc || val)) {
        continue
      }
      
      // If there is a attribute that matches a filter for this property, it could be in the filter, otherwise it's definitely not
      var propertyInFilter = false
      for (let attribute of inscription.meta.attributes) {
        if (attribute.trait_type == property && traitFilters[attribute.trait_type][attribute.value]) {
          propertyInFilter = true
          break
        }
      }
      if (!propertyInFilter) {
        inFilter = false
        break
      }
    }

    if (inFilter) {
      filteredInscriptions.push(inscription)
    }
  }
  return filteredInscriptions
}

export default function Collection({ inscriptions, traitCounts, config }) {
  const router = useRouter()

  const [filters, setFilters] = useState(() => parseFilters(router, traitCounts))
  const [traitFilters, setTraitFilters] = useState(() => generateTraitFilters(filters, traitCounts))
  const [filteredInscriptions, setFilteredInscriptions] = useState(() => 
      filterInscriptions(inscriptions, traitFilters))
  const [sideBarOpen, setSideBarOpen] = useState(false)

  // Set up filters when query is changed
  useEffect(() => {
    let filters = parseFilters(router, traitCounts)
    setFilters(filters)

    let traitFilters = generateTraitFilters(filters, traitCounts)
    setTraitFilters(traitFilters)

    setFilteredInscriptions(filterInscriptions(inscriptions, traitFilters))
  }, [router, router.query, inscriptions, traitCounts])

  function toggleSideBar() {
    setSideBarOpen(!sideBarOpen)
  }

  // Add/remove filter from filterList, then set the query
  function setFilterState(property, trait, state) {
    let filter = {"property": property, "trait": trait}
    if (state) {
      filters.push(filter)
    } else {
      var index = -1
      for (let i = 0; i < filters.length; i++) {
        if (filters[i].property == filter.property && filters[i].trait == filter.trait) {
          index = i
          break
        }
      }
      filters.splice(index, 1)
    }
    setQuery(router, filters)
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>{config.title}</title>
        <meta name="description"
              content={config.description}
              key="desc"/>
      </Head>
      <main className={styles.main}>
        <SideBar isOpen={sideBarOpen} filters={traitFilters} counts={traitCounts} setState={setFilterState} toggleSideBar={toggleSideBar}/>
        <div className={styles.mainContainer}>
          <div className={styles.topContainer}>
            <Button text="Filter" icon="filter" onClick={toggleSideBar} style={{ letterSpacing: "0.07rem" }}/>
            {filters.length > 0 &&
              <div className={styles.filterContainer}>
                {filters.map((filter) => 
                  <FilterCard property={filter.property} trait={filter.trait} setState={setFilterState} key={`card_${filter.property}_${filter.trait}`}/>
                )}
                <p className={styles.clearAll} onClick={() => setQuery(router, [])}>Clear All</p> 
              </div>
            }
          </div>
          <div className={styles.collectionContainer}>
            {filteredInscriptions.map((inscription) => 
              <Link href={`/${inscription.id}`} key={inscription.meta.name}>
                <div className={styles.imageCard}>
                  <div className={styles.imageContainer}>
                    <Image src={`https://ordinals.com/content/${inscription.id}`}
                           fill
                           style={{ objectFit: "contain" }}
                           alt={`Image of #${inscription.inscription_number}`}/>
                  </div>
                  <h1>{`#${inscription.inscription_number}`}</h1>
                </div>
              </Link>
              )
            }
            {filteredInscriptions.length == 0 &&
              <h1>No items found for this search</h1>
            }
          </div>
        </div>
      </main>
    </>
  )
}

function FilterCard({ property, trait, setState }) {
  return (
    <div className={styles.filterCard}>
      <p className={styles.filterCardProperty}>{property}: </p>
      <p className={styles.filterCardTrait}>{trait}</p>
      <Icon icon="exit" onClick={ () => setState(property, trait, false) } className={styles.filterCardExit} />
    </div>
  )
}

function SideBar({ isOpen, filters, counts, setState, toggleSideBar }) {
  return (
    <div className={styles.resizableContainer} open={isOpen}>
      <div className={styles.propertyList}>
        <div className={styles.exitContainer}>
          <h1>Filters</h1>
          <IconButton icon="exit" onClick={toggleSideBar} ariaLabel="Close Filter" style={{
            margin: "0.3rem",
            position: "absolute",
            right: "0px",
            width: "2.5rem"
          }}/>
        </div>
        {Object.keys(filters).map((property) => 
          <FilterProperty property={property} filters={filters[property]} counts={counts[property]} key={`property_${property}`} setState={setState}/>
        )}
      </div>
    </div>
  )
}

function FilterProperty({ property, filters, counts, setState }) {
  const [open, setOpen] = useState(false)

  function toggleOpen() {
    setOpen(!open)
  }

  return (
    <div className={styles.propertyContainer}>
      <button className={styles.propertyButton} onClick={toggleOpen}>
        <p>{property}</p>
        <p>{Object.keys(filters).length}</p>
        <Icon icon="caret-down" className={styles.downArrow} style={{ transform: `scaleY(${open ? -1 : 1})` }}/>
      </button>
      <div className={styles.traitsList} open={open}>
        {Object.keys(filters).map((trait) =>
          <FilterTrait key={`trait_${property}_${trait}`} property={property} trait={trait} count={counts[trait]} checked={filters[trait]}
          setState={ (trait, state) => {
            setState(property, trait, state)
          } }/>
        )}
      </div>
    </div>
  )
}

function FilterTrait({ property, trait, count, checked, setState }) {
  let id = encodeURIComponent(`trait_${property}_${trait}`)
  return (
    <button className={styles.traitContainer} onClick={ () => setState(trait, !checked) }>
      <p id={id}>{trait}</p>
      <p>{count}</p>
      <input className={styles.checkbox} type="checkbox" defaultChecked={checked} aria-labelledby={id}/>
    </button>
  )
}