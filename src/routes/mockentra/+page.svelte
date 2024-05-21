<script>
  const mockLogin = () => {
    window.location.href = '/entracallback?code=mockcode&state=mockstate'
  }

</script>

<h2>MOCKE-ENTRA</h2>
<button on:click={mockLogin}>Lat som du logger på EntraID</button>
<p>Ingen data ellerno vil bli hentet/sendt, dette skjer bare lokalt i browser</p>

<style>
</style>