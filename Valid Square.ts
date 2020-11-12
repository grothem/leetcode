/* Given the coordinates of four points in 2D space, return whether the four points could construct a square.

The coordinate (x,y) of a point is represented by an integer array with two integers.

Example:

Input: p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,1]
Output: True

Note:

All the input integers are in the range [-10000, 10000].
A valid square has four equal sides with positive length and four equal angles (90-degree angles).
Input points have no order. */

type Point = {
    x: number,
    y: number
}

function validSquare(p1: number[], p2: number[], p3: number[], p4: number[]): boolean {
    const points = [p1, p2, p3, p4].map<Point>(p => {
        return {x: p[0], y: p[1]};
    });

    if (!allPointsUnique(points)) return false;

    // first we need to order the points in clock-wise order, starting with left-most point
    // Once we have the order, we can determine the distance between each point to figure out if it's a square
    // Use the Convex Hull algorithm
    const hullVerts: Point[] = [];
    const minimumX = minX(points);
    const indexOfMin = points.findIndex(p => p.x === minimumX);
    hullVerts.push(points[indexOfMin]);

    let l = indexOfMin;
    let q = (indexOfMin + 1) % points.length;

    for (let index = 0; index < points.length; index++) {
        for (let i = 0; i < points.length; i++) {
            if (l === i) continue;
            const d = direction(points[l], points[i], points[q]);
            const dli = distanceBetweenPoints(points[l], points[i]);
            const dlq = distanceBetweenPoints(points[l], points[q]);

            if (d > 0 || (d === 0 && dli > dlq))
                q = i;
        }
        // reset l to be the the next point we found to keep working our way around the shape
        l = q;
        // if we got back to where we started, just stop. Could happen because of collineality
        if (l === indexOfMin) break;
        hullVerts.push(points[q]);
    }

    // If we don't have the same number of verts, there's collinearity, and therefore definitely not square
    if (hullVerts.length !== points.length) return false;

    // Since we know the points are clock-wise order, we just need to know if all sides are equal and the diagonals are equal
    const perimiterDistances = [
        distanceBetweenPoints(hullVerts[0], hullVerts[1]),
        distanceBetweenPoints(hullVerts[1], hullVerts[2]),
        distanceBetweenPoints(hullVerts[2], hullVerts[3]),
        distanceBetweenPoints(hullVerts[3], hullVerts[0])
    ];

    const diagonalDistances = [
        distanceBetweenPoints(hullVerts[0], hullVerts[2]),
        distanceBetweenPoints(hullVerts[1], hullVerts[3])
    ];

    const perimiterDistancesEqual = perimiterDistances.every(value => value === perimiterDistances[0]);
    const diagonalDistanceEqual = diagonalDistances.every(value => value === diagonalDistances[0]);

    return perimiterDistancesEqual && diagonalDistanceEqual;
}

function allPointsUnique(points: Point[]): boolean {
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        for (let j = i + 1; j < points.length - 1; j++) {
            const p2 = points[j];
            if (p1.x === p2.x && p1.y === p2.y) return false;
        }
    }
    return true;
}

function distanceBetweenPoints(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function minX(points: Point[]): number {
    return Math.min(...points.map(p => p.x));
}

function direction(p1: Point, p2: Point, p3: Point) {
    const p1p2 = [(p2.x - p1.x), (p2.y - p1.y)];
    const p1p3 = [(p3.x - p1.x), (p3.y - p1.y)];

    return crossProduct(p1p2, p1p3);
}

function crossProduct(p1: number[], p2: number[]) {
    const [x1, x2] = [p1[0], p2[0]];
    const [y1, y2] = [p1[1], p2[1]];
    return (x1 * y2) - (x2 * y1);
}
