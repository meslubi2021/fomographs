let colorIndex = 0;
const colorArray = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];
let coinsListArray = [];

const REDDIT_USER_BASE_URL = 'https://www.reddit.com/user/';
const COINSIGHT_COIN_DETAILS_URL = 'coin-details.html'
const COINSIGHT_MENTIONER_DETAILS_URL = 'mentioner-details.html?user='

let queryToSend = "";

function getCoinNameFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("coin");
}

function getUsernameFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("user");
}

function getTotalMentions(coinsDataArray){

  let totalMentions = 0;

  coinsDataArray.forEach(coin => {
    totalMentions+=coin.count;
  });

  return totalMentions;

}

function getTotalAwards(coinsDataArray){

  let totalAwards = 0;

  coinsDataArray.forEach(coin => {
    coin.comments.forEach(comment => {
      if (comment.total_awards_received)
      totalAwards+=comment.total_awards_received;
    });
  });

  return totalAwards;

}

function getTotalUps(coinsDataArray){

  let totalUps = 0;

  coinsDataArray.forEach(coin => {
    coin.comments.forEach(comment => {
      if (comment.total_awards_received)
      totalUps+=comment.ups;
    });
  });

  return totalUps;

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

function getTotalAward(coin){
    let awards = 0;
    coin.comments.forEach(comment => {
        if (comment.total_awards_received)
        awards+=comment.total_awards_received;
    });
    return awards;
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

  function sortCommentsByUps(comment1, comment2){
    return comment2.ups-comment1.ups;
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

  function searchCoin(e) {
    location.href = "coin-details.html?coin="+document.getElementById("search-coin-value").value.toLowerCase();
  }

  function searchCoinMobile(e) {
    location.href = "coin-details.html?coin="+document.getElementById("search-coin-value-mobile").value.toLowerCase();
  }

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

function createComment(comment, coinName, coinSymbol) {

  var div = document.createElement('div');
  var h4 = document.createElement('h4');
  var spanUps = document.createElement('span');
  var spanComment = document.createElement('span');

  div.classList.add("mentions-comments");
  h4.classList.add("small");
  h4.classList.add("font-weight-bold");
  h4.classList.add("commenter");
  h4.innerHTML = comment.author_name + ' at ' + timestamp_format(comment.timestamp) + " - " + timestamp_format_2(comment.timestamp);
  h4.onclick = function () { 
    window.open(
      COINSIGHT_MENTIONER_DETAILS_URL + comment.author_name,
      '_blank'
    )
  };
  spanUps.classList.add("float-right");
  spanUps.classList.add("comment-ups");
  spanUps.innerHTML = 'Upvotes: '+comment.ups;
  h4.appendChild(spanUps);
  spanComment.classList.add("comment-body");
  spanComment.classList.add("three-rows-comment");
  spanComment.innerHTML = comment.body ? boldCoinNameAndSymbol(comment.body, coinName, coinSymbol) : "Comment not available";
  spanComment.onclick = function() { 
    window.open(
      'https://reddit.com' + comment.permalink,
      '_blank' 
    )
  }
  spanComment.alt = 'https://reddit.com' + comment.permalink ? comment.permalink : '';
  spanComment.title = 'https://reddit.com' + comment.permalink ? comment.permalink : '';
  div.appendChild(h4);
  div.appendChild(spanComment);

  return div;
}

function createMentionerRow(mentioner) {

  /*

  <div class="col-xs-2 pr-3">
      <img class="img-fluid" style="width: 3rem;" id="top-mentioner-last-day-avatar" src="" />
  </div>
  <div class="col-xs-10">
      <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
          Top mentioner last day</div>
      <div class="h5 mb-0 font-weight-bold text-gray-800 pointer" id="top-mentioner-last-day">...</div>
  </div>

  */

  var div = document.createElement('div');
  var row = document.createElement('div');
  var divImg = document.createElement('div');
  var h4 = document.createElement('h4');
  var img = document.createElement('img');
  var divUsername = document.createElement('div');

  row.classList.add("row");
  row.classList.add("no-gutters");
  row.classList.add("align-items-center");
  row.classList.add("mb-2");
  divImg.classList.add("col-xs-2");
  divImg.classList.add("pr-3");
  img.classList.add("img-fluid");
  divUsername.classList.add("col-xs-10");

  div.classList.add("mentions-comments");
  h4.classList.add("small");
  h4.classList.add("font-weight-bold");
  h4.classList.add("commenter");
  h4.innerHTML = mentioner.author_name + " ("+ mentioner.count +")";
  h4.onclick = function() { 
    window.open(
      COINSIGHT_MENTIONER_DETAILS_URL + mentioner.author_name,
      '_blank'
    )
  };

  setRedditAvatarToMentioner(mentioner.author_name, img);

  row.appendChild(divImg);
  divUsername.appendChild(h4);
  row.appendChild(divUsername);
  divImg.appendChild(img);
  div.appendChild(row);

  return div;
}

function boldCoinNameAndSymbol(str, coinName, coinSymbol) {
  if(coinName){
    str = str.replaceAll(coinName, '<strong>'+ coinName + '</strong>');
    str = str.replaceAll(titleCase(coinName), '<strong>'+ titleCase(coinName) + '</strong>');
  }

  if(coinSymbol)
    str = str.replaceAll(coinSymbol, '<strong>'+ coinSymbol + '</strong>');

  return str;

}

function getTopMentioners(coinsDataArray, limit) {

  let userMentionsCounter = [];
  let commentioners = [];

  coinsDataArray.forEach(coin => {

    if(coin.comments){
      coin.comments.forEach(comment => {
        if(userMentionsCounter[comment.author_name])
          userMentionsCounter[comment.author_name]++;
        else
          userMentionsCounter[comment.author_name] = 1;
      })
    }

  });

  for (var author_name in userMentionsCounter) {
    commentioners.push({author_name: author_name, count: userMentionsCounter[author_name]});
  }

  return commentioners.sort(function(el1, el2) {return el2.count-el1.count}).slice(0,limit);

}

function getTopMoontionersAllTime(coinsDataArray, limit) {

  let userMentionsCounter = [];
  let commentioners = [];

  coinsDataArray.forEach(day => {
    day.forEach(coin => {
      if(coin.id == "moon") {
        if(coin.comments){
          coin.comments.forEach(comment => {
            if(userMentionsCounter[comment.author_name])
              userMentionsCounter[comment.author_name]++;
            else
              userMentionsCounter[comment.author_name] = 1;
          })
        }
      }
    });
  });

  for (var author_name in userMentionsCounter) {
    commentioners.push({author_name: author_name, count: userMentionsCounter[author_name]});
  }

  return commentioners.sort(function(el1, el2) {return el2.count-el1.count}).slice(0,limit);

}

function getTopMoontionersLastDay(coinsDataArray, limit) {

  let userMentionsCounter = [];
  let commentioners = [];

  coinsDataArray.forEach(coin => {
    if(coin.id == "moon") {
      if(coin.comments){
        coin.comments.forEach(comment => {
          if(userMentionsCounter[comment.author_name])
            userMentionsCounter[comment.author_name]++;
          else
            userMentionsCounter[comment.author_name] = 1;
        })
      }
    }
  });

  for (var author_name in userMentionsCounter) {
    commentioners.push({author_name: author_name, count: userMentionsCounter[author_name]});
  }

  return commentioners.sort(function(el1, el2) {return el2.count-el1.count}).slice(0,limit);

}


function getTopMentioner(coinsDataArray) {

  let userMentionsCounter = [];
  let max = 0;
  let max_author_name = "";

  coinsDataArray.forEach(coin => {

    if(coin.comments){
      coin.comments.forEach(comment => {
        if(userMentionsCounter[comment.author_name])
          userMentionsCounter[comment.author_name]++;
        else
          userMentionsCounter[comment.author_name] = 1;
      })
    }

  });

  for (var author_name in userMentionsCounter) {
    if(userMentionsCounter[author_name] > max){
      max = userMentionsCounter[author_name];
      max_author_name = author_name;
    }
  }

  return {count: max, author_name: max_author_name};

}

function getTopMentionerAwards(coinsDataArray) {

  let userMentionsCounter = [];
  let max = 0;
  let max_author_name = "";

  coinsDataArray.forEach(coin => {

    if(coin.comments){
      coin.comments.forEach(comment => {
        if(userMentionsCounter[comment.author_name])
          userMentionsCounter[comment.author_name]+= comment.total_awards_received;
        else
          userMentionsCounter[comment.author_name] = comment.total_awards_received;
      })
    }

  });

  for (var author_name in userMentionsCounter) {
    if(userMentionsCounter[author_name] > max){
      max = userMentionsCounter[author_name];
      max_author_name = author_name;
    }
  }

  return {count: max, author_name: max_author_name};

}

function getTopMentionersAwards(coinsDataArray) {

  let userMentionsCounter = [];
  let commentioners = [];

  coinsDataArray.forEach(coin => {

    if(coin.comments){
      coin.comments.forEach(comment => {
        if(userMentionsCounter[comment.author_name])
          userMentionsCounter[comment.author_name]+= comment.total_awards_received;
        else
          userMentionsCounter[comment.author_name] = comment.total_awards_received;
      })
    }

  });

  for (var author_name in userMentionsCounter) {
    commentioners.push({count: userMentionsCounter[author_name], author_name: author_name});
  }

  return commentioners.sort(function(el1, el2) {return el2.count-el1.count}).slice(0,10);;

}

function getTopMentionersUps(coinsDataArray) {

  let userMentionsCounter = [];
  let commentioners = [];

  coinsDataArray.forEach(coin => {

    if(coin.comments){
      coin.comments.forEach(comment => {
        if(userMentionsCounter[comment.author_name])
          userMentionsCounter[comment.author_name]+= comment.ups;
        else
          userMentionsCounter[comment.author_name] = comment.ups;
      })
    }

  });

  for (var author_name in userMentionsCounter) {
    commentioners.push({count: userMentionsCounter[author_name], author_name: author_name});
  }

  return commentioners.sort(function(el1, el2) {return el2.count-el1.count}).slice(0,10);;

}

function goToCoinPageFunction(coinName) {
  return function () {
    location.href = 'coin-details.html?coin=' + coinName;
  }
}

function setRedditAvatar(username, id) {

  $.ajax({
    url: "https://www.reddit.com/user/" + username + "/about.json",
    context: document.body
  }).done(function(result) {
      if(result.data.snoovatar_img)
        $("#"+id).attr( "src", decodeEntities(result.data.snoovatar_img));
      else 
      $("#"+id).attr( "src", decodeEntities(result.data.icon_img));
  });

}

function setRedditAvatarToMentioner(username, domElement) {

  $(domElement).css("width", "2rem");

  $.ajax({
    url: "https://www.reddit.com/user/" + username + "/about.json",
    context: document.body
  }).done(function(result) {
      if(result.data.snoovatar_img)
        $(domElement).attr( "src", decodeEntities(result.data.snoovatar_img));
      else 
      $(domElement).attr( "src", decodeEntities(result.data.icon_img));
  });

}

function decodeEntities(encodedString) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

function getTopMentionedCoin(userStats) {

  let max = 0;
  let maxCoinName = "";
  let maxCoinImage = "";
  let mentionsArray = userStats.mentionsArray;


  for(var coin in mentionsArray){
    if(mentionsArray[coin].totalComments > max) {
      max = mentionsArray[coin].totalComments;
      maxCoinName = mentionsArray[coin].coinName;
      maxCoinImage = mentionsArray[coin].image;
    }
  }

  return {count: max, coinName: maxCoinName, image: maxCoinImage};

}

function getTopNMentionedCoin(userStats, n) {

  let coinArray = userStats;
  let otherCount = 0;

  /*userStats.forEach(coin => {
    coinArray.push({
      totalComments: coin.totalComments,
      name: coin._id.name,
      symbol: coin._id.symbol
    });
  });*/

  let coinResultArray = coinArray.sort(function(el1, el2){ return el2.totalComments - el1.totalComments});

  if (n < coinResultArray.length) {
    let otherArray = coinResultArray.slice(n, coinResultArray.length);

    otherArray.forEach(coin => {
      otherCount+=coin.totalComments;
    });
    coinResultArray = coinResultArray.slice(0,n)
    coinResultArray.push({
      totalComments: otherCount,
      name: "Other",
      symbol: "Other"
    });
  }

  return coinResultArray;

}

function getTopAwardingCoin(userStats) {

  let max = 0;
  let maxCoinName = "";  
  let maxCoinImage = "";
  let mentionsArray = userStats.mentionsArray;


  for(var coin in mentionsArray){
    if(mentionsArray[coin].totalAwards > max) {
      max = mentionsArray[coin].totalAwards;
      maxCoinName = mentionsArray[coin].coinName;
      maxCoinImage = mentionsArray[coin].image;
    }
  }

  return {count: max, coinName: maxCoinName, image: maxCoinImage};

}

function getTopUpvotingCoin(userStats) {

  let max = 0;
  let maxCoinName = "";
  let maxCoinImage = "";
  let mentionsArray = userStats.mentionsArray;


  for(var coin in mentionsArray){
    if(mentionsArray[coin].totalUps > max) {
      max = mentionsArray[coin].totalUps;
      maxCoinName = mentionsArray[coin].coinName;
      maxCoinImage = mentionsArray[coin].image;
    }
  }

  return {count: max, coinName: maxCoinName, image: maxCoinImage};

}

function getPositionInAllCoinMentioner(usersStatsMap, coinName, username){

  let usersArray = [];

  for(var user in usersStatsMap){
    if(usersStatsMap[user].mentionsArray[coinName])
      usersArray.push({user:user, stats: usersStatsMap[user].mentionsArray[coinName]});
  }

  usersArray.sort(function(el1, el2){return el2.stats.totalComments - el1.stats.totalComments});

  for(var i = 0; i < usersArray.length; i++)
    if(usersArray[i].user == username)
      return i+1;

  return "Not mentioned"

}

function getPositionInAllMentioner(usersStatsMap, username){

  let usersArray = [];
  let userGlobalPositions= {mentionsGlobalPosition: "No Data", awardsGlobalPosition: "No Data", upsGlobalPosition: "No Data"};

  for(var user in usersStatsMap){
      usersArray.push({user:user, stats: usersStatsMap[user]});
  }


  usersArray.sort(function(el1, el2){return el2.stats.totalComments - el1.stats.totalComments});

  for(var i = 0; i < usersArray.length; i++)
    if(usersArray[i].user == username)
      userGlobalPositions.mentionsGlobalPosition = i+1;

  usersArray.sort(function(el1, el2){return el2.stats.totalAwards - el1.stats.totalAwards});

  for(var i = 0; i < usersArray.length; i++)
    if(usersArray[i].user == username)
      userGlobalPositions.awardsGlobalPosition = i+1;

  usersArray.sort(function(el1, el2){return el2.stats.totalUps - el1.stats.totalUps});

  for(var i = 0; i < usersArray.length; i++)
    if(usersArray[i].user == username)
      userGlobalPositions.upsGlobalPosition = i+1;


  return userGlobalPositions;

}

function getPositionInAllAwardedMentioner(usersStatsMap, coinName, username){

  let usersArray = [];

  for(var user in usersStatsMap){
    if(usersStatsMap[user].mentionsArray[coinName])
      usersArray.push({user:user, stats: usersStatsMap[user].mentionsArray[coinName]});
  }

  usersArray.sort(function(el1, el2){return el2.stats.totalAwards - el1.stats.totalAwards});

  for(var i = 0; i < usersArray.length; i++)
    if(usersArray[i].user == username)
      return i+1;

  return "Not mentioned"

}

function getPositionInAllUpvotedMentioner(usersStatsMap, coinName, username){

  let usersArray = [];

  for(var user in usersStatsMap){
    if(usersStatsMap[user].mentionsArray[coinName])
      usersArray.push({user:user, stats: usersStatsMap[user].mentionsArray[coinName]});
  }

  usersArray.sort(function(el1, el2){return el2.stats.totalUps - el1.stats.totalUps});

  for(var i = 0; i < usersArray.length; i++)
    if(usersArray[i].user == username)
      return i+1;

  return "Not mentioned"

}

function getAvgUsersMentionsStats(userMentionsStatsMap) {

  let sumTotalComments = 0;
  let sumTotalAwards = 0;
  let sumTotalUps = 0;
  let sumDifferentMentionedCoins = 0;
  let count = 0;

  for(var user in userMentionsStatsMap) {
    if(userMentionsStatsMap[user].totalComments >=100){
      count++;
      sumTotalComments+=userMentionsStatsMap[user].totalComments;
      sumTotalAwards+=userMentionsStatsMap[user].totalAwards;
      sumTotalUps+=userMentionsStatsMap[user].totalUps;
      sumDifferentMentionedCoins+=Object.keys(userMentionsStatsMap[user].mentionsArray).length;
    }
  }

  return {avgTotalComments: sumTotalComments/count, avgTotalAwards: sumTotalAwards/count, avgTotalUps: sumTotalUps/count, avgUniqueCoinMentioned: sumDifferentMentionedCoins/count};

}

function getCoinPositionMap(coinArray){

  let coinPositionMap = [];
  let position = 1;

  coinArray.sort(sortCoinsByMentions);
  coinArray.forEach(coin => {
    coinPositionMap[coin.id] = {coin: coin, position: position++};
  });

  return coinPositionMap;

}

function getPositionsCoinArray(coinsDataObjects, coinName) {

  let positionsArray = [];

  coinsDataObjects.forEach(coins => {
    let coinArray = [];
    for(var name in coins){
      coinArray.push(coins[name]);
    }
    let position = getCoinPositionMap(coinArray)[coinName];
    
    positionsArray.push(position ? position.position : 0);
  });
  return positionsArray;
}

function getTopGrowthCoinByMention(afterMap, beforeMap) {

  let coinPositionDifferenceArray = [];

  for(var afterCoin in afterMap){
    if(beforeMap[afterCoin] && beforeMap[afterCoin].coin.count > 0)
      coinPositionDifferenceArray.push({
        differencePosition: (beforeMap[afterCoin] ? beforeMap[afterCoin].position : Object.keys(afterMap).length) - afterMap[afterCoin].position,
        afterPosition: afterMap[afterCoin].position,
        afterMentions: afterMap[afterCoin].coin.count,
        beforePosition: beforeMap[afterCoin].position,
        beforeMentions: beforeMap[afterCoin].coin.count,
        coin: afterMap[afterCoin].coin
      });
  }

  coinPositionDifferenceArray.sort(function (el1, el2) {return el2.differencePosition - el1.differencePosition});

  return coinPositionDifferenceArray;

}

function getTopDecreasedCoinByMention(afterMap, beforeMap) {

  let coinPositionDifferenceArray = [];

  for(var afterCoin in afterMap){
    if(beforeMap[afterCoin] && beforeMap[afterCoin].coin.count > 0)
      coinPositionDifferenceArray.push({
        differencePosition: (beforeMap[afterCoin] ? beforeMap[afterCoin].position : Object.keys(afterMap).length) - afterMap[afterCoin].position,
        afterPosition: afterMap[afterCoin].position,
        afterMentions: afterMap[afterCoin].coin.count,
        beforePosition: beforeMap[afterCoin].position,
        beforeMentions: beforeMap[afterCoin].coin.count,
        coin: afterMap[afterCoin].coin
      });
  }

  coinPositionDifferenceArray.sort(function (el1, el2) {return el1.differencePosition - el2.differencePosition});

  return coinPositionDifferenceArray;

}

function getDataList(q) {

  queryToSend = q;

  setTimeout( function () {
    if(queryToSend == q){
      $.ajax({
        url: "https://aldobrand.herokuapp.com/get-datalist?q="+q,
        context: document.body
      }).done(function(result) {
        let datalist = document.getElementById("aviable-coin-list");
        datalist.innerHTML = '';

        result.coinsList.forEach(coin => {
          var opt = document.createElement('option');
          opt.value = titleCase(coin.name);
          opt.innerHTML = coin.symbol;
          $(opt).attr("type", "coin");
          datalist.appendChild(opt);
        });
        
        result.usersList.forEach(user => {
          var opt = document.createElement('option');
          opt.value = user.name;
          opt.innerHTML = "User";
          $(opt).attr("type", "user");
          datalist.appendChild(opt);
          userSet.add(user.name);
        });

        coinsListArray = result.coinsList;

        $("#search-coin-value").on("change", function (e) {
          if(userSet.has(e.target.value))
            location.href = "mentioner-details.html?user="+e.target.value;
          else{
            coinsListArray.forEach(coin => {
              if(coin.name==e.target.value.toLowerCase())
                location.href = "coin-details.html?coin="+coin.id;
            });
          }
        });
        
        $("#search-coin-value-mobile").on("change", function (e) {
          if(userSet.has(e.target.value))
            location.href = "mentioner-details.html?user="+e.target.value;
          else{
            coinsListArray.forEach(coin => {
              if(coin.name==e.target.value.toLowerCase())
                location.href = "coin-details.html?coin="+coin.id;
            });
          }
        });
      });
    }
  }, 500);
}