// global styles shared across the entire site
import 'styles/global.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

// used for rendering equations (optional)
import 'katex/dist/katex.min.css'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'

// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'

// global style overrides for notion
import 'styles/notion.css'

// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

import * as React from 'react'
import * as Fathom from 'fathom-client'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'

import { bootstrap } from 'lib/bootstrap-client'
import Layout from '../components/Layout'
import {
  isServer,
  fathomId,
  fathomConfig,
  posthogId,
  posthogConfig
} from 'lib/config'
import App from "next/app";
import {getSiteMap} from "../lib/get-site-map";

if (!isServer) {
  bootstrap()
}

// // Adding a timestamp in front of all logs:
// console.log = (function () {
//   const consoleLog = console.log
//
//   return function () {
//     // eslint-disable-next-line prefer-rest-params
//     const args = [].slice.call(arguments)
//     consoleLog.apply(console, [new Date().toLocaleTimeString() + ' ::'].concat(args))
//   }
// })()

export default function MyApp({ Component, pageProps }: AppProps, hierarchy) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return (
      <Layout hierarchy={hierarchy}>
        <Component {...pageProps} />
      </Layout>
  )
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  if (typeof window === 'undefined') { // can only call this server-side
    return {...appProps, hierarchy: {}}
  }
  const hierarchy = await getSiteMap();
  console.log("SiteMap Hierarchy: ", hierarchy)

  return {...appProps, hierarchy: hierarchy}
}

