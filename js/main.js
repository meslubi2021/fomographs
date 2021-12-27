
getDataList("");
//getBestCoinsData();
//getMoontionerOverview();
getOverviewData();
getBarChartData();
getMoontionerOverview();

const userSet = new Set();

$("#search-coin-value").on("input", function (e) {
  getDataList($("#search-coin-value").val());
});

$("#search-coin-value-mobile").on("input", function (e) {
  getDataList($("#search-coin-value-mobile").val());
});

  function getMoontionerOverview(){
    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-top-mentioners-by-coin?coin=moon",
      context: document.body
    }).done(function(result) {

      var topMoontionersDayCard = document.getElementById("top-moontioners-last-day-card");
      const topMoontioners = result.mentioners;
      topMoontioners.forEach(mentioner => {
        topMoontionersDayCard.appendChild(createMentionerRow(mentioner));
      });
 
      var topMoontionersAllTimeCard = document.getElementById("top-moontioners-card");
      const topMoontionersAllTime = result.awarded;
      topMoontionersAllTime.forEach(mentioner => {
        topMoontionersAllTimeCard.appendChild(createMentionerRow(mentioner));
      });

    });
  }

  function getBarChartData(){
    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-mentions-data-chart",
      context: document.body
    }).done(function(result) {
      plotCharts(result, sortCoinsByMentions, "last-5-days-mentions-chart", "mentions");
    });
  }

  function getOverviewData(){

    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-mentions-podium",
      context: document.body
    }).done(function(result) {

      const mostMentioned = result[0].coin;
      const mostMentionedValue = document.getElementById("most-mentioned-value");
      $("#most-mentioned-image").attr("src", mostMentioned.image);
      mostMentionedValue.innerHTML = mostMentioned.name + " ("+ mostMentioned.lastDayMentions + ")";
      mostMentionedValue.onclick = goToCoinPageFunction(mostMentioned.id);
      document.getElementById("last-update").innerHTML = mostMentioned.lastUpdate.substr(6,2) + '/' + mostMentioned.lastUpdate.substr(4,2) + '/' + mostMentioned.lastUpdate.substr(0,4);
      bindOnClick("card-coin-of-the-day", "coin-details.html?coin="+mostMentioned.id);
    });

    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-awards-podium",
      context: document.body
    }).done(function(result) {

      const mostAwarded = result[0].coin;
      const mostAwardedValue = document.getElementById("most-awarded-value");
      $("#most-awarded-image").attr("src", mostAwarded.image)
      mostAwardedValue.innerHTML = mostAwarded.name + " ("+ mostAwarded.lastDayAwards + ")";
      mostAwardedValue.onclick = goToCoinPageFunction(mostAwarded.id);
      bindOnClick("card-most-awarded-coin", "coin-details.html?coin="+mostAwarded.id);
    });

    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-mentions-donut-chart",
      context: document.body
    }).done(function(result) {

      plotDonutChartV2(result.dataset, result.labels, result.titles, "top-mentioned-and-others");
      
    });

    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-positions-bar-charts",
      context: document.body
    }).done(function(result) {

      plotBarChart(result.coinGrowByMentionsArray, "top-coin-mentions-grow", "#1cc88a");
      plotBarChart(result.coinDecreaseByMentionsArray, "top-coin-mentions-decrease", "#e74a3b");    

    });

    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-trending-coin",
      context: document.body
    }).done(function(result) {

      const coinOfTheDay = result.trendingCoins[0];
      const mostAwardedValue = document.getElementById("coin-of-the-day-value");
      $("#coin-of-the-day-image").attr("src", coinOfTheDay.image)
      mostAwardedValue.innerHTML = coinOfTheDay.name + " (Score: " +  result.trendingCoins[0].score.toFixed(2) + ")";
      mostAwardedValue.onclick = goToCoinPageFunction(coinOfTheDay.id);
      bindOnClick("card-trending-coin", "coin-details.html?coin="+coinOfTheDay.id);
    });

    $.ajax({
      url: "https://aldobrand.herokuapp.com/get-trending-coin-week",
      context: document.body
    }).done(function(result) {

      const coinOfTheDay = result.trendingCoins[0];
      const mostAwardedValue = document.getElementById("coin-of-the-week-value");
      $("#coin-of-the-week-image").attr("src", coinOfTheDay.image)
      mostAwardedValue.innerHTML = coinOfTheDay.name + " (Score: " +  result.trendingCoins[0].score.toFixed(2) + ")";
      mostAwardedValue.onclick = goToCoinPageFunction(coinOfTheDay.id);
      bindOnClick("flavour-of-the-week", "coin-details.html?coin="+coinOfTheDay.id);
    });

    
      

      /*const commentsCounter = result.commentsCounter.counter;
      const commentsGrow = result.commentsGrow.grow.toFixed(3);

      document.getElementById("comments-grow-value").innerHTML = commentsGrow + "%";
      document.getElementById("comments-grow-width").style.width = commentsGrow;
      document.getElementById("comments-counter-value").innerHTML = commentsCounter;

      plotBarChart(result.coinGrowthDataChart, "top-coin-mentions-grow", "#1cc88a");
      plotBarChart(result.coinDecreaseDataChart, "top-coin-mentions-decrease", "#e74a3b");    
      plotDonutChart(result.mentionedCoinDonutDataChart, "top-mentioned-and-others");
      plotCharts(result.lastFiveDaysMentionsBarDataChart, sortCoinsByMentions, "last-5-days-mentions-chart", "mentions");*/

      /*var topMoontionersDayCard = document.getElementById("top-moontioners-last-day-card");
      const topMoontioners = result.topMoontionersLastDay;
      topMoontioners.forEach(mentioner => {
        topMoontionersDayCard.appendChild(createMentionerRow(mentioner));
      });
  
      var topMoontionersAllTimeCard = document.getElementById("top-moontioners-card");
      const topMoontionersAllTime = result.topMoontionersAllTime;
      topMoontionersAllTime.forEach(mentioner => {
        topMoontionersAllTimeCard.appendChild(createMentionerRow(mentioner));
      }); */

   // });

  }

  function getTopMentionedAndOther(coinArray, limit) {
    let sortedCoinArray = coinArray.sort(sortCoinsByMentions);
    let topArray = sortedCoinArray.slice(0,limit);
    let otherArray = sortedCoinArray.slice(limit, sortedCoinArray.length);
    let dummyCoin = {name: "Others", count:0, symbol: "Others"};
    otherArray.forEach(coin => {
      if(coin.count)
        dummyCoin.count+=coin.count;
    });
    topArray.push(dummyCoin);
    return topArray;
  }

  function getMostAwarded(coinArray){
    return coinArray.sort(sortCoinsByAwards)[0];
  }

  function getCommentCounter(coinArray){
    let counter = 0;
    coinArray.forEach(coin => {
        if(coin.comments)
            counter+=coin.comments.length;
    });
    return counter;
  }

  function getGrowCommentsDiscussion(coinArrayToday, coinArrayYesterday){
    let todayCounter = getCommentCounter(coinArrayToday);
    let yesterdayCounter = getCommentCounter(coinArrayYesterday);

    if (todayCounter > yesterdayCounter)
        return (todayCounter - yesterdayCounter)*100/yesterdayCounter;
    else 
        return -(yesterdayCounter - todayCounter)*100/yesterdayCounter;

  }

