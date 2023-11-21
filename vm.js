const { deepRequired } = require("ajv-keywords/keywords");
const { hasModuleSpecifier } = require("eshost/lib/dependencies");

/**
 * 
 * To build a simple virtual machine
 * Features:
 * Basic math operators, ADD, SUB, MUL, DIV
 * Condition and Logic, OR, AND, NOT, LT, GT, EQ
 * Control flow: JUMP, JUMPIFZERO
 * NO OP: SKIP
 * Environment: memories
 * Execution stack
 * This machine is not capable to handle function call
 * 
 */
const {
    MPUSH,
    MOP,
    MLOAD,
    MSTORE,
    MBLOCK,
    MEXITBLOCK,
    MJUMP,
    MJUMPIFZERO,
    MPUSHI,
    MSKIP,
    MADD,
    MAND,
    MDIV,
    MEQ,
    MGT,
    MLT,
    MMUL,
    MNOT,
    MOR,
    MSUB,
    MPRNT
        
    } = require('./constants');
    

function loadValueOf(identifier, environment) {
    let len = environment.length - 1;
    while(len >= 0) {
        let map  = environment[len];
        if(map[identifier] !== undefined) {
            return map[identifier];
        }
        len--;    
    }
    return undefined;
}

function storeVal(identifier,  value, environment) {
    let map = environment[environment.length - 1];
    map[identifier] = value;
}

function enterBlock(environment) {
    let map = new Map();
    environment.push(map);
}

function exitBlock(environment) {
    if(environment.length === 0) {
        throw new Error('There should be a least a block of memory');
    }
    environment.pop();
}

//[{op: MPUSH, value: 500},{op: MPUSH, value:1000}, {op: ADD, kind: MOP} ]
function vm(ir, debug) {
    let pc = 0;
    let len = ir.length;
    let stack = [];
    let map = new Map();
    let environment = [map];
    let code = undefined;
    let variables = [];
    let left = undefined;
    let right = undefined;
    let result = undefined;
    while(pc < len) {
       
        code  = ir[pc];
        console.log(code);
        switch(code.op) {
            case MOP:
                switch(code.kind) {
                    case MADD:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        left = stack.pop();
                        right = stack.pop();
                        result = left + right;
                        stack.push(result);
                        pc++;
                        break;
                    case MSUB:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        left = stack.pop();
                        right = stack.pop();
                        result = right - left;
                        stack.push(result);
                        pc++;
                        break;
                    case MDIV:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        
                        left = stack.pop();
                        right = stack.pop();
                        if(right === 0) {
                            throw new Error('Division by zero');
                        }
                        result = right / left;
                        stack.push(result);
                        pc++;
                        break;
                    case MMUL:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        
                        left = stack.pop();
                        right = stack.pop();
                        result = left * right;
                        stack.push(result);
                        pc++;
                        break;
                    case MOR:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        
                        left = stack.pop();
                        right = stack.pop();
                        result = 0;
                        if (left > 0 ||  right > 0) {
                            result = 1;
                        }
                        stack.push(result);
                        pc++;
                        break;
                    case MAND:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        
                        left = stack.pop();
                        right = stack.pop();
                        result = 0;
                        if (left > 0 &&  right > 0) {
                            result = 1;
                        }
                        stack.push(result);
                        pc++;
                        break;
                    case MGT:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        
                        left = stack.pop();
                        right = stack.pop();
                        result = 0;
                        if (right > left) {
                            result = 1;
                        }
                        stack.push(result);
                        pc++;
                        break;
                    case MLT:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        
                        left = stack.pop();
                        right = stack.pop();
                        result = 0;
                        if (right < left) {
                            result = 1;
                        }
                        stack.push(result);
                        pc++;
                        break;
                    case MEQ:
                        if(stack.length < 2){
                            throw new Error('This is binary operation and stack should have at least 2 operands');
                        }
                        
                        left = stack.pop();
                        right = stack.pop();
                        result = 0;
                        if (right === left) {
                            result = 1;
                        }
                        stack.push(result);
                        pc++;
                        break;
                    case MNOT:
                        if(stack.length < 1){
                            throw new Error('This is unary operation and stack should have at least 1 operand');
                        }
                        
                        left = stack.pop();
                        result = 0;
                        if (left <= 0) {
                            result = 1;
                        }
                        stack.push(result);
                        pc++;
                }
                break;
            case MLOAD:
                if(variables.length < 1) {
                    throw new Error('There should identifier to load');
                }
                console.log(variables);
                result = loadValueOf(variables.pop(), environment);
                console
                if(result === undefined) {
                    throw new Error(`The identifier, ${identifier}, is not defined`);
                }
                pc++;
                stack.push(result);
                break;
            case MSTORE:
                if(variables.length < 1  && stack.length < 1) {
                    throw new Error('There should identifier and valure to store');
                }
                storeVal(variables.pop(),  stack.pop(), environment);

                pc++;
                break;
            case MBLOCK:
                enterBlock(environment);
                pc++;
                break;
            case MEXITBLOCK:
                exitBlock(environment);
                pc++;
                break;
            case MJUMPIFZERO:
                let newPC = stack.pop();
                let conditionalValue = stack.pop();
                if(conditionalValue === 0) {
                    pc = newPC;
                } else {
                    pc++;
                }
                break;
            case MJUMP:
                pc = stack.pop();
                break;
            case MPUSH:
                stack.push(code.value);
                pc++;
                break;
            case MPUSHI:
                variables.push(code.value);
                pc++;
                break;
            case MSKIP:
                pc++;
                break;
            case MPRNT:
                pc++;
                if(stack.length > 0) {
                    console.log(`\n Output: ${stack[stack.length - 1]} `);
                } else {
                    console.log('\n Output: ');
                }
                
                break;
        }
    }
    console.log(stack);
    if (debug) {
        console.log(stack);
    }
}

