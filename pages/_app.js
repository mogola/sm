import '../styles/global.scss'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
}