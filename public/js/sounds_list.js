
function redrawList()
{
    var div =document.getElementById("copyList");
    div.innerHTML="";

    for(k in soundsList)
    {
        let doc=soundsList[k];
        div.innerHTML+=`<div draggable="true" class="box">${doc.LABEL}<i class="far fa-play-circle fa-2x" id="${doc._id}" onclick="playSound('/files/${doc.OWNER}/${doc.PATH}',this)"></i></div>`;
    }
}
function redrawBoard(board)
{
    for(k =0;k<9;k++ )
    {  
        var id ='drag'+parseInt((k/3))+"."+(k%3);
    var div=document.getElementById(id);
    div.innerHTML= "<i>__</i>";
    }
    for(k in board.SOUNDS)
    {
        var id ='drag'+parseInt((k/3))+"."+(k%3);
      var div=document.getElementById(id);
        let doc=board.SOUNDS[k];
        if(doc != null)
            div.innerHTML=`${doc.LABEL}<i class="far fa-play-circle fa-2x" id="${doc._id}" onclick="playSound('/files/${doc.OWNER}/${doc.PATH}',this)"></i> <i class="far fa-times-circle fa-1x box-board-cross" onclick="deleteSoundFromBoard(${k})"></i>`;
    }
}

var currentAudio;
var currentAudioPath;
function playSound(path,html)
{
    
    if(currentAudio)
    {   
    currentAudio.pause();
    if(currentAudioPath == path)
    {
        currentAudioPath = undefined;
        return;
    }
    }
    currentAudioPath = path;
    currentAudio= new Audio(path);
    currentAudio.play();
    currentAudio.addEventListener("play",()=>{
        
        html.classList.add('fa-pause-circle')
        html.classList.remove('fa-play-circle')
    });
    currentAudio.addEventListener("pause",()=>{
        
        html.classList.remove('fa-pause-circle')
        html.classList.add('fa-play-circle')
    });
    currentAudio.addEventListener("ended",()=>{
        currentAudioPath= undefined;
        html.classList.remove('fa-pause-circle')
        html.classList.add('fa-play-circle')
    });
}