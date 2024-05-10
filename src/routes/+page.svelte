<script>
  import CardButton from '../lib/components/CardButton.svelte'
  import school from '$lib/assets/school.svg'
  import person from '$lib/assets/person.svg'
</script>

<main>
    <div class="centerstuff">
        <h3>Her kan du logge på med MinID eller BankID for å tilbakestille passord</h3>
    </div>
    <div class="centerstuff">
        <CardButton header={'Elev eller lærling'} imgPath={school} imgAlt={'Ikon bilde av en elev'} gotoPath={'/elev'} paragraph={'Her trykker du om du er elev eller lærling'} boolValue={true}/>
        <CardButton header={'Ansatt'} imgPath={person} imgAlt={'Ikon bilde av en ansatt'} gotoPath={'/ansatt'} paragraph={'Her trykker du om du er ansatt'} boolValue={true}/>
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

