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

  let infoModal
  let countDown = 15

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
    infoModal.showModal()
    for (countDown; countDown > 0; countDown--) {
      await sleep(1000)
    }
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

  // STUDENT_PC_AGREEMENT
  let studentPcAgreementEnabled = import.meta.env.VITE_STUDENT_PC_AGREEMENT_ENABLED === 'true' && $page.state.state?.startsWith('elev')

  let code = $page.state.code
  let state = $page.state.state
  let iss = $page.state.iss

  let studentPcAgreementUrl = import.meta.env.VITE_STUDENT_PC_AGREEMENT_URL
  let studentPcAgreementAcceptedCheckBoxValue = false
  let studentPcAgreementAccepted = false

  onMount(() => {
    if (!(code && state && iss)) {
      console.log('De er ikke der, slutt å kødde')
      goto('/')
      return
    }

    if (studentPcAgreementEnabled && !import.meta.env.VITE_STUDENT_PC_AGREEMENT_URL) {
      throw new Error('STUDENT_PC_AGREEMENT_ENABLED is true, but STUDENT_PC_AGREEMENT_URL is not set!')
    }

    if (!studentPcAgreementEnabled) {
      resetPasswordForUser(code, iss, state)
      fakeLoadingMessages()
    }
  })

</script>

<div>
  {#if studentPcAgreementEnabled && !studentPcAgreementAccepted}
    <br />
    
    <p>
      <strong>
        Vi har et eget reglement for elev-PC. Dette må du bekrefte at du har lest og forstått.
      </strong>
    </p>

    <br />

    <p>
      <strong>Vi forventer at du blant annet:</strong>
    </p>
    <ul>
      <li>tar godt vare på PC-en din</li>
      <li>melder fra til skolen hvis PC-en blir skadet, ikke fungerer eller om du mister den</li>
    </ul>

    <br />

    <p>
      <a class="agreement-link" href="{studentPcAgreementUrl}" target="_blank">
        <span class="material-symbols-outlined">link_2</span>
        Les hele reglementet (åpnes i ny side).
      </a>
    </p>

    <br />
    <br />

    <label class="agreement-checkbox">
      <input type="checkbox" bind:checked={studentPcAgreementAcceptedCheckBoxValue} />
      <span>
        Jeg bekrefter at jeg har lest og forstått reglement for elev-PC
      </span>
    </label>

    <br />

    <div class="next-button-container">
      <button disabled={!studentPcAgreementAcceptedCheckBoxValue} on:click={() => { studentPcAgreementAccepted = true; resetPasswordForUser(code, iss, state) }}>Neste</button>
    </div>
  {:else}
    {#if !resetPasswordResponse}
      <div class="loading">
        <IconSpinner />
        <p class="loadingMessage">{loadingMessage}...</p>
      </div>
    {:else if resetPasswordResponse.hasError}
      <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
      <div class="error">
        <p>{resetPasswordResponse.message}</p>
        <div style="display: flex; gap: 5px; align-items: center"><span class="material-symbols-outlined">arrow_back</span><a href="/">Til startsiden</a></div>
      </div>
    {:else}
      <h3>Hei, {resetPasswordResponse.displayName}</h3>
      <div class="section">
        <p><strong>Brukernavn:</strong> {resetPasswordResponse.userPrincipalName}</p>
      </div>

      <div class="section">
        <p>Midlertidig passord er sendt til: {resetPasswordResponse.maskedPhoneNumber}</p>
      </div>

      <div class="section">
        <button class="big" on:click={() => { entraLogin(resetPasswordResponse.userPrincipalName, resetPasswordResponse.logEntryId) }}>Klikk her når du har mottatt SMS</button>
        <!--<a href="https://aka.ms/mysecurityinfo?login_hint={resetPasswordResponse.userPrincipalName}" target="_blank">https://aka.ms/mysecurityinfo</a>-->
        <dialog bind:this={infoModal}>
          <form method="dialog">
              <div class="modalContent">
                <div>
                  <h2 class="modalTitle">VIKTIG!</h2>
                  <p>Du skal bruke det midlertidige passordet som du fikk på SMS to ganger:</p>
                  <ol>
                    <li>for å logge på</li>
                    <li>som <strong>"nåværende passord"</strong> når du lager nytt passord</li>
                  </ol>
                </div>
                <br />
                <p><i>Du sendes videre til innlogging om {countDown} sekunder</i></p>
            </div>
          </form>
        </dialog>
        {#if entraLoading}
          <IconSpinner width="20px" />
        {/if}
        {#if entraErrorMessage}
          <div class="error">
            <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
            <p>{entraErrorMessage}</p>
            <div style="display: flex; gap: 5px; align-items: center"><span class="material-symbols-outlined">arrow_back</span><a href="/">Til startsiden</a></div>
          </div>
        {/if}
      </div>

      <br />

      <InfoBox title="Ikke mottatt SMS? Trykk her">
        <p><strong>Er ikke dette ditt mobilnummer?</strong></p>
        <a href="https://minprofil.kontaktregisteret.no" target="_blank">Trykk her for å sjekke hva du har registrert i Kontakt- og reservasjonsregisteret</a>
        <br />
        <br />
        <p><strong>Har du ikke fått SMS?</strong></p>
        <p>Vent i 5 minutter og forsøk igjen. Om det ikke hjelper, ta kontakt med servicedesk</p>
        <br />
        <p><strong>Servicedesk</strong></p>
        <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
        <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
      </InfoBox>
    {/if}
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
  .modalContent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .modalTitle {
    margin-bottom: 8px;
  }
  form {
    height: 100%;
  }

  .agreement-link > span {
    font-size: 1.2rem;
    vertical-align: sub;
  }

  .agreement-checkbox {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .next-button-container {
    display: flex;
    justify-content: flex-start;
  }

  li {
    margin-left: 2rem;
  }
</style>