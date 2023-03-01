import fs from 'fs'
import path from 'path'
import Head from 'next/head'

import styles from '../styles/inscription.module.sass'
import Image from 'next/image'
import Button from '../components/button'
import IconButton from '../components/icon-button'
import Link from 'next/link'
import { fetchInscriptionNumber } from '@/lib/utils'

export async function getStaticPaths() {
  let inscriptions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/inscriptions.json')))
  let paths = inscriptions.map((inscription) => {
    return {
      params: {
        id: inscription.id
      }
    }
  })

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  let inscriptions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/inscriptions.json')))
  let inscription = inscriptions.filter((inscription) => inscription.id == params.id)[0]
  inscription.inscription_number = await fetchInscriptionNumber(inscription.id)
  inscription.meta.attributes.sort((a, b) => a.trait_type.localeCompare(b.trait_type))
  return {
    props: {
      inscription
    }
  }
}

export default function Incription({ inscription }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Ordinal Fomojis - {inscription.name}</title>
        <meta name="description"
              content="A collection of 100 digital artifacts inscribed as Ordinals on the Bitcoin blockchain"
              key="desc"/>
      </Head>
      <main className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <div className={styles.imageContainer}>
            <Image src={`https://ordinals.com/content/${inscription.id}`}
                   fill
                   style={{ objectFit: "contain" }}
                   alt={`Image of #${inscription.inscription_number}`}/>
          </div>
          <div className={styles.infoContainer}>
            <HeaderInfo inscription={inscription}/>
            <TraitsInfo inscription={inscription}/>
          </div>
        </div>
      </main>
    </>
  )
}

function HeaderInfo({ inscription }) {
  return (
    <div className={styles.headerContainer}>
      <h1>{`Inscription #${inscription.inscription_number}`}</h1>
      <div className={styles.idContainer}>
        <p>{`ID: ${inscription.id}`}</p>
        <IconButton icon="copy" 
                    onClick={() => navigator.clipboard.writeText(inscription.id)}
                    style={{ minWidth: "1.7rem" }}
                    ariaLabel="Copy inscription ID"/>
      </div>
      <Button text="View on Ordinals.com" href={`https://ordinals.com/inscription/${inscription.id}`} openTab style={{
        margin: "0.5rem 1rem 1rem auto",
        fontWeight: "normal",
        fontSize: "1rem"
      }}/>
    </div>
  )
}

function TraitsInfo({ inscription }) {
  return (
    <div className={styles.attributesContainer}>
      <p>Attributes</p>
      <div className={styles.attributesGrid}>
        {inscription.meta.attributes.map((attribute) =>
          <TraitCard attribute={attribute} key={`${attribute.trait_type}_${attribute.value}`}/>
        )}
      </div>
    </div>
  )
}

function TraitCard({ attribute }) {
  let query = encodeURIComponent(`${attribute.trait_type}-${attribute.value}`)
  return (
    <Link href={`/?${query}`}>
      <div className={styles.attribute}>
        <p className={styles.property}>{attribute.trait_type}</p>
        <p className={styles.trait}>{attribute.value}</p>
        <p className={styles.rarity}>{`${attribute.percent} have this trait`}</p>
      </div>
    </Link>
  )
}