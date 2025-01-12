<script>
  import { onMount } from 'svelte'
  import { getEntraMfaLoginUrl, verifyUser } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { goto } from '$app/navigation'
  import InfoBox from '../../lib/components/InfoBox.svelte';

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  let loadingMessage = "Verifiserer ID-porten pålogging"

  const fakeLoadingMessages = async () => {
    const interval = 1500
    await sleep(interval)
    loadingMessage = "Leter etter brukeren din"
  }

  // State
  let verifyUserResponse

  const verifyEntraUser = async (code, iss, state) => {
    try {
      verifyUserResponse = await verifyUser(code, iss, state)
      const { logEntryId, userPrincipalName } = verifyUserResponse
      const { loginUrl } = await getEntraMfaLoginUrl(userPrincipalName, logEntryId)
      window.location.href = loginUrl
    } catch (error) {
      const errorMsg =  error.response?.data?.message || error.stack || error.toString()
      verifyUserResponse = { hasError: true, message: errorMsg }
    }
  }

  onMount(() => {
    const code = $page.state.code
    const state = $page.state.state
    const iss = $page.state.iss

    if (!(code && state && iss)) {
      console.log('De er ikke der, slutt å kødde')
      // Hvis de ikke er der, kan vi vel sende til forsiden egt
      goto('/')
    } else {
      verifyEntraUser(code, iss, state)
      fakeLoadingMessages()
    }
  })

</script>

<div>
  {#if !verifyUserResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}...</p>
    </div>
  {:else if verifyUserResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">
      <p>{verifyUserResponse.message}</p>
      <div style="display: flex; gap: 5px; align-items: center"><span class="material-symbols-outlined">arrow_back</span><a href="/">Til startsiden</a></div>
    </div>
    <br />
    <InfoBox title="Trenger du hjelp?">
      <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
      <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
    </InfoBox>
  {:else}
    redirecting...
  {/if}
</div>