import axios from 'axios'

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const getIdPortenLoginUrl = async (userType, action) => {
  if (!(userType && action)) throw new Error('Missing required paramteres "userType" and "action"')
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(2000)
    return { loginUrl: `/mockidporten?user_type=${userType}&action=${action}` }
  }
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/IdPortenLoginUrl?user_type=${userType}&action=${action}`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const getEntraPwdLoginUrl = async (loginHint, logEntryId) => {
  if (!logEntryId) throw new Error('Missing required paramteres "logEntryId"')
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    return { loginUrl: `/mockentra?loginHint=demodemo&log_entry_id=${logEntryId}&action=pwd` }
  }
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/EntraPwdLoginUrl?login_hint=${loginHint}&log_entry_id=${logEntryId}`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const getEntraMfaLoginUrl = async (loginHint, logEntryId) => {
  if (!logEntryId) throw new Error('Missing required paramteres "logEntryId"')
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    return { loginUrl: `/mockentra?loginHint=demodemo&log_entry_id=${logEntryId}&action=mfa` }
  }
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/EntraMfaLoginUrl?login_hint=${loginHint}&log_entry_id=${logEntryId}`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const getStatsLoginUrl = async () => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    return { loginUrl: `/mockentra?action=stats` }
  }
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/EntraMfaLoginUrl?action=stats`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const getIdportenLogoutUrl = async () => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    return { logoutUrl: '/' }
  }
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/IdPortenLogoutUrl`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const resetPassword = async (code, iss, state) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(1000)
    return {
      logEntryId: 'ijijiji',
      displayName: 'Mock Trynefjert',
      userPrincipalName: 'mock.trynefjerten.sorensen@fisfylke.no',
      maskedPhoneNumber: '+47 *****123'
    }
  }
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/ResetPassword`, { code, iss, state }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const verifyUser = async (code, iss, state) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(1000)
    return {
      logEntryId: 'jijijijiji',
      displayName: 'Mock Trynefjert',
      userPrincipalName: 'mock.trynefjerten.sorensen@fisfylke.no'
    }
  }
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/VerifyUser`, { code, iss, state }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const entraPwdAuth = async (code, state) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(1000)
    return {
      logEntryId: 'jfiji',
      displayName: 'Mock Trynefjert',
      userPrincipalName: 'mock.trynefjerten.sorensen@fisfylke.no',
    }
  }
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/EntraPwdAuth`, { code, state }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const entraMfaAuth = async (code, state) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(1000)
    return {
      logEntryId: 'jfiji',
      displayName: 'Mock Trynefjert',
      userPrincipalName: 'mock.trynefjerten.sorensen@fisfylke.no',
    }
  }
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/EntraMfaAuth`, { code, state }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const getStats = async (code, state) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(1000)
    return {
      message: 'ROBIN, her kan du lage mock-data som har samme format som api-et gir tilbake på UserStats, bare husk å ikke bruke reelle data, men det vet du jo'
    }
  }
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/UserStats`, { code, state }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}
