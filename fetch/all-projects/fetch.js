'use strict'

const axios = require('axios')
const getRepos = require('../allrepos/fetch')
const { mandatoryTag } = require('../../data/json/config.json')
const contenturl = 'https://raw.githubusercontent.com/'
const defaultBrach = process.env.defaultBrach || 'master'
const usernamENV = process.env.GHUSERNAME
const infoFile = process.env.infoFile || 'package.json'

module.exports = async (username) => {
  const data = (await getRepos(username))
  return Promise.all((data.filter(repos => repos.topics.includes(mandatoryTag))).map(async repo => {
    repo.package = (await axios.get(contenturl + `${username || usernamENV}/${repo.name}/${defaultBrach}/${infoFile}`)).data
    return repo
  }))
}
