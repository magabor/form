const checks = $('#cardOptions').find('input');

checks.on('click',onCheck);

function onCheck(event){
    const target = event.target;
    for(let i = 0;i<checks.length;i++){
        if(checks[i].id !== target.id)
            checks[i].checked = false;
    }
}
function formatter(value,row,index,field){
    return `<input type="checkbox"  value=${value} />`;
}
function detailFormatter(index, row) {
    return 'lalalal';
}
window.operateEvents  = {
    'click input': function (event,value,row,index){
        row.equipped = !value;
    }
}
const columns = [
    {
        field: 'portNo',
        title: 'Port #'
    },{
        field: 'portID',
        title: 'Port Id'
    },{
        field: 'equipped',
        title: 'Equipped',
        formatter: formatter,
        events: window.operateEvents
    }];

$('#table').bootstrapTable({
    columns: columns,
    detailView: true,
    //detailFormatter: detailFormatter
});

$('#addBtn').on('click',function (){
    const data = getLastRow();
    const lastPortNo = data.length ? data[0].portNo : 0;
    let newrow = newRow(lastPortNo + 1);
    $('#table').bootstrapTable('append',newrow);
})
$('#delBtn').on('click',function (){
    const data = getLastRow();
    const lastPortNo = data.length ? data[0].portNo : 0;
    $('#table').bootstrapTable('remove',{
        field:'portNo',
        values: [lastPortNo]
    });
})

function getLastRow() {
    var prevData = $('#table').bootstrapTable('getData');
    return prevData.slice(-1);
}

function newRow(portNo){
    return [{
        portNo: portNo,
        portID: portNo,
        equipped: false
    }];
}



