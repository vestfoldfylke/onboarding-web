<script>
  import { page } from '$app/stores'
  import { getThemeAsset } from '$lib/themes/theme.config'

  const mockIcon = getThemeAsset('images/idporten.svg')

  const mockLogin = () => {
    const action = $page.url.searchParams.get('action')
    if (!action) {
      throw new Error('Mangler query param ACTION!')
    }
    window.location.href = `/idportencallback?code=mockcode&iss=mockiss&state=mock${action}`
  }
</script>

<div class="mock-container">
  <h2>MOCK IDPORTEN</h2>
  <button class="mock-button" on:click={mockLogin}>
    Lat som du logger på ID-porten
  </button>
  <p class="mock-info">
    Ingen data ellerno vil bli hentet/sendt, dette skjer bare lokalt i browser
  </p>
</div>