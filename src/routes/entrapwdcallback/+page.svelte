<script>
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { getEntraMfaLoginUrl, entraPwdAuth } from '../../lib/useApi'
  import InfoBox from '../../lib/components/InfoBox.svelte'
  import { goto } from '$app/navigation'
  import { getThemeAsset } from '$lib/themes/theme.config'

  const loadingIcon = getThemeAsset('images/loading.svg')
  const errorIcon = getThemeAsset('images/error.svg')
  
  let entraPwdAuthResponse
  let loadingMessage = "Verifiserer pålogging..."

  const pwdAuth = async (code, state) => {
    try {
      entraPwdAuthResponse = await entraPwdAuth(code, state)
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
    window.history.replaceState(null, '', '/entrapwdcallback')
    if (!(code && state)) {
      console.log('De er ikke der, slutt å kødde')
      goto('/')
    } else {
      pwdAuth(code, state)
    }
  })
</script>

<div class="centerstuff">
  {#if !entraPwdAuthResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}</p>
    </div>
  {:else if entraPwdAuthResponse.hasError}
    <InfoBox type="error">
      <img src={errorIcon} alt="Error icon" />
      <h2>Noe gikk galt</h2>
      <p>{entraPwdAuthResponse.message}</p>
      <button on:click={() => goto('/')}>Prøv igjen</button>
    </InfoBox>
  {/if}
</div>