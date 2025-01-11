<script>
  import CardButton from '$lib/components/CardButton.svelte'
  import { getThemeAsset } from '$lib/themes/theme.config'

  const schoolIcon = getThemeAsset('images/school.svg')
  const personIcon = getThemeAsset('images/person.svg')

</script>
  
  <main>
    <div class="centerstuff">
      <CardButton 
        header="Elev eller lærling"
        imgPath={schoolIcon}
        imgAlt="Ikon bilde av en elev"
        gotoPath="/elev"
        paragraph="Trykk her hvis du er elev eller lærling"
        boolValue={true}
        func={() => {}} 
      />
      <CardButton 
        header="Ansatt"  
        imgPath={personIcon}
        imgAlt="Ikon bilde av en ansatt"
        gotoPath="/ansatt"
        paragraph="Trykk her hvis du er ansatt"
        boolValue={true}
        func={() => {}}
      />
    </div>
  </main>