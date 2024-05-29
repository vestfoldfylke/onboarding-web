<script>
  import { afterUpdate, onMount } from 'svelte'
  import { getEntraMfaLoginUrl, getStats, verifyUser } from '../../lib/useApi'
  import { page } from '$app/stores'
  import IconSpinner from '../../lib/components/Icons/IconSpinner.svelte'
  import { goto } from '$app/navigation'
  import InfoBox from '../../lib/components/InfoBox.svelte';
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  let loadingMessage = "Henter statistikk"

  const fakeLoadingMessages = async () => {
    const interval = 1500
    await sleep(interval)
    loadingMessage = "Henter statistikk fortsatt"
  }

  // State
  let userStatsResponse
  let showTableState = false
  let showChartState = true

  const getUserStats = async (code, state) => {
    try {
      userStatsResponse = await getStats(code, state)
      // ROBIN, gjør det du vil med responsen
    } catch (error) {
      const errorMsg =  error.response?.data?.message || error.stack || error.toString()
      userStatsResponse = { hasError: true, message: errorMsg }
    }
  }

  const showChart = () => {
    showChartState = true
    showTableState = false
  }

  const showTable = () => {
    showChartState = false
    showTableState = true
  }

  onMount(async () => {
    // States
    const code = $page.state.code
    const state = $page.state.state

    if (!(code && state)) {
      console.log('De er ikke der, slutt å kødde')
      // Hvis de ikke er der, kan vi vel sende til forsiden egt
      goto('/admin', { replaceState: false })
    } else {
      getUserStats(code, state)
      fakeLoadingMessages()
    }
  })

  afterUpdate(async () => {
    // Define the chart
    const ctx = document.getElementById('chart');
    
    const calculate = (dataIndex, dataSet, value2) => {
      const percentage = dataSet[dataIndex]
      if(isNaN(percentage)) {
        return null
      } else {
        return percentage
      }
    }

    const footer = (tooltipItems) => {
      let percentage = 0;
      let total = 0
      const data = userStatsResponse.find(s => s.navn === tooltipItems[0].label)
      if(tooltipItems[0].dataset.label.includes('Ansatt')) {
        percentage = data.antall?.ansatt?.fullføringsgrad || data.fullføringsgrad
        total = data.antall?.ansatt?.max || data.max
      } else {
        percentage = data.antall?.elev?.fullføringsgrad || data.fullføringsgrad
        total = data.antall?.elev?.max || data.max
      }
      return  'Fullføringsgrad: ' + percentage + '%' + '\n' + 'Totalt: ' + total
    }
  
    const chart = new Chart(ctx, {
      //Type of the chart
      type: 'bar', 
      data: {
        //labels on x-axis
        labels: [], 
        datasets: [
          // Administrasjon
          {
            //The label for the dataset which appears in the legend and tooltips.
            label: 'Fullført Ansatte',
            //data for the line
            data: [],
            //styling of the chart
            backgroundColor: [
                '#B2E1ED',
            ],
            borderColor: [
                '#4CB9D4',
            ],
            borderWidth: 1,
            stack: 'Stack 0', // groups
          },
          {
            //The label for the dataset which appears in the legend and tooltips.
            label: 'Ikke fullført Ansatte',
            //data for the line
            data: [],
            //styling of the chart
            backgroundColor: [
                '#CD5D77',
            ],
            borderColor: [
                '#BE2E50',
            ],
            borderWidth: 1,
            stack: 'Stack 0' // groups
          },
          // Skolene
          {
            //The label for the dataset which appears in the legend and tooltips.
            label: 'Fullført Elever',
            //data for the line
            data: [],
            //styling of the chart
            backgroundColor: [
                '#79BFA1',
            ],
            borderColor: [
                '#1F9562',
            ],
            borderWidth: 1,
            stack: 'Stack 1', // groups
          },
          {
            //The label for the dataset which appears in the legend and tooltips.
            label: 'Ikke fullført Elever',
            //data for the line
            data: [],
            //styling of the chart
            backgroundColor: [
                '#CD5D77',
            ],
            borderColor: [
                '#BE2E50',
            ],
            borderWidth: 1,
            stack: 'Stack 1', // groups
          },
          {
            //The label for the dataset which appears in the legend and tooltips.
            label: 'Fullført Ansatte(skole)',
            //data for the line
            data: [],
            //styling of the chart
            backgroundColor: [
              '#B2E1ED',
            ],
            borderColor: [
              '#4CB9D4',
            ],
            borderWidth: 1,
            stack: 'Stack 0', // groups
          },
          {
            //The label for the dataset which appears in the legend and tooltips.
            label: 'Ikke fullført Ansatte(skole)',
            //data for the line
            data: [],
            //styling of the chart
            backgroundColor: [
              '#CD5D77',
            ],
            borderColor: [
              '#BE2E50',
            ],
            borderWidth: 1,
            stack: 'Stack 0', // groups
          }
        ]
      },
      options: {
        scales: {
            // make sure Y-axis starts at 0 
            // stacked = stacking bars
            y: {
              beginAtZero: true,
              stacked: true
            }, 
        },
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // For horizontal barchart, remove if you want normal
        plugins: {
          datalabels: {
            display: true,
            formatter: function(context, chart_obj) {
              return calculate(chart_obj.dataIndex, chart_obj.dataset.data)
            },
            font: {
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              footer: footer
            }
          }
        }
      }
   });
    Chart.register(ChartDataLabels);
    // map data from data set to chart
    chart.data.labels = userStatsResponse.map(n => n.navn)
    // Administrasjon
    chart.data.datasets[0].data = userStatsResponse.map(n => n.antall)
    chart.data.datasets[1].data = userStatsResponse.map(n => n.max - n.antall)
    // Skoler, elever
    chart.data.datasets[2].data = userStatsResponse.map(n => n.antall?.elev?.antall)
    chart.data.datasets[3].data = userStatsResponse.map(n => n.antall?.elev?.max - n.antall?.elev?.antall)
    // Skoler, ansatte
    chart.data.datasets[4].data = userStatsResponse.map(n => n.antall?.ansatt?.antall)
    chart.data.datasets[5].data = userStatsResponse.map(n => n.antall?.ansatt?.max - n.antall?.ansatt?.antall)
    chart.update();
  })

</script>

<div>
  {#if !userStatsResponse}
    <div class="loading">
      <IconSpinner />
      <p class="loadingMessage">{loadingMessage}...</p>
    </div>
  {:else if userStatsResponse.hasError}
    <h3 class="errorTitle">Oi, noe gikk galt 😩</h3>
    <div class="error">{userStatsResponse.message}</div>
    <br />
    <InfoBox title="Trenger du hjelp?">
      <p>Telefon: <a href="tel:{import.meta.env.VITE_SERVICEDESK_TLF.replaceAll(' ', '')}">{import.meta.env.VITE_SERVICEDESK_TLF}</a></p>
      <p>E-post: <a href="mailto:{import.meta.env.VITE_SERVICEDESK_EPOST}">{import.meta.env.VITE_SERVICEDESK_EPOST}</a></p>
    </InfoBox>
  {:else}
    <main>
      <div class="centerstuff">
        <button on:click={() => { showTable() } }><span class="material-symbols-outlined">table_chart</span>Vis Tabell</button>
        <button on:click={() => { showChart() } }><span class="material-symbols-outlined">bar_chart</span>Vis Graf</button>
      </div>
      <br>
      {#if showChartState}
      <!-- Empty div around the canvas to stop it from growing -->
        <div> 
          <canvas id="chart"></canvas>
        </div>
      {/if}
      {#if showTableState}
      <div class="centerstuff">
        <table>
          <thead>
            <tr>
              <th>Skole/Seksjon</th>
              <th>Antall Elever fullført</th>
              <th>Antall Ansatte fullført</th>
              <th>Antall Totalt fullført</th>
              <th>Antall Elever</th>
              <th>Antall Ansatte</th>
              <th>Antall Ikke fullført Elever</th>
              <th>Antall Ikke fullført Ansatte</th>
              <th>Fullføringsgrad Elever</th>
              <th>Fullføringsgrad Ansatte</th>
            <tr/>
          </thead>
          <tbody>
            {#each Object.values(userStatsResponse) as row}
              <tr>
                  <td>{row.navn}</td>
                  <td>{row.antall?.elev?.antall === undefined ? 0 : row.antall?.elev?.antall}</td>
                  <td>{row.antall?.ansatt?.antall || row.antall}</td>
                  <td>{((row.antall?.elev?.antall === undefined ? 0 : row.antall?.elev?.antall) + (row.antall?.ansatt?.antall || row.antall)) }</td>
                  <td>{(row.antall?.elev?.max === undefined ? 0 : row.antall?.elev?.max)}</td>
                  <td>{(row.antall?.ansatt?.max || row.max)}</td>
                  <td>{((row.antall?.elev?.max === undefined ? 0 : row.antall?.elev?.max) - (row.antall?.elev?.antall === undefined ? 0 : row.antall?.elev?.antall))}</td>
                  <td>{((row.antall?.ansatt?.max || row.max) - (row.antall?.ansatt?.antall || row.antall))}</td>
                  <td>{row.antall?.elev?.fullføringsgrad === undefined ? 0 : row.antall?.elev?.fullføringsgrad}%</td>
                  <td>{row.antall?.ansatt?.fullføringsgrad || row.fullføringsgrad}%</td>
              </tr>
            {/each}
          </tbody>
        </table>
        </div>
      {/if}
    </main>
  {/if}
</div>

<style>
  .loading {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    justify-content: center;
  }
  .loadingMessage {
    font-style: italic;
    width: 200px;
  }
  .centerstuff {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      margin: 10px;
  }
  .error {
    background-color: var(--nype-10);
    padding: 16px;
  }
  #chart {
    height: 100% !important;
    width: 100% !important;
  }
  table, th, td {
		border: 1px solid #ddd;
		border-collapse: collapse;
		margin-bottom: 10px;
    padding: 4px;
	}

  th {
    padding: 10px;
  }

  tr:hover {background-color: #D6EEEE;}

  button {
    margin: 10px;
  }
</style>