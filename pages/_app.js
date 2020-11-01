import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected} from './../context/contextUser'
import { getPostConfig } from './api/home'

export async function getStaticProps() {
    const config = await getPostConfig()

    return {
      props: {
        config: JSON.parse(JSON.stringify(config[0]))
      },
      revalidate: 1, // In secondes
    }
  }

export default function App({ Component, pageProps, config }) {
    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected
        }}>
            <themeContextUser.Consumer>
                {({userConnected}) => (
                    <Component config={config} connect={userConnected()} {...pageProps} />
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}