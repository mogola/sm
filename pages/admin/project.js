import { useState } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import Link from 'next/link'
import {projectConfig} from './../../services/jsonProjects'
console.log(projectConfig)

export async function getStaticProps() {
  return {
    props: {}
  }
}

export default function Default({}) {
    const [configProject, setConfigProject] = useState(projectConfig)
  const submitForm = async () => {
  }

  return (
    <Layout home>
      <Head>
        <title>New project</title>
      </Head>
      <form onSubmit={submitForm}>
          {configProject.map((item, i) => (
              <div key={i}>
                    <label forHtml={item["name"]}>
                      {item["name"]}
                    </label>
                  {item.type === "select" &&
                  <select>
                    </select>
                }
                {item.type === "textarea" &&
                <textarea name={item["name"]}>
                    here description
                </textarea>
                }
                {item.type === "file" &&
                <>
                <input type={item.type} />
                <button>Ajouter</button>
                </>
                }
                {
                    item.type !== "select" &&
                    item.type !== "textarea" &&
                    item.type !== "file" &&
                    <input name={item["name"]} />
                }
              </div>
          ))}
      </form>
    </Layout>
  )
}