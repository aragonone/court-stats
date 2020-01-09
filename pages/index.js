import React from 'react'
import Head from 'next/head'
import { request } from 'graphql-request'
import { fromWei, toBN, toWei } from 'web3-utils'

const jurorsQuery = `{
  jurors {
    activeBalance
  }
}`

const endpoint = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-court'
const anjRate = 100

const Home = ({ jurors }) => {
  const anjStaked = jurors.reduce((acc, { activeBalance }) => acc.add(toBN(activeBalance)), toBN(0))
  const antStaked = anjStaked.div(toBN(anjRate))

  return (
    <div>
      <h1>Aragon Court stats</h1>
      <ul>
        <li>Total jurors: {jurors.length}</li>
        <li>Active ANJ: {formatTokenAmount(anjStaked)} ANJ</li>
        <li>ANT staked: {formatTokenAmount(antStaked)} ANT</li>
      </ul>
      <p></p>
    </div>
  )
}

Home.getInitialProps = async () => {
  const data = await request(endpoint, jurorsQuery)
  console.log(data)
  return data
}

const decimalPlaces = toBN(toWei('0.01'))
const formatTokenAmount = n => (parseFloat(fromWei(n)) * 100 / 100).toFixed(2)

export default Home