<script>
  import { onMount } from 'svelte'
  import { entraMfaAuth } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { goto } from '$app/navigation'
  import InfoBox from '../../lib/components/InfoBox.svelte'

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  let loadingMessage = "Verifiserer innlogging"

  const fakeLoadingMessages = async () => {
    const interval = 1500
    await sleep(interval)
    loadingMessage = "Verifiserer innlogging"
    await sleep(interval)
    loadingMessage = "Verfiserer fortsatt innlogging"
  }

  // Entra logout
  let entraErrorMessage
  let entraLoading

  // Entra ID auth
  let entraResponse

  const entraAuthentication = async (code, state) => {
    try {
      entraResponse = await entraMfaAuth(code, state)
    } catch (error) {
      const errorMsg =  error.response?.data?.message || error.stack || error.toString()
      entraResponse = { hasError: true, message: errorMsg }
    }
  }

  onMount(() => {
    const code = $page.state.code
    const state = $page.state.state

    if (!(code && state)) {
      console.log('De er ikke der, slutt å kødde')
      // Hvis de ikke er der, kan vi vel sende til forsiden egt
      goto('/')
    } else {
      entraAuthentication(code, state)
      fakeLoadingMessages()
    }
  })

</script>

<div>
  {#if !entraResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}...</p>
    </div>
  {:else if entraResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">
      <p>{entraResponse.message}</p>
      <div style="display: flex; gap: 5px; align-items: center"><span class="material-symbols-outlined">arrow_back</span><a href="/">Til startsiden</a></div>
    </div>
  {:else}
    <h3>Hei, {entraResponse.displayName}</h3>
    <div class="section">
      <p><strong>Brukernavn:</strong> {entraResponse.userPrincipalName}</p>
    </div>
    <div class="section">
      <p> ✅ Kontoen din er nå klar til bruk</p>
    </div>
  {/if}
  <br />
  <InfoBox title="Trenger du hjelp?">
    <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
    <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
  </InfoBox>
</div>


<style>
  .loading {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    justify-content: center;
  }
  .section {
    margin: 12px 0px;
  }
  .loadingMessage {
    font-style: italic;
    width: 200px;
  }
  .error {
    background-color: var(--nype-10);
    padding: 16px;
  }
</style>