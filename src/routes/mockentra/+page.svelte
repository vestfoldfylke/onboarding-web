<script>
  import { page } from '$app/stores'

  const mockLogin = () => {
    const action = $page.url.searchParams.get('action')
    if (!action) {
      throw new Error('Mangler query param ACTION!')
    }
    if (!['mfa', 'pwd', 'stats'].includes(action)) {
      throw new Error('query param action must be "mfa" or "pwd" or "stats"')
    }
    if (action === 'mfa') {
      window.location.href = '/entramfacallback?code=mockcode&state=mockstate'
    } else if (action === 'pwd') {
      window.location.href = '/entrapwdcallback?code=mockcode&state=mockstate'
    } else if (action === 'stats') {
      window.location.href = '/entramfacallback?code=mockcode&state=statsguidfuidjuid'
    }
  }

</script>

<h2>MOCKE-ENTRA</h2>
<button on:click={mockLogin}>Lat som du logger på EntraID</button>
<p>Ingen data ellerno vil bli hentet/sendt, dette skjer bare lokalt i browser</p>

<style>
</style>