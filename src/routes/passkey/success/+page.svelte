<script>
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import InfoBox from '../../../lib/components/InfoBox.svelte'

  let displayName = $page.state.displayName
  let userPrincipalName = $page.state.userPrincipalName

  onMount(() => {
    if (!(displayName && userPrincipalName)) {
      console.log('De er ikke der, slutt å kødde')
      goto('/')
    }
  })
</script>

<div>
  {#if displayName && userPrincipalName}
    <h3>Hei, {displayName}</h3>
    <div class="section">
      <p><strong>Brukernavn:</strong> {userPrincipalName}</p>
    </div>
    <div class="section">
      <p>✅ Passkey er registrert. Kontoen din er nå klar til bruk.</p>
      <br />
      <p>
        Du kan nå logge inn på fylkeskommunens systemer med passkey — uten passord.
      </p>
    </div>
  {/if}
  <br />
  <InfoBox title="Trenger du hjelp?">
    <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
    <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
  </InfoBox>
</div>


<style>
  .section {
    margin: 12px 0px;
  }
</style>
