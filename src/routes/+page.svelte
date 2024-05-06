<script>
  import { goto } from '$app/navigation';
</script>

<main>
    <div class="cardsCollection">
        <button on:click={() => goto('/ansatt')} class="card">
            <img src="src\assets\person.svg" alt="Ikon bilde av en ansatt"/>
            <div class="container">
                <h3><b>Ansatt</b></h3>
                <p>Her trykker du om du er ansattasdfasdf</p>
            </div>
        </button>
        <button on:click={() => goto('/elev')} class="card">
            <img src="src\assets\school.svg" alt="Ikon bilde av en elev"/>
            <div class="container">
                <h3><b>Elev eller lærling</b></h3>
                <p>Her trykker du om du er elev eller lærlig</p>
            </div>
        </button>
    </div>
</main>

<!-- <a href="/elev">Jeg er elev, lærling, privatist OT, osv, eller jeg er her ved en feil</a>
<br>
<a href="/ansatt">Jeg er ansatt</a> -->

<style>
    .cardsCollection {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
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

