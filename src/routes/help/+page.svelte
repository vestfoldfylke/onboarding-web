<script>

  let currentCounty = import.meta.env.VITE_FYLKE

  const links = [
    {
      title: "Elev fra mobil",
      href: currentCounty === 'vestfold' ? 'https://vestfoldfylke.no/no/meny/tjenester/opplaring/opplaring-i-skole/nye-brukerkontoer-for-skoleansatte-og-elever/ny-brukerkonto-for-deg-som-elev/#heading-h2-4' : 'https://telemarkfylke.no/no/meny/tjenester/opplaring-og-folkehelse/opplaring-i-skole/ny-brukerkonto-fra-skolearet-2024-2025/ny-brukerkonto-for-deg-som-elev/#heading-h2-4'
    },
    {
      title: "Elev fra PC",
      href: currentCounty === 'vestfold' ? "https://www2.vestfoldfylke.no/doc/P-ORG-NyeFK-IKT-Infrastrukturogfelleslsninger/8582016473a868be4c5c16e0776ac440-Veiledning%20Oppsett%20brukerkonto%20fra%20PC.pdf" : 'https://telemarkfylke.no/globalassets/tfk/dokumenter/opplaring-og-folkehelse/ny-brukerkonto/veiledning-oppsett-brukerkonto-fra-pc---elev---14.06.24.pdf'
    },
    {
      title: "Ansatt fra mobil",
      href: currentCounty === 'vestfold' ? "https://www2.vestfoldfylke.no/doc/P-ORG-NyeFK-IKT-Infrastrukturogfelleslsninger/ce119cebe9afb9759049f2b91e3ee91d-Veiledning%20Oppsett%20av%20konto%20fra%20mobil_ansatt.pdf" : "https://telemarkfylke.no/globalassets/tfk/dokumenter/opplaring-og-folkehelse/ny-brukerkonto/veiledning-oppsett-av-konto-fra-mobil_ansatt---14.06.24.pdf"
    },
    {
      title: "Ansatt fra PC",
      href: currentCounty === 'vestfold' ? "https://www2.vestfoldfylke.no/doc/P-ORG-NyeFK-IKT-Infrastrukturogfelleslsninger/05b8f30cf3fb09df4661268a2f6f5597-Veiledning%20Oppsett%20av%20konto%20fra%20PC_ansatt.pdf" : 'https://telemarkfylke.no/globalassets/tfk/dokumenter/opplaring-og-folkehelse/ny-brukerkonto/veiledning-oppsett-av-konto-fra-pc_ansatt-14.06.24.pdf'
    }
  ]

</script>

<div>
  <h1>Står du fast?</h1>
  <h2>Da finner du veiledninger her:</h2>
  <ul>
    {#each links as link}
      <li>
        <a href="{link.href}" target="_blank">{link.title}</a>
      </li>
    {/each}
  </ul>
</div>

 
<style>
  ul {
    padding-left: 32px;
    font-size: 24px;
  }
  li {
    padding: 12px 0px;
  }
</style>