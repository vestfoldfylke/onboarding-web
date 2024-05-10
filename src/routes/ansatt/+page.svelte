<script>
  import { getLoginUrl } from '../../lib/useApi'
  import CardButton from '../../lib/components/CardButton.svelte'
  import { goto } from '$app/navigation'

  const redirect = async () => {
    // const confirmation = confirm("Er du sikker på du vil resette ditt passord?")
    const confirmation = true
    if (confirmation) {
      if (import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true') {
        goto('/mockidporten', { replaceState: false, invalidateAll: true })
      } else {
        const { loginUrl } = await getLoginUrl('ansatt')
        window.location.href = loginUrl
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
  <div class="centerstuff">
    <CardButton header={'Tilbakestill mitt passord, og send engangspassord på sms'} imgPath={'src/assets/key.svg'} imgAlt={'Ikon bilde av en nøkkel'} gotoPath={''} paragraph={'Krever pålogging med MinID eller BankID'} boolValue={false} func={redirect}/>
  </div>
</main>


<style>
  .centerstuff {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
  }
</style>