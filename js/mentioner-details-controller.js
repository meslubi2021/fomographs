
const username = getUsernameFromUrl();
const userSet = new Set();
const coinSet = new Set();

$("#mentioner-title").html("u/" + username);

setRedditAvatar(username, "mentioner-avatar");
$("#mentioner-avatar").css("width", "4rem");

getMentionerDetailsData();
getGlobalPositions();
getDataList("");

$("#search-coin-value").on("input", function (e) {
    getDataList($("#search-coin-value").val());
});

$("#search-coin-value-mobile").on("input", function (e) {
    getDataList($("#search-coin-value-mobile").val());
});


function getGlobalPositions() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-global-positions?user=" + getUsernameFromUrl(),
        context: document.body
    }).done(function (result) {
        $("#global-position-mentions").html(" Global Leaderboard: " + result.mentionsGlobalPosition + "°");
        $("#global-position-awards").html(" Global Leaderboard: " + result.awardsGlobalPosition + "°");
        $("#global-position-ups").html(" Global Leaderboard: " + result.upsGlobalPosition + "°");
        $("#global-position-ups-per-mention").html(" Global Leaderboard: " + result.upsPerMentionsGlobalPosition + "°");

    });
}

function getMentionerDetailsData() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-mentioner-details?user=" + getUsernameFromUrl(),
        context: document.body
    }).done(function (result) {

        const userMentionsStats = result.userMentionsStats;
        const avgUsersStats = result.avgUsersStats;
        const topMentionedCoin = result.topMentionedCoin;
        const topAwardingCoin = result.topAwardingCoin;
        const topUpvotingCoin = result.topUpvotingCoin;
        const userGlobalPositions = result.userGlobalPositions;
        const coinGlobalPositions = result.coinsGlobalPositions;

        $("#total-mentions-value").html(userMentionsStats.totalComments + " ");
        $("#total-awards-value").html(userMentionsStats.totalAwards + " ");
        $("#total-ups-value").html(userMentionsStats.totalUps + " ");
        $("#ups-per-mentions-value").html((userMentionsStats.totalUps / userMentionsStats.totalComments).toFixed(2) + " ");

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


        topCommentsArray.forEach(commentsArray => {
            if (Array.isArray(commentsArray.topCommentsArray))
                commentsArray.topCommentsArray.forEach(comment => {
                    comment.name = commentsArray.name;
                    comment.symbol = commentsArray.symbol;
                    comments.push(comment);
                });
            else {
                let comment = commentsArray.topCommentsArray;
                comment.name = commentsArray.name;
                comment.symbol = commentsArray.symbol;
                comments.push(comment);
            }
        });

        var commentsCard = document.getElementById("mentions-comments-card");
        comments.sort(sortCommentsByUps);

        if (comments.length > 0)
            $('#nothing-to-see').remove();

        comments.slice(0, 5).forEach(comment => {
            commentsCard.appendChild(createComment(comment, comment.name, comment.symbol));
            commentsCard.appendChild(document.createElement('hr'));
        });

    });
}

function getDonutChartMentionsData() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-mentions-donut-char-data-by-username?user=" + getUsernameFromUrl(),
        context: document.body
    }).done(function (result) {
        plotDonutChart(getTopNMentionedCoin(result, 5), "top-mentioned-and-others");
    });
}

function getCommentsData() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-all-comments-by-username?user=" + getUsernameFromUrl(),
        context: document.body
    }).done(function (result) {
        var commentsCard = document.getElementById("mentions-comments-card");
        result.sort(sortCommentsByUps);

        result.slice(0, 5).forEach(comment => {
            commentsCard.appendChild(createComment(comment, "", ""));
            commentsCard.appendChild(document.createElement('hr'));
        });
    });
}