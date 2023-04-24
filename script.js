// asynchronous request to API
async function fetchData(url) {
    const respose = await fetch(url);
    const data = await Response.json();
    return data;

    
}

//function for frequency graph

function createFrequencyGraph(data) {
    const chartData = Object.entries(data).map(([label, value]) => ({
      label,
      value
    }));
  
    /// map method to align variables

    // label for country

    // value for frequency of strikes
    const labels = chartData.map(entry => entry.label);
    const values = chartData.map(entry => entry.value);
  
    const ctx = document.getElementById('frequency-chart').getContext('2d');
    const chart = new chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Frequency',
          data: values,
          backgroundColor: 'rgba(33, 165, 230, 0.2)',
          borderColor: 'rgba(33, 165, 230, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
  
