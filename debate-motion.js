
const axios = require('axios')
const { motion, theme } = options.requiredProperties

async function execute() {
  if ( !motion || !theme ) {
    return send(new Error('Missing property'))
  }
  try {
    const url =  'http://954b-2405-201-1006-d0e3-c820-67fa-3cdf-4c89.ngrok.io'
    const response = axios.post(url + '/theme', {motion, theme})
    send(null, {observedState:"correct", response})
  }
  catch (error) {
    send(new Error('Could not ping api: ' + error))
  }
}

execute()
