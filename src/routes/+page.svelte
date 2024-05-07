<script>
  import { goto } from '$app/navigation';

  import CardButton from '../components/CardButton.svelte'
</script>

<main>
    <CardButton header={'Ansatt'} imgPath={'src/assets/person.svg'} imgAlt={'Ikon bilde av en ansatt'} gotoPath={'/ansatt'} paragraph={'Her trykker du om du er ansatt'} boolValue={true}/>
    <CardButton header={'Elev eller lærling'} imgPath={'src/assets/school.svg'} imgAlt={'Ikon bilde av en elev'} gotoPath={'/elev'} paragraph={'Her trykker du om du er elev eller lærling'} boolValue={true}/>
</main>

<style>
   main {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>

