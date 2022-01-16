const board = document.getElementById('draw_board');
const color_picker = document.getElementById('color_input');
const image_name   = document.getElementById('name_input');
const htmltext     = document.getElementById('html-text');
const csstext      = document.getElementById('css-text');
const colorviewer  = document.getElementById('selectedcolor-viewer');

//change canvas draw size
const size   = {width: 20, height:20};
board.width  = size.width; 
board.height = size.height;

//context
const context   = board.getContext('2d');
const imageData = context.createImageData(size.width, size.height);

//all box shadows
let boxes = '';
//all colors of the board in hexadecimal
const colors = new Array(size.width*size.height);
//name of class of the div
let name = image_name.getAttribute('value');
let selectedColor = '#000';

//update the html viewer text 
const updateHTMLViewer = classname => htmltext.innerText = '<div class="' + classname + '"></div>';

const updateColorViewer = color => colorviewer.style.background = color;

const updateCSSViewer = string => csstext.innerText = string;

const getCSS = unity => `.${name} {\n width:1${unity};\n height:1${unity};\n${boxes.length!=0?' box-shadow:\n  ':''}${boxes}}`;

const updateBox = ()=>{
	let verticalFirstPixel = [0, 0], horizontalFirstPixel = [0, 0];
	let ref = [0, 0];
	let unity = 'em'
	boxes = '';
	let close = false;
	for(let y = 0; y < size.height; y++){
		for(let x = 0; x < size.width; x++){
			if(colors[y*size.width + x]){
				ref[1] = y;
				close = true;
				break;
			}
		}
		if(close){break;}
	}
	close = false;
	for(let x = 0; x < size.width; x++){
		for(let y = 0; y < size.height; y++){
			if(colors[y*size.width + x]){
				ref[0] = x;
				close = true;
				break;
			}
		}
		if(close){break;}
	}
	for(let y = 0; y < size.height; y++){
		for(let x = 0; x < size.width; x++){
			if(colors[y*size.width + x]){
				boxes += `${x-ref[0]}${unity} ${y-ref[1]}${unity} ${colors[y*size.width + x]},\n  `
			}
		}
	}
	boxes = boxes.slice(0, boxes.length-4)+';\n'
}

//convert a hexadecimal code value to an rgb format
const toRGB = (hex)=>{
	let h = hex.replace(' ', '').replace('#','');
	h = (h.length === 3)?`${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`:h;
	const rgb = [0, 0, 0];
	rgb[0] = parseInt(h.slice(0,2), 16);
	rgb[1] = parseInt(h.slice(2,4), 16);
	rgb[2] = parseInt(h.slice(4,6), 16);
	
	return rgb;
}

//convert an decimal value to kexadecimal value
const intToHex = (v)=>{ let temp = v.toString(16); return temp.length===1?'0'+temp:temp;}

//return an hexadecimal color code from an rgb color
const toHex = (r, g, b)=>{return `#${intToHex(r)}${intToHex(g)}${intToHex(b)}`;}

//change an specific pixel value in canvas
const putPixel = (x, y, r, g, b, a)=>{
	const positionInArray = ((y*4) * size.width) + (x*4);
	imageData.data[positionInArray + 0] = r;
	imageData.data[positionInArray + 1] = g;
	imageData.data[positionInArray + 2] = b;
	imageData.data[positionInArray + 3] = a;
}

updateHTMLViewer(name);
updateCSSViewer(getCSS('em'))


//change selected color
color_picker.onkeyup = (e)=>{
	selectedColor = (e.target.value[0]==='#')?e.target.value:'#'+e.target.value;
	updateColorViewer(selectedColor);
}

image_name.onkeyup = (e)=>{
	name = e.target.value;
	updateHTMLViewer(name);
	updateCSSViewer(getCSS('em'))
}

board.onclick = (e)=>{
	//take coordinates in the canvas
	let x = Math.floor((e.offsetX/e.target.offsetWidth) * size.width);
	let y = Math.floor((e.offsetY/e.target.offsetHeight) * size.height);
	//convert the selected color in a rgb form
	const cor = toRGB(selectedColor);
	colors[y*size.width + x] = selectedColor;
	putPixel(x, y, cor[0], cor[1], cor[2], 255);
	updateBox();
	updateCSSViewer(getCSS('em'))
	context.putImageData(imageData, 0, 0);
}

document.querySelector('.box__infocss').onclick = e=>navigator.clipboard.writeText(csstext.innerText);
document.querySelector('.box__infohtml').onclick = e=>navigator.clipboard.writeText(htmltext.innerText);