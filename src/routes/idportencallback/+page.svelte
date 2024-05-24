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
      throw new Error('SLUTT med det')
    }
    // check state and goto corresponding site
    const actionString = state.substring(0,30)
    if (actionString.includes('resetpassword')) {
      goto('/resetpassord', { state: { code, state, iss }, replaceState: true, invalidateAll: true })
    } else if (actionString.includes('verifyuser')) {
      goto('/verifyuser', { state: { code, state, iss } })
    } else {
      throw new Error('Her vart det itj no gyldig action... prøv igjen')
    }
  })

</script>

<div>
  redirecting...
</div>


<style>
</style>