const userSet = new Set();
const coinSet = new Set();


getCoinDetails();
getDataList("");
getPositionsChartData();
getTopMentionersByCoin();

let coinName = "";

$("#search-coin-value").on("input", function (e) {
    getDataList($("#search-coin-value").val());
});

$("#search-coin-value-mobile").on("input", function (e) {
    getDataList($("#search-coin-value-mobile").val());
});

function getPositionsChartData() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-positions-chart-data?id="+getCoinNameFromUrl(),
        context: document.body
    }).done(function(result) {
        plotLineChartPositionAndMarketCapByDay(result.labels, result.positionChartData, result.marketCapChartData, "mentions-per-day-h24-chart");
    });
}

function getTopMentionersByCoin() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-top-mentioners-data-by-coin?coin="+getCoinNameFromUrl(),
        context: document.body
    }).done(function(result) {
        const topMentionerAllTime = result.topMentionerAllTime;
        const topMentionerLastDay = result.topMentionerLastDay;
        const topMentionerGainedUpvoted = result.topMentionerGainedUpvoted;
        const topMentiorerGainedAwards = result.topMentiorerGainedAwards;
        const topMentionersGainedAwards =  result.topMentionersGainedAwards;
        const topMentionersUpvoted = result.topMentionersUpvoted;
        const topMentioners = result.topMentioners;
        const topMentionersLastDay = result.topMentionersLastDay;

        let topMentionerLastDayDocument = document.getElementById("top-mentioner-last-day");
        let topMentionerAllTimeDocument = document.getElementById("top-mentioner-all-time");
        let topMentionerLastMonthDocument = document.getElementById("top-mentioner-per-ups");
        let topMentiorerGainedAwardsDocument = document.getElementById("top-mentioner-per-awards");

        topMentionerLastDayDocument.innerHTML = topMentionerLastDay.author_name + " (" + topMentionerLastDay.count + ")";
        topMentionerLastDayDocument.onclick = function() {location.href = COINSIGHT_MENTIONER_DETAILS_URL + topMentionerLastDay.author_name};
        setRedditAvatar(topMentionerLastDay.author_name, "top-mentioner-last-day-avatar");
        topMentionerAllTimeDocument.innerHTML = topMentionerAllTime.author_name + " (" + topMentionerAllTime.count + ")";
        topMentionerAllTimeDocument.onclick = function() {location.href = COINSIGHT_MENTIONER_DETAILS_URL + topMentionerAllTime.author_name}
        setRedditAvatar(topMentionerGainedUpvoted.author_name, "top-mentioner-per-ups-avatar");
        topMentionerLastMonthDocument.innerHTML = topMentionerGainedUpvoted.author_name + " (" + topMentionerGainedUpvoted.count + ")";
        topMentionerLastMonthDocument.onclick = function() {location.href = COINSIGHT_MENTIONER_DETAILS_URL + topMentionerGainedUpvoted.author_name}
        setRedditAvatar(topMentionerAllTime.author_name, "top-mentioner-all-time-avatar");
        topMentiorerGainedAwardsDocument.innerHTML = topMentiorerGainedAwards.author_name + " (" + topMentiorerGainedAwards.count + ")";
        topMentiorerGainedAwardsDocument.onclick = function() {location.href = COINSIGHT_MENTIONER_DETAILS_URL + topMentiorerGainedAwards.author_name}
        setRedditAvatar(topMentiorerGainedAwards.author_name, "top-mentioner-per-awards-avatar");

        
        var topMentionersCard = document.getElementById("top-mentioner-card");
        topMentioners.forEach(mentioner => {
            topMentionersCard.appendChild(createMentionerRow(mentioner));
        });

        var topMentionersLastDayCard = document.getElementById("top-mentioner-last-day-card");
        topMentionersLastDay.forEach(mentioner => {
            topMentionersLastDayCard.appendChild(createMentionerRow(mentioner));
        });

        var topMentionersAwaredCard = document.getElementById("top-awarded-users-card");
        topMentionersGainedAwards.forEach(mentioner => {
            topMentionersAwaredCard.appendChild(createMentionerRow(mentioner));
        });

        var topMentionersUpvotedCard = document.getElementById("top-upvoted-users-card");
        topMentionersUpvoted.forEach(mentioner => {
            topMentionersUpvotedCard.appendChild(createMentionerRow(mentioner));
        });

    });

}

function getCoinDetails() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-coin-details-data?coin="+getCoinNameFromUrl(),
        context: document.body
    }).done(function(result) {

        const totalMentions = result.totalMentions;
        const totalAwards = result.totalAwards;
        const totalUps = result.totalUps;
        const awardsPerMentions = totalAwards/totalMentions;

        const coinId = result.id;
        coinName = result.name;
        const image = result.image;
        
        document.getElementById("coin-logo").src = image;
        document.getElementById("coin-logo").alt = coinName + " logo";
        document.getElementById("coin-name").innerHTML = titleCase(coinName);
        document.getElementById("coin-title").innerHTML = titleCase(coinName);
        document.getElementById("coin-symbol").innerHTML = ' (' + result.symbol + ')';
        document.getElementById("total-mentions-value").innerHTML = totalMentions;
        document.getElementById("total-awards-value").innerHTML = totalAwards;
        document.getElementById("total-ups-value").innerHTML = totalUps;
        document.getElementById("awards-per-mentions-value").innerHTML = awardsPerMentions.toFixed(2);

        let coinNameElements = document.getElementsByClassName("coin-name-class");
        for(let coinNameIndex = 0; coinNameIndex < coinNameElements.length; coinNameIndex++)
            coinNameElements[coinNameIndex].innerHTML = coinName;

        //marketCapRank = Math.ceil(coinsDataArray[0].market_cap_change_percentage_24h);
        let coinSymbol = result.symbol;
        
        let commentsArray = result.topCommentsArray;
    
        //document.getElementById("rank-value").innerHTML = marketCapRank;
        //document.getElementById("coin-name-rank").innerHTML = coinName;

        plotLineChartMentionsMarketCapByDay(result.labels, result.mentionsData, result.marketCapData, result.awardsData, result.upsData, "mentions-per-day-chart");
        plotLineChartMentionsVolumeByDay(result.labels, result.mentionsData, result.volume, "mentions-per-day-volume-chart");

        var commentsCard = document.getElementById("mentions-comments-card");

        commentsArray.forEach(comment => {
            commentsCard.appendChild(createComment(comment, coinName, coinSymbol));
            commentsCard.appendChild(document.createElement('hr'));
        });


    })
}