<script>
  import { onMount } from 'svelte'
  import { resetPassword } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte';

  // State
  let resetPasswordResponse

  const resetPasswordForUser = async (code, iss, state) => {
    try {
      resetPasswordResponse = await resetPassword(code, iss, state)
    } catch (error) {
      resetPasswordResponse = { message: JSON.stringify(error.response?.data || error.stack) }
    }
  }

  onMount(() => {
    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')
    const iss = $page.url.searchParams.get('iss')

    if (!(code && state && iss)) {
      console.log('De er ikke der, slutt å kødde')
      resetPasswordResponse = {
        message: 'Du må logge på ordentlig da....'
      }
      throw new Error('SLUTT med det')
    }
    resetPasswordForUser(code, iss, state)
  })

</script>

<div>
  <p>Halla</p>
  {#if !resetPasswordResponse}
    <IconSpinner />
  {:else}
    {JSON.stringify(resetPasswordResponse, null, 2)}
  {/if}
</div>


<style>
</style>