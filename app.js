var gl, program;

var color = [0.6, 0.0, 0.9, 0.95];
var thetaLoc; // a "pointer" to the shader variable theta

var theta; // the angle theta in CPU
var isDirCockwise=false;
var stopB=false;
var delay=50;
var xSize = 0.8, ySize = 0.8, zSize = 1.0;
var xP = 0.0, yP = 0.0, zP = 0.0;
	

var vertices = new Float32Array(
	[
		-0.3,0.4,
		-0.4,0.4,
		-0.4,-0.4,
		-0.4,-0.4,
		-0.3,-0.4,
		-0.3,0.4,
		//
		-0.4,0.4,
		0.0,0.3,
		0.0,0.4,
		-0.4,0.3,
		-0.4,0.4,
		0.0,0.3,
		//
		0.0,0.3,
		0.0,0.0,
		-0.1,0.3,
		0.0,0.0,
		-0.1,0.0,
		-0.1,0.3,
		//
		-0.4,0.0,
		-0.1,0.0,
		-0.4,0.1,
		-0.4,0.1,
		-0.1,0.1,
		-0.1,0.0,
		//
		-0.4,0.2,
		-0.1,-0.4,
		0.0,-0.4,
		//
		0.3,0.4,
		0.4,0.4,
		0.4,-0.4,
		0.4,-0.4,
		0.3,-0.4,
		0.3,0.4,
		//
		0.6,0.4,
		0.7,0.4,
		0.7,-0.4,
		0.7,-0.4,
		0.6,-0.4,
		0.6,0.4,
		//
		0.4,0.4,
		0.7,-0.4,
		0.6,-0.4,
		0.4,0.3,
		0.4,0.4,
		0.6,-0.4,

	   
	]
);


window.onload = function main() {

	var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext( "webgl" );
    if (!gl) { alert("WebGL isn’t available"); }


   gl.viewport(0, 0, canvas.width, canvas.height); 


    program = initShaders(gl, "vertex-shader", "fragment-shader"); 
    gl.useProgram(program);

	var myButton =document.getElementById("DirectionButton");
	myButton.addEventListener("click",function(){
		isDirCockwise=!isDirCockwise;});
	
	document.getElementById("slide").onchange= function(){
		delay = 100-this.value;
	};
	

	var stopButton =document.getElementById("StopButton");
	stopButton.addEventListener("click",function(){
		stopB=!stopB;
	})
	var trUp=document.getElementById("up");
	trUp.addEventListener("click",function(){
		yP+=0.1;
	});    
	var trDown=document.getElementById("down");
	trDown.addEventListener("click",function(){
		yP-=0.1;
	});
	var trRight=document.getElementById("right");
	trRight.addEventListener("click",function(){
		xP+=0.1;
	});
	var trLeft=document.getElementById("left");
	trLeft.addEventListener("click",function(){
		xP-=0.1;
	});
	
	document.getElementById("scalex").onchange= function(){
		xSize=this.value;
		
	};
	document.getElementById("scaley").onchange= function(){
		
		ySize=this.value;
	};
	
    var vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition"); 
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(vPosition);

    window.addEventListener("keydown", checkKeyPressed); 

	thetaLoc = gl.getUniformLocation( program, "theta" ); 
 	theta = 0.0;

    render();
}

function render() {
    
	setTimeout(function(){
		var Matrix = new Float32Array([
			xSize,   0.0,  0.0,  0.0,
			0.0,  ySize,   0.0,  0.0,
			0.0,  0.0,  zSize,   0.0,
			0.0,  0.0,  0.0,  1.0  
		]);
		
		requestAnimationFrame(render);
		 
		gl.clear( gl.COLOR_BUFFER_BIT ); // Clear Background
	 	var colorLocation = gl.getUniformLocation(program, "u_color"); 
		gl.uniform4fv(colorLocation, color); 
		var u_Matrix = gl.getUniformLocation(program, 'scale');
		gl.uniformMatrix4fv(u_Matrix, false, Matrix);
		var translation = gl.getUniformLocation(program, 'translation');
		gl.uniform4f(translation, xP, yP, zP, 0.0);
		
	theta+=(stopB ? 0.0 : (isDirCockwise ? -0.1 : 0.1));
	
	
	gl.uniform1f( thetaLoc, theta ); // access the variable and pass value
	gl.clearColor(0.2,0.9,0.8,1.0); //canvas background color
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES ,0,45);//draw the lines
	 
 
 
 },delay);
    
    
}

function checkKeyPressed(e) {

   if (e.keyCode == "32") {
        color = [Math.random(), Math.random(), Math.random(), 1.0];
    }
	else if (e.keyCode == "66") {
        color = [0.0, 0.0, 1.0, 1.0];
    }
	else if (e.keyCode == "71") {
        color = [0.4, 1.0, 0.0, 1.0];
    }
	else if (e.keyCode == "82") {
        color = [1.0,0.0,0.0, 1.0];
    }
}
