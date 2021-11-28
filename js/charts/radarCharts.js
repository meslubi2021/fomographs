function plotRadarChart(username, userData, avgData, id){

    var ctx = document.getElementById(id);
    var myRadarChart = new Chart(ctx, getRadarConfig(username, userData, avgData));

}



function getRadarConfig(username, userData, avgData) {
    return {
        type: 'radar',
        data: getUserRadar(username, userData, avgData),
        options: {
        responsive: true,
            scale: {
                ticks: {
                    display: false
                }
            },
            tooltips: {
                enabled: false
            },
            plugins: {
                title: {
                display: true,
                text: 'Chart.js Radar Chart'
                }
            }
        },
    };
}

function getUserRadar(username, userData, avgData) {

    let data1 = [];
    let data2 = [];

    for(var i = 0; i < userData.length; i++){

        data1[i] = (userData[i] >= avgData[i]) ? 100 : (userData[i]*100/avgData[i]);
        data2[i] = (avgData[i] >= userData[i]) ? 100 : (avgData[i]*100/userData[i]);

    }

    return {
    labels: ["Total Mentions (" + userData[0] + ")", "Total Awards (" + userData[1] + ")", "Total Upvoting (" + userData[2] + ")", "Unique Coin Mentioned (" + userData[3] + ")"],
    datasets: [
        {
            label: username,
            data: data1,
            borderColor: '#4e73df',
        },
        {
            label: 'Community Avg',
            data: data2,
            borderColor: '#f6c23e',
        }
     ]
    };
}