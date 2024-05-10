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
      resetPasswordResponse = { hasError: true, message: JSON.stringify(error.response?.data || error.stack) }
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
    {JSON.stringify(resetPasswordResponse, null, 2)}
  {:else}
    <h3>Hei, {resetPasswordResponse.displayName}</h3>
    <br />
    <p>Vi har nå sendt et engangspassord til deg på tlf nr: <strong>{resetPasswordResponse.maskedPhoneNumber}</strong></p>
    <p><i>Er ikke dette ditt telefonnummer? Sjekk hva du har registrert i kontakt og reservasjons-registeret her: <a href="https://minprofil.kontaktregisteret.no" target="_blank">https://minprofil.kontaktregisteret.no</a></i></p>
    <br />
    <div class="usernameContainer">
      <p>Brukernavn: </p>
      <button title="Kopier brukernavn" class="action" on:click={copyUsername}>{resetPasswordResponse.userPrincipalName}<span class="material-symbols-outlined">content_copy</span></button>
      {#if showSnackbar}
        <p class="snackbar" transition:fly={{ delay: 50, duration: 500, x: -50, y: 0, opacity: 0, easing: quintOut }}><span class="material-symbols-outlined">done</span>Kopiert til utklippstavlen</p>
      {/if}
    </div>
    <br>
    <p>Når du har fått engangspassord på sms, går du til <a href="https://aka.ms/mysecurityinfo?login_hint={resetPasswordResponse.userPrincipalName}" target="_blank">https://aka.ms/mysecurityinfo</a> for å sette et nytt passord og evt to-faktor</p>
    <p>Når dette er gjort er brukeren din aktivert og klar til vanlig bruk. Ta kontakt med servicedesk dersom du trenger hjelp.</p>
    <br>
    <h4>Servicedesk</h4>
    <p>Telefon: {import.meta.env.VITE_SERVICEDESK_TLF}</p>
    <p>E-post: {import.meta.env.VITE_SERVICEDESK_EPOST}</p>
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
</style>