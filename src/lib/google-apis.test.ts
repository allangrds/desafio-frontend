jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
        getToken: jest.fn(),
      })),
    },
  },
}))

import { oauth2ServerClient } from './google-apis'

describe('google-apis', () => {
  it('exports oauth2ServerClient as an object', () => {
    expect(oauth2ServerClient).toBeDefined()
    expect(typeof oauth2ServerClient).toBe('object')
    expect(oauth2ServerClient).not.toBeNull()
  })

  it('oauth2ServerClient has expected mock methods', () => {
    expect(typeof oauth2ServerClient.setCredentials).toBe('function')
    expect(typeof oauth2ServerClient.getToken).toBe('function')
  })
})
