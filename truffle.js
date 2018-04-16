// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '*'
    },
    ropsten: {
		provider: function() {
			return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/Ax5n010X0yJC4cLit0ra")
		},
		network_id: 3, // Official ropsten network id
		gas: 4712388
	}   
  }
}
