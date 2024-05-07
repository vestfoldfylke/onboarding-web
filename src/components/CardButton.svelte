<script>
    import { goto } from '$app/navigation';

    // Props
    export let header = 'header'
    export let imgPath = 'path'
    export let imgAlt = 'alt'
    export let gotoPath = 'urlPath'
    export let paragraph = 'some text'
    export let boolValue = false
    export let func
</script>

<main>
    <div class="cardsCollection">
        <button on:click={boolValue ? () => goto(gotoPath) : func} class="card">
            <img src={imgPath} alt={imgAlt}/>
            <div class="container">
                <h3><b>{header}</b></h3>
                <p>{paragraph}</p>
            </div>
        </button>
</main>

<style>
    .cardsCollection {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        cursor: pointer;
    }
    .card {
        /* Add shadows to create the "card" effect */
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        flex: 0 1 calc(25% - 1em);
        border-radius: 1rem;
        margin: 1rem;
        min-width: calc(20em - 1em);
        max-width: calc(20em - 1em);
        padding: .5rem;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        background: linear-gradient(rgb(255, 255, 255), rgb(178, 203, 207));
    }

    .container {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: flex-start;
        width: 100%;
    }

    .card img {
        height: calc(50% - 1em);
        width: calc(80% - 1em);
    }

    button {
        all:unset
    }

    /* @media screen and (max-width: 60em) {
        .card {
            flex: 0 1 calc(25% - 1em);
        }
        .card img {
            height: calc(50% - 1em);
            width: calc(101% - 1em);
        }
    }

    @media screen and (max-width: 40em) {   
        .card {
            flex: 0 1 calc(25% - 1em);
        }
        .card img {
            height: calc(50% - 1em);
            width: calc(101% - 1em);
        }
    } */
</style>