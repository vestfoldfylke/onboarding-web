<script>
  import { getIdPortenLoginUrl } from '../../lib/useApi'
  import { getThemeAsset } from '$lib/themes/theme.config'
  import CardButton from '../../lib/components/CardButton.svelte'

  const keyIcon = getThemeAsset('images/key.svg')
  const verifiedIcon = getThemeAsset('images/verified.svg')

  let errorMessage = null
  let loading = false

  const redirect = async (action) => {
    errorMessage = null
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
</script>

<main>
  {#if errorMessage}
    <div class="error">
      <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
      <p>{errorMessage}</p>
    </div>
  {/if}
  <div class="centerstuff">
    <CardButton 
      header="Verifiser bruker"
      imgPath={verifiedIcon}
      imgAlt="Ikon bilde av en nøkkel"
      gotoPath=""
      paragraph="Krever pålogging med MinID eller BankID"
      boolValue={false}
      loading={loading === 'verifyuser'}
      func={() => redirect('verifyuser')}
    />
    <CardButton 
      header="Tilbakestill passord"
      imgPath={keyIcon}
      imgAlt="Ikon bilde av en nøkkel"
      gotoPath=""
      paragraph="Krever pålogging med MinID eller BankID, deretter vil du få et engangspassord på sms"
      boolValue={false}
      loading={loading === 'resetpassword'}
      func={() => redirect('resetpassword')}
    />
  </div>
</main>