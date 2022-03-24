import React from 'react'
import { Navigation } from './Navigation'
import useSWR from 'swr'

const fetcher = (url) => {
  console.log('Fetching results from ', url)
  return fetch(url).then((res) => res.json())
}

export default function Layout({ children }) {
  const { data, error } = useSWR('/api/sitemap.xml', fetcher)

  if (error) {
    console.warn(error)
    return <div>Failed to load navigation from Notion</div>
  }
  if (!data) {
    return <div>Loading Navigation...</div>
  }

  return (
    <div className='main'>
      <Navigation collapsed={true} blocks={data} />
      {children}
    </div>
  )
}
