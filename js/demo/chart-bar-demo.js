// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// stitch connection
const client = stitch.Stitch.initializeDefaultAppClient('malmap-vgvib');
const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('MALMAP');

let coins = [];
let coinsYesterday = [];
let coinsArray = [];
let coinsArrayYesterday = {};
let coinsDataArray = [];

let colorIndex = 0;


client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user =>
  db.collection('COIN').find({}).toArray()
).then(docs => {
  coins = docs[docs.length-1];
  coinsYesterday = docs[docs.length-2];

  for (var ind = 0; ind < 5; ind++) {
    let doc = docs[docs.length-1-ind];
    coinsDataArray[ind] = [];
    for (var k in doc) {
      if (ind == 0)
        coinsDataArray[ind].push(doc[k]);
      else 
        if (k != '_id')
          coinsDataArray[ind][doc[k].name.toLowerCase()] = doc[k];
    }
  }

  /*for (var k in coins) {
    coinsArray.push(coins[k]);
  }

  for (var k in coinsYesterday) {
    if (k != '_id')
      coinsArrayYesterday[coinsYesterday[k].name.toLowerCase()] = coinsYesterday[k];
  }*/

  plotCharts();
  plotChartsAwards();
  plotChartsUps();
  plotChartsMentupsRateo();
  plotChartsMentardsRateo();

}).catch(err =>{
  console.error(err);
});

function sortCoinsByMentions(firstEl, secondEl) {
  return (secondEl.count ? secondEl.count : 0) - (firstEl.count ? firstEl.count : 0);
}

function sortCoinsByAwards(coin1, coin2) {

  let awards1 = 0, awards2 = 0;

  if (coin1.comments)
    coin1.comments.forEach(comment => {
      if (comment.total_awards_received)
        awards1+=comment.total_awards_received;
    });

  if (coin2.comments)  
    coin2.comments.forEach(comment => {
      if (comment.total_awards_received)
        awards2+=comment.total_awards_received; 
    });

  return awards2 - awards1;
}

function sortCoinsByMentards(coin1, coin2) {

  let awards1 = 0, awards2 = 0;

  if (coin1.comments)
    coin1.comments.forEach(comment => {
      if (comment.total_awards_received)
        awards1+=comment.total_awards_received;
    });

  if (coin2.comments)  
    coin2.comments.forEach(comment => {
      if (comment.total_awards_received)
        awards2+=comment.total_awards_received; 
    });

  return awards2/coin2.count - awards1/coin1.count;
}

function sortCoinsByUps(coin1, coin2) {

  let ups1 = 0, ups2 = 0;

  if (coin1.comments)
    coin1.comments.forEach(comment => {
      if (comment.ups){
        ups1+=comment.ups;
      }
    });

  if (coin2.comments)  
    coin2.comments.forEach(comment => {
      if (comment.ups){
        ups2+=comment.ups; 
      }
    });

  return ups2 - ups1;
}

function sortCoinsByMentUps(coin1, coin2) {

  let ups1 = 0, ups2 = 0;

  if (coin1.comments)
    coin1.comments.forEach(comment => {
      if (comment.ups){
        ups1+=comment.ups;
      }
    });

  if (coin2.comments)  
    coin2.comments.forEach(comment => {
      if (comment.ups){
        ups2+=comment.ups; 
      }
    });

  return ups2/coin2.count - ups1/coin1.count;
}

function timestamp_format(timestamp) {
  let unix_timestamp = timestamp
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();
  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;

}

function timestamp_format_2(timestamp) {
  let unix_timestamp = timestamp
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var day = "0" + date.getDate();
  // Minutes part from the timestamp
  var month = "0" + (date.getMonth()+1);
  // Seconds part from the timestamp
  var year = date.getFullYear();
  // Will display time in 10:30:23 format
  var formattedTime = day.substr(-2) + '/' + month.substr(-2) + '/' + year;

  return formattedTime;

}

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function plotCharts() {

  coinsDataArray[0].sort(sortCoinsByMentions);
  let i = 0;
  let labels = [];
  let titles = [];
  let coinMentions = [];
  let totalUpsByCoin = [];
  let totalDownsByCoin = [];
  let totalAwardsByCoin = [];
  let firtsDateMentionsByCoin = [];
  let coinDataArray = [];

  let datasetArray = getData(coinsDataArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles, "mentions");

  // Bar Chart Example
  var ctx = document.getElementById("myBarChart");
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasetArray,
    },
    options: getOptionsBar(coinsArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles)
  });

}

function plotChartsMentupsRateo() {

  coinsDataArray[0].sort(sortCoinsByMentUps);

  let labels = [];
  let titles = [];
  let coinMentions = [];
  let totalUpsByCoin = [];
  let totalDownsByCoin = [];
  let totalAwardsByCoin = [];
  let firtsDateMentionsByCoin = [];

  let datasetArray = getData([coinsDataArray[0]], coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles, "mentups");

  let rateoDataArray = [];

  for (let i = 0; i < coinMentions.length; i++)
      rateoDataArray.push(totalUpsByCoin[i]/coinMentions[i]);

  // Bar Chart Example
  var ctx = document.getElementById("myBarChartMentupsRateo");
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasetArray,
    },
    options: getOptionsBar(coinsArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles)
  });

}

