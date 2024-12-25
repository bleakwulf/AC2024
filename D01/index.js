const fs = require("fs");
const logHeaderPrefix = "ADVENT OF CODE 2024";
const challengeDayNo = "Day 01";
const challengeTitle = "Historian Hysteria";

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

const parseLists = (rawInputData) => {
    return rawInputData
        .split(`\n`)
        .map( inputLine => inputLine.match(/\d+/g).map(Number))
        .reduce( 
            ([ leftLocationId, rightLocationId ], [ location1, location2]) => {
                leftLocationId.push(location1);
                rightLocationId.push(location2);

                return [ leftLocationId, rightLocationId ]    
            }, 
            [ [], [] ]
        ).map( listRef => listRef.sort( (id1, id2) => id1 > id2 ? 1 : -1 ));
}

const solveP1 = (leftList, rightList) => {
    const pairCount = leftList.length;

    return Array(pairCount)
        .fill(0)
        .reduce(
            (totalDistance, _, indexRef) => totalDistance += Math.abs( leftList.at(indexRef) - rightList.at(indexRef)), 
            0
        );
}

const solveP2 = (leftList, rightList) => {
    const refMap = new Map();

    rightList.forEach( locationId => {
        let locationCount = refMap.get(locationId) ?? 0;
        refMap.set(locationId, ++locationCount);
    })

    return leftList
        .reduce( 
            (totalDistance, locationId) => totalDistance += locationId * (refMap.get(locationId) ?? 0), 
            0
        )
}

const t1 = performance.now();

const [leftList, rightList] = parseLists(rawInputData);

console.info(`P1 : ${solveP1(leftList, rightList)}`); //  2166959
console.info(`P2 : ${solveP2(leftList, rightList)}`); //  23741109

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
