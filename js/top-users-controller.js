
const userSet = new Set();
const coinSet = new Set();
const USER_STAT_TYPES = ["mentions", "ups", "awards"];

getDataList("");

getStats();

$("#search-coin-value").on("input", function (e) {
    getDataList($("#search-coin-value").val());
});

$("#search-coin-value-mobile").on("input", function (e) {
    getDataList($("#search-coin-value-mobile").val());
});


function getStats() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get("q");

    if(!USER_STAT_TYPES.includes(type))
        location.href = "404.html";

    $.ajax({
        url: "https://aldobrand.herokuapp.com/get-top-users?stat="+type+"&limit=100",
        context: document.body
    }).done(function (result) {
        let datatableBody = document.getElementById("datatable-body");
        
        result.forEach(user => {
            createNewUserDataTableRow(user, datatableBody)
        });

        let orderColumn = 0;

        for(let i = 0; i < USER_STAT_TYPES.length; i++)
            if(USER_STAT_TYPES[i] == type)
                orderColumn = i+1;

        $('#dataTable').DataTable({
            "order": [[ orderColumn, "desc" ]]
        });
    });
}

function createNewUserDataTableRow(user, datatableBody){

    var tr = document.createElement('tr');
    var tdUser = createTdAndAppendToTr(user.username);
    tdUser.onclick(function () {
        location.href = COINSIGHT_MENTIONER_DETAILS_URL + user.username;
    });
    tr.appendChild(tdUser);
    tr.appendChild(createTdAndAppendToTr(user.totalMentions));
    tr.appendChild(createTdAndAppendToTr(user.totalUps));
    tr.appendChild(createTdAndAppendToTr(user.totalAwards));
    tr.appendChild(createTdAndAppendToTr((user.totalUps/user.totalMentions).toFixed(2)));    
    tr.appendChild(createTdAndAppendToTr((user.totalAwards/user.totalMentions).toFixed(2)));

    datatableBody.appendChild(tr);

}

function createTdAndAppendToTr(text){
    var td = document.createElement('td');
    td.innerHTML = text;
    return td;
}

