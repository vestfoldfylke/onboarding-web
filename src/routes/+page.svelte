<script>
  import CardButton from '../lib/components/CardButton.svelte'
  import school from '$lib/assets/school.svg'
  import person from '$lib/assets/person.svg'
</script>

<main>
    <div class="centerstuff">
        <h3>Logg deg på med MinID eller BankID for å aktivere den nye brukeren din eller tilbakestille passordet ditt. </h3>
        <p>Dersom du både har en elev/lærling-konto, og en ansatt-konto, velg den du tror</p>
    </div>
    <div class="centerstuff">
        <CardButton header={'Elev eller lærling'} imgPath={school} imgAlt={'Ikon bilde av en elev'} gotoPath={'/elev'} paragraph={'Trykk her hvis du er elev eller lærling'} boolValue={true}/>
        <CardButton header={'Ansatt'} imgPath={person} imgAlt={'Ikon bilde av en ansatt'} gotoPath={'/ansatt'} paragraph={'Trykk her hvis du er ansatt'} boolValue={true}/>
    </div>
</main>


<style>
   .centerstuff {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>

