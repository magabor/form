const checks = $('#cardOptions').find('input');

checks.on('click',onCheck);

function onCheck(event){
    const target = event.target;
    for(let i = 0;i<checks.length;i++){
        if(checks[i].id !== target.id)
            checks[i].checked = false;
    }
}


