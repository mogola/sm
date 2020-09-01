import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Portfolio of Sangaré Mogola</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          portfolio Begin
          Read <Link href="/posts/first-post"><a>this page!</a></Link>
        </div>
      </main>
    </div>
  )
}
