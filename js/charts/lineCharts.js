
function plotLineChartMentionsByDay(labels, data, id) {

    var ctx = document.getElementById(id);
    var mentionsLineChart = new Chart(ctx, {
    type: 'line',
    data: {
            labels: labels,
            datasets: [{
            label: "Mentions",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: data,
            }],
            options: optionsChart
        }
    });

}

function plotLineChartMentionsMarketCapByDay(labels, data1, data2, data3, data4, id) {

    var ctx = document.getElementById(id);
    var mentionsLineChart = new Chart(ctx, {
    type: 'line',
    data: {
            labels: labels,
            datasets: [{
                label: "Mentions",
                yAxisID: 'y1',
                lineTension: 0,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'line',
                data: data1,
            },
            {
                label: "Ups",
                yAxisID: 'y1',
                lineTension: 0,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: colorArray[4],
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'line',
                data: data4,
            },
            {
                label: "Awards",
                yAxisID: 'y1',
                lineTension: 0,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: colorArray[1],
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'line',
                data: data3,
            },
            {
                label: "Market Cap",
                yAxisID: 'y2',
                lineTension: 0.3,
                backgroundColor: colorArray[2],
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'bar',
                data: data2,
            }],
        },
    options: optionsChart
    });

}

function plotLineChartPositionAndMarketCapByDay(labels, data1, data2, id) {

  var ctx = document.getElementById(id);
  var customOptions = optionsChart;
  customOptions.scales.yAxes[0].ticks.reverse = true;
  var mentionsLineChart = new Chart(ctx, {
  type: 'line',
  data: {
          labels: labels,
          datasets: [{
              label: "Global position by mentions",
              yAxisID: 'y1',
              lineTension: 0,
              backgroundColor: "rgba(78, 115, 223, 0.05)",
              borderColor: "rgba(78, 115, 223, 1)",
              pointRadius: 3,
              pointBackgroundColor: "rgba(78, 115, 223, 1)",
              pointBorderColor: "rgba(78, 115, 223, 1)",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
              stack: 'combined',
              type: 'line',
              data: data1,
          },
          {
              label: "Market cap",
              yAxisID: 'y2',
              lineTension: 0.3,
              backgroundColor: colorArray[2],
              borderColor: "rgba(78, 115, 223, 1)",
              pointRadius: 3,
              pointBackgroundColor: "rgba(78, 115, 223, 1)",
              pointBorderColor: "rgba(78, 115, 223, 1)",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
              stack: 'combined',
              type: 'bar',
              data: data2,
          }],
      },
  options: customOptions
  });

  customOptions.scales.yAxes[0].ticks.reverse = false;

}

function plotLineChartMentionsHigh24HByDay(labels, data1, data2, id) {

    var ctx = document.getElementById(id);
    var mentionsLineChart = new Chart(ctx, {
    type: 'line',
    data: {
            labels: labels,
            datasets: [{
                label: "Mentions",
                yAxisID: 'y1',
                lineTension: 0,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'line',
                data: data1,
            },
            {
                label: "High 24h",
                yAxisID: 'y2',
                lineTension: 0.3,
                backgroundColor: colorArray[2],
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'bar',
                data: data2,
            }],
        },
    options: optionsChart
    });

}

function plotLineChartMentionsVolumeByDay(labels, data1, data2, id) {

    var ctx = document.getElementById(id);
    var mentionsLineChart = new Chart(ctx, {
    type: 'line',
    data: {
            labels: labels,
            datasets: [{
                label: "Mentions",
                yAxisID: 'y1',
                lineTension: 0,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'line',
                data: data1,
            },
            {
                label: "Total Volume",
                yAxisID: 'y2',
                lineTension: 0.3,
                backgroundColor: colorArray[2],
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                stack: 'combined',
                type: 'bar',
                data: data2,
            }],
        },
    options: optionsChart
    });

}


let optionsChart = {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes:[{
        id: 'y1',
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }, {
        id: 'y2',
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          beginAtZero: false,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
        }
      }
    }
  };