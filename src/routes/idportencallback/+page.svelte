<script>
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  onMount(() => {
    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')
    const iss = $page.url.searchParams.get('iss')

    if (!(code && state && iss)) {
      console.log('De er ikke der, slutt å kødde')
      goto('/')
    } else {
      // check state and goto corresponding site
      const actionString = state.substring(0,30)
      if (actionString.includes('resetpassword')) {
        goto('/resetpassord', { state: { code, state, iss }, replaceState: true })
      } else if (actionString.includes('verifyuser')) {
        goto('/verifyuser', { state: { code, state, iss }, replaceState: true })
      } else {
        throw new Error('Her vart det itj no gyldig action... prøv igjen')
      }
    }
  })

</script>

<div class="center-container">
  Omdirigerer...
</div>


<style>
</style>