'use strict'

const axios = require('axios')
const api = 'https://api.github.com/users/'
const usernamENV = process.env.GHUSERNAME
const maxPages = process.env.MAXPAGE || 9
const token = process.env.GHTOKEN

module.exports = async (username) => {
  if (token) axios.defaults.headers.common.Authorization = `bearer ${token}`
  return (await getRepos(username))
}

async function getRepos (username) {
  let repos = []
  for (let i = 1; i <= maxPages; i++) repos = repos.concat((await axios.get(api + `${username || usernamENV}/repos?&sort=pushed&per_page=100&page=${i}`)).data)
  return repos
}
