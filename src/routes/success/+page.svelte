<script>
  import { onMount } from 'svelte'
  import { entraAuth } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { goto } from '$app/navigation'
  import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

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
      entraResponse = await entraAuth(code, state)
      // Oi shit, vi må redirecte igjen...
      window.location.href = 'https://portal.office.com'
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
      goto('/', { replaceState: false })
    } else {
      entraAuthentication(code, state)
      fakeLoadingMessages()
    }
  })

</script>

<div>
  {#if !entraResponse || !entraResponse.hasError}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}...</p>
    </div>
  {:else if entraResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">{entraResponse.message}</div>
  {:else}
    <h3>Hei igjen, {entraResponse.displayName}</h3>
    <br />
    <br />
    <p>Din bruker er nå satt opp og klar til bruk 👍</p>
    <br />
    <p>Ditt brukernavn er: <strong>{entraResponse.userPrincipalName}</strong></p>
    <!-- Hvis man ønsker logout feks
    {#if entraErrorMessage}
      <div class="error">
        <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
        <p>{entraErrorMessage}</p>
      </div>
    {/if}
    <p>
      <button class="link" on:click={() => { console.log('hei') }}><span class="material-symbols-outlined">logout</span>TUT TUT</button>
      {#if entraLoading}
        <IconSpinner width="20px" />
      {/if}
    </p>
    -->
  {/if}
  <br>
  <h4>Servicedesk</h4>
  <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
  <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
  <br />
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
  ul {
    padding-left: 32px;
  }
  .usernameContainer {
    display: flex;
    align-items: center;
  }
  .action, .snackbar {
    display: flex;
    gap: 4px;
    align-items: center;
    background-color: var(--himmel-30);
    border-radius: 0px;
    border: 0px solid;
    font-weight: bold;
    padding: 2px 6px;
    margin-left: 4px;
  }
  .snackbar {
    background-color: var(--korn-30);
    font-weight: normal;
    font-style: italic;
    margin-left: 0px;
  }
  .action:hover {
    background-color: var(--himmel-50);
  }
  .error {
    background-color: var(--nype-10);
    padding: 16px;
  }
</style>