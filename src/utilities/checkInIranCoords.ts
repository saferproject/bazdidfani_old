const iranBoundaries = [
    [25.0, 60.0],
    [29.9, 61.5],
    [31.5, 61.0],
    [33.4, 60.9],
    [35.9, 61.8],
    [36.5, 61.0],
    [37.0, 59.0],
    [37.5, 54.0],
    [38.5, 48.0],
    [39.2, 44.8],
    [38.0, 44.0],
    [37.5, 44.5],
    [35.0, 45.5],
    [34.0, 45.0],
    [32.0, 47.0],
    [30.0, 49.0],
    [29.0, 50.0],
    [27.0, 56.0],
    [25.0, 60.0],
  ];

export const isPointInPolygon = (point: number[]) => {
    const x = point[0];
    const y = point[1];
    let inside = false;

    for (let i = 0, j = iranBoundaries.length - 1; i < iranBoundaries.length; j = i++) {
        const xi = iranBoundaries[i][0];
        const yi = iranBoundaries[i][1];
        const xj = iranBoundaries[j][0];
        const yj = iranBoundaries[j][1];

        const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
    }

    return inside;
};