import Head from 'next/head'
import fs from 'fs'
import path from 'path'

import { fetchInscriptionNumber } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/collection.module.sass'

export async function getStaticProps() {
  let inscriptions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/inscriptions.json')))
  let config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/config.json')))
  for (let inscription of inscriptions) {    
    inscription.inscription_number = await fetchInscriptionNumber(inscription.id)
  }
  return {
    props: {
      inscriptions,
      config
    }
  }
}

export default function Collection({ inscriptions, config }) {
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
        <div className={styles.mainContainer}>
          <div className={styles.collectionContainer}>
            {inscriptions.map((inscription) => 
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
          </div>
        </div>
      </main>
    </>
  )
}