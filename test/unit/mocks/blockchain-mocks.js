/*
  Mocking data for the blockchain unit tests.
*/

const mockBalance = {
  success: true,
  balance: {
    confirmed: 10107,
    unconfirmed: 0
  }
}

const mockUtxos = [
  {
    height: 654089,
    tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
    tx_pos: 1,
    value: 546
  },
  {
    height: 654089,
    tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
    tx_pos: 2,
    value: 9561
  }
]

module.exports = {
  mockBalance,
  mockUtxos
}
