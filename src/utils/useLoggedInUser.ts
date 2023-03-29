/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {useMemo} from 'react'
import {useKeycloak} from '@react-keycloak/web'

function parseSezione (groups: string[]): string {
  return groups[0].split('/')[1]
}

export interface User {
  tessera: string
  sezione: string
  name: string;
}

export default function useLoggedInUser (): User | null {
  const { keycloak, initialized } = useKeycloak()

  return useMemo(() => {
    if (!initialized) return null
    const token = keycloak.idTokenParsed!
    return {
      tessera: token.preferred_username,
      sezione: parseSezione(token.groups),
      name: token.name,
    }
  }, [keycloak, initialized])
}
