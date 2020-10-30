import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'
import { themeContextUser, tokenStorage, userIsConnected, connected} from './../context/contextUser'

export default function App({ Component, pageProps }) {

    return (
        <themeContextUser.Provider value={{
            getToken: tokenStorage,
            userIsConnected: userIsConnected,
            userConnected: connected
            }}>
            <themeContextUser.Consumer>
                {({userConnected}) => (
                    <Component connect={userConnected()} {...pageProps} />
                )}
            </themeContextUser.Consumer>
        </themeContextUser.Provider>)
}