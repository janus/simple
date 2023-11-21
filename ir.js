const {
    EXPRESSION,
    IFSTATEMENT,
    WHILESTATEMENT,
    SKIP,
    PRINTSTATEMENT,
    ASSIGNMENTSTATEMENT,
    MJUMP,
    MJUMPIFZERO,
    MPRNT,
    MPUSH,
    MPUSHI,
    MSKIP,
    MSUB,
    MDIV,
    MMUL,
    MADD,
    MLOAD,
    MSTORE,
    MOP,
    ADD,
    SUB,
    DIV,
    MUL,
    LT,
    GT,
    EQ,
    AND,
    OR,
    NUM,
    IDENTIFIER,
    MLT,
    MEQ,
    MGT
} = require('./constants');

const {vm} = require('./vm');


function generateExpression(expression) {
    let irs = [];
    let i = 0;
    let len = expression.length;
    while(i < len){
        switch(expression[i].type){
            case NUM:
                irs.push({op: MPUSH, value: expression[i].value});
                i++;
                break;
            case IDENTIFIER:
                irs.push({op: MPUSHI, value: expression[i].name});
                irs.push({op: MLOAD});
                i++;
                break;
            case ADD:
                irs.push({kind: MADD, op: MOP});
                i++;
                break;
            case SUB:
                irs.push({kind: MSUB, op: MOP});
                i++;
                break;
            case DIV:
                irs.push({kind: MDIV, op: MOP});
                i++;
                break;
            case MUL:
                irs.push({kind: MMUL, op: MOP});
                i++;
                break;
            case LT:
                irs.push({kind: MLT, op: MOP});
                i++;
                break;
            case GT:
                irs.push({kind: MGT, op: MOP});
                i++;
                break;
            case EQ:
                irs.push({kind: MEQ, op: MOP});
                i++;
                break;
            case AND:
                irs.push({kind: MAND, op: MOP});
                i++;
                break;
            case OR:
                irs.push({kind: MOR, op: MOP});
                i++;
                break;
        }
    }
    return irs;
}

let input = [{type: NUM, value: 500}, {type: IDENTIFIER, name: 'num1'}, {type: ADD}];
//console.log(generateExpression(input));

function generateIR(parsed) {
    let irs = [];
    let i = 0;
    let len = parsed.length;
    let locations = [];
    while(i < len){
        console.log(i);
        switch(parsed[i].type) {
            case IFSTATEMENT:
                irs = irs.concat(generateExpression(parsed[i].conditional));
                irs.push({op: MPUSH, value: 0});
                locations.push(irs.length - 1);
                irs.push({op: MJUMPIFZERO});
                irs = irs.concat(generateIR(parsed[i].thenstatement));
                irs.push({op: MPUSH, value: 0});
                irs.push({op: MJUMP});
                irs[locations.pop()].value = irs.length;
                locations.push(irs.length - 2);
                irs = irs.concat(generateIR(parsed[i].elsestatement));
                irs[locations.pop()].value = irs.length;
                i++;
                break;
            case WHILESTATEMENT:
                locations.push(irs.length);
                irs = irs.concat(generateExpression(parsed[i].conditional));
                irs.push({op: MPUSH, value: 0});
                locations.push(irs.length - 1);
                irs.push({op: MJUMPIFZERO});
                irs = irs.concat(generateIR(parsed[i].statement));
                irs.push({op: MPUSH, value: locations[locations.length - 2]});
                irs.push  ({op: MJUMP});
                irs[locations.pop()].value = irs.length;
                locations.pop();
                i++;
                break;
            case SKIP:
                irs.push({op: MSKIP});
                i++;
                break;
            case PRINTSTATEMENT:
                console.log(parsed[i].expression);
                irs = irs.concat(generateExpression(parsed[i].expression));
                irs.push({op: MPRNT});
                i++;
                break;
            case ASSIGNMENTSTATEMENT:
                irs = irs.concat(generateExpression(parsed[i].expression));
                irs.push({op: MPUSHI, value: parsed[i].identifier});
                irs.push({op: MSTORE});
                i++;
                break;
        }
    }
    return irs;
}

/**
input = [{type: ASSIGNMENTSTATEMENT, identifier: 'num1',  expression: [{type: NUM, value: 500}]},
    {type: ASSIGNMENTSTATEMENT, identifier: 'num2',  expression: [{type: NUM, value: 50}, {type: IDENTIFIER, name: 'num1'}, {type: ADD}] },
{type: PRINTSTATEMENT, expression: [{type: IDENTIFIER, name: 'num2'}]}];
//vm(generateIR(input));
input = [{type: ASSIGNMENTSTATEMENT, identifier: 'num1',  expression: [{type: NUM, value: 39}]},
    {type: IFSTATEMENT, conditional: [{type: NUM, value: 500} , {type: NUM, value: 5}, {type: LT}],
thenstatement:
    [{type: ASSIGNMENTSTATEMENT, identifier: 'num2',  expression: [{type: NUM, value: 17}, {type: IDENTIFIER, name: 'num1'}, {type: ADD}] },
{type: PRINTSTATEMENT, expression: [{type: IDENTIFIER, name: 'num2'}]}],
elsestatement:[{type: PRINTSTATEMENT, expression: [{type: NUM, value: 500} ]}]
}, {type: PRINTSTATEMENT, expression: [{type: NUM, value: 777} ]}];
//console.log(generateIR(input));


input = [{type: ASSIGNMENTSTATEMENT, identifier: 'num1',  expression: [{type: NUM, value: 0}]},
    {type: WHILESTATEMENT, conditional: [{type: IDENTIFIER, name: 'num1'}, {type: NUM, value: 5}, {type: LT}],
statement:
    [{type: ASSIGNMENTSTATEMENT, identifier: 'num2',  expression: [{type: NUM, value: 17}, {type: IDENTIFIER, name: 'num1'}, {type: ADD}] },
    {type: ASSIGNMENTSTATEMENT, identifier: 'num1',  expression: [{type: NUM, value: 1}, {type: IDENTIFIER, name: 'num1'}, {type: ADD}] },
{type: PRINTSTATEMENT, expression: [{type: IDENTIFIER, name: 'num2'}]}]
}, {type: PRINTSTATEMENT, expression: [{type: NUM, value: 777} ]}];

 */
//vm(generateIR(input));


module.exports = {
    generateIR
};