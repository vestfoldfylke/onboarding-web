<script>
  import { getLoginUrl } from '../../lib/useApi'
  import CardButton from '../../lib/components/CardButton.svelte'
  import { goto } from '$app/navigation'
  import key from '$lib/assets/key.svg'

  let errorMessage = null
  let loading = false

  const redirect = async () => {
    // const confirmation = confirm("Er du sikker på du vil resette ditt passord?")
    const confirmation = true
    errorMessage = null
    if (confirmation) {
      if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
        goto('/mockidporten', { replaceState: false, invalidateAll: true })
      } else {
        try {
          loading = true
          const { loginUrl } = await getLoginUrl('ansatt')
          loading = false
          window.location.href = loginUrl
        } catch (error) {
          loading = false
          errorMessage = error.response?.data?.message || error.toString()
        }
      }
    }
  }

</script>

<main>
  <!--
  <div class="centerstuff">
    <p><strong>MERK:</strong> SMS med engangspassord vil bli sendt til telefonnummeret du har registrert i kontakt og reservasjons-registeret. Sjekk hva du har registrert i kontakt og reservasjons-registeret her: <a href="https://minprofil.kontaktregisteret.no" target="_blank">minprofil.kontaktregisteret.no</a></p>
  </div>
  -->
  {#if errorMessage}
    <div class="error">
      <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
      <p>{errorMessage}</p>
    </div>
  {/if}
  <div class="centerstuff">
    <CardButton header={'Aktiver bruker / tilbakestill passord'} imgPath={key} imgAlt={'Ikon bilde av en nøkkel'} gotoPath={''} paragraph={'Krever pålogging med MinID eller BankID, deretter vil du få et engangspassord på sms'} boolValue={false} {loading} func={redirect}/>
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