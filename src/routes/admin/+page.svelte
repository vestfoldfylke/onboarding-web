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
  {#if errorMessage}
    <div class="error">
      <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
      <p>{errorMessage}</p>
    </div>
  {/if}
  <div class="centerstuff">
    <div>
      <h3>Admin-greier</h3>
      <!--<button class="link" on:click={() => redirect('stats') }><span class="material-symbols-outlined">analytics</span>Se statistikk</button>-->
      <p>Ingenting å se eller gjøre her</p>
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