<script>
  import '../app.css' // Add global css (and make it hot reload)
  import logo from '$lib/assets/logo.png'
  import { getLogoutUrl } from '../lib/useApi'
  import { goto } from '$app/navigation'

  const logout = async () => {
    const { logoutUrl } = await getLogoutUrl()
    window.location.href = logoutUrl
  }

  const appTitle = ""

</script>

<div class="topbar">
  <div class="toptop">
    <div>
      <a href="/"><img class="logo" src={logo} alt="Fylkekommunens logo" /></a>
    </div>
    <a href="/" title="Gå til forsiden" class="appTitle"><h1>{appTitle}</h1></a>
    <div class="topbarOptions">
      <button class="link" on:click={logout}><span class="material-symbols-outlined">logout</span>Hjem / Logg ut</button>
      <button class="link" on:click={() => { goto('/help', { replaceState: false }) }}><span class="material-symbols-outlined">help</span>Hjelp</button>
    </div>
  </div>
</div>
<div class="content">
  <slot></slot>
</div>
<div class="footer">
</div>

<style>
  .appTitle {
    color: black;
    text-decoration: none;
  }
  .topbar {
    width: 100%;
    background-color: var(--gress-10);
    padding: 20px 0px;
  }
  .toptop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px 40px 40px;
  }
  .topbarOptions {
    float: right;
    display: flex;
    flex-direction: column;
    align-items: self-end;
  }
  .logo {
    width: 180px;
  }
  .content {
    padding: 20px 20px 10px 20px;
    margin: auto;
    max-width: 1440px;
  }

  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    .topbar {
      padding: 5px 0px;
    }
    .toptop {
      padding: 5px;
    }
    .appTitle {
      display: none;
      font-size: 10px;
    }
    .logo {
      width: 92px;
    }
    .content {
      padding: 12px;
    }
  }
</style>