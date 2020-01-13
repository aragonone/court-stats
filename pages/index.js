import React from 'react'
import { fromWei, toBN, toWei } from 'web3-utils'

import query from '../services/graphql'

const anjRate = 100

const Home = ({ jurors }) => {
  const anjStaked = jurors.reduce((acc, { activeBalance }) => acc.add(toBN(activeBalance)), toBN(0))
  const antStaked = anjStaked.div(toBN(anjRate))

  return (
    <div>
      <h1>Aragon Court stats</h1>
      <ul>
        <li>Jurors: {jurors.length}</li>
        <li>Active ANJ: {formatTokenAmount(anjStaked)} ANJ</li>
        <li>ANT staked: {formatTokenAmount(antStaked)} ANT</li>
      </ul>
    </div>
  )
}

Home.getInitialProps = () => (
  query(`{
    jurors {
      activeBalance
    }
  }`)
)

const decimalPlaces = toBN(toWei('0.01'))
const formatTokenAmount = n => (parseFloat(fromWei(n)) * 100 / 100).toFixed(2)

export default Home