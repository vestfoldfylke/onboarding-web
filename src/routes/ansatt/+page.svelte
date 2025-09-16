<script>
  import { getIdPortenLoginUrl } from '../../lib/useApi'
  import CardButton from '../../lib/components/CardButton.svelte'
  import travel from '$lib/assets/travel.svg'
  import key from '$lib/assets/key.svg'

  let errorMessage = null
  let loading = false

  const utenlandsreiseUrl = import.meta.env.VITE_UTENLANDSREISE_SKJEMA_URL

  const redirect = async (action) => {
    // const confirmation = confirm("Er du sikker på du vil resette ditt passord?")
    const confirmation = true
    errorMessage = null
    if (confirmation) {
      try {
        loading = action
        const { loginUrl } = await getIdPortenLoginUrl('ansatt', action)
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
  <div class="centerstuff">
    <CardButton header={''} imgPath={key} imgAlt={'Ikon bilde av en nøkkel'} gotoPath={''} paragraph={'Trykk her hvis du skal aktivere din nye brukerkonto eller tilbakestille passordet ditt'} boolValue={false} {loading} func={() => redirect('resetpassword')}/>
    {#if utenlandsreiseUrl}
      <CardButton header={''} imgPath={travel} imgAlt={'Ikon bilde av et fly'} paragraph={'Trykk her hvis du vil logge deg på fylkeskommunens systemer mens du er i utlandet'} boolValue={false} func={() => {window.open(utenlandsreiseUrl)}}/>
    {/if}
  </div>
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
</style>