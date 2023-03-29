import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'https://auth.cngei.it/auth',
  realm: 'cngei',
  clientId: 'sc'
})

export default keycloak
