
const userSet = new Set();
const coinSet = new Set();

getDataList("");

getStats();

$("#search-coin-value").on("input", function (e) {
    getDataList($("#search-coin-value").val());
});

$("#search-coin-value-mobile").on("input", function (e) {
    getDataList($("#search-coin-value-mobile").val());
});


function getStats() {
    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-top-users?stat=mentions&limit=100",
        context: document.body
    }).done(function (result) {
        let datatableBody = document.getElementById("datatable-body");

        result.forEach(user => {
            createNewUserDataTableRow(user, datatableBody)
        });

        $('#dataTable').DataTable({
            "order": [[ 1, "desc" ]]
        });
    });
}

function createNewUserDataTableRow(user, datatableBody){

    var tr = document.createElement('tr');
    createTdAndAppendToTr(user.username, tr);
    createTdAndAppendToTr(user.totalMentions, tr);
    createTdAndAppendToTr(user.totalUps, tr);
    createTdAndAppendToTr(user.totalAwards, tr);
    createTdAndAppendToTr((user.totalUps/user.totalMentions).toFixed(2), tr);    
    createTdAndAppendToTr((user.totalAwards/user.totalMentions).toFixed(2), tr);

    datatableBody.appendChild(tr);

}

function createTdAndAppendToTr(text, tr){
    var td = document.createElement('td');
    td.innerHTML = text;
    tr.appendChild(td);
}

