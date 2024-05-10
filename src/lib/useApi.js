import axios from 'axios'

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const getLoginUrl = async (userType) => {
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/LoginUrl?userType=${userType}`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const getLogoutUrl = async () => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    return { logoutUrl: '/' }
  }
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/LogoutUrl`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const resetPassword = async (code, iss, state) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(6000)
    return {
      displayName: 'Mock Trynefjert',
      userPrincipalName: 'mock.trynefjerten.sorensen@fisfylke.no',
      maskedPhoneNumber: '+47 *****123'
    }
  }
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/ResetPassword`, { code, iss, state }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}
