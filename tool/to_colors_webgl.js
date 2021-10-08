function to_webgl_colors(data) {
    let colors = []
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i][0].length / 2; j++) {
            colors.push(...data[i][1])
        }
        colors.push(0.0, 0.0, 0.0, 0.0)
    }

    return colors
}