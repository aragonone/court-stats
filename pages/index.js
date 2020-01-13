import React from 'react'
import { Main, Header, Split, Box, Button, Card, CardLayout, textStyle } from '@aragon/ui'
import { fromWei, toBN, toWei } from 'web3-utils'

import query from '../services/graphql'
import { formatNumber } from '../utils/numbers'

const anjRate = 100

const Home = ({ jurors }) => {
  const anjStaked = jurors.reduce((acc, { activeBalance }) => acc.add(toBN(activeBalance)), toBN(0))
  const antStaked = anjStaked.div(toBN(anjRate))

  const StatCard = ({ title, amount, unit }) => (
    <Card width="100%">
      <div>
        { title }
      </div>
      { formatNumber(amount) }{ unit && ` ${unit}` }
    </Card>
  )

  return (
    <Main>
      <Header
        primary="Aragon Court stats"
        secondary={<Button mode="strong" label="See on Etherscan" />}
      />
      <Split
        primary={
          <Box heading="Stats">
            <CardLayout>
              <StatCard title="Jurors" amount={jurors.length}/>
              <StatCard title="Active tokens" amount={formatTokenAmount(anjStaked)} unit="ANJ"/>
              <StatCard title="Total converted" amount={formatTokenAmount(antStaked)} unit="ANT"/>
            </CardLayout>
          </Box>
        }
        secondary={<Box heading="Secondary">Secondary content</Box>}
      />
    </Main>
  )
}



Home.getInitialProps = () => {
  const jurorsQuery = query(`{
    jurors {
      activeBalance
    }
  }`)

  return jurorsQuery
}


/*
{
  anjmovements(first: 20) {
    juror {
      id
    },
    amount,
    createdAt,
    type
  }
}
*/

const decimalPlaces = toBN(toWei('0.01'))
const formatTokenAmount = n => (parseFloat(fromWei(n)) * 100 / 100).toFixed(2)

export default Home