function plotDonutChart(coinData, id) {

    let labels = [];
    let data = [];
    let colorIndex = 0;

    coinData.forEach(coin => {
        labels.push(coin.name);
        data.push(coin.count ? coin.count : coin.totalComments);
        createLegendElement("donut-top-mentioned-legend", coin.symbol, colorIndex++);
    });

    var ctx = document.getElementById(id);
    var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
        data: data,
        backgroundColor: colorArray,
        hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
    },
    options: {
        maintainAspectRatio: false,
        tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        },
        legend: {
        display: false
        },
        cutoutPercentage: 80,
    },
    });

}

function plotDonutChartV2(coinData, labels, titles, id) {

    let data = [];
    let colorIndex = 0;

    coinData.forEach(coin => {
        data.push(coin.lastDayMentions);
        createLegendElement("donut-top-mentioned-legend", coin.symbol, colorIndex++);
    });

    var ctx = document.getElementById(id);
    var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
        data: data,
        backgroundColor: colorArray,
        hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
    },
    options: {
        maintainAspectRatio: false,
        tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        },
        legend: {
        display: false
        },
        cutoutPercentage: 80,
    },
    });

}

function createLegendElement(id, text, colorIndex) {
/*
    <span class="mr-2">
        <i class="fas fa-circle text-primary"></i> Direct
    </span>

*/
    let legend = document.getElementById(id);
    let span = document.createElement('span');
    span.classList.add('mr-2');
    let i = document.createElement('i');
    i.classList.add("fas");
    i.classList.add("fa-circle");
    i.style.color = colorArray[colorIndex];
    span.appendChild(i);
    span.innerHTML += " " + text;
    legend.appendChild(span);

}