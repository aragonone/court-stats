import Web3 from 'web3'

export function getContract(addr, abi, rpcUrl = 'wss://mainnet.eth.aragon.network/ws') {
  const web3 = new Web3(rpcUrl)

  return new web3.eth.Contract(abi, addr)
}