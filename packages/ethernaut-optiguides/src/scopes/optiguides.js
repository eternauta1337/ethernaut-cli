const { scope } = require('hardhat/config')
const { description } = require('../../package.json')

module.exports = scope('optiguides', description)
