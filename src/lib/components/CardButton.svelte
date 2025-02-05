<script>
    import { goto } from '$app/navigation'
    import IconSpinner from './Icons/IconSpinner.svelte'
    
    export let header = ''
    export let imgPath = ''
    export let imgAlt = 'alt'
    export let gotoPath = 'urlPath'
    export let paragraph = 'some text'
    export let boolValue = false
    export let loading = false
    export let func = () => {} // Default empty function

    const handleClick = () => {
        if (boolValue) {
            goto(gotoPath)
        } else {
            func()
        }
    }
</script>

<button on:click={handleClick} class="card">
    {#if loading}
        <div class="loadingSpinner">
            <IconSpinner width="80px"/>
        </div>
    {:else}
        <img src={imgPath} alt={imgAlt}/>
    {/if}
    <div class="container">
        <h3><b>{header}</b></h3>
        <p>{paragraph}</p>
    </div>
</button>