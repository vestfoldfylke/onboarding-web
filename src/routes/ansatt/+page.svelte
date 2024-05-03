<script>
  import { getLoginUrl } from '../../lib/useApi'

  const redirect = async () => {
    const { loginUrl } = await getLoginUrl('ansatt')
    window.location.href = loginUrl
  }

</script>

<div>
  <p>Halla</p>
  <button on:click={redirect}>Send engangspassord på sms</button>
  <p>Krever pålogging ID-porten (MinID / BankID)</p>
</div>


<style>
</style>