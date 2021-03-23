"use strict";
	const drawApp =
		{
			getElementPosition: function(obj) 
			{
		        let top = 0;
		        let left = 0;
		        while (obj && obj.tagName != "BODY") 
		        {
		            top += obj.offsetTop - obj.scrollTop;
		            left += obj.offsetLeft - obj.scrollLeft;
		            obj = obj.offsetParent;
		        }

		        const borderTop = parseInt(this.canvasMain.style.borderLeftWidth);
		        const borderLeft = parseInt(this.canvasMain.style.borderLeftWidth);
		        if (!(isNaN(borderTop)||isNaN(borderLeft)))
		        {
		        top+=parseInt(this.canvasMain.style.borderTopWidth);	//border handler
		        left+=parseInt(this.canvasMain.style.borderLeftWidth);	//border handler
		    	}
		        return {
		            top: top,
		            left: left
		        };
	    	},

	   		getMousePosition: function(e)
	   		{
		        const mouseX = e.pageX - this.getElementPosition(this.canvasMain).left;
		        const mouseY = e.pageY - this.getElementPosition(this.canvasMain).top;
		        return {
		            x: mouseX,
		            y: mouseY
		        };
	       	},

			backgroundColor: '#ffffff',

				changeBackgroundColor: function (e)
				{
					const color = this.settingsElements[2].value;
					this.ctxBg.fillStyle = color;
					this.ctxBg.fillRect(0, 0, this.canvasBackground.width, this.canvasBackground.height);
					this.backgroundColor = color;
				},

			createCanvas: function()
			{
				const element = document.createElement('canvas');
				element.width = this.drawSpace.offsetWidth;
				element.height = this.drawSpace.offsetHeight;
				element.style.border = "50px solid dimgray";
				return element;
			},

			previewDraw: function(e)
			{
				this.ctxTemp.clearRect(0,0,this.canvasTemp.width,this.canvasTemp.height);
				const mousePos = this.getMousePosition(e);
				this.ctxTemp.beginPath();
				this.ctxTemp.moveTo(this.startX,this.startY);

				if (this.drawingMode == 'draw'||this.drawingMode == 'line')
					{
						this.ctxTemp.lineWidth = 1;
						this.ctxTemp.fillStyle = this.ctxTemp.strokeStyle;
						this.ctxTemp.beginPath();
						this.ctxTemp.arc(mousePos.x,mousePos.y,this.drawWidth/2,0,2*Math.PI);
						this.ctxTemp.stroke();
						this.ctxTemp.fill();
						this.ctxTemp.closePath();
						this.ctxTemp.lineWidth = this.drawWidth;
					}
				else if (this.drawingMode == 'erase')
					{
						const width = this.drawWidth;
						this.ctxTemp.lineWidth = 5;
						this.ctxTemp.strokeStyle = "#000000";
						this.ctxTemp.fillStyle = this.backgroundColor;
						this.ctxTemp.rect(mousePos.x-(width/2),mousePos.y-(width/2),width-1,width-1);
						this.ctxTemp.stroke();
						this.ctxTemp.fill();
					}
				},

			shiftcolors: function(e)
			{
				const tempFill = this.ctxTemp.fillStyle;
				this.ctxTemp.fillStyle = this.ctxTemp.strokeStyle;
				this.ctxTemp.strokeStyle = tempFill;
			},

			mousemove: function(e)
			{

				this.ctxTemp.strokeStyle = this.colorFirst;
				this.ctxTemp.fillStyle = this.colorSecond;
				if (this.shiftDraw) this.shiftcolors();
				this.ctxTemp.clearRect(0,0,this.canvasTemp.width,this.canvasTemp.height);
				this.ctxTemp.lineWidth = this.drawWidth;
				const mousePos = this.getMousePosition(e);
				if (this.drawOn)
				{
					if (this.drawingMode=='draw')
					{ 	
						if (!this.ctrlDraw)
						{
							this.ctxTemp.bezierCurveTo(mousePos.x,mousePos.y,mousePos.x,mousePos.y,mousePos.x,mousePos.y);
							if (this.rightClick) this.shiftcolors();
							this.ctxTemp.stroke();
						}
						else
						{
							this.ctxTemp.beginPath();
								if (this.rightClick) this.shiftcolors();
								
								this.ctxTemp.lineWidth = this.drawWidth;
							if (this.curveClick==false) 
							{
								this.ctxTemp.moveTo(this.startX,this.startY);
								this.curveBufor = 
								{
									startX: this.startX, 
									startY: this.startY,
									endX:mousePos.x,
									endY:mousePos.y
								};
								this.ctxTemp.lineTo(mousePos.x,mousePos.y);
							}
							
							else
							{
								this.ctxTemp.bezierCurveTo(this.curveBufor.startX,	this.curveBufor.startY,		mousePos.x,	mousePos.y,	this.curveBufor.endX,	this.curveBufor.endY);
								/*
								this.ctxTemp.moveTo(this.curveBufor.startX,this.curveBufor.startY);
								this.ctxTemp.quadraticCurveTo(mousePos.x,mousePos.y,this.curveBufor.endX,this.curveBufor.endY);*/
							}
							this.ctxTemp.stroke();
						}
					}
					if (this.drawingMode=='erase')
					{
						this.previewDraw(e);
						this.ctx.beginPath();
						this.ctx.clearRect(mousePos.x-(this.drawWidth/2),mousePos.y-(this.drawWidth/2),this.drawWidth,this.drawWidth);
					}
					else if (this.drawingMode == 'line')
					{
						this.ctxTemp.beginPath();
						if (this.rightClick) this.shiftcolors();
						this.ctxTemp.moveTo(this.startX,this.startY);
						this.ctxTemp.lineWidth = this.drawWidth;
						if (this.ctrlDraw)
						{
							const offY = mousePos.y-this.startY;
							const offX = mousePos.x-this.startX;
							if (Math.abs(offX)<0.3*Math.abs(offY)) this.ctxTemp.lineTo(this.startX,this.startY+offY);
							else if (Math.abs(offX)<1.9*Math.abs(offY)) 
								{
									if (offX*offY>0) this.ctxTemp.lineTo(this.startX+offY,this.startY+offY);
									else this.ctxTemp.lineTo(this.startX+offY*(-1),this.startY+offY);
								}

							else 
								{
									this.ctxTemp.lineTo(this.startX+offX,this.startY);
								}
								
						}
						else 
						{
							this.ctxTemp.lineTo(mousePos.x,mousePos.y);
						}
						this.ctxTemp.closePath();
						this.ctxTemp.stroke();
					}
					else if (this.drawingMode == 'square')
					{
						this.ctxTemp.beginPath();
						this.ctxTemp.lineCap = 'butt';
						this.ctxTemp.lineJoin = 'miter';
						this.ctxTemp.moveTo(this.startX,this.startY);
						this.ctxTemp.lineWidth = this.drawWidth;
						if (this.ctrlDraw)
						{
							const offY = mousePos.y-this.startY;
							const offX = mousePos.x-this.startX;
							if (offX*offY>=0) this.ctxTemp.rect(this.startX,this.startY,offY,offY);
							else this.ctxTemp.rect(this.startX,this.startY,offY*(-1),offY);
						}
						else
						{
							this.ctxTemp.rect(this.startX,this.startY,mousePos.x-this.startX,mousePos.y-this.startY)
						}
						this.ctxTemp.closePath();
						if (this.rightClick) this.ctxTemp.fill();
						this.ctxTemp.stroke();
					}
					else if (this.drawingMode == 'circle')
					{
						this.ctxTemp.beginPath();
						this.ctxTemp.lineWidth = this.drawWidth;
						if (this.ctrlDraw)
						{
						const x = mousePos.x-this.startX;
						const y = mousePos.y-this.startY;
						//const radius = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))/2;
						const radius = Math.max(Math.abs(x),Math.abs(y))/2;
						this.ctxTemp.arc(this.startX+(x/2),this.startY+(y/2),radius,0,2*Math.PI);
						}
						else
						{
							const kappa = 0.5522848;

							const offX = mousePos.x-this.startX;
							const offY = mousePos.y-this.startY;

							const ox = (offX / 2) * kappa; // control point offset horizontal
						    const oy = (offY / 2) * kappa; // control point offset vertical
						    const xe = this.startX + offX;  // x-end
						    const ye = this.startY + offY;  // y-end
						    const xm = this.startX + offX / 2; // x-middle
						    const ym = this.startY + offY / 2; //y-middle

							this.ctxTemp.moveTo(this.startX , ym);
							this.ctxTemp.bezierCurveTo(this.startX , ym - oy, xm - ox, this.startY, xm, this.startY);
							this.ctxTemp.bezierCurveTo(xm + ox, this.startY, xe, ym - oy, xe, ym);
							this.ctxTemp.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
							this.ctxTemp.bezierCurveTo(xm - ox, ye, this.startX , ym + oy, this.startX , ym);
						}
						this.ctxTemp.closePath();
						if(this.rightClick) this.ctxTemp.fill();
						this.ctxTemp.stroke();
					}
					else if (this.drawingMode == 'triangle')
					{
						this.ctxTemp.beginPath();
						this.ctxTemp.moveTo(this.startX,this.startY);
						this.ctxTemp.lineWidth = this.drawWidth;
						if (this.ctrlDraw) //draws equilateral triangle
						{
							const offX = mousePos.x-this.startX;
							const offY = mousePos.y-this.startY;
							let height = offX*Math.sqrt(3)/2;
							if (!(offX*offY>=0))
							{
								height*=(-1);
							}
								this.ctxTemp.lineTo(mousePos.x,this.startY);
							this.ctxTemp.moveTo(this.startX,this.startY);
								this.ctxTemp.lineTo(this.startX+(offX/2),this.startY+height);
								this.ctxTemp.lineTo(mousePos.x,this.startY);
						}
						else
						{
							const base = mousePos.x-this.startX;
								this.ctxTemp.lineTo(this.startX+(base/2),mousePos.y) //left leg of triangle
							this.ctxTemp.moveTo(this.startX,this.startY);
								this.ctxTemp.lineTo(mousePos.x,this.startY); //base of triangle
								this.ctxTemp.lineTo(this.startX+(base/2),mousePos.y); //right leg of triangle
						}
						this.ctxTemp.closePath();
						if(this.rightClick) this.ctxTemp.fill();
						this.ctxTemp.stroke();
					}
				}

				else 
				{
					this.previewDraw(e);
				}
			},

			colortake: function()
			{
				const pixelData = this.ctx.getImageData(0,0,this.canvasMain.width,this.canvasMain.height);
					let colorValue = simplePx.getColor(pixelData,this.startX,this.startY,'hex');
					if (colorValue!=false)
					{
						if (this.shiftDraw||this.rightClick) 
							{
								this.settingsElements[1].value = colorValue;
								this.colorSecond = this.settingsElements[1].value;
							}
						else 
							{
								this.settingsElements[0].value = colorValue;
								this.colorFirst = this.settingsElements[0].value;
							}
						console.log(colorValue);
					}
			},

			mouseOn: function(e)
			{
				const clickPos = this.getMousePosition(e);
				this.startX = clickPos.x;
				this.startY = clickPos.y;

				if (e.which === 3) this.rightClick = true;
				if (this.drawingMode=='colortake')
				{
					this.colortake();
					return false;
				}

				this.drawOn = true;
				this.ctxTemp.closePath();
				this.ctx.closePath();

				this.ctxTemp.moveTo(this.startX,this.startY);
				this.ctxTemp.beginPath();

				this.mousemove(e);
			},

			manageUndo: function(canvas)
			{
				this.undoredo[0].classList.remove('off');
				for (let i = 0; i < this.undoIndex ; i++)
				{
					this.versions.shift();
				}
				this.undoIndex = 0;
				this.undoredo[1].classList.add('off');
				if(this.versions.unshift(canvas.toDataURL())>15) this.versions.pop();
			},

			undo: function(e,t)
			{
				if (t===undefined)
				{
					if (e.target.parentNode.id == 'undo') t=true;
					else if (e.target.parentNode.id == 'redo') t=false;
					else return false;
				}
				if (!t&&this.undoIndex!=0) this.undoIndex--;
				else if (t&&this.undoIndex<this.versions.length-1) this.undoIndex++; 
				else return false;
				var img_data = this.versions[this.undoIndex];
				var undo_img = new Image();
				undo_img.src = img_data.toString();
				this.ctx.clearRect(0,0,this.canvasMain.width,this.canvasMain.height);
				undo_img.onload = function(){this.ctx.drawImage(undo_img,0,0)}.bind(this);

				if (this.undoIndex==0) this.undoredo[1].classList.add('off');
				else this.undoredo[1].classList.remove('off');

				if (this.undoIndex>=this.versions.length-1) this.undoredo[0].classList.add('off');
				else this.undoredo[0].classList.remove('off');
			},

			mouseOff: function(e)
			{	
				if (this.ctrlDraw&&this.drawingMode == 'draw'||e.key=='Escape')
				{
					if (e.type == 'mouseout') return false;
					if (!this.curveClick)
						{
							this.curveClick = true;
							return false;
						}
					else
					{
						this.curveClick = false;
						this.curveBufor = undefined;
					}
					
				}

				this.shiftDraw = false;
				this.ctrlDraw = false;



				if (e.key!='Escape'&&this.drawOn&&this.drawingMode!='erase'&&e.type!='focus'&&e.target.tagName=='CANVAS') 
					{
						this.ctx.drawImage(this.canvasTemp,0,0);
						this.manageUndo(this.canvasMain);
					}
				if (this.drawingMode!='erase') this.ctxTemp.clearRect(0,0,this.canvasTemp.width,this.canvasTemp.height);

				if (e.type!='mouseout') this.rightClick = false;
				this.drawOn = false;
				this.tempDefaultSettings();
			},

			mouseAway: function(e)
			{
				if(this.drawOn)
				{
					if(this.drawingMode=='draw')
						{
							this.mouseOff(e);
							this.ctxTemp.beginPath();
							this.drawOn=true;
						}
					}
				else
				{
					this.ctxTemp.clearRect(0,0,this.canvasTemp.width,this.canvasTemp.height);
				}
			},

			changeDrawingMode: function(e,keyId)
			{
				this.drawOn = false;
				let element;
				if (keyId === undefined)
				{
				if (e.target.classList[0] == 'draw_functions') element = e.target;
				else if ( e.target.parentNode.classList[0] == 'draw_functions') element = e.target.parentNode;
				else return false;
				}
				else element = this.modeElements[keyId];
				this.ctxTemp.clearRect(0,0,this.canvasTemp.width,this.canvasTemp.height);
				const type = element.id;
				if (type!=this.drawingMode)
					{
						this.modeElements[this.modeIDs.indexOf(this.drawingMode)].classList.remove('chosenmode');
						this.drawingMode = type;
						element.classList.add('chosenmode');
					}
				if (this.drawingMode=='colortake') this.drawSpace.style.cursor = 'cell';
				else this.drawSpace.style.cursor = 'default';
			},

			changeDrawingModeByClick: function(e, id)
			{
				this.modeIDs
			},
 
			changeSettings: function(e)
			{
				this.drawWidth = this.settingsElements[3].value;
				document.getElementById('widthValue').innerText=this.drawWidth;
				localStorage.setItem('drawwidthvalue',this.drawWidth);
				if (!this.drawOn) this.previewDraw(e);
			},

			changeColor: function(e)
			{
				if (e.target.id == 'color_first') 
					{
						this.colorFirst = e.target.value;
						localStorage.setItem('colorfirstvalue',e.target.value);
					}
				else if (e.target.id == 'color_second')
					{
						this.colorSecond = e.target.value;
						localStorage.setItem('colorsecondvalue',e.target.value);
					}
			},

			switchColor: function(e)
			{
				const temp = this.settingsElements[1].value;
					this.settingsElements[1].value = this.settingsElements[0].value;
					this.settingsElements[0].value = temp;

					this.colorFirst = this.settingsElements[0].value;
					this.colorSecond = this.settingsElements[1].value;
			},

			keyboardOn: function(e)
			{
				if (e.shiftKey) this.shiftDraw = true;
				else if (e.key == 'Escape') this.mouseOff(e);
				else if (e.key == 'Control') this.ctrlDraw = true;
				else if (e.key == 'Z' || e.key == 'z') this.undo(e,true);
				else if (e.key == 'Y' || e.key == 'y') this.undo(e,false);
			},

			keyboardOff: function(e)
			{
				if (e.key == 'Shift') 
					{
						this.shiftDraw = false;
					}
				else if (e.key == 'Control')
					{
						this.ctrlDraw = false;
					}

				else if (parseInt(e.key)>=1 &&parseInt(e.key)<=this.modeIDs.length)
					{
						this.changeDrawingMode(e,parseInt(e.key)-1);
					}

				else if (e.key == 's' || e.key == 'S')
				{
					document.getElementById('downloadimage').firstElementChild.click();
				}

				else if (e.key == 'q' || e.key == 'Q')
				{
					this.settingsElements[0].click(); //first color change
				}

				else if (e.key == 'w' || e.key == 'W')
				{
					this.settingsElements[1].click(); //second color change
				}

				else if (e.key == 'e' || e.key == 'E')
				{
					this.settingsElements[2].click(); //background color change
				}

				else if (e.key == 'e' || e.key == 'E')
				{
					this.settingsElements[2].click(); //background color change
				}

				else if (e.key == 'r' || e.key == 'R')
				{
					this.switchColor(e);
				}				
			},

			wheel: function(e)
			{
				if (!this.ctrlDraw)
				{
					e.preventDefault(); 	
					if (e.wheelDeltaY != undefined)
					{
						this.settingsElements[3].value = parseInt(this.settingsElements[3].value)+(e.wheelDeltaY/120);
						this.changeSettings(e);
					}
				}
			},


			close: function(e)
			{
				e.preventDefault();
				this.drawOn = false;
				this.ctx.closePath();
				return false;
			},

			saveFile: function(e)
			{
				//this.ctxBg.drawImage(this.canvasMain,0,0);
				e.target.parentNode.setAttribute('href',this.canvasMain.toDataURL("image/png").replace("image/png", "image/octet-stream")); //return newest canvas version
			},

			attachEvents: function()
			{
				//drawing events
				this.drawSpace.addEventListener('mousedown',this.mouseOn.bind(this));
				document.addEventListener('mouseup',this.mouseOff.bind(this));
				window.addEventListener('focus',this.mouseOff.bind(this));
				//this.drawSpace.addEventListener('mouseout',this.mousemove.bind(this)); //obsolete
				this.drawSpace.addEventListener('mouseout',this.mouseAway.bind(this));

				this.drawSpace.parentNode.addEventListener('wheel',this.wheel.bind(this));

				this.drawSpace.addEventListener('contextmenu',this.close.bind(this),false);

				this.drawSpace.addEventListener('mousemove',this.mousemove.bind(this));

				this.undoredo = document.querySelectorAll('.undoredo');

				this.undoredo[0].addEventListener('click',this.undo.bind(this));
				this.undoredo[1].addEventListener('click',this.undo.bind(this));



				document.documentElement.addEventListener('keydown',this.keyboardOn.bind(this));
				document.documentElement.addEventListener('keyup',this.keyboardOff.bind(this));

				//settings
				this.settingsElements[2].addEventListener('change',this.changeBackgroundColor.bind(this));
				this.settingsElements[3].addEventListener('input',this.changeSettings.bind(this));

				this.settingsElements[0].addEventListener('change',this.changeColor.bind(this));
				this.settingsElements[1].addEventListener('change',this.changeColor.bind(this));

				document.getElementById('colorswitch').addEventListener('click',this.switchColor.bind(this));
				
				this.functionList.addEventListener('click',this.changeDrawingMode.bind(this));

				document.getElementById('downloadimage').setAttribute('download',this.defaultFileName);
				document.getElementById('downloadimage').firstElementChild.addEventListener('click',this.saveFile.bind(this));

				window.onbeforeunload = reload => true ? "" : undefined;

			},

			getModes: function()
			{
				this.modeElements = document.querySelectorAll('.draw_functions');
				this.modeElements[0].classList.add('chosenmode');
				this.modeIDs = [];
				for (let i = 0; i<this.modeElements.length; i++)
				{
					this.modeIDs.push(this.modeElements[i].id);
				}
				this.drawingMode = this.modeIDs[0];
				console.log(this.modeIDs);
			},

			getSettings: function()
			{
				this.settingsElements = document.querySelectorAll('.draw_settings');
				this.settingsIDs = [];
				for (let i = 0; i<this.settingsElements.length; i++)
				{
					this.settingsIDs.push(this.settingsElements[i].id);
				}
			},

			tempDefaultSettings: function()
			{
				this.ctxTemp.strokeStyle = this.colorFirst;
				this.ctxTemp.fillStyle = this.colorSecond;
				this.ctxTemp.lineWidth = this.drawWidth;

				this.ctxTemp.lineCap = "round";
				this.ctxTemp.lineJoin = "round";
			},

			defaultSettings: function()
			{
				this.changeBackgroundColor(); //background color changed to html value
				this.drawWidth = 5;	 //stroke width
				this.curveBufor = undefined;
				this.curveClick = false;
				if(localStorage.getItem('drawwidthvalue') != null) this.drawWidth = localStorage.getItem('drawwidthvalue');
				this.settingsElements[3].value = this.drawWidth;
				document.getElementById('widthValue').innerText=this.drawWidth;
				this.drawOn = false;

				this.versions = [];
				this.undoIndex = 0;
				this.manageUndo(this.canvasMain);
				this.undoredo[0].classList.add('off');

				this.colorFirst = '#000000';
				if (localStorage.getItem('colorfirstvalue') != null) this.colorFirst = localStorage.getItem('colorfirstvalue');
				this.settingsElements[0].value = this.colorFirst;

				this.colorSecond = '#ffffff';
				if (localStorage.getItem('colorsecondvalue') != null) this.colorSecond = localStorage.getItem('colorsecondvalue');
				this.settingsElements[1].value = this.colorSecond;

				this.shiftDraw = false;
				this.ctrlDraw = false;

				this.ctx.lineCap = "round";
				this.ctx.lineJoin = "round";

				this.tempDefaultSettings();
			},

			run: function ()
				{
					this.drawSpace = document.getElementById('draw_app_canvas');
					this.drawMenu = document.getElementById('draw_app_menu');
					this.functionList = document.getElementById('functionlist');

					this.defaultFileName = 'picture.png';	

					this.getModes();
					this.getSettings();

					this.canvasBackground = this.createCanvas();
					this.drawSpace.appendChild(this.canvasBackground);
					this.ctxBg = this.canvasBackground.getContext('2d');

					this.canvasMain = this.createCanvas();
					this.drawSpace.appendChild(this.canvasMain);
					this.ctx = this.canvasMain.getContext('2d');

					this.canvasTemp = this.createCanvas();
					this.drawSpace.appendChild(this.canvasTemp);
					this.ctxTemp = this.canvasTemp.getContext('2d');	

					this.attachEvents();
					this.defaultSettings();
				}
		};
