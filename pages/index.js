import React from 'react'
import Head from 'next/head'
import { Main, Header, Split, Box, Button, Card, CardLayout, LineChart, GU, useViewport } from 'aui-jorge'
import { fromWei, toBN, toWei } from 'web3-utils'

import query from '../services/graphql'
import { getContract } from '../services/web3'
import tokenBalanceOfAbi from '../services/web3/abis/token-balanceof'

import theme from '../theme'
import { formatNumber } from '../utils/numbers'

const ANT_ADDR =     '0x960b236A07cf122663c4303350609A66A7B288C0'
const PRESALE_ADDR = '0xf89c8752d82972f94a4d1331e010ed6593e8ec49'

const Home = ({ jurors, antStaked, anjMovements }) => {
  const anjStaked = jurors.reduce((acc, { activeBalance }) => acc.add(toBN(activeBalance)), toBN(0))

  const yesterday = getYesterdayTimestamp()
  const anjToday = anjMovements
    .filter(({ type, createdAt }) => type === 'Activation' && createdAt >= yesterday)
    .reduce((acc, { amount }) => acc.add(toBN(amount)), toBN(0))

  const StatCard = ({ title, amount, unit }) => (
    <Card width="100%">
      <div>
        { title }
      </div>
      <br/>
      { formatNumber(amount) }{ unit && ` ${unit}` }
    </Card>
  )

  const chart = {
    labels: ['one', 'two', 'three'],
    values: [0.1,0.2, 0.3]
  }

  const { width: vw } = useViewport()
  console.log(vw, GU)
  console.log(vw - 160 * GU)

  return (
    <Main theme={theme}>
      <Head>
        <title>Aragon Court stats</title>
      </Head>
      <Header
        primary="Aragon Court stats"
        secondary={<Button mode="strong" label="Get ANJ" onClick={() => window.open("https://anj.aragon.org", "_blank")}/>}
      />
      <Split
        primary={
          <Box heading="Stats">
            <CardLayout>
              <StatCard title="Jurors" amount={jurors.length}/>
              <StatCard title="Total staked" amount={formatTokenAmount(antStaked)} unit="ANT"/>
              <StatCard title="Active tokens" amount={formatTokenAmount(anjStaked)} unit="ANJ"/>
              <StatCard title="24h activations" amount={formatTokenAmount(anjToday)} unit="ANJ"/>
            </CardLayout>
            <LineChart
              lines={[chart.values]}
              springConfig={{ mass: 1, tension: 120, friction: 80 }}
              label={index => chart.labels[index]}
              width={vw - 80 * GU}
              height={400}
              color={() => theme.accent}
            />
          </Box>
        }
        secondary={<Box heading="Activity">Coming soon™️</Box>}
      />
    </Main>
  )
}

Home.getInitialProps = async () => {
  const { jurors } = await query(`{
    jurors {
      activeBalance
    }
  }`)

  const { anjmovements: anjMovements } = await query(`{
    anjmovements(orderBy:createdAt, orderDirection:desc) {
      juror {
        id
      },
      amount,
      createdAt,
      type
    }
  }`)

  const ant = getContract(ANT_ADDR, tokenBalanceOfAbi)
  const antStaked = await ant.methods.balanceOf(PRESALE_ADDR).call()

  return {
    jurors,
    anjMovements,
    antStaked
  }
}

const decimalPlaces = toBN(toWei('0.01'))
const formatTokenAmount = n => (parseFloat(fromWei(n)) * 100 / 100).toFixed(2)
const getYesterdayTimestamp = () => parseInt((+new Date()) / 1000) - 3600 * 24

export default Home