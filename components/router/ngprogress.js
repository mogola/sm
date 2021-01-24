import {Router} from 'next/router'
import NProgress from 'nprogress'

const RouterTracking = (routing)=> {
    Router.events.on('routeChangeStart', (url) => {
        console.log(`Loading: ${url} router Pathname :  ${routing}`)
        if(url !== routing){
          NProgress.start()
        }
      })
      Router.events.on('routeChangeComplete', (url) => {
        if(url !== routing){
          NProgress.done()
        }
      })
      Router.events.on('routeChangeError', () => NProgress.done())
}

export {
    RouterTracking
}