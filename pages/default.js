import { useState } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export async function getStaticProps() {
  return {
    props: {}
  }
}

export default function Default({}) {

  const submitForm = async () => {
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <form onSubmit={submitForm}>
      </form>
    </Layout>
  )
}