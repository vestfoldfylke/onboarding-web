<script>
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { getEntraMfaLoginUrl, entraPwdAuth } from '../../lib/useApi'
  import InfoBox from '../../lib/components/InfoBox.svelte'
  import { goto } from '$app/navigation'


  let entraPwdAuthResponse

  const pwdAuth = async (code, state) => {
    try {
      entraPwdAuthResponse = await entraPwdAuth(code, state)
      // Her skal vi ha logget inn
      const { logEntryId, userPrincipalName } = entraPwdAuthResponse
      const { loginUrl } = await getEntraMfaLoginUrl(userPrincipalName, logEntryId)

      window.location.href = loginUrl
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.stack || error.toString()
      entraPwdAuthResponse = { hasError: true, message: errorMsg }
    }
  }

  onMount(() => {
    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')
    // Then we replaceState to change url and remove code and state from state
    window.history.replaceState(null, '', '/entrapwdcallback')
    if (!(code && state)) {
      console.log('De er ikke der, slutt å kødde')
      goto('/')
    } else {
      // Here we first loginUser with provided code and state- then we getEntraMFaLoginUrl - and redirect again woah
      pwdAuth(code, state)
    }
  })

</script>

<div>
  {#if !entraPwdAuthResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">Verifiserer passordbytte...</p>
    </div>
  {:else if entraPwdAuthResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">
      <p>{entraPwdAuthResponse.message}</p>
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