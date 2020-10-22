import Head from 'next/head'
import baseUrl from '../../helpers/baseUrl'
import Layout, { siteTitle } from '../../components/layout'
import useSWR from 'swr'

// const fetcher = (...args) => fetch(...args).then(res => res.json());

async function fetcher() {
  const res =  await fetch(`${baseUrl}/api/posts`, { method:"GET" })
  return res.json()
}

export default function DashboardServer() {
  const { data, error } = useSWR('api/posts', fetcher)

  console.log("data", data)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Layout dashboard>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="dashboard_container">
        {
          data.map((home, i) => (
            <>
              <div key={i}> hello {home.title}!
              <img src={home.urlImage} width={300} />
              </div>

              <br />
            </>
          ))
        }
      </div>
    </Layout>
  )
}