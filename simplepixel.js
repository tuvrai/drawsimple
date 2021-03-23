(function(window){
  function simplePixel(){
    var simplePx = {};

    	simplePx.getValues = function (data,x,y)
 		{
 			let redOfChosenPixel = ((y-1)*(data.width*4))+((x-1)*4);

 			let red = parseInt(data.data[redOfChosenPixel],10);
 			let green = parseInt(data.data[redOfChosenPixel+1],10);
 			let blue = parseInt(data.data[redOfChosenPixel+2],10);
 			let alpha = parseInt(data.data[redOfChosenPixel+3],10);

 			if (isNaN(red)||isNaN(green)||isNaN(blue)||isNaN(alpha))
 			{
 				return false;
 			}
 			else
 			{
	 			return {
		            red: red,
		            green: green,
		            blue: blue,
		            alpha: alpha
	        	};
        	}
 		}

		simplePx.getConvertedValues = function (data,x,y,type)
		{
			const colors = this.getValues(data,x,y);
			if (!colors) return false;
			if (type===undefined) return colors;
			else if (type==='rgb')
			{
				const alpha = Math.round(colors.alpha/255*100)/100;
				colors.alpha = alpha;
				colors.type = type;
				return colors;
			}
			else if (type==='hex')
			{
				let red = colors.red.toString(16);
				if (red.length==1) red = '0'+red;
				let green = colors.green.toString(16);
				if (green.length==1) green = '0'+green;
				let blue = colors.blue.toString(16);
				if (blue.length==1) blue = '0'+blue;
				let alpha = colors.alpha.toString(16);
				console.log(red,green,blue,alpha);
				return{
					red:red,
					green:green,
					blue:blue,
					alpha:alpha,
					type: type
				}
			}
		}

		simplePx.getColor = function (data,x,y,type,alpha)
		{
			const colors = this.getConvertedValues(data,x,y,type);
			let color;
			if (type===undefined) type = 'rgb';
			if (alpha === undefined) alpha = false;
			if (type == 'rgb')
			{
				color = 'rgb';
				if (alpha) color+='a';
				color+='(';
				color+=colors.red.toString(); color+=',';
				color+=colors.green.toString(); color+=',';
				color+=colors.blue.toString();
				if (alpha) 
					{
						color+=','; 
						color+=colors.alpha;
					}
				color+=')';
			}
			else if (type == 'hex')
			{
				color = '#';
				color+=colors.red;
				color+=colors.green;
				color+=colors.blue;
				if (alpha) color+=colors.alpha;
			}
			return color;
		}

		function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
    } : null;
}

		simplePx.setColor = function (data,x,y,value)
		{
			let redOfChosenPixel = ((y-1)*(data.width*4))+((x-1)*4);
			if (typeof value === 'object')
			{	
				if (value.type === undefined)
				{
					data.data[redOfChosenPixel] = value.red;
					data.data[redOfChosenPixel+1] = value.green;
					data.data[redOfChosenPixel+2] = value.blue;
					data.data[redOfChosenPixel+3] = value.alpha;
				}
				if (value.type == 'rgb')
				{
					data.data[redOfChosenPixel] = value.red;
					data.data[redOfChosenPixel+1] = value.green;
					data.data[redOfChosenPixel+2] = value.blue;
					data.data[redOfChosenPixel+3] = Math.round(value.alpha*255);
				}
				else if (value.type == 'hex')
				{
					console.log(value);
					data.data[redOfChosenPixel] = parseInt(value.red,16);
					data.data[redOfChosenPixel+1] = parseInt(value.green,16);
					data.data[redOfChosenPixel+2] = parseInt(value.blue,16);
					data.data[redOfChosenPixel+3] = parseInt(value.alpha,16);
				}
				else return false;
			}
			if (typeof value === 'string')
			{
				let a;
				if (value[0]=='#') a = hexToRgb(value);
				else
				{
					let b = value.split("(")[1].split(")")[0];
					b = b.split(",");
					a = {
						red : b[0],
						green : b[1],
						blue : b[2],
						alpha: b[3]
					}
				}
				data.data[redOfChosenPixel] = a.red;
				data.data[redOfChosenPixel+1] = a.green;
				data.data[redOfChosenPixel+2] = a.blue;
				if (a.alpha!=undefined)data.data[redOfChosenPixel+3] = a.alpha;
				else data.data[redOfChosenPixel+3] = 255;
			}
		}


    return simplePx;
  }

  if(typeof(window.simplePx) === 'undefined'){
    window.simplePx = simplePixel();
  }
})(window); 