const board = document.getElementById('draw_board');
const color_picker = document.getElementById('color_hex');
color_picker.onkeyup = (e)=>{
	console.log(e.target.value);
	document.querySelector('.color_show').style.background = e.target.value;
}
const size = {width: 10, height:10};
board.width=size.width; 
board.height=size.height;

const context = board.getContext('2d');
const data = context.createImageData(size.width, size.height);


const putPixel = (x, y, r, g, b, a)=>{
	const pos = ((y*4) * size.width) + (x*4);
	data.data[pos] = r;
	data.data[pos+1] = g;
	data.data[pos+2] = b;
	data.data[pos+3] = a;
}

board.onmousedown = (e)=>{
	let x = Math.floor((e.layerX/e.target.clientWidth) * size.width);
	let y =  Math.floor((e.layerY/e.target.clientHeight) * size.height);
	putPixel(x, y, 255, 0, 0, 255);
	context.putImageData(data, 0, 0);
}