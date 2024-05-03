<script>
  import '../app.css' // Add global css (and make it hot reload)
  import logo from '$lib/assets/logo.png'

  const appTitle = "All aboard! 🚂"

</script>

<div class="topbar">
  <div class="toptop">
    <div>
      <img class="logo" src={logo} alt="Fylkekommunens logo" />
    </div>
    <a href="/" title="Gå til forsiden" class="appTitle"><h1>{appTitle}</h1></a>
    <div class="topbarOptions">
      <a href="/help"><span class="material-symbols-outlined">help</span>Hjelp</a>
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
      font-size: 10px;
    }
    .logo {
      width: 92px;
    }
    .content {
      padding: 5px;
    }
  }
</style>