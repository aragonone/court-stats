import { request } from 'graphql-request'

const ENDPOINT = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-court'

export default (query) => request(ENDPOINT, query)