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
  let userStatsResponseFull
  let userStatsResponseColne
  let userStatsResponseSchools
  let userStatsResponseAdmin
  let showTableState = false
  let showChartState = true

  const getUserStats = async (code, state, onlyStats) => {
    try {
      userStatsResponse = await getStats(code, state, onlyStats)
      userStatsResponseColne = userStatsResponse
      userStatsResponseSchools = userStatsResponse.filter(obj => !obj.navn.startsWith('Seksjon') && (obj.navn.includes("skole") || obj.navn.includes("Kompetansebyggeren") || obj.navn.includes('Skolen') || obj.navn.includes('skule')))
      userStatsResponseAdmin = userStatsResponse.filter(obj => obj.navn.startsWith('Seksjon') || (!obj.navn.includes("skole") && !obj.navn.includes("Kompetansebyggeren") && !obj.navn.includes('Skolen') && !obj.navn.includes('skule')))
    } catch (error) {
      const errorMsg =  error.response?.data?.message || error.stack || error.toString()
      userStatsResponse = { hasError: true, message: errorMsg }
    }
  }

  const getUserStatsFull = async (code, state, onlyStats) => {
    try {
      userStatsResponseFull = await getStats(code, state, onlyStats)
    } catch (error) {
      const errorMsg =  error.response?.data?.message || error.stack || error.toString()
      userStatsResponseFull = { hasError: true, message: errorMsg }
    }
  }

  const showChart = () => {
    showChartState = true
    showTableState = false
  }

  const showTable = () => {
    userStatsResponse = userStatsResponseColne
    showChartState = false
    showTableState = true
  }

  const showOnlySchools = () => {
    userStatsResponse = userStatsResponseSchools
  }

  const showOnlyAdmin = () => {
    userStatsResponse = userStatsResponseAdmin
  }

  const showAll = () => {
    userStatsResponse = userStatsResponseColne
  }

  const downloadCsv = () => {
    // Create a csv file from an array of objects where to keys are the headers and the values are the data
    const headers = Object.keys(userStatsResponseFull[0])
    //  Wrap the values in quotes to avoid commas in the values to be interpreted as a new column. This will not affect the csv file or importing it to excel.
    const rows = userStatsResponseFull.map(row => headers.map(header => `"${row[header]}"`))
    const csvData = [headers, ...rows].map(row => {
     const rowString = row.join(',')
     return rowString.endsWith(',') ? rowString.slice(0, -1) : rowString
    }).join('\n')

    // Get date
    const today = new Date()
    // Padstart to makes sure we get a 2 digit number, it looks better.
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    const date = `${day}-${month}-${year}`

    // Create a blob and download the file
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${date}-statistikk.csv`
    link.click()
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
      getUserStats(code, state, true)
      getUserStatsFull(code, state, false)
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
        percentage = data.ansatt?.fullføringsgrad || data.fullføringsgrad
        total = data.ansatt?.max || data.max
      } else {
        percentage = data.elev?.fullføringsgrad || data.fullføringsgrad
        total = data.elev?.max || data.max
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
          // {
          //   //The label for the dataset which appears in the legend and tooltips.
          //   label: 'Fullført Ansatte(skole)',
          //   //data for the line
          //   data: [],
          //   //styling of the chart
          //   backgroundColor: [
          //     '#B2E1ED',
          //   ],
          //   borderColor: [
          //     '#4CB9D4',
          //   ],
          //   borderWidth: 1,
          //   stack: 'Stack 0', // groups
          // },
          // {
          //   //The label for the dataset which appears in the legend and tooltips.
          //   label: 'Ikke fullført Ansatte(skole)',
          //   //data for the line
          //   data: [],
          //   //styling of the chart
          //   backgroundColor: [
          //     '#CD5D77',
          //   ],
          //   borderColor: [
          //     '#BE2E50',
          //   ],
          //   borderWidth: 1,
          //   stack: 'Stack 0', // groups
          // }
        ],
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
    // Labels 
    chart.data.labels = userStatsResponse.map(n => n.navn)
    // Ansatte
    chart.data.datasets[0].data = userStatsResponse.map(n => n.ansatt?.antall)
    chart.data.datasets[1].data = userStatsResponse.map(n => n.ansatt?.max - n.ansatt?.antall)
    // Elever
    chart.data.datasets[2].data = userStatsResponse.map(n => n.elev?.antall)
    chart.data.datasets[3].data = userStatsResponse.map(n => n.elev?.max - n.elev?.antall)
    // Update the chart
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
      <div class="centerstuff">
        <button on:click={() => { showOnlySchools() } }><span class="material-symbols-outlined">school</span>Vis Skoler</button>
        <button on:click={() => { showOnlyAdmin() } }><span class="material-symbols-outlined">badge</span>Vis Administrasjon</button>
        <button on:click={() => { showAll() } }><span class="material-symbols-outlined">bar_chart</span>Vis Alt</button>
      </div>
      {#if showChartState}
        <!-- Empty div around the canvas to stop it from growing -->
        {#key userStatsResponse}
          <div> 
            <canvas id="chart"></canvas>
          </div>
        {/key}
      {/if}
      {#if showTableState}
        {#key userStatsResponse}
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
                      <td>{row.elev?.antall === undefined ? 0 : row.elev?.antall}</td>
                      <td>{row.ansatt?.antall || row.antall}</td>
                      <td>{((row.elev?.antall === undefined ? 0 : row.elev?.antall) + (row.ansatt?.antall || row.antall)) }</td>
                      <td>{(row.elev?.max === undefined ? 0 : row.elev?.max)}</td>
                      <td>{(row.ansatt?.max || row.max)}</td>
                      <td>{((row.elev?.max === undefined ? 0 : row.elev?.max) - (row.elev?.antall === undefined ? 0 : row.elev?.antall))}</td>
                      <td>{((row.ansatt?.max || row.max) - (row.ansatt?.antall || row.antall))}</td>
                      <td>{row.elev?.fullføringsgrad === undefined ? 0 : row.elev?.fullføringsgrad}%</td>
                      <td>{row.ansatt?.fullføringsgrad || row.fullføringsgrad}%</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/key}
      {/if}
        <div class="centerstuff">
          <button on:click={() => { downloadCsv() } }><span class="material-symbols-outlined">csv</span>Last ned CSV-fil</button>
        </div>
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
    height: 2000px !important;
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