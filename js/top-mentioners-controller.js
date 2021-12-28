
const userSet = new Set();
const coinSet = new Set();

//getDataList("");

getGlobalPositions();

$("#search-coin-value").on("input", function (e) {
    getDataList($("#search-coin-value").val());
});

$("#search-coin-value-mobile").on("input", function (e) {
    getDataList($("#search-coin-value-mobile").val());
});


function getGlobalPositions() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-top-users?stats=mentions",
        context: document.body
    }).done(function (result) {
        let datatableBody = document.getElementById("datatable-body");
        let users = [
            {username: "_pistone", mentions: 100, ups: 200, awards: 1},
            {username: "furbone", mentions: 200, ups: 300, awards: 1},
            {username: "maltone", mentions: 1030, ups: 2200, awards: 1},
            {username: "stempione", mentions: 10, ups: 500, awards: 1},
            {username: "giocone", mentions: 110, ups: 10, awards: 1},
            {username: "manone", mentions: 140, ups: 20, awards: 1},
            {username: "pieceone", mentions: 152, ups: 1, awards: 1},
            {username: "carlone", mentions: 1110, ups: 5, awards: 1},
            {username: "fattone", mentions: 2100, ups: 66, awards: 1},
            {username: "crotone", mentions: 5100, ups: 453, awards: 1},
            {username: "salmone", mentions: 1020, ups: 2345, awards: 1},
            {username: "creatone", mentions: 1070, ups: 756, awards: 1},
            {username: "visualstudione", mentions: 1001, ups: 646, awards: 1},
            {username: "bottone", mentions: 3100, ups: 24, awards: 1},
            {username: "frattone", mentions: 1200, ups: 734, awards: 1}
        ];

        users.forEach(user => {
            createNewUserDataTableRow(user, datatableBody)
        });

        $('#dataTable').DataTable();
    });
}

function createNewUserDataTableRow(user, datatableBody){

    var tr = document.createElement('tr');
    createTdAndAppendToTr(user.username, tr);
    createTdAndAppendToTr(user.mentions, tr);
    createTdAndAppendToTr(user.ups, tr);
    createTdAndAppendToTr(user.awards, tr);
    createTdAndAppendToTr((user.mentions/user.ups).toFixed(2), tr);    
    createTdAndAppendToTr((user.mentions/user.awards).toFixed(2), tr);

    datatableBody.appendChild(tr);

}

function createTdAndAppendToTr(text, tr){
    var td = document.createElement('td');
    td.innerHTML = text;
    tr.appendChild(td);
}

