'use strict'

const axios = require('axios')
const controlAccess = require('control-access')
const token = process.env.GHTOKEN
const username = process.env.GHUSERNAME
const { readFileSync } = require('fs')
const { resolve } = require('path')

const api = 'https://api.github.com/graphql'
if (token) axios.defaults.headers.common.Authorization = `bearer ${token}`

module.exports = async (req, res) => {
  controlAccess()(req, res)
  try {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('cache-control', 's-maxage=86400, max-age=0')
    const data = (await axios.post(api,
      {
        query:
        `
        query ($cursor: String) {
            user(login: "${req.query.username || username}") {
                repositories(
                    last: ${req.query.maxnumber || (process.env.MAXNUMBER || 50)},
                    isLocked: false,
                    ownerAffiliations: OWNER,
                    privacy: PUBLIC,
                    orderBy: {
                        field: CREATED_AT,
                        direction: ASC
                    }
                    before: $cursor
                ) {
                    edges {
                        node {
                            name
                            description
                            url
                            primaryLanguage {
                                name
                                color
                            }
                            forks {
                                totalCount
                            }
                        }
                    }
                }
            }
        }
    `,
        variables: { login: req.query.username }
      })).data

    res.json({
      latestRepos: data.data.user.repositories.edges.filter(({ node: repo }) => repo.description && repo.name !== '.github').map(repo => repo.node).reverse(),
      projects: Object.values(JSON.parse(readFileSync(resolve('data/json/projects.json'), 'utf-8'))) // fetch info from gh api
    })
    // console.log(resolve('data/json/projects.json'))
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.setHeader('content-type', 'text/plain')
    res.end('Internal server error')
  }
}