function plotChartsMentardsRateo() {

  coinsDataArray[0].sort(sortCoinsByMentards);

  let labels = [];
  let titles = [];
  let coinMentions = [];
  let totalUpsByCoin = [];
  let totalDownsByCoin = [];
  let totalAwardsByCoin = [];
  let firtsDateMentionsByCoin = [];

  let datasetArray = getData([coinsDataArray[0]], coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles, "mentards");

  let rateoDataArray = [];

  for (let i = 0; i < coinMentions.length; i++)
      rateoDataArray.push(totalAwardsByCoin[i]/coinMentions[i]);

  // Bar Chart Example
  var ctx = document.getElementById("myBarChartMentardsRateo");
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasetArray,
    },
    options: getOptionsBar(coinsArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles)
  });

}

function plotChartsAwards() {

  coinsDataArray[0].sort(sortCoinsByAwards);
  let labels = [];
  let titles = [];
  let coinMentions = [];
  let totalUpsByCoin = [];
  let totalDownsByCoin = [];
  let totalAwardsByCoin = [];
  let firtsDateMentionsByCoin = [];

  let datasetArray = getData(coinsDataArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles, "awards");

  // Bar Chart Example
  var ctx = document.getElementById("myBarChartAwards");
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasetArray,
    },
    options: getOptionsBar(coinsArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles)
  });

}

function plotChartsUps() {

  coinsDataArray[0].sort(sortCoinsByUps);
  let labels = [];
  let titles = [];
  let coinMentions = [];
  let totalUpsByCoin = [];
  let totalDownsByCoin = [];
  let totalAwardsByCoin = [];
  let firtsDateMentionsByCoin = [];

  let datasetArray = getData(coinsDataArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles, "ups")

  // Bar Chart Example
  var ctx = document.getElementById("myBarChartUps");
  var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasetArray,
    },
    options: getOptionsBar(coinsArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles)
  });


}

function getDatasetByDataToPlot(dataToPlot, coinData){
  const colorArray = ["#4e73df", "#f6c23e", "#1cc88a", "#36b9cc", "#e74a3b"];
  let defaultDataset = {
    label: timestamp_format_2(coinData.timestamp[0]),
    backgroundColor: colorArray[colorIndex++%5], // #f6c23e #1cc88a #36b9cc #e74a3b
    //hoverBackgroundColor: "#2e59d9",
    borderColor: colorArray[colorIndex++%5],
    data: [],
    coinData: coinData,
  }

  let array = [];

  switch (dataToPlot) {

    case "mentions":
      defaultDataset["data"] = coinData.mentions;
      return defaultDataset;
    case "ups":
      defaultDataset["data"] = coinData.ups;
      return defaultDataset;
    case "awards":
      defaultDataset["data"] = coinData.awards;
      return defaultDataset;
    case "timestamp":
      defaultDataset["data"] = coinData.timestamp;
      return defaultDataset;
    case "mentards":

      for (let i = 0; i < coinData.awards.length; i++)
        array.push(coinData.awards[i]/coinData.mentions[i]);

      defaultDataset["data"] = array;
      return defaultDataset;
    case "mentups":

      for (let i = 0; i < coinData.awards.length; i++)
        array.push(coinData.ups[i]/coinData.mentions[i]);

      defaultDataset["data"] = array;
      return defaultDataset;
    default:
      defaultDataset["data"] = coinData.mentions;
      return defaultDataset;
  }

}

function getData(orderedCoinsArrays, mentions, totalUps, totalDowns, totalAwards, firstMentions, labels, titles, dataToPlot) {
  
  let iteration = 0;
  let names = [];
  let datasetArray = [];

  orderedCoinsArrays.forEach(orderedCoinsArray => {
    let i=0;
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
            ups+=comment.ups;
            downs+=comment.downs;
            awards+=comment.total_awards_received;
            if (timestamp > comment.timestamp || timestamp == 0)
              timestamp=comment.timestamp;
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
            if(coin)
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
                ups+=comment.ups;
                downs+=comment.downs;
                awards+=comment.total_awards_received;
                if (timestamp > comment.timestamp || timestamp == 0)
                  timestamp=comment.timestamp;
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

function getOptionsBar(coinsArray, coinMentions, totalUpsByCoin, totalDownsByCoin, totalAwardsByCoin, firtsDateMentionsByCoin, labels, titles) {
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
      }],
    },
    legend: {
      display: true
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
        label: function(tooltipItem, chart) {
          var coinData = chart.datasets[tooltipItem.datasetIndex].coinData || '';
          var details = ["Day: " + timestamp_format_2(coinData.timestamp[tooltipItem.index]),
                        "Mentions: " + coinData.mentions[tooltipItem.index] ,
                        "Total ups: " + coinData.ups[tooltipItem.index],
                        /*"Total downs: " + coinData.downs[tooltipItem.index],*/
                        "Total awards: " + coinData.awards[tooltipItem.index],
                        "First mention at: " + timestamp_format(coinData.timestamp[tooltipItem.index]),
                        "Mentups rateo: " + ((coinData.ups[tooltipItem.index]/coinData.mentions[tooltipItem.index]).toFixed(3)),
                        "Mentards rateo: " + ((coinData.awards[tooltipItem.index]/coinData.mentions[tooltipItem.index]).toFixed(3))]
          
          return details;
        },
        title: function(tooltipItem, obj) {
          var datasetName = titles[tooltipItem[0].index] || '';
          return datasetName;
        }
      }
    }
  }
}

