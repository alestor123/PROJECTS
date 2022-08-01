'use strict'

const controlAccess = require('control-access')
const allRepos = require('../../../fetch/allrepos/fetch')

module.exports = async (req, res) => {
  controlAccess()(req, res)
  try {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('cache-control', 's-maxage=86400, max-age=0')
    res.json(await allRepos(req.query.username))
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.setHeader('content-type', 'text/plain')
    res.end('Internal server error')
  }
}
