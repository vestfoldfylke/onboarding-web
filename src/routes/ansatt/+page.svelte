<script>
  import { getLoginUrl } from '../../lib/useApi'
  import CardButton from '../../components/CardButton.svelte'

  const redirect = async () => {
    const { loginUrl } = await getLoginUrl('ansatt')
    window.location.href = loginUrl
  }

  

</script>

<main>
  <!-- <p>Halla</p>
  <button on:click={redirect}>Send engangspassord på sms</button>
  <p>Krever pålogging ID-porten (MinID / BankID)</p> -->
  <CardButton header={'Send engangspassord på sms'} imgPath={'src/assets/key.svg'} imgAlt={'Ikon bilde av en ansatt'} gotoPath={''} paragraph={'Krever pålogging ID-porten (MinID / BankID)'} boolValue={false} func={redirect}/>
</main>


<style>
</style>