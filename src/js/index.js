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
function selectFormatter(value,row,index,field){
    return [
        '<select name="" id="">',
            '<option value="">Electrical</option>',
            '<option value="">Microwave</option>',
            '<option value="">Optical</option>',
        '</select>'
    ].join('');
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
    onExpandRow: showBwTable
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

function showBwTable(index,row,$detail){
    // console.log($detail);
    // $detail.append(`<h1>this is a table ${index}</h1>`);
    const $addBtn = $(`<button id="addBtn${index}">Add</button>`);
    const tableId = `table_${index}`;
    const table = `<table id="${tableId}"></table>`;
    const columns = [{
        field:'physMedia',
        title: 'Physical Media',
        formatter: selectFormatter
        },{
            field:'bw',
            title: 'Bandwidth'
        },{
            field:'allowed',
            title: 'Allowed',
            formatter: formatter
    }];
    $table = $(table).bootstrapTable({
        columns: columns
    });
    $addBtn.on('click',function (){
        const data = [{
            physMedia: 1,
            bw: 1,
            allowed: 1
        }]
        $(['#',tableId].join('')).bootstrapTable('append',data);
    })
    $detail.append($addBtn);
    $detail.append($table);
}

