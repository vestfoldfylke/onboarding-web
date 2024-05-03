import axios from 'axios'

export const getLoginUrl = async (userType) => {
  console.log(`${import.meta.env.VITE_ONBOARDING_API_URI}/LoginUrl?userType=${userType}`)
  const { data } = await axios.get(`${import.meta.env.VITE_ONBOARDING_API_URI}/LoginUrl?userType=${userType}`, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}

export const resetPassword = async (code, iss, state) => {
  console.log(`${import.meta.env.VITE_ONBOARDING_API_URI}/ResetPassword`)
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/ResetPassword`, { code, iss, state }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}
