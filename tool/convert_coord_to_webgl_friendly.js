//* PASTE THIS CODE TO WEB CONSOLE AND CALL convert(...) WITH JSON'S URL RESULT FROM svg_to_json.js
// ! scaling salah, rasio webgl tidak selalu persegi

function to_webgl_coord(json, min_x_webgl, min_y_webgl, canvas_size) {
    /**
     * JSON STRUCTURE
     * 
     * {
     *      'data' : [
     *              [[layer_1_coordinate], 'layer_1_color'],
     *              [[layer_2_coordinate], 'layer_2_color'],
     *              ....
     *       ]
     * }
     */
    let data = json.data
    let min_x = undefined
    let min_y = undefined
    let max_x = undefined
    let max_y = undefined

    // FIND THE BIGGEST COORDINATE
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i][0].length; j++) {
            // for (let k = 0; k < data[i][0][j].length; k++) {
            //     if (max == undefined) {
            //         max = data[i][0][j][k];
            //     } else if (max < data[i][0][j][k]) {
            //         max = data[i][0][j][k];
            //     }
            // }
            if (min_x == undefined) {
                min_x = data[i][0][j][0];
            } else if (min_x > data[i][0][j][0]) {
                min_x = data[i][0][j][0];
            }
            
            if (max_x == undefined) {
                max_x = data[i][0][j][0];
            } else if (max_x < data[i][0][j][0]) {
                max_x = data[i][0][j][0];
            }
            
            if (min_y == undefined) {
                min_y = data[i][0][j][1];
            } else if (min_y > data[i][0][j][1]) {
                min_y = data[i][0][j][1];
            }

            if (max_y == undefined) {
                max_y = data[i][0][j][1];
            } else if (max_y < data[i][0][j][1]) {
                max_y = data[i][0][j][1];
            }

        }
    }

    let y_size = Math.abs(max_y - min_y);
    let x_size = Math.abs(max_x - min_x);

    // Hitung rasio scale
    let ratio_scale = 1.0
    if (y_size > x_size) {
        ratio_scale = y_size / canvas_size
    } else {
        ratio_scale = x_size / canvas_size
    }

    // CONVERT COORDINATE
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i][0].length; j++) {
            data[i][0][j][0] = min_x_webgl + (data[i][0][j][0] - min_x) * ratio_scale;
            data[i][0][j][1] = min_y_webgl + (data[i][0][j][1] - min_y) * ratio_scale;
        }
    }

    var result = JSON.stringify(json);
    var blob = new Blob([result], {type: "application/json"});
    console.log(`Go to ${URL.createObjectURL(blob)} to download the text`)
}

function convert(json_url, min_webgl_x, min_webgl_y, max_webgl_size) {
    fetch(json_url)
        .then(response => response.json())
        .then(json => to_webgl_coord(json, min_webgl_x, min_webgl_y, max_webgl_size));
}