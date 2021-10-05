// daging_l
// daging_r

function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    /*
        A(-0.5, 0.5)
        B(0.5, 0.5)
        C(0.5, -0.5)
        D(-0.5, -0.5)
    */

    var vertices = [
        -0.5, 0.5, 1.0, 0.0, 0.0,   // A
        0.5, 0.5, 1.0, 0.0, 0.0,    // B
        0.5, -0.5, 0.0, 1.0, 0.0,   // C
        -0.5, -0.5, 0.0, 0.0, 1.0   // D
    ];

    // Linked list for vertices
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uChange;

        void main() {
            gl_Position = vec4(aPosition + uChange, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Preparing .exe
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false,1 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    var speedRaw = 1;
    var speed = speedRaw / 600;
    var change = 0;
    var uChange = gl.getUniformLocation(shaderProgram, "uChange");

    function render() {
        /*setTimeout(function() {
            
            . . . (isi codingan)

            render();
        }, 1000 / 60);
    }

    render();
    */
		// START
        if (change >= 0.5 || change <= -0.5) {
            speed = -speed;
        }
        
        change = change + speed;
        gl.uniform1f(uChange, change);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
		// END -> buat isi codingan setTimeout
    }

    setInterval(render, 1000 / 60);
}
