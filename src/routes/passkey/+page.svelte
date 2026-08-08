<script>
  import { onMount } from 'svelte'
  import { startPasskeyOnboarding, completePasskeyOnboarding } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { goto } from '$app/navigation'
  import InfoBox from '../../lib/components/InfoBox.svelte'

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
    loadingMessage = "Utsteder engangskode (TAP)"
    await sleep(interval)
    loadingMessage = "Klargjør passkey-registrering"
  }

  // Start passkey onboarding
  let startResponse

  const startForUser = async (code, iss, state) => {
    try {
      startResponse = await startPasskeyOnboarding(code, iss, state)
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.stack || error.toString()
      startResponse = { hasError: true, message: errorMsg }
    }
  }

  // TAP copy state
  let copied = false

  const copyTap = async () => {
    try {
      await navigator.clipboard.writeText(startResponse.temporaryAccessPass)
      copied = true
      await sleep(2000)
      copied = false
    } catch {
      copied = false
    }
  }

  // Complete passkey onboarding
  let completeResponse
  let completing = false

  const finish = async () => {
    completing = true
    completeResponse = undefined
    try {
      const result = await completePasskeyOnboarding(startResponse.logEntryId)
      if (result.completed) {
        goto('/passkey/success', { state: { displayName: result.displayName, userPrincipalName: result.userPrincipalName }, replaceState: true })
        return
      }
      completeResponse = result
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.stack || error.toString()
      completeResponse = { completed: false, hasError: true, message: errorMsg }
    } finally {
      completing = false
    }
  }

  // Formatted expiry
  const formatExpiry = (isoString) => {
    if (!isoString) return ''
    try {
      const formatter = new Intl.DateTimeFormat('nb-NO', { hour: '2-digit', minute: '2-digit' })
      return formatter.format(new Date(isoString))
    } catch {
      return ''
    }
  }

  let code = $page.state.code
  let state = $page.state.state
  let iss = $page.state.iss

  onMount(() => {
    if (!(code && state && iss)) {
      console.log('De er ikke der, slutt å kødde')
      goto('/')
      return
    }
    startForUser(code, iss, state)
    fakeLoadingMessages()
  })
</script>

<div>
  {#if !startResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}...</p>
    </div>
  {:else if startResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">
      <p>{startResponse.message}</p>
      <div style="display: flex; gap: 5px; align-items: center"><span class="material-symbols-outlined">arrow_back</span><a href="/">Til startsiden</a></div>
    </div>
  {:else}
    <h3>Hei, {startResponse.displayName}</h3>
    <div class="section">
      <p><strong>Brukernavn:</strong> {startResponse.userPrincipalName}</p>
    </div>

    <div class="section">
      <p>
        Under er en <strong>engangskode</strong> som du bruker til å registrere en passkey (passordfri innlogging) på Microsoft-siden.
        Koden er gyldig i {startResponse.lifeTimeInMinutes} minutter{#if startResponse.expireDateTime} (utløper kl. {formatExpiry(startResponse.expireDateTime)}){/if}.
      </p>
    </div>

    <div class="tapBox">
      <span class="tapCode">{startResponse.temporaryAccessPass}</span>
      <button type="button" class="copyButton" on:click={copyTap}>
        <span class="material-symbols-outlined">content_copy</span>
        <span>{copied ? 'Kopiert!' : 'Kopier'}</span>
      </button>
    </div>

    <div class="section">
      <ol>
        <li>Åpne Microsoft-siden og logg på med brukernavnet ditt.</li>
        <li>Lim inn engangskoden når du blir bedt om det.</li>
        <li>Følg instruksjonene for å registrere en passkey.</li>
        <li>Kom tilbake hit og trykk «Jeg er ferdig».</li>
      </ol>
    </div>

    <div class="section">
      <a class="externalLink" href="https://aka.ms/mysecurityinfo" target="_blank" rel="noopener noreferrer">
        <span class="material-symbols-outlined">open_in_new</span>
        <span>Åpne Microsoft-siden (aka.ms/mysecurityinfo)</span>
      </a>
    </div>

    <div class="section">
      <button class="big" disabled={completing} on:click={finish}>
        {#if completing}
          Sjekker om passkey er registrert...
        {:else}
          Jeg er ferdig
        {/if}
      </button>
    </div>

    {#if completing}
      <div class="loading">
        <IconSpinner width="20px" />
        <p class="loadingMessage">Sjekker om passkey er registrert...</p>
      </div>
    {/if}

    {#if completeResponse && !completeResponse.completed}
      <div class="error">
        <h3 class="errorTitle">Ikke helt i mål enda</h3>
        <p>{completeResponse.message || 'Vi fant ingen registrert passkey på kontoen din. Fullfør registreringen på Microsoft-siden og prøv igjen.'}</p>
        <br />
        <button on:click={finish} disabled={completing}>Prøv igjen</button>
      </div>
    {/if}

    <br />

    <InfoBox title="Trenger du hjelp?">
      <p><strong>Får du ikke koden til å fungere?</strong></p>
      <p>Koden er en engangskode og kan kun brukes én gang. Er den utløpt eller allerede brukt, må du starte flyten på nytt fra forsiden.</p>
      <br />
      <p><strong>Servicedesk</strong></p>
      <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
      <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
    </InfoBox>
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
  .tapBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background-color: var(--vann-10);
    padding: 16px 20px;
    margin: 16px 0px;
    border-radius: 4px;
    flex-wrap: wrap;
  }
  .tapCode {
    font-family: ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    user-select: all;
    word-break: break-all;
  }
  .copyButton {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .copyButton > span.material-symbols-outlined {
    font-size: 1.2rem;
  }
  .externalLink {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .externalLink > span.material-symbols-outlined {
    font-size: 1.2rem;
    vertical-align: sub;
  }
  ol {
    padding-left: 1.5rem;
  }
  ol > li {
    margin: 4px 0;
  }
</style>
