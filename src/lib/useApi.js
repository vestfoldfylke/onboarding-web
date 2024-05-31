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

export const getStats = async (code, state, onlyStats) => {
  if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
    await sleep(1000)
    if(onlyStats === true) {
      return [
        {
          "ansatt": {
            "antall": 149,
            "max": 162,
            "fullføringsgrad": 92.01
          },
          "elev": {
            "antall": 700,
            "max": 883,
            "fullføringsgrad": 79.25
          },
          "navn": "Færder videregående skole"
        },
        {
          "ansatt": {
            "antall": 155,
            "max": 167,
            "fullføringsgrad": 92.81
          },
          "elev": {
            "antall": 600,
            "max": 775,
            "fullføringsgrad": 77.42
          },
          "navn": "Re videregående skole"
        },
        {
          "ansatt": {
            "antall":50,
            "max": 54,
            "fullføringsgrad": 92.59
          },
          "elev": null,
          "navn": "Seksjon mobilitet"
        },
        {
          "ansatt": {
            "antall": 178,
            "max": 330,
            "fullføringsgrad": 53.94
          },
          "elev": {
            "antall": 1000,
            "max": 1528,
            "fullføringsgrad": 65.49
          },
          "navn": "Thor Heyerdahl videregående skole"
        },
        {
          "ansatt": {
            "antall": 95,
            "max": 95,
            "fullføringsgrad": 100.00
          },
          "elev": {
            "antall": 500,
            "max": 580,
            "fullføringsgrad": 86.20
          },
          "navn": "Nøtterøy videregående skole"
        },
        {
          "ansatt": {
            "antall": 234,
            "max": 310,
            "fullføringsgrad": 75.48
          },
          "elev": null,
          "navn": "Seksjon tannhelse"
        },
        {
          "ansatt": {
            "antall": 700,
            "max": 1312,
            "fullføringsgrad": 53.35
          },
          "elev": null,
          "navn": "Kompetansebyggeren"
        },
        {
          "ansatt": {
            "antall": 120,
            "max": 128,
            "fullføringsgrad": 93.75
          },
          "elev": null,
          "navn": "Opplæring og tannhelse"
        },
        {
          "ansatt": {
            "antall": 130,
            "max": 260,
            "fullføringsgrad": 50.00
          },
          "elev": {
            "antall": 600,
            "max": 1238,
            "fullføringsgrad": 48.46
          },
          "navn": "Horten videregående skole"
        }
      ]
    } else {
      
      return [
        {
          "_id": "6656cb705220d6e8f20d71bb",
          "userType": "ansatt",
          "id": "000c63b0-45e8-462d-94a7-097fa9509eac",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Fagleder kontor",
          "state": "OF-FRV",
          "department": "Færder vgs kontor",
          "companyName": "Færder videregående skole",
          "extensionAttribute6": "OF-FRV-KONTOR",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71bc",
          "userType": "ansatt",
          "id": "001ac529-0820-46b6-b5a5-43b78bc75fec",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Avdelingsleder undervisning",
          "state": "OF-REV",
          "department": "Re vgs ledelse",
          "companyName": "Re videregående skole",
          "extensionAttribute6": "OF-REV-ADM",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71bd",
          "userType": "ansatt",
          "id": "001d4f31-c280-4a3a-a07d-0dbf98ee8d1e",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Unge arbeidstakere",
          "state": "SAMF-MOB",
          "department": "Team marked og utvikling",
          "companyName": "Seksjon mobilitet",
          "extensionAttribute6": "SAMF-MOB-MAR",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71be",
          "userType": "ansatt",
          "id": "00478e10-9e47-4d78-a739-cc5601a20f92",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Adjunkt m/till utd",
          "state": "OF-THV",
          "department": "Thor Heyerdahl vgs musikk og dans",
          "companyName": "Thor Heyerdahl videregående skole",
          "extensionAttribute6": "OF-THV-MD",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71bf",
          "userType": "ansatt",
          "id": "00481036-6bec-4d04-9c73-c16e10ac396d",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Konsulent",
          "state": "OF-NTV",
          "department": "Nøtterøy vgs administrasjon og drift",
          "companyName": "Nøtterøy videregående skole",
          "extensionAttribute6": "OF-NTV-KONTOR",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71c0",
          "userType": "ansatt",
          "id": "00c301a7-f89e-473f-bd0a-daf4b16c0961",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Tannlege",
          "state": "OPT-TAN",
          "department": "Sande tannklinikk",
          "companyName": "Seksjon tannhelse",
          "extensionAttribute6": "OPT-TAN-SAT",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71c1",
          "userType": "ansatt",
          "id": "00e79617-e6aa-4b5d-a27d-ecf1fce1744c",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Adjunkt",
          "state": "OF-FRV",
          "department": "Færder vgs bygg- og anleggsteknikk",
          "companyName": "Færder videregående skole",
          "extensionAttribute6": "OF-FRV-BA",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71c2",
          "userType": "ansatt",
          "id": "00eb0810-458a-4e26-acb6-2562d32eace2",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Rektor",
          "state": "OF-KB",
          "department": "Kompetansebyggeren",
          "companyName": "Kompetansebyggeren",
          "extensionAttribute6": "OF-KB",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71c3",
          "userType": "ansatt",
          "id": "010ebfd0-6c48-4928-bd8d-9a96d28dab02",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Rådgiver",
          "state": "OF-THV",
          "department": "Thor Heyerdahl vgs realfag",
          "companyName": "Thor Heyerdahl videregående skole",
          "extensionAttribute6": "OF-THV-REALFAG",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71c4",
          "userType": "ansatt",
          "id": "0117e19f-e7d0-4dcb-8bb1-3dbf53133469",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Lektor 1",
          "state": "OF-NTV",
          "department": "Nøtterøy vgs språkfag",
          "companyName": "Nøtterøy videregående skole",
          "extensionAttribute6": "OF-NTV-SP-SPRAK",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
        {
          "_id": "6656cb705220d6e8f20d71c5",
          "userType": "ansatt",
          "id": "0118fcae-d4a3-49d1-b20e-34289317bc37",
          "accountEnabled": true,
          "displayName": "displayName",
          "userPrincipalName": "userPrincipalName",
          "jobTitle": "Rådgiver",
          "state": "OPT",
          "department": "Seksjon sektorstøtte, inntak og eksamen",
          "companyName": "Opplæring og tannhelse",
          "extensionAttribute6": "OPT-SEK",
          "updatedTimestamp": "2024-05-29T06:30:07.975Z",
          "onboardedTimestamp": null
        },
      ]
    }
  }
  const { data } = await axios.post(`${import.meta.env.VITE_ONBOARDING_API_URI}/UserStats`, { code, state, onlyStats }, { headers: { 'x-functions-key': import.meta.env.VITE_ONBOARDING_API_PUBLIC_KEY } })
  return data
}
