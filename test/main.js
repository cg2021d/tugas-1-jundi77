function flatten_data_daging(data) {
    let flatted = []
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i][0].length; j++) {
            flatted.push(...data[i][0][j])
        }
    }

    return flatted
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} vsSource 
 * @param {*} fsSource 
 * 
 * @return {WebGLProgram}
 */
function initShaderProgram(gl, vsSource, fsSource) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    // Buat program
    let shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Gagal membuat program shader: ' + gl.getProgramInfoLog(shaderProgram))
        return null
    }

    return shaderProgram
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} type 
 * @param {*} source 
 * 
 * 
 */
function loadShader(gl, type, source) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('Shader gagal dikompilasi: ' + gl.getShaderInfoLog(shader))
        gl.detachShader(shader)
        return null
    }

    return shader
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function initBuffers(gl, bufferType, positions) {
    let positionBuffer = gl.createBuffer()
    gl.bindBuffer(bufferType, positionBuffer)
    gl.bufferData(
        bufferType,
        new Float32Array(positions),
        gl.STATIC_DRAW
    )

    //! Kehabisan ide untuk cara mewarnai
    // let colors = [
    //     1,
    // ];
    // let colorBuffer = gl.createBuffer()
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    // gl.bufferData(
    //     gl.ARRAY_BUFFER,
    //     new Float32Array(colors),
    //     gl.STATIC_DRAW
    // )
    return {
        position: {
            buffer: positionBuffer,
            length: positions.length
        },
        // color: {
        //     buffer: colorBuffer,
        //     length: colors.length
        // },
    }
}

var speed = 0.0144;
var change = 0;
var uChange = undefined;
/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0) // eraser dengan warna hitam
    gl.clear(gl.COLOR_BUFFER_BIT)

    let numComponents = 2 // ambil 2 value per iterasi
    let type = gl.FLOAT // data di buffer tipenya apa
    let normalize = false
    let stride = 0 // how many bytes to get from one set of values to the next, 0 = pakai type dan numComponents yang telah disediakan
    let offset = 0 // how many bytes inside the buffer to start from
    
    for (let i = 0; i < buffers.length; i++) {
        const element = buffers[i];
        gl.bindBuffer(gl.ARRAY_BUFFER, element.position.buffer)
        if (i == 1) {
            // Tidak bergerak?
            if (change >= 1 || change <= -1) {
                speed = -speed;
            }

            change = change + speed;
            gl.uniform1f(uChange, change);
            console.log(change)
        }
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
        gl.useProgram(programInfo.program)

        let draw_offset = 0
        let vertexCount = element.position.length / 2
        gl.drawArrays(gl.TRIANGLE_FAN, draw_offset, vertexCount)
        
    }
    // let color_numComponents = 2 // ambil 2 value per iterasi
    // let color_type = gl.FLOAT // data di buffer tipenya apa
    // let color_normalize = false
    // let color_stride = 0 // how many bytes to get from one set of values to the next, 0 = pakai color_type dan color_numComponents yang telah disediakan
    // let color_offset = 0 // how many bytes inside the buffer to start from

    // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color.buffer)
    // gl.vertexAttribPointer(
    //     programInfo.attribLocations.vertexColor,
    //     color_numComponents,
    //     color_type,
    //     color_normalize,
    //     color_stride,
    //     color_offset
    // )
    // gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
// console.log(buffers.position.buffer)
}

function main() {
    const vsSource = `
        attribute vec2 aVertexPosition;
        attribute vec4 aVertexColor;

        varying lowp vec4 vColor;
        uniform float uChange;

        void main() {
            gl_Position = vec4(aVertexPosition.x, aVertexPosition.y + uChange, 1.0, 1.0);
            vColor = aVertexColor;
        }
    `;

    const fsSource = `
        varying lowp vec4 vColor;

        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    var canvas = document.querySelector('#glCanvas')

    /**
     * @type {WebGLRenderingContext}
     */
    var gl = canvas.getContext("webgl")

    if (gl === null) {
        alert("Browser tidak mendukung webgl")
        return
    }

    let shaderProgram = initShaderProgram(gl, vsSource, fsSource)
    let programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            uChange: gl.getUniformLocation(shaderProgram, "uChange"),
        },
    }

    // BG hitam
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // Clear color buffer dengan cleaer color
    gl.clear(gl.COLOR_BUFFER_BIT)

    let buffers = initBuffers(gl, gl.ARRAY_BUFFER, flatten_data_daging(daging_l.data))
    let buffers2 = initBuffers(gl, gl.ARRAY_BUFFER, flatten_data_daging(daging_r.data))

    function render(now) {
        drawScene(gl, programInfo, [buffers, buffers2])
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}

window.onload = main