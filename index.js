const board = document.getElementById('draw_board');
const color_picker = document.getElementById('color_hex');
const image_name = document.getElementById('image_name');
const colors = [];
let name = '';

image_name.onkeyup = (e)=>{
	name = e.target.value;
	document.querySelector('.html_text').innerText = '<div class="' + name + '"></div>';
}

let selectedColor = 'black';
color_picker.onkeyup = (e)=>{
	console.log(e.target.value);
	selectedColor = (e.target.value[0]==='#')?e.target.value:'#'+e.target.value;
	document.querySelector('.color_show').style.background = selectedColor;
}
const size = {width: 10, height:10};
board.width=size.width; 
board.height=size.height;

const context = board.getContext('2d');
const data = context.createImageData(size.width, size.height);

const generateCSS = ()=>{
	let ref = [0, 0];
	let unity = 'em'
	let string = `.${name}{\n\twidth:1${unity};\n\theight:1${unity};\n\tbox-shadow:\n\t`;
	let i = 0;
	for(let y = 0; y < size.height; y++){
		for(let x = 0; x < size.width; x++){
			if(colors[y*size.width + x]){
				string += `${x-ref[0]}${unity} ${y-ref[0]}${unity} ${colors[y*size.width + x]},\n\t`
			}
			i+=1;
		}
	}
	string+='\n}'
	return string;
}

const toRGB = (hex)=>{
	let h = hex.replace(' ', '').replace('#','');
	const rgb = [0, 0, 0];
	if(h.length === 3){
		rgb[0] = parseInt(h[0], 16)*parseInt(h[0], 16);
		rgb[1] = parseInt(h[1], 16)*parseInt(h[1], 16);
		rgb[2] = parseInt(h[2], 16)*parseInt(h[2], 16);
	}
	else{
		rgb[0] = parseInt(h[0], 16)*parseInt(h[1], 16);
		rgb[1] = parseInt(h[2], 16)*parseInt(h[3], 16);
		rgb[2] = parseInt(h[4], 16)*parseInt(h[5], 16);
	}
	return rgb;
}

const intToHex = (v)=>{
	let temp = v.toString(16)
	return temp.length===1?'0'+temp:temp;
}

const toHex = (r, g, b)=>{
	return `#${intToHex(r)}${intToHex(g)}${intToHex(b)}`;
}

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
	const cor = toRGB(selectedColor);
	colors[y*size.width + x] = selectedColor;
	putPixel(x, y, cor[0], cor[1], cor[2], 255);
	const css = generateCSS();
	document.querySelector('.css_text').innerText = css;
	context.putImageData(data, 0, 0);
}