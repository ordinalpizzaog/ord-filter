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

export async function getStaticProps() {
  let inscriptions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/inscriptions.json')))
  let counts = {}
  for (let inscription of inscriptions) {
    let attributes = inscription.meta.attributes
    for (let attribute of attributes) {
      if (!(attribute.trait_type in counts)) {
        counts[attribute.trait_type] = {}
      }
      if (!(attribute.value in counts[attribute.trait_type])) {
        counts[attribute.trait_type][attribute.value] = 0
      }
      counts[attribute.trait_type][attribute.value]++
    }
  }

  let properties = {}
  let propertyNames = Object.keys(counts)
  propertyNames.sort()
  // Manually move 1/1 to the end
  propertyNames.push(propertyNames.splice(0, 1))
  for (let property of propertyNames) {
    properties[property] = {}
    let traitNames = Object.keys(counts[property])
    traitNames.sort()
    traitNames.sort((a, b) => counts[property][b] - counts[property][a])
    for (let trait of traitNames) {
      properties[property][trait] = false
    }
  }

  return {
    props: {
      inscriptions,
      properties,
      counts
    }
  }
}

function setQueryFilters(router, filterList) {
  if (filterList.length > 0) {
    let query = filterList.map((filter) => encodeURIComponent(`${filter.property}-${filter.trait}`)).join('&')
    router.push(`/?${query}`, undefined, {shallow: true})
  } else {
    router.push(`/`, undefined, {shallow: true})
  }
}

function resetProperties(properties) {
  for (let property of Object.keys(properties)) {
    for (let trait of Object.keys(properties[property])) {
      properties[property][trait] = false
    }
  }
}

function queryToFilters(query, properties) {
  var queryValid = true
  let filterList = []

  for (let key of Object.keys(query)) {
    let params = key.split('-')
    if (params.length != 2) {
      queryValid = false
      continue
    }
    let filter = {property: params[0], trait: params[1]}
    if (filter.property in properties && filter.trait in properties[filter.property]) {
      properties[filter.property][filter.trait] = true
      filterList.push(filter)
    } else {
      queryValid = false
    }
  }

  return { queryValid, filterList }
}

function filterInscriptions(inscriptions, filters) {
  let filteredInscriptions = []
  for (let inscription of inscriptions) {
    var inFilter = true
    
    for (let property of Object.keys(filters)) {
      // If all filters are false, then we match everything, so skip this property
      if (!Object.values(filters[property]).reduce((acc, val) => acc || val)) {
        continue
      }
      
      // If there is a attribute that matches a filter for this property, it could be in the filter, otherwise it's definitely not
      var propertyInFilter = false
      for (let attribute of inscription.meta.attributes) {
        if (attribute.trait_type == property && filters[attribute.trait_type][attribute.value]) {
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

export default function Collection({ inscriptions, properties, counts }) {
  const router = useRouter()
  const [filters, setFilters] = useState(properties)
  const [filterList, setFilterList] = useState([])
  const [filteredInscriptions, setFilteredInscriptions] = useState(inscriptions)
  const [sideBarOpen, setSideBarOpen] = useState(false)

  // Set up filters when query is changed
  useEffect(() => {
    resetProperties(properties)
    let { queryValid, filterList } = queryToFilters(router.query, properties)
    
    if (!queryValid) {
      setQueryFilters(router, filterList)
    } else {
      setFilters({...properties})
      setFilterList(filterList)
      setFilteredInscriptions(filterInscriptions(inscriptions, properties))
    }
  }, [router.query, router, inscriptions, properties])

  function toggleSideBar() {
    setSideBarOpen(!sideBarOpen)
  }

  function setState(property, trait, state) {
    // Make sure each event is only responded to once, even if function is called multiple times
    if (filters[property][trait] == state)
      return
    filters[property][trait] = state

    // Add/remove filter from filterList, then set the query
    let filter = {"property": property, "trait": trait}
    if (state) {
      filterList.push(filter)
    } else {
      var index = -1
      for (let i = 0; i < filterList.length; i++) {
        if (filterList[i].property == filter.property && filterList[i].trait == filter.trait) {
          index = i
          break
        }
      }
      filterList.splice(index, 1)
    }
    setQueryFilters(router, filterList)
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Ordinal Fomojis - Collection</title>
        <meta name="description"
              content="A collection of 100 digital artifacts inscribed as Ordinals on the Bitcoin blockchain"
              key="desc"/>
      </Head>
      <main className={styles.main}>
        <SideBar isOpen={sideBarOpen} filters={filters} counts={counts} setState={setState} toggleSideBar={toggleSideBar}/>
        <div className={styles.mainContainer}>
          <div className={styles.topContainer}>
            <Button text="Filter" icon="filter" onClick={toggleSideBar} style={{ letterSpacing: "0.07rem" }}/>
            <div className={styles.filterContainer}>
              {filterList.map((filter) => 
                <FilterCard property={filter.property} trait={filter.trait} setState={setState} key={`card_${filter.property}_${filter.trait}`}/>
              )}
              {filterList.length > 0 &&
                <p className={styles.clearAll} onClick={() => setQueryFilters(router, [])}>Clear All</p>
              }
            </div>
          </div>
          <div className={styles.collectionContainer}>
            {filteredInscriptions.map((inscription) => 
              <Link href={`/${inscription.inscription_number}`} key={inscription.fomojis_number}>
                <div className={styles.imageCard}>
                  <div className={styles.imageContainer}>
                    <Image src={`/ordinals/${inscription.inscription_number}.jpeg`}
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