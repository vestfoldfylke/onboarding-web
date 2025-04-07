<script>
    import { goto } from '$app/navigation';
    import IconSpinner from './Icons/IconSpinner.svelte';

    // Props
    export let header = 'header'
    export let imgPath = 'path'
    export let imgAlt = 'alt'
    export let gotoPath = 'urlPath'
    export let paragraph = 'some text'
    export let boolValue = false
    export let loading = false
    export let func
</script>

<button on:click={boolValue ? () => goto(gotoPath) : func } class="card">
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

<style>
    .card {
        /* Add shadows to create the "card" effect */
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        /* border: 2px solid var(--himmel-30); */
        /* background-color: var(--himmel-10); */
        transition: 0.3s;
        border-radius: 1rem;
        margin: 1rem;
        width: 310px;
        height: 310px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        background: linear-gradient(rgb(255, 255, 255), rgb(178, 203, 207));
        /* background-color: var(--himmel-30); */
        cursor: pointer;
    }

    .container {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        width: 100%;
        text-align: center;
    }

    .card img, .loadingSpinner {
        height: 170px;
        width: 170px;
        padding: 16px;
    }

    .loadingSpinner {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        all:unset
    }

    @media only screen and (max-width: 768px) {
        /* For mobile phones: */
        .card {
            /* Add shadows to create the "card" effect */
            border-radius: 1rem;
            margin: 0.5rem;
            padding: 16px;
            width: 100%;
            height: unset;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
        }
        .card img, .loadingSpinner {
            height: 100px;
            width: 100px;
            padding: 16px;
        }
    }  
</style>