const fs = require("fs");
const logHeaderPrefix = "ADVENT OF CODE 2024";
const challengeDayNo = "Day 04";
const challengeTitle = "Ceres Search";

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

const incrementsMap = new Map([
    [ 'NW', [ -1, -1]],
    [ 'N', [ 0, -1]],
    [ 'NE', [ 1, -1]],
    [ 'W', [ -1, 0]],
    [ 'E', [ 1, 0]],
    [ 'SW', [ -1, 1]],
    [ 'S', [ 0, 1]],
    [ 'SE', [ 1, 1]],
]);

const parseRawData = (rawInputData) => {
    const lines = rawInputData.split("\n");
    const [ lineCount, colCount] = [ 
        lines.length, 
        lines.at(0).trim().length 
    ];
    
    const grid = lines
        .map( line => line.split(''));

    return { grid, lines, lineCount, colCount };
}

const solveP1 = (grid, lines, lineCount, colCount) => {
    const searchParam = new RegExp(/X/, "g");
    
    const seedData = lines
        .flatMap( (line, lineIndex) => 
            Array.from ( line.matchAll( searchParam ), 
            ({ index: colIndex }) => ({ x: colIndex, y: lineIndex}))
        )
        .flatMap( ({x: xSeed, y: ySeed}) => {
            const origin = { x: xSeed, y: ySeed };
            const lastCoordRead = { x: xSeed, y: ySeed };
            const lettersRead = 1;

            const candidates = [];

            if (xSeed)
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'W'});
            
            if (ySeed)
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'N'});

            if (xSeed + 1 < colCount)
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'E'});
            
            if (ySeed + 1 < lineCount)
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'S'});
                
            if (xSeed && ySeed)
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'NW'});
                
            if ((xSeed + 1 < colCount) && ySeed)
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'NE'});

            if (xSeed && (ySeed + 1 < lineCount))
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'SW'});

            if ((xSeed  + 1 < colCount) && (ySeed + 1 < lineCount))
                candidates.push({ origin, lastCoordRead, lettersRead, direction: 'SE'});

            return candidates;
        })

    const wordRef = 'XMAS'

    let foundWords = 0;
    let candidate, expectedLetter, isWordEnd;

    do {
        candidate = seedData.shift();
        expectedLetter = wordRef.at(candidate.lettersRead);

        const increments = incrementsMap.get(candidate.direction);

        const [ nextX, nextY ] = [ candidate.lastCoordRead.x, candidate.lastCoordRead.y]
            .map( (coord, paramIndex) => coord + increments?.at(paramIndex));

        if (nextX >= lineCount || nextY >= colCount || nextX < 0 || nextY < 0) 
            continue;
        
        const isMatch = expectedLetter === grid[nextY][nextX];

        if (isMatch) {
            ++candidate.lettersRead;
            
            isWordEnd = candidate.lettersRead === wordRef.length;

            if (isWordEnd)
                foundWords++;
            else
                seedData.push({ 
                    ...candidate, 
                    lastCoordRead: { x: nextX, y: nextY }
                });
        }

        if (!seedData.length)
            break;

        continue;

    } while( true )

    return foundWords;
}

const solveP2 = (grid, lines, lineCount, colCount) => {
    let foundCrossWords = 0;
    const wordsRef = [ 'MAS', 'SAM' ];
    const searchParam = new RegExp(/A/, "g");
    
    lines
        .flatMap( (line, lineIndex) => 
            Array.from ( line.matchAll( searchParam ), 
            ({ index: colIndex }) => ({ x: colIndex, y: lineIndex}))
        )
        .forEach( 
            ({x: xSeed, y: ySeed}) => {

                const crossingWords = [];
                
                if (    (xSeed && ySeed)    //  with NW
                    &&  ((xSeed  + 1 < colCount) && (ySeed + 1 < lineCount)) // with SE
                )
                    crossingWords.push([
                            grid[ySeed - 1][xSeed - 1],
                            grid[ySeed][xSeed],
                            grid[ySeed + 1][xSeed + 1]
                        ].join('') 
                    );
                    
                if (    ((xSeed + 1 < colCount) && ySeed)   // with NE
                    &&  (xSeed && (ySeed + 1 < lineCount))   // with SW
                )
                    crossingWords.push([
                            grid[ySeed - 1][xSeed + 1],
                            grid[ySeed][xSeed],
                            grid[ySeed + 1][xSeed - 1]
                        ].join('') 
                    );

                if (    crossingWords.length === 2 
                    &&  crossingWords.every( word => wordsRef.includes(word))
                ) 
                    foundCrossWords++;
            }
        );

    return foundCrossWords;
}

const t1 = performance.now();

const { grid, lines, lineCount, colCount } = parseRawData(rawInputData);

console.info(`P1 : ${solveP1(grid, lines, lineCount, colCount)}`); //   2554
console.info(`P2 : ${solveP2(grid, lines, lineCount, colCount)}`); //   1916

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
