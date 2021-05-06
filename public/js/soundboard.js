
function redrawBoard(board)
{
    for(k =0;k<9;k++ )
    {  
        var id =String.fromCharCode(97+parseInt(k));
    var div=document.getElementById(id);
    div.innerHTML= "<p>"+(k+1)+"</p>";
    }
    for(k in board.SOUNDS)
    {
        var id =String.fromCharCode(97+parseInt(k));
      var div=document.getElementById(id);
        let doc=board.SOUNDS[k];
        if(doc != null)
            div.innerHTML=`<p id="${doc._id}">${parseInt(k)+1}</p> <p style="overflow-wrap:normal;font-size:30px; word-wrap: break-word; overflow: hidden; text-overflow: inherit; white-space: normal; text-align: justify;">${doc.LABEL}</p> `;
    }
}

socket.on('soundboard.sendSoundboard',(data)=>{
    redrawBoard(data)
    soundsboards.push(data);
    var d=document.getElementById('listboard');
    d.innerHTML+=  `<div style="background-color: ;" class="btn-1" id="${data._id}" onclick="loadBoard(${soundsboards.length+1})">${data.LABEL}<i class="far fa-times-circle fa-1x box-board-cross" onclick="deleteboard('${data._id}')"></i></div>`;
    
});

function loadBoard(pos)
{
    
redrawBoard(soundsboards[pos]);
}
function playSound(divElement)
{
    var id=divElement.getElementsByTagName('p')[0].id;
    if(id)
        socket.emit('soundboard.play',id);
}
function deleteboard(id)
{
socket.emit('soundboard.delete',id);
var d=document.getElementById('listboard');
var e =d.getElementsByTagName("div");
for(k in e)
{
    if(e[k].id == id)
    {
        d.removeChild(e[k]);
        break;
    }
}
}