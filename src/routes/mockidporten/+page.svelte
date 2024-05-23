<script>
  import { page } from '$app/stores'

  const mockLogin = () => {
    const action = $page.url.searchParams.get('action')
    if (!action) {
      throw new Error('Mangler query param ACTION!')
    }
    window.location.href = `/idportencallback?code=mockcode&iss=mockiss&state=mock${action}`
    //goto('/idportencallback?code=mockcode&iss=mockiss&state=mockstate', { replaceState: false })
  }

</script>

<h2>MOCKE-PORTEN</h2>
<button on:click={mockLogin}>Lat som du logger på ID-porten</button>
<p>Ingen data ellerno vil bli hentet/sendt, dette skjer bare lokalt i browser</p>

<style>
</style>