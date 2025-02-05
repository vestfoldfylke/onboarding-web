<script>
  import { getIdportenLogoutUrl } from '$lib/useApi'
  import { goto } from '$app/navigation'
  
  export let data
  const { theme } = data

  const logout = async () => {
    const { logoutUrl } = await getIdportenLogoutUrl()
    window.location.href = logoutUrl
  }

  const appTitle = ""
</script>

<svelte:head>
  <link rel="icon" href={theme.assets.favicon} />
  <link rel="stylesheet" href={theme.assets.css}>
</svelte:head>

<div class="topbar">
  <div class="toptop">
    <div>
      <a href="/"><img class="logo" src={theme.assets.logo} alt="Fylkekommunens logo" /></a>
    </div>
    <a href="/" title="Gå til forsiden" class="appTitle"><h1>{appTitle}</h1></a>
    <div class="topbarOptions">
      <button class="link" on:click={logout}><span class="material-symbols-outlined">logout</span>Hjem / Logg ut</button>
      <button class="link" on:click={() => { goto('/help') } }><span class="material-symbols-outlined">help</span>Hjelp</button>
    </div>
  </div>
</div>
<div class="content">
  <slot></slot>
</div>
<div class="footer">
</div>