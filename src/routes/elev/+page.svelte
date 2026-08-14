<script>
  import { getIdPortenLoginUrl } from '../../lib/useApi'
  import CardButton from '../../lib/components/CardButton.svelte'
  import travel from '$lib/assets/travel.svg'
  import key from '$lib/assets/key.svg'
  import { onMount } from 'svelte';

  let errorMessage = null
  let loading = false

  // STUDENT_PC_AGREEMENT
  let studentPcAgreementEnabled = import.meta.env.VITE_STUDENT_PC_AGREEMENT_ENABLED === 'true'
  let showPcAgreementStuff = false
  let studentPcAgreementUrl = import.meta.env.VITE_STUDENT_PC_AGREEMENT_URL
  let studentPcAgreementAcceptedCheckBoxValue = false

  const utenlandsreiseUrl = import.meta.env.VITE_UTENLANDSREISE_SKJEMA_URL

  onMount(() => {
    if (studentPcAgreementEnabled && !import.meta.env.VITE_STUDENT_PC_AGREEMENT_URL) {
      throw new Error('STUDENT_PC_AGREEMENT_ENABLED is true, but STUDENT_PC_AGREEMENT_URL is not set!')
    }
  })

  const redirect = async (action) => {
    // const confirmation = confirm("Er du sikker på du vil resette ditt passord?")
    const confirmation = true
    errorMessage = null
    if (confirmation) {
      try {
        loading = true
        const { loginUrl } = await getIdPortenLoginUrl('elev', action)
        loading = false
        window.location.href = loginUrl
      } catch (error) {
        loading = false
        errorMessage = error.response?.data?.message || error.toString()
      }
    }
  }

</script>

<main>
  {#if errorMessage}
    <div class="error">
      <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
      <p>{errorMessage}</p>
    </div>
  {/if}
  {#if !showPcAgreementStuff}
    <div class="centerstuff">
      <CardButton header={''} imgPath={key} imgAlt={'Ikon bilde av en nøkkel'} gotoPath={''} paragraph={'Trykk her for å aktivere din nye brukerkonto eller tilbakestille passordet ditt'} boolValue={false} {loading} func={() => showPcAgreementStuff = true}/>
      {#if utenlandsreiseUrl}
        <CardButton header={''} imgPath={travel} imgAlt={'Ikon bilde av et fly'} paragraph={'Trykk her for å logge deg på fylkeskommunens systemer mens du er i utlandet'} boolValue={false} func={() => {window.open(utenlandsreiseUrl)}}/>
      {/if}
    </div>
  {:else if studentPcAgreementEnabled}
    <br />
    
    <p>
      <strong>
        Vi har et eget reglement for elev-PC og lån fra skolebibliotek. Dette må du bekrefte at du har lest og forstått.
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
        Jeg bekrefter at jeg har lest og forstått reglement for elev-PC og lån fra skolebibliotek
      </span>
    </label>

    <br />

    <div class="next-button-container">
      <button disabled={!studentPcAgreementAcceptedCheckBoxValue} on:click={() => { redirect('resetpassword') }}>Neste</button>
    </div>
  {/if}

</main>


<style>
  .centerstuff {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
  }
  .error {
    text-align: center;
    background-color: var(--nype-10);
    padding: 16px;
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