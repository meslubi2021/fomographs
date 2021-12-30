function plotCharts(coinsDataArray, sortMethod, id, dataToPlot) {

  let i = 0;
  let labels = coinsDataArray.labels;
  let titles = coinsDataArray.titles;

  let datasetArray = coinsDataArray.datasets;

  // Bar Chart Example
  var ctx = document.getElementById(id);
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasetArray,
    },
    options: getOptionsBar(labels, titles)
  });

}

function plotSameMarketRankChart(data, labels, titles, id) {

  // Bar Chart Example
  var ctx = document.getElementById(id);
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Mentions",
        backgroundColor: colorArray[colorIndex++ % 5], // #f6c23e #1cc88a #36b9cc #e74a3b
        //hoverBackgroundColor: "#2e59d9",
        borderColor: colorArray[colorIndex++ % 5],
        data: data,
      }],
    },
    options: getOptionsBar(labels, titles)
  });

}

function plotBarChart(coinData, id, color) {

  let data = [];
  let labels = [];
  let titles = [];

  coinData.forEach(coinPosition => {
    data.push(coinPosition.differencePosition);
    labels.push(coinPosition.coin.symbol);
    titles.push(coinPosition.coin.name);
  })

  // Bar Chart Example
  var ctx = document.getElementById(id);
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Climbed positions",
        backgroundColor: color, // #f6c23e #1cc88a #36b9cc #e74a3b
        //hoverBackgroundColor: "#2e59d9",
        borderColor: color,
        data: data,
        info: coinData
      }],
    },
    options: getOptionsBar(labels, titles)
  });

}

function getData(orderedCoinsArrays, mentions, totalUps, totalDowns, totalAwards, firstMentions, labels, titles, dataToPlot) {

  let iteration = 0;
  let names = [];
  let datasetArray = [];

  orderedCoinsArrays.forEach(orderedCoinsArray => {
    let i = 0;
    if (iteration++ == 0) {
      orderedCoinsArray.forEach(coin => {
        if (coin.count > 0 && i < 10) {
          labels.push(coin.symbol);
          names.push(coin.name.toLowerCase());
          mentions.push(coin.count);
          titles.push(coin.name);
          let ups = 0;
          let downs = 0;
          let awards = 0;
          let timestamp = 0;
          coin.comments.forEach(comment => {
            ups += comment.ups;
            downs += comment.downs;
            awards += comment.total_awards_received;
            if (timestamp > comment.timestamp || timestamp == 0)
              timestamp = comment.timestamp;
          });
          totalUps.push(ups);
          totalDowns.push(downs);
          totalAwards.push(awards);
          firstMentions.push(timestamp);
          i++;
        }
      });
      let coinData = {};
      coinData["mentions"] = mentions;
      coinData["ups"] = totalUps;
      coinData["awards"] = totalAwards;
      coinData["timestamp"] = firstMentions;
      datasetArray.push(getDatasetByDataToPlot(dataToPlot, coinData));
    } else {
      mentions = [];
      totalUps = [];
      totalAwards = [];
      firstMentions = [];
      names.forEach(name => {
        let coin = orderedCoinsArray[name];
        let newName = "";
        newName = name;
        if (names.includes(newName)) {
          if (coin)
            mentions.push(coin.count);
          else
            mentions.push(0);
          titles.push(name);
          let ups = 0;
          let downs = 0;
          let awards = 0;
          let timestamp = 0;
          if (coin)
            coin.comments.forEach(comment => {
              ups += comment.ups;
              downs += comment.downs;
              awards += comment.total_awards_received;
              if (timestamp > comment.timestamp || timestamp == 0)
                timestamp = comment.timestamp;
            });
          totalUps.push(ups);
          totalDowns.push(downs);
          totalAwards.push(awards);
          firstMentions.push(timestamp);
        }
      });
      let coinData = {};
      coinData["mentions"] = mentions;
      coinData["ups"] = totalUps;
      coinData["awards"] = totalAwards;
      coinData["timestamp"] = firstMentions;
      datasetArray.push(getDatasetByDataToPlot(dataToPlot, coinData));
    }
  });

  return datasetArray.reverse();

}

function getOptionsBar(labels, titles) {
  return {
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
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: labels.length
        },
        maxBarThickness: 25,
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
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
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function (tooltipItem, chart) {
          var coinData = chart.datasets[tooltipItem.datasetIndex].coinData || '';
          var info = chart.datasets[tooltipItem.datasetIndex].info || '';
          var details;
          if (coinData) {
            details = ["Day: " + getBarChartDate(coinData.lastUpdate),
            "Mentions: " + coinData.mentions[tooltipItem.index],
              //"Total ups: " + coinData.ups[tooltipItem.index],
              /*"Total downs: " + coinData.downs[tooltipItem.index],*/
              //"Total awards: " + coinData.awards[tooltipItem.index],
              //"First mention at: " + timestamp_format(coinData.timestamp[tooltipItem.index]),
              //"Mentups rateo: " + ((coinData.ups[tooltipItem.index]/coinData.mentions[tooltipItem.index]).toFixed(3)),
              //"Mentards rateo: " + ((coinData.awards[tooltipItem.index]/coinData.mentions[tooltipItem.index]).toFixed(3))
            ]
          } else if (info) {
            var tooltipInfo = chart.datasets[tooltipItem.datasetIndex].info[tooltipItem.index];
            details = ["Climbed Positions: " + (tooltipInfo.differencePosition > 0 ? ('+' + tooltipInfo.differencePosition) : tooltipInfo.differencePosition),
            "Actual: " + tooltipInfo.afterPosition + "° (" + tooltipInfo.afterMentions + ")",
            "Previous: " + tooltipInfo.beforePosition + "° (" + tooltipInfo.beforeMentions + ")",
            ];
          } else {
            details = ["Mentions:" + chart.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]];
          }

          return details;
        },
        title: function (tooltipItem, obj) {
          var datasetName = titleCase(titles[tooltipItem[0].index]) || '';
          return datasetName;
        }
      }
    }
  }
}

function getBarChartDate(date) {
  date = date + "";
  return date.substr(6, 2) + '/' + date.substr(4, 2) + '/' + date.substr(0, 4);
}