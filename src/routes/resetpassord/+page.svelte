<script>
  import { onMount } from 'svelte'
  import { resetPassword, getEntraPwdLoginUrl } from '../../lib/useApi'
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

  const entraLogin = async (loginHint, logEntryId) => {
    entraErrorMessage = null
    try {
      entraLoading = true
      const { loginUrl } = await getEntraPwdLoginUrl(loginHint, logEntryId)
      entraLoading = false
      window.location.href = loginUrl
    } catch (error) {
      entraLoading = false
      entraErrorMessage = error.response?.data?.message || error.stack || error.toString()
    }
  }

  // State
  let resetPasswordResponse

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
      <p>Midlertidig passord er sendt til: {resetPasswordResponse.maskedPhoneNumber}</p>
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
      <p><strong>Når du har fått SMS skal du:</strong></p>
      <p>1. Logge på med passord fra SMS</p>
      <p>2. Sette nytt passord<strong>*</strong></p>
      <p>3. Sette opp tofaktorautentisering<strong>**</strong></p>
    </div>
    <div class="section">
      <button class="big" on:click={() => { entraLogin(resetPasswordResponse.userPrincipalName, resetPasswordResponse.logEntryId) }}>Klikk her når du har mottatt SMS</button>
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
    <p><i><strong>*</strong> Bruk SMS-passord som "Nåværende passord"</i></p>
  </div>
  <div class="section">
    <p><i><strong>**</strong> Tofaktorautentisering betyr at du bruker to faktorer (bevis) for å bekrefte identiteten din når du logger deg på.</i></p>
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
  .section {
    margin: 12px 0px;
  }
  .error {
    background-color: var(--nype-10);
    padding: 16px;
  }
</style>