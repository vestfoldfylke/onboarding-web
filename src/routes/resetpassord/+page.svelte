<script>
  import { onMount } from 'svelte'
  import { resetPassword, getEntraLoginUrl } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { goto } from '$app/navigation'
  import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
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
    await sleep(interval)
    loadingMessage = "Slår opp telefonnummer fra kontakt- og reservasjons-registeret"
    await sleep(interval)
    loadingMessage = "Finner på et engangspassord som er vanskelig å gjette"
    await sleep(interval)
    loadingMessage = "Tilbakestiller passord"
  }

  // Entra ID login

  let entraErrorMessage
  let entraLoading

  const entraLogin = async (loginHint) => {
    entraErrorMessage = null
    if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
      goto('/mockentra', { replaceState: false, invalidateAll: true })
    } else {
      try {
        entraLoading = true
        const { loginUrl } = await getEntraLoginUrl(loginHint)
        entraLoading = false
        window.location.href = loginUrl
      } catch (error) {
        entraLoading = false
        entraErrorMessage = error.response?.data?.message || error.stack || error.toString()
      }
    }
  }

  // State
  let resetPasswordResponse
  let showSnackbar = false

  const copyUsername = async () => {
    navigator.clipboard.writeText(resetPasswordResponse.userPrincipalName)
    showSnackbar = true
    await sleep(2750)
    showSnackbar = false
  }

  const resetPasswordForUser = async (code, iss, state) => {
    try {
      resetPasswordResponse = await resetPassword(code, iss, state)
    } catch (error) {
      const errorMsg =  error.response?.data?.message || error.stack || error.toString()
      resetPasswordResponse = { hasError: true, message: errorMsg }
    }
  }

  onMount(() => {
    const code = $page.state.code
    const state = $page.state.state
    const iss = $page.state.iss

    if (!(code && state && iss)) {
      console.log('De er ikke der, slutt å kødde')
      // Hvis de ikke er der, kan vi vel sende til forsiden egt
      goto('/', { replaceState: false })
    } else {
      resetPasswordForUser(code, iss, state)
      fakeLoadingMessages()
    }
  })

</script>

<div>
  {#if !resetPasswordResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}...</p>
    </div>
  {:else if resetPasswordResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">{resetPasswordResponse.message}</div>
  {:else}
    <h3>Hei, {resetPasswordResponse.displayName}</h3>
    <div class="section">
      <p><strong>Brukernavn:</strong> {resetPasswordResponse.userPrincipalName}</p>
    </div>
    <div class="section">
      <p><strong>Engangspassord sendt til:</strong> {resetPasswordResponse.maskedPhoneNumber}</p>
    </div>
    <InfoBox title="Ikke fått SMS?">
      <p><strong>Er ikke dette ditt mobilnummer?</strong></p>
      <a href="https://minprofil.kontaktregisteret.no" target="_blank">Trykk her for å sjekke hva du har registrert i Kontakt- og reservasjonsregisteret</a>
      <br />
      <br />
      <p><strong>Har du ikke fått SMS?</strong></p>
      <p>Vent i 5 minutter og forsøk igjen. Om det ikke hjelper, ta kontakt med servicedesk</p>
    </InfoBox>
    <div class="section">
      <p><strong>Når du har fått SMS:</strong></p>
      <p>1. Sett nytt passord</p>
      <p>2. Sett opp tofaktorautentisering*</p>
    </div>
    <div class="section">
      <button class="bigmode" on:click={() => { entraLogin(resetPasswordResponse.userPrincipalName) }}>Klikk her når du har mottatt SMS</button>
      <!--<a href="https://aka.ms/mysecurityinfo?login_hint={resetPasswordResponse.userPrincipalName}" target="_blank">https://aka.ms/mysecurityinfo</a>-->
      {#if entraLoading}
        <IconSpinner width="20px" />
      {/if}
      {#if entraErrorMessage}
        <div class="error">
          <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
          <p>{entraErrorMessage}</p>
        </div>
      {/if}
    </div>
  {/if}
  <br>
  <InfoBox title="Trenger du hjelp?">
    <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
    <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
  </InfoBox>
  <div class="section">
    <p><i>* Tofaktorautentisering betyr at du bruker to faktorer (bevis) for å bekrefte identiteten din når du logger deg på.</i></p>
  </div>
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
  .bigmode {
    border: 2px solid var(--himmel-70);
    background-color: var(--himmel-10);
    border-radius: 12px;
    align-items: center;
    padding: 16px;
    font-size: 1.1em;
  }
  .bigmode:hover {
    background-color: var(--himmel-30);
  }
  .section {
    margin: 12px 0px;
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
  @media only screen and (max-width: 768px) {
        /* For mobile phones: */
        .bigmode {
            width: 100%;
        }
    }  
</style>