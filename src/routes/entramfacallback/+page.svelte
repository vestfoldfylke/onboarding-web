<script>
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'


  onMount(() => {
    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')

    if (!(code && state)) {
      console.log('De er ikke der, slutt å kødde')
      goto('/')
    }
    // check state and goto corresponding site
    if (state.startsWith('stats')) {
      goto('/stats', { state: { code, state }, replaceState: true })
    } else {
      goto('/success', { state: { code, state }, replaceState: true })
    }
  })

</script>

<div>
  redirecting...
</div>


<style>
</style>