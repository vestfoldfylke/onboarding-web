<script>
  import CardButton from '../lib/components/CardButton.svelte'
  import school from '$lib/assets/school.svg'
  import person from '$lib/assets/person.svg'
  import travel from '$lib/assets/travel.svg'

  const utenlandsreiseUrl = import.meta.env.VITE_UTENLANDSREISE_SKJEMA_URL
</script>

<main>
    <div class="centerstuff">
        <h3>Logg på med MinID eller BankID for å aktivere brukeren din eller tilbakestille passordet ditt. </h3>
    </div>
    <div class="centerstuff">
        <CardButton header={'Elev eller lærling'} imgPath={school} imgAlt={'Ikon bilde av en elev'} gotoPath={'/elev'} paragraph={'Trykk her hvis du er elev eller lærling'} boolValue={true}/>
        <CardButton header={'Ansatt'} imgPath={person} imgAlt={'Ikon bilde av en ansatt'} gotoPath={'/ansatt'} paragraph={'Trykk her hvis du er ansatt'} boolValue={true}/>
    </div>
    {#if utenlandsreiseUrl}
        <div class="centerstuff">
            <h3>Bestill tilgang til å logge på fra utlandet</h3>
        </div>
        <div class="centerstuff">
            <CardButton header={'Bestill tilgang'} imgPath={travel} imgAlt={'Ikon bilde av et fly'} paragraph={'Trykk her for å bestille tilgang for å logge på fra utlandet'} boolValue={false} func={() => {window.open(utenlandsreiseUrl)}}/>
        </div>
    {/if}
</main>


<style>
   .centerstuff {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>

