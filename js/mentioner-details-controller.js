
const username = getUsernameFromUrl();
const userSet = new Set();
const coinSet = new Set();

$("#mentioner-title").html("u/"+username);    

setRedditAvatar(username, "mentioner-avatar");
$("#mentioner-avatar").css("width", "4rem");

getMentionerDetailsData();
//getDonutChartMentionsData();
getGlobalPositions();
//getCommentsData();
getDataList();

/*
const client = stitch.Stitch.initializeDefaultAppClient('malmap-vgvib');
const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('MALMAP');
const userSet = new Set();
const coinSet = new Set();

client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user =>
    db.collection('COIN').find({}).toArray()
  ).then(docs => {
    const username = getUsernameFromUrl();

    $("#mentioner-title").html("u/"+username);    

    setRedditAvatar(username, "mentioner-avatar");
    $("#mentioner-avatar").css("width", "4rem");

    let datalist = document.getElementById("aviable-coin-list");

    let userMentionsStatsMap = [];
    let userCommentsList = [];

    docs.forEach(doc => {
       for(var k in doc) {
            let coin = doc[k];
            if(coin.name && !coinSet.has(coin.name)){
                coinSet.add({name: coin.name, symbol: coin.symbol});
            }
            if(coin.comments)
                coin.comments.forEach(comment => {
                    if(comment.author_name && !userSet.has(comment.author_name)){
                        userSet.add(comment.author_name);   
                        if(comment.author_name == username)
                            userCommentsList.push(comment);
                    }
                    
                    let userMentionsStats = userMentionsStatsMap[comment.author_name];
                    if(userMentionsStats){
                        if(userMentionsStats.mentionsArray[coin.name]){
                            userMentionsStats.mentionsArray[coin.name].totalComments++;
                            userMentionsStats.mentionsArray[coin.name].totalAwards+= comment.total_awards_received;
                            userMentionsStats.mentionsArray[coin.name].totalUps+=comment.ups;
                            userMentionsStats.mentionsArray[coin.name].symbol=coin.symbol;
                            if(!userMentionsStats.mentionsArray[coin.name].image){
                                userMentionsStats.mentionsArray[coin.name].image = coin.image;
                            }
                        }else
                            userMentionsStats.mentionsArray[coin.name] = {totalComments:1, totalAwards: comment.total_awards_received, totalUps: comment.ups, image: coin.image, coinName: coin.name};
                        userMentionsStats.totalComments++;
                        userMentionsStats.totalAwards+=comment.total_awards_received;
                        userMentionsStats.totalUps+=comment.ups;
                        userMentionsStatsMap[comment.author_name] = userMentionsStats;
                    }else{
                        userMentionsStatsMap[comment.author_name] = {mentionsArray: [], totalComments: 1, totalAwards: comment.total_awards_received, totalUps: comment.ups};
                        userMentionsStatsMap[comment.author_name].mentionsArray[coin.name] = {totalComments:1, totalAwards: comment.total_awards_received, totalUps: comment.ups, image: coin.image, coinName: coin.name};
                    }
                });    
       }
    });

    coinSet.forEach(coin => {
        var opt = document.createElement('option');
        opt.value = titleCase(coin.name);
        opt.innerHTML = coin.symbol;
        $(opt).attr("type", "coin");
        datalist.appendChild(opt);   
    });

    userSet.forEach(user => {
        var opt = document.createElement('option');
        opt.value = user;
        opt.innerHTML = "User";
        $(opt).attr("type", "user");
        datalist.appendChild(opt);
    });

    $("#search-coin-value").on("change", function (e) {
        if(userSet.has(e.target.value))
            location.href = "mentioner-details.html?user="+e.target.value;
        else
            location.href = "coin-details.html?coin="+e.target.value.toLowerCase();
    });

    $("#search-coin-value-mobile").on("change", function (e) {
        if(userSet.has(e.target.value))
            location.href = "mentioner-details.html?user="+e.target.value;
        else
            location.href = "coin-details.html?coin="+e.target.value.toLowerCase();
    });

    const userMentionsStats = userMentionsStatsMap[username];
    const avgUsersStats = getAvgUsersMentionsStats(userMentionsStatsMap);
    const topMentionedCoin = getTopMentionedCoin(userMentionsStats);
    const topAwardingCoin = getTopAwardingCoin(userMentionsStats);
    const topUpvotingCoin = getTopUpvotingCoin(userMentionsStats);
    const userGlobalPositions = getPositionInAllMentioner(userMentionsStatsMap, username);

    $("#total-mentions-value").html(userMentionsStats.totalComments + " <i class='global-position'> Global Leaderboard: " + userGlobalPositions.mentionsGlobalPosition + "°</i>");
    $("#total-awards-value").html(userMentionsStats.totalAwards + " <i class='global-position'> Global Leaderboard: " + userGlobalPositions.awardsGlobalPosition + "°</i>");
    $("#total-ups-value").html(userMentionsStats.totalUps + "  <i class='global-position'> Global Leaderboard: " + userGlobalPositions.upsGlobalPosition + "°</i>");
    $("#ups-per-mentions-value").html((userMentionsStats.totalUps/userMentionsStats.totalComments).toFixed(2));

    $("#top-mentioned-coin").html(topMentionedCoin.coinName + " (" + topMentionedCoin.count + ")  <i class='global-position'>" + getPositionInAllCoinMentioner(userMentionsStatsMap, topMentionedCoin.coinName, username)+"°</i>");
    $("#top-mentioned-coin-image").attr("src", topMentionedCoin.image);

    $("#top-awarding-coin").html(topAwardingCoin.coinName + " (" + topAwardingCoin.count + ")  <i class='global-position'>" + getPositionInAllAwardedMentioner(userMentionsStatsMap, topMentionedCoin.coinName, username)+"°</i>");
    $("#top-awarding-coin-image").attr("src", topAwardingCoin.image);

    $("#top-upvoting-coin").html(topUpvotingCoin.coinName + " (" + topUpvotingCoin.count + ")  <i class='global-position'>" + getPositionInAllUpvotedMentioner(userMentionsStatsMap, topMentionedCoin.coinName, username)+"°</i>");
    $("#top-upvoting-coin-image").attr("src", topUpvotingCoin.image);

    let userRadarData = [userMentionsStats.totalComments, userMentionsStats.totalAwards, userMentionsStats.totalUps, Object.keys(userMentionsStats.mentionsArray).length];
    let avgUsersRadaData = [avgUsersStats.avgTotalComments, avgUsersStats.avgTotalAwards, avgUsersStats.avgTotalUps, avgUsersStats.avgUniqueCoinMentioned];

    var commentsCard = document.getElementById("mentions-comments-card");
    userCommentsList.sort(sortCommentsByUps);

    userCommentsList.slice(0, 5).forEach(comment => {
        commentsCard.appendChild(createComment(comment, "", ""));
        commentsCard.appendChild(document.createElement('hr'));
    });



    plotRadarChart(username, userRadarData, avgUsersRadaData, "user-stats-radar");
    plotDonutChart(getTopNMentionedCoin(userMentionsStats, 5), "top-mentioned-and-others");

  });*/

    function getGlobalPositions() {
        $.ajax({
            url: "https://aldobrand.herokuapp.com/get-global-positions?user="+getUsernameFromUrl(),
            context: document.body
        }).done(function(result) {
            $("#global-position-mentions").html(" Global Leaderboard: " + result.mentionsGlobalPosition + "°");
            $("#global-position-awards").html(" Global Leaderboard: " + result.awardsGlobalPosition + "°");
            $("#global-position-ups").html(" Global Leaderboard: " + result.upsGlobalPosition + "°");
            $("#global-position-ups-per-mention").html(" Global Leaderboard: " + result.upsPerMentionsGlobalPosition + "°");

        });
    }

  function getMentionerDetailsData() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-mentioner-details?user="+getUsernameFromUrl(),
        context: document.body
    }).done(function(result) {

        const userMentionsStats = result.userMentionsStats;
        const avgUsersStats = result.avgUsersStats;
        const topMentionedCoin = result.topMentionedCoin;
        const topAwardingCoin = result.topAwardingCoin;
        const topUpvotingCoin = result.topUpvotingCoin;
        const userGlobalPositions = result.userGlobalPositions;
        const coinGlobalPositions = result.coinsGlobalPositions;
    
        $("#total-mentions-value").html(userMentionsStats.totalComments + " ");
        $("#total-awards-value").html(userMentionsStats.totalAwards + " ");
        $("#total-ups-value").html(userMentionsStats.totalUps +  " ");
        $("#ups-per-mentions-value").html((userMentionsStats.totalUps/userMentionsStats.totalComments).toFixed(2) +  " ");
    
        $("#top-mentioned-coin").html(topMentionedCoin.name + " (" + topMentionedCoin.totalComments + ")  <i class='global-position'>" + /*coinGlobalPositions.mentionsPosition +*/"°</i>");
        $("#top-mentioned-coin-image").attr("src", topMentionedCoin.image);
    
        $("#top-awarding-coin").html(topAwardingCoin.name + " (" + topAwardingCoin.totalAwards + ")  <i class='global-position'>" + /*coinGlobalPositions.awardsPosition +*/"°</i>");
        $("#top-awarding-coin-image").attr("src", topAwardingCoin.image);
    
        $("#top-upvoting-coin").html(topUpvotingCoin.name + " (" + topUpvotingCoin.totalUps + ")  <i class='global-position'>" + /*coinGlobalPositions.upsPosition +*/"°</i>");
        $("#top-upvoting-coin-image").attr("src", topUpvotingCoin.image);
    
        let userRadarData = [userMentionsStats.totalComments, userMentionsStats.totalAwards, userMentionsStats.totalUps, userMentionsStats.uniqueCoinMentioned];
        let avgUsersRadaData = [avgUsersStats.avgTotalComments, avgUsersStats.avgTotalAwards, avgUsersStats.avgTotalUps, avgUsersStats.avgUniqueCoinMentioned];
        
        plotRadarChart(getUsernameFromUrl(), userRadarData, avgUsersRadaData, "user-stats-radar");
        plotDonutChart(getTopNMentionedCoin(result.coinsArray, 5), "top-mentioned-and-others");

        var topCommentsArray = result.highlightedComments;

        var comments = [];


        topCommentsArray.forEach(commentsArray =>{
            if(Array.isArray(commentsArray.topCommentsArray))
                commentsArray.topCommentsArray.forEach(comment => {
                    comment.name = commentsArray.name;
                    comment.symbol = commentsArray.symbol;
                    comments.push(comment);
                });
            else{
                let comment = commentsArray.topCommentsArray;
                comment.name = commentsArray.name;
                comment.symbol = commentsArray.symbol;
                comments.push(comment);
            }
        });

        var commentsCard = document.getElementById("mentions-comments-card");
        comments.sort(sortCommentsByUps);
        
        if(comments.length > 0)
            $('#nothing-to-see').remove();

        comments.slice(0, 5).forEach(comment => {
            commentsCard.appendChild(createComment(comment, comment.name, comment.symbol));
            commentsCard.appendChild(document.createElement('hr'));
        });
        
    });
}

function getDonutChartMentionsData() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-mentions-donut-char-data-by-username?user="+getUsernameFromUrl(),
        context: document.body
    }).done(function(result) {
        plotDonutChart(getTopNMentionedCoin(result, 5), "top-mentioned-and-others");
    });
}

function getCommentsData() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-all-comments-by-username?user="+getUsernameFromUrl(),
        context: document.body
    }).done(function(result) {
        var commentsCard = document.getElementById("mentions-comments-card");
        result.sort(sortCommentsByUps);
    
        result.slice(0, 5).forEach(comment => {
            commentsCard.appendChild(createComment(comment, "", ""));
            commentsCard.appendChild(document.createElement('hr'));
        });
    });
}