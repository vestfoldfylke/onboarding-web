<script>
  import { onMount } from 'svelte'
  import { resetPassword } from '../../lib/useApi'
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
    <br />
    <p>Ditt brukernavn er: <strong>{resetPasswordResponse.userPrincipalName}</strong></p>
    <br />
    <p>Vi har sendt et engangspassord på SMS til mobilnummer: <strong>{resetPasswordResponse.maskedPhoneNumber}</strong></p>
    <p>Er det ikke ditt mobilnummer? <a href="https://minprofil.kontaktregisteret.no" target="_blank">Trykk her for å sjekke hva du har registrert i Kontakt- og reservasjonsregisteret</a></p>
    <p><i>Har du ikke fått sms og det er ditt mobilnummer? Vent i 10 min og prøv igjen, eller ta kontakt med Bjørn Riis</i></p>
    <br />
    <!--
    <div class="usernameContainer">
      <p>Brukernavn: </p>
      <button title="Kopier brukernavn" class="action" on:click={copyUsername}>{resetPasswordResponse.userPrincipalName}<span class="material-symbols-outlined">content_copy</span></button>
      {#if showSnackbar}
        <p class="snackbar" transition:fly={{ delay: 50, duration: 500, x: -50, y: 0, opacity: 0, easing: quintOut }}><span class="material-symbols-outlined">done</span>Kopiert til utklippstavlen</p>
      {/if}
    </div>
    <br>
    -->
    <p>Når du har mottatt engangspassordet på SMS, klikker du deg inn på:</p>
    <p><a href="https://aka.ms/mysecurityinfo?login_hint={resetPasswordResponse.userPrincipalName}" target="_blank">https://aka.ms/mysecurityinfo</a></p>
    <br />
    <p>Her skal du gjøre to ting før du er ferdig:</p>
    <ul>
      <li>Erstatte engangspassordet du fikk tilsendt med et eget passord
        <ul>
          <li>Passordet du lager må bestå av minst 14 tegn, inneholde små og store bokstaver, og minst et tall eller tegn</li>
        </ul>
      </li>
      <li>Sette opp tofaktorautentisering* </li>
    </ul>
    <br />
    <p>Når du har laget deg et nytt passord og satt opp tofaktorautentisering, er den nye brukeren din aktivert og klar til bruk. Ta kontakt med servicedesk dersom du trenger hjelp. </p>
  {/if}
  <br>
  <h4>Servicedesk</h4>
  <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
  <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
  <br />
  <p><i>* Tofaktorautentisering betyr at du bruker to faktorer (bevis) for å bekrefte identiteten din når du logger deg på.</i></p>
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