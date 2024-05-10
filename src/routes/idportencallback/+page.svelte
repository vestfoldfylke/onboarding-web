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
    // set state and goto resetpassord
    goto('/resetpassord', { state: { code, state, iss } })
  })

</script>

<div>
  redirecting...
</div>


<style>
</style>