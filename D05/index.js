const fs = require("fs");
const logHeaderPrefix = "ADVENT OF CODE 2024";
const challengeDayNo = "Day 05";
const challengeTitle = "Print Queue";

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

const parseRawData = (rawInputData) => {
    const [ rules, rawPrintQueue] = rawInputData
        .split(`\r\n\r\n`)
        .map( dataPart => dataPart.split("\r\n"));

    const printQueue = rawPrintQueue
        .map( printBatch => printBatch.split(",").map(Number));

    return { rules, printQueue };
}

const hasRuleViolations = (rules, pageQueue) => {
    if (pageQueue.length === 2) {
        const lastPair = pageQueue.reverse().join('|');
        return rules.has(lastPair);
    }

    const [leadPage, ...otherPages] = pageQueue;

    const hasPageQueueError = otherPages.some( nextPage => {
        const pagePair = [nextPage, leadPage].join('|');
        return rules.has(pagePair);
    });

    return hasPageQueueError || hasRuleViolations(rules, otherPages);
}

const reorderPageQueue = (rules, pageQueue) => {
    let leadPage, otherPages = [...pageQueue];
    let reorderedPageQueue = [];
    
    do {
      let errors = [];
      
      const skipLeadPage = otherPages.length === 2;
      
      if (skipLeadPage) {
        errors = [( [...otherPages].reverse().join('|') )]
            .reduce( (errors, pair) => rules.has(pair) 
                ? errors.concat([pair]) 
                : errors, 
                []
            );

      } else {
        ([ leadPage, ...otherPages ] = otherPages);
      
        errors = otherPages
          .map( otherPage => [otherPage, leadPage ].join('|'))
          .reduce( (errors, pair) => rules.has(pair) 
                ? errors.concat([pair]) 
                : errors, 
            []
            );
      }
      
      if (!errors.length && !skipLeadPage) {
        reorderedPageQueue.push(leadPage);
      } else if (!errors.length && skipLeadPage) {
        reorderedPageQueue.push(...otherPages)
        otherPages = [];
      } else if (errors.length) {
        const correctPairOrder = errors
            .shift()
            .split('|')
            .map(Number);

        otherPages = [
          ...reorderedPageQueue, 
          ...correctPairOrder,
          ...otherPages.filter( page => !correctPairOrder.includes(page))
        ];
          
        reorderedPageQueue = [];
      }
      
      if (!otherPages.length)
        break;

    } while (true);

    return reorderedPageQueue;
}

const resolvePrintQueue = (rules, printQueue) => {
    const erringPageQueues = []; 

    const p1Value = printQueue
        .reduce( 
            (midPageSum, pageQueue) => {
                if (hasRuleViolations(rules, pageQueue)) {
                    erringPageQueues.push(pageQueue);
                    return midPageSum;
                }

                const midQueuePoint = Math.floor(pageQueue.length / 2)
                return midPageSum + pageQueue.at(midQueuePoint);
            }, 
            0
        );

    const p2Value = erringPageQueues
        .map( errPageQueue => reorderPageQueue(rules, errPageQueue))
        .reduce( 
            (midPageSum, pageQueue) => {
                if (hasRuleViolations(rules, pageQueue)) {
                    erringPageQueues.push(pageQueue);
                    return midPageSum;
                }

                const midQueuePoint = Math.floor(pageQueue.length / 2)
                return midPageSum + pageQueue.at(midQueuePoint);
            }, 
            0
        );
        ;

    return { p1Value, p2Value };
}

const t1 = performance.now();

const { rules, printQueue } = parseRawData(rawInputData);
const ruleSet = new Set(rules);

const { p1Value, p2Value } = resolvePrintQueue(ruleSet, printQueue);

console.info(`P1 : ${p1Value}`);        // 3608
console.info(`P2 : ${p2Value}`);        // 4922

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
