import React, { useState, useEffect} from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import Link from 'next/link'
import {projectConfig} from './../../services/jsonProjects'
import Input from '../../components/Input'
import InputConfig from '../../components/InputConfig'
import Textarea from '../../components/Textarea'
import Selects from '../../components/Select'
import UploadFile from './../../helpers/upload'
import { Button, Heading, Box, Loader, Tag, Form, Column } from 'react-bulma-components';
import Files from './../../components/File'
import ImageUploads from './../../components/ImageUpload'
console.log(projectConfig)

export async function getStaticProps() {
  return {
    props: {}
  }
}

export default function Default({dataProjects = projectConfig}) {
  const [configProject, setConfigProject] = useState(projectConfig)
  const [state, changeState] = useState({});
  const [value, setValue] = useState('');

  const onChange = ({target}) => {
    // state$

    console.log(target.name, target.value)
    changeState({...state, [target.name]: target.value})
  }

  const onChangeState = (data) => {
    console.log("data from child", data)
    setValue(data)
    changeState({...state, "arrayImage": data})
    console.log("Form>", state);
}
  const submitForm = async () => {
  }

  useEffect(() => {
    console.log("update state", state)
  }, [state])

  return (
    <Layout home>
      <Head>
        <title>New project</title>
      </Head>
      <form onSubmit={submitForm}>
          {dataProjects.map((item, i) => (
              <div key={`${item["name"]}${i}`}>
                  {item.type === "select" &&
                  <Selects
                    key={`${item["name"]}${i}`}
                    onChange={onChange}
                    name={item["name"]}
                    list={item["option"]}
                    value={state[item.name]}
                  />
                }
                {item.type === "textarea" &&
                <Textarea
                  onChange={onChange}
                  name={item["name"]}
                  placeholder="Description..."
                />
                }
                {item.type === "file" &&
                item.name !== "imageArray" &&
                <>
                <Files
                  onChange={onChange}
                  name={item["name"]}
                />
                </>
                }
                {item.name === "imageArray" &&
                  <ImageUploads
                    state={state}
                    name={item["name"]}
                    onChange={(e) => {onChangeState(e)}}
                  />
                }
                {
                    item.type !== "select" &&
                    item.type !== "textarea" &&
                    item.type !== "file" &&
                    <InputConfig
                      value={state[item.name]}
                      onChange={onChange}
                      name={item["name"]}
                    />
                }
              </div>
          ))}
      </form>
    </Layout>
  )
}