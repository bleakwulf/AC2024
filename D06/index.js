const fs = require("fs");
const logHeaderPrefix = "ADVENT OF CODE 2024";
const challengeDayNo = "Day 06";
const challengeTitle = "Guard Gallivant";

let rawInputData;

try {
    rawInputData = fs.readFileSync(`${__dirname}/data.txt`, "utf8");
} catch (e) {
  console.log(`Error!`);
  console.error(e);
}

console.info(`${logHeaderPrefix}`);
console.info(`${challengeDayNo}: ${challengeTitle}`);
console.info(`==============================`);

const DIRECTIONS = [ 'N', 'E', 'S', 'W'];
const DIRECTIONAL_INCREMENTS = new Map([
    [ 'N', [-1, 0] ],
    [ 'E', [0, 1] ],
    [ 'S', [1, 0] ],
    [ 'W', [0, -1] ],
]);
const INIT_DIRECTION = 'N';

const parseRawData = (rawInputData) => {
    const lines = rawInputData
        .split(`\r\n`);

    const [ lineCount, colCount] = [ 
        lines.length, 
        lines.at(0).trim().length 
    ];
        
    const obstacles = lines
        .flatMap( (line, lineIndex) => Array.from(
            line.matchAll( new RegExp(/#/, 'g')),
            ({ index }) => ({ 
                key: [lineIndex, index].join('|'), 
                x: lineIndex, 
                y: index
            })
        ));

    let guardInitPosition; 
    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
        const colIndex = lines.at(lineIndex).indexOf(`^`);

        if (!!~colIndex) {
            guardInitPosition = { 
                key: [ lineIndex, colIndex ].join('|'), 
                x: lineIndex, 
                y: colIndex
            };

            break;
        }
    }

    return { 
        lineCount, 
        colCount, 
        obstacles, 
        guardInitPosition 
    };
}

const simulateGuardPatrol = (lineCount, colCount, baseObstacles, guardInitPosition, isFailOnLoop = false) => {
    const obstacles = new Set(baseObstacles.map( ({ key }) => key));
    let isTrapped = false;

    let coveredTiles = new Set();
    const routeCells = new Map();

    let direction = INIT_DIRECTION;
    let directionIndex = DIRECTIONS.indexOf(INIT_DIRECTION);

    //  add guard's init positions
    coveredTiles.add( guardInitPosition.key );

    routeCells.set( guardInitPosition.key, {
        ...guardInitPosition, 
        direction: isFailOnLoop ? direction : null
    });

    let { x: xPosition, y: yPosition } = guardInitPosition;

    do {
        const stepIncrements = DIRECTIONAL_INCREMENTS.get(direction);

        const [ newXPosition, newYPosition ] = [ xPosition, yPosition ]
            .map( (coordValue, coordIndex ) => coordValue += stepIncrements.at(coordIndex) );

        const newPositionKey = [ newXPosition, newYPosition ].join('|');

        if (obstacles.has(newPositionKey)) {
            directionIndex = ++directionIndex % DIRECTIONS.length;
            direction = DIRECTIONS.at(directionIndex);

            continue;
        }

        ([ xPosition, yPosition ] = [ newXPosition, newYPosition ]);

        if (    xPosition >= colCount 
            || !~xPosition 
            || yPosition >= lineCount 
            || !~yPosition
        ) {
            //  guard leaves mapped area
            break;
        } else {
            coveredTiles.add(newPositionKey);

            const newPositionMapKey = isFailOnLoop 
                ? [ newPositionKey, direction ].join('|')
                : newPositionKey;

            if (isFailOnLoop && routeCells.has(newPositionMapKey)) {
                isTrapped = true;
                break;
            }

            routeCells.set(newPositionMapKey, {x: xPosition, y: yPosition, direction } )
        }

    } while (true);

    return { 
        coveredTiles: coveredTiles.size, 
        routeCells, 
        isTrapped
    };
}

const resolveGuardPath = (rawInputData) => {
    const { 
        lineCount, 
        colCount, 
        obstacles: 
        baseObstacles, 
        guardInitPosition 
    } = parseRawData(rawInputData);

    const { coveredTiles, routeCells } = simulateGuardPatrol(
        lineCount, 
        colCount, 
        baseObstacles, 
        guardInitPosition 
    );
    
    const routeCellRefs = Array.from(routeCells.values());
    let loopTraps = 0;

    do {
        const newObstacles = [...baseObstacles]
        const newObstacle = routeCellRefs.shift()
        newObstacles.push({ key: [newObstacle.x, newObstacle.y].join('|'), ...newObstacle});
        
        const { isTrapped } = simulateGuardPatrol(
            lineCount, 
            colCount, 
            newObstacles, 
            guardInitPosition, 
            true
        );

        if (isTrapped) 
            loopTraps++;

        if (!routeCellRefs.length) 
            break;

    } while( true );

    return { 
        p1Value: coveredTiles, 
        p2Value: loopTraps
    };
}

const t1 = performance.now();
const { p1Value, p2Value } = resolveGuardPath(rawInputData);

console.info(`P1 : ${p1Value}`);        // 4722
console.info(`P2 : ${p2Value}`);        // 1602

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
