const {ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')
// const readline = require('readline')
const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const TOKEN_PATH = path.join(__static, '/token.json')

let oAuth2Client
ipcMain.on('init', (event) => {
  console.log('init')
  let [res, credentials] = loadCredentials()
  console.log('credentials: ', credentials)
  if (res) {
    let result = authorize(credentials)
    if (result) {
      event.sender.send('initReply', 'success')
    } else {
      let url = generateAuthUrl(oAuth2Client)
      event.sender.send('authUrl', url)
      ipcMain.on('authCode', (event, code) => {
        getNewToken(code, (res) => {
          event.returnValue = res
        })
      })
    }
  } else {
    event.sender.send('initReply', 'false')
  }
  event.sender.send('initReply', 'success')
})

// Load client secrets from a local file
export function loadCredentials () {
  console.log('loadCredentials')
  let content = fs.readFileSync(path.join(__static, '/credentials.json'), 'utf-8')
  if (!content) {
    return [false, 'cannot read credentials.json']
  }
  // if (err) return console.log('Error loading client secret file:', err)
  console.log('content: ', content)
  return [true, JSON.parse(content)]
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
export function authorize (credentials) {
  console.log('authorize')
  const {client_secret, client_id, redirect_uris} = credentials.installed
  oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  )
  console.log('authorize')
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return false
    oAuth2Client.setCredentials(JSON.parse(token))
    return true
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client TheOAuth2 client to get token for.
 */
export function generateAuthUrl (oAuth2Client) {
  console.log('generateAuthUrl')
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Enter the code from that page here: ', authUrl)
  return authUrl
}

export function getNewToken (code, callback) {
  console.log('getNewToken')
  console.log('code : ', code)
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      callback(Boolean(false))
      return
    }
    // oAuth2Client.setCredentials(token)
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) {
        callback(Boolean(false))
        return
      }
      console.log('Token stored to', TOKEN_PATH)
      callback(Boolean(true))
    })
  })
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth an authorized OAuth2 client.
 */
// function listLabels (auth) {
//   const gmail = google.gmail({version: 'v1', auth})
//   gmail.users.labels.list({
//     userId: 'me'
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err)
//     const labels = res.data.labels
//     if (labels.length) {
//       console.log('Labels: ')
//       labels.forEach((label) => {
//         console.log('- ' + label.name)
//       })
//     } else {
//       console.log('No labels found.')
//     }
//   })
// }
