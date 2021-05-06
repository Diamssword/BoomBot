
dragula({copy: function (el, source) {
    return source.id=="1";
  },
    accepts: function (el, target) {
        console.log("hey")
      return target.id!="1"; // elements can be dropped in any of the `containers` by default
    }, 
    revertOnSpill: false,
    removeOnSpill:true,
containers:[
	document.getElementById('1'),
	document.getElementById('2'),
	document.getElementById('3'),
	document.getElementById('4')
]})
.on('drop', function(el,e,source) {
    
})
.on('dragend', function(el) {
	// remove 'is-moving' class from element after dragging has stopped
	// add the 'is-moved' class for 600ms then remove it
	window.setTimeout(function() {
		el.classList.add('is-moved');
		window.setTimeout(function() {
			el.classList.remove('is-moved');
		}, 600);
	}, 100);
});