/*
let input = [{op: MPUSH, value: 500},{op: MPUSH, value:1000}, {kind: MADD, op: MOP} ];
vm(input);

input = [{op: MPUSH, value: 500},{op: MPUSH, value:1000}, {kind: MSUB, op: MOP} ];
vm(input);
input = [{op: MPUSH, value: 500},{op: MPUSH, value:1000}, {kind: MDIV, op: MOP} ];
vm(input);
input = [{op: MPUSH, value: 500},{op: MPUSH, value:1000}, {kind: MMUL, op: MOP} ];
vm(input);
input = [{op: MPUSH, value: 500},{op: MPUSHI, value:'num1'}, {op: MSTORE}, {op: MPUSH, value: 342},{op: MPUSHI, value:'num2'},{op: MSTORE}, 
{op: MPUSHI, value:'num2'}, {op: MLOAD},
{op: MPUSHI, value:'num1'}, {op: MLOAD},
{kind: MADD, op: MOP} ];
vm(input);
input = [{op: MPUSH, value: 0},{op: MPUSH, value:-1000}, {kind: MOR, op: MOP} ];
vm(input);
input = [{op: MPUSH, value: 500},{op: MPUSHI, value:'num1'}, {op: MSTORE}, {op: MPUSH, value: 342},{op: MPUSHI, value:'num2'},{op: MSTORE}, 
{op: MPUSHI, value:'num2'}, {op: MLOAD},
{op: MPUSHI, value:'num1'}, {op: MLOAD},
{kind: MOR, op: MOP},
{op: MPUSH, value: 18},
{op: MJUMPIFZERO},
{op: MPUSH, value: 500},{op: MPUSH, value:1000}, {kind: MDIV, op: MOP},
{op: MPUSH, value: 21},
{op: MJUMP},
{op: MPUSH, value: 500},{op: MPUSH, value:1000}, {kind: MMUL, op: MOP}
 ];
vm(input);

console.log(input.length);
input = [{op: MPUSH, value: 500},{op: MPUSH, value: 0},{op: MPUSHI, value:'num1'}, {op: MSTORE}, {op: MPUSH, value: 10},{op: MPUSHI, value:'num2'},{op: MSTORE}, 
{op: MPUSHI, value:'num1'}, {op: MLOAD},
{op: MPUSHI, value:'num2'}, {op: MLOAD},
{kind: MLT, op: MOP},
{op: MPUSH, value: 24},
{op: MJUMPIFZERO},
{op: MPUSH, value:1000}, {kind: MADD, op: MOP},
{op: MPUSHI, value:'num1'}, {op: MLOAD},
{op: MPUSH, value:1},
{kind: MADD, op: MOP},
{op: MPUSHI, value:'num1'}, {op: MSTORE},
{op: MPUSH, value: 7},
{op: MJUMP},
{op: MPRNT }
 ];
vm(input);
console.log(input.length);
*/

module.exports = {
    vm
};