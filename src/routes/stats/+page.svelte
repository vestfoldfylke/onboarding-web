<script>
  import { onMount } from 'svelte'
  import { getEntraMfaLoginUrl, getStats, verifyUser } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { goto } from '$app/navigation'
  import InfoBox from '../../lib/components/InfoBox.svelte';

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  let loadingMessage = "Henter statistikk"

  const fakeLoadingMessages = async () => {
    const interval = 1500
    await sleep(interval)
    loadingMessage = "Henter statistikk fortsatt"
  }

  // State
  let userStatsResponse

  const getUserStats = async (code, state) => {
    try {
      userStatsResponse = await getStats(code, state)
      // ROBIN, gjør det du vil med responsen
    } catch (error) {
      const errorMsg =  error.response?.data?.message || error.stack || error.toString()
      userStatsResponse = { hasError: true, message: errorMsg }
    }
  }

  onMount(() => {
    const code = $page.state.code
    const state = $page.state.state

    if (!(code && state)) {
      console.log('De er ikke der, slutt å kødde')
      // Hvis de ikke er der, kan vi vel sende til forsiden egt
      goto('/admin', { replaceState: false })
    } else {
      getUserStats(code, state)
      fakeLoadingMessages()
    }
  })

</script>

<div>
  {#if !userStatsResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}...</p>
    </div>
  {:else if userStatsResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">{userStatsResponse.message}</div>
    <br />
    <InfoBox title="Trenger du hjelp?">
      <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
      <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
    </InfoBox>
  {:else}
    <p>Her skal Robin UX-designe</p>
    {JSON.stringify(userStatsResponse)}
  {/if}
</div>

<style>
  .loading {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    justify-content: center;
  }
  .loadingMessage {
    font-style: italic;
    width: 200px;
  }
  .section {
    margin: 12px 0px;
  }
  .error {
    background-color: var(--nype-10);
    padding: 16px;
  } 
</style>