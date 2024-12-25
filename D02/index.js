const fs = require("fs");
const logHeaderPrefix = "ADVENT OF CODE 2024";
const challengeDayNo = "Day 02";
const challengeTitle = "Red-Nosed Reports";

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

const MAX_LEVELVALUEDIFF = 3;

const parseLists = (rawInputData) => {
    return rawInputData
        .split(`\n`)
        .map( inputLine => inputLine.match(/\d+/g).map(Number))
}

const isSafeReport = (report) => {
    const diffs = report.reduce( (diffs, currVal, levelIndex, report) => {
        if (levelIndex) {
            const diff = report.at(levelIndex - 1) - currVal;
            diffs.push(diff);
        }

        return diffs;
    }, [])

    const [ 
        positives, 
        negatives, 
        zeroDiffs, 
        overIncrements 
    ] = [
        diffs.filter( diff =>  diff > 0), 
        diffs.filter( diff =>  diff < 0), 
        diffs.filter(diff => !diff),
        diffs.filter( diff =>  diff && Math.abs(diff) > MAX_LEVELVALUEDIFF)
    ];

    const zeroCount = zeroDiffs.length;
    const overIncrementCount = overIncrements.length;
    const isAllPositive = positives.length === diffs.length;
    const isAllNegative = negatives.length === diffs.length;

    return (isAllPositive || isAllNegative) & !zeroCount & !overIncrementCount;
}

const countSafeReports = (refList, isUseProblemDampener = false) => {
    let safeReports = new Set();

    const reportList = refList.map( ( report, index ) => ({ index, report }));
    let currentReport = reportList.shift();

    do {
        if (isSafeReport(currentReport.report)) {
            safeReports.add(currentReport.index)
        } else if (isUseProblemDampener) {
            const levelCount = currentReport.report.length;
            let levelIndex = 0;

            do {
                const reporVariant = [...currentReport.report];
                reporVariant.splice(levelIndex, 1);

                if (isSafeReport(reporVariant)) {
                    safeReports.add(currentReport.index)
                    break;
                }
                
                if (++levelIndex === levelCount)
                    break;

            } while (true);
        }

        if (!reportList.length) 
            break;

        currentReport = reportList.shift();

        continue;
    } while (true);

    return safeReports.size;
}

const t1 = performance.now();

const refLists = parseLists(rawInputData);

console.info(`P1 : ${countSafeReports(refLists)}`); //  631
console.info(`P2 : ${countSafeReports(refLists, true)}`); //  665

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
