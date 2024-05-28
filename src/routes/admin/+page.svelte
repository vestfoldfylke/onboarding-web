<script>
  import { getStatsLoginUrl } from '../../lib/useApi'

  let errorMessage = null
  let loading = false

  const redirect = async () => {
    errorMessage = null
    try {
      loading = true
      const { loginUrl } = await getStatsLoginUrl()
      loading = false
      window.location.href = loginUrl
    } catch (error) {
      loading = false
      errorMessage = error.response?.data?.message || error.toString()
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
    <div>
      <h3>Admin-greier</h3>
      <button class="link" on:click={() => redirect('stats') }><span class="material-symbols-outlined">analytics</span>Se statistikk</button>
      {#if loading}
        laster...
      {/if}
    </div>
  </div>
</main>


<style>
  .centerstuff {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
  }
  .error {
    text-align: center;
    background-color: var(--nype-10);
    padding: 16px;
  }
</style>