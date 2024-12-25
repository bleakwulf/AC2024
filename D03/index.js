const fs = require("fs");
const logHeaderPrefix = "ADVENT OF CODE 2024";
const challengeDayNo = "Day 03";
const challengeTitle = "Mull It Over";

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

const solveP1 = (rawInputData) => {
    const searchParam = new RegExp(/mul\((?<factor1>\d+),(?<factor2>\d+)\)/, "g");

    return Array
        .from(
            rawInputData.matchAll( searchParam ), 
            ({ groups: { factor1, factor2 } }) =>  [ factor1, factor2 ].map(Number)
        )
        .map( ([ factor1, factor2 ]) => factor1 * factor2 )
        .reduce( (total, addend) => total += addend, 0);
}

const solveP2 = (rawInputData) => {
    const searchParam = new RegExp(/(?<ins>do\(\)|don't\(\)|mul\((?<factor1>\d+),(?<factor2>\d+)\))/, "g");

    const { sum } = Array
        .from(
            rawInputData.matchAll( searchParam ), 
            ({ groups: { ins, factor1 = null, factor2 = null } }) => ({
                instruction: ins, 
                params: (factor1 !== null && factor2 !== null) ? [ factor1, factor2 ].map(Number) : []
            })
        )
        .reduce( 
            ({ sum, enableAdd }, { instruction, params } ) => { 
                if (instruction.startsWith(`mul(`) && enableAdd) {
                    const [ factor1, factor2 ] = params;
                    sum += factor1 * factor2;
                } 
                else if (instruction.startsWith(`do(`)) 
                    enableAdd = true;
                
                else if (instruction.startsWith(`don't(`)) 
                    enableAdd = false;

                return { sum, enableAdd };
            }, 
            {
                sum: 0, 
                enableAdd: true
            }
        );

    return sum;


}

const t1 = performance.now();

console.info(`P1 : ${solveP1(rawInputData)}`); //  173529487
console.info(`P2 : ${solveP2(rawInputData)}`); //  99532691

const t2 = performance.now();
console.info(`------------------------------`);
console.info(`T : ${t2 - t1} ms`);
