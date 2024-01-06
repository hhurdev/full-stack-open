// mongoose ei tykkää jestistä ongelma
// package.json muutettu: globalTeardown: './tests/teardown.js'

module.exports = () => {
  process.exit(0)
}