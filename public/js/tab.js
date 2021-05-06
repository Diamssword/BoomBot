$(document).ready(tab_load);
function tab_load() {

  var $wrapper = $('.tab-wrapper'),
    $tabMenu = $wrapper.find('.tab-menu li'),
    $line = $('<div class="line"></div>').appendTo($tabMenu);

  $tabMenu.filter(':first-of-type').find(':first').width('100%')

  $tabMenu.each(function (i) {
    $(this).attr('data-tab', 'tab' + i);
  });
  $tabMenu.on('click', function () {
    $getWrapper = $(this).closest($wrapper);

    $getWrapper.find($tabMenu).removeClass('active');
    $(this).addClass('active');

    $getWrapper.find('.line').width(0);
    $(this).find($line).animate({ 'width': '100%' }, 'fast');
  });
document.getElementById("close_bugfix").style="";
}
var currentIndex=0;
function tabChangeBoard(index)
{
  currentIndex=index;
  currentboard= soundboards[index];
  document.getElementById("boardnameinput").value= currentboard.LABEL;
  redrawBoard(currentboard);
}
var tabnewname = 0;
function addTab() {
  document.getElementById("adding_table").classList.remove("active");
  var d = document.createElement("li");
  d.innerHTML="nouveau#" + tabnewname +'<i class="far fa-times-circle fa-1x box-board-cross" onclick="deleteSoundBoard('+(soundboards.length)+')"></i>';
  soundboards.push({LABEL:d.innerText,SOUNDS:[]})
  d.addEventListener('click',()=>{tabChangeBoard(soundboards.length-1)});
  d.id="tab_li_"+(soundboards.length-1);
  tabnewname++;
  var res = document.getElementById("tab_ul").insertBefore(d, document.getElementById("adding_table"));
  res.classList.add("active");
  tab_load();
  res.click();
}

function changeName()
{
  var txt=document.getElementById("boardnameinput").value;
  document.getElementById("tab_li_"+currentIndex).innerText=txt;
  tab_load();
  if(soundboards[currentIndex] && soundboards[currentIndex]._id )
    socket.emit("manager.rename",{label:txt,id:soundboards[currentIndex]._id});
}
function changeName()
{
  var txt=document.getElementById("boardnameinput").value;
  document.getElementById("tab_li_"+currentIndex).innerText=txt;
  tab_load();
  if(soundboards[currentIndex] && soundboards[currentIndex]._id )
    socket.emit("manager.rename",{label:txt,id:soundboards[currentIndex]._id});
}
function deleteSoundBoard(index)
{
var board =soundboards[index]
if(confirm("supprimer "+board.LABEL+"?"))
{
  socket.emit("manager.delete",board._id);
}
}