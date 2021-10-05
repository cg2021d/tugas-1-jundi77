//* PASTE THIS CODE TO WEB CONSOLE AND CALL convert(...) WITH JSON'S URL RESULT FROM svg_to_json.js

function to_webgl_coord(json, min_x, min_y, canvas_size) {
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
    let max = undefined

    // FIND THE BIGGEST COORDINATE
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i][0].length; j++) {
            for (let k = 0; k < data[i][0][j].length; k++) {
                if (max == undefined) {
                    max = data[i][0][j][k];
                } else if (max < data[i][0][j][k]) {
                    max = data[i][0][j][k];
                }
            }
        }
    }

    console.log('MAX is: ' + max)

    // CONVERT COORDINATE
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i][0].length; j++) {
            data[i][0][j][0] = min_x + data[i][0][j][0] / max * canvas_size;
            data[i][0][j][1] = min_y + data[i][0][j][1] / max * canvas_size;
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