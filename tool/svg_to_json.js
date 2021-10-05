//! ONLY WORKS FOR SVG THAT ONLY HAS M (MOVE) AND L (LINE)
//* OPEN THE SVG FILE IN BROWSER AND THEN PASTE THIS CODE TO CONSOLE

// Download script provided by https://stackoverflow.com/a/34156339
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    URL.revokeObjectURL(a.href)
}

var paths = document.getElementsByTagName('svg')[0].getElementsByTagName('path')
var result = {'data' : []}

/**
 * RESULT STRUCTURE
 * 
 * {
 *      'data' : [
 *              [[layer_1_coordinate], 'layer_1_color'],
 *              [[layer_2_coordinate], 'layer_2_color'],
 *              ....
 *       ]
 * }
 */

for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    var color = path.style.fill;
    var path_d = path.getAttribute('d')

    path_d = path_d.replace('z', '')
    path_d = path_d.split('        M ')

    // skip first element, empty string
    for (let j = 1; j < path_d.length; j++) {
        let part_d = path_d[j].split('         L ')
    
        if (part_d.length == 0) continue;
        coords = []

        for (var k = 0; k < part_d.length; k++) {
            let coord = part_d[k].split(' ');
            for (let l = 0; l < coord.length; l++) {
                coord[l] = parseFloat(coord[l])
            }
            coords.push(coord)
        }
    
        result.data.push([coords, color]);
    }
}


var json = JSON.stringify(result);
var blob = new Blob([json], {type: "application/json"});
console.log(`Go to ${URL.createObjectURL(blob)} to download the text`)