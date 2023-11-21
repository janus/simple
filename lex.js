const {
    IFSTATEMENT,
    WHILESTATEMENT,
    SKIP,
    PRINTSTATEMENT,
    ASSIGNMENTSTATEMENT,
    ADD,
    SUB,
    DIV,
    MUL,
    LT,
    GT,
    EQ,
    AND,
    NOT,
    OR,
    NUM,
    IDENTIFIER,
    Add,
    Sub,
    Div,
    Mul,
    Lt,
    Gt,
    Eq,
    And,
    Or,
    Num,
    Identifier,
    If,
    While,
    Fi,
    Do,
    Od,
    Else,
    Then,
    Assign,
    Separator,
    Operator,
    Skip,
    Print,
    Binary,
    Unary
} = require('./constants');


function getOperatorName(str) {
    return {
        '+': 'Add',
        '-': 'Sub',
        '/': 'Div',
        '*': 'MUl',
        '=': 'Assign',
        '>': 'GT',
        '<': 'LT',
        '==': 'EQ',
        '>=': 'GE',
        '<=': 'LE'
    }[str];
}

function getPrecedence(str) {
    return {
        '+': 3,
        '-': 3,
        '/': 4,
        '*': 4,
        '=': 1,
        '>': 2,
        '<': 2,
        '==': 2,
        '>=': 2,
        '<=': 2
    }[str];
}

function isKeyword(str) {
    return ['if', 'fi', 'then', 'else', 'while', 'do', 'od', 'print'].includes(str);
}

function getkeyword(str) {
    return {
        'if': If,
        'fi': Fi,
        'then': Then,
        'else': Else,
        'while': While,
        'do': Do,
        'od': Od,
        'print': Print,
        'skip': Skip
    }[str];
}

const START = 0;
const NUMBER = 1;
const NAME = 2;

function tokenize(source) {
    let len = source.length;
    let i = 0;
    let state = START;
    let beginIndex = 0;
    let tokens = [];

    while(i < len) {
        if(state === START && [' ', '\t', '\r', '\n'].includes(source[i])) {
            i++;
            continue;
        } else {
            if(state === START &&  '123456789'.includes(source[i])) {
                state = NUMBER;
                beginIndex = i;
                i++;

            } else if(state === START && ['=', '+', '-','*', '/', '==', '<', '>', '>=', '<='].includes(source[i])){
                tokens.push({type: Operator, kind: Binary, operator: getOperatorName(source[i]),  precedence: getPrecedence(source[i])});
                i++;
                continue;
            } else if(['a', 'z'].includes(source[i])){
                state = NAME;
                beginIndex = i;
                i++;
            } else if (';' === source[i]){
                tokens.push({type: Separator});
                i++;
                continue;

            }
// digit , and letter
        }

        while(state == NUMBER &&  '0123456789'.includes(source[i])) {
            i++;
        }

        while(state == NAME && ![' ', '\t', '\r', '\n'].includes(source[i]) &&  !['=', '+', '-','*', '/', '==', '<', '>', '>=', '<='].includes(source[i])) {
            i++;
        }

        if(state === NUMBER) {
            let value = substring(beginIndex, i);
            tokens.push({type:Num, value: parseInt(value) });

        }

        if(state === NAME) {
            let value = substring(beginIndex, i);
            if (isKeyword(value)) {
                tokens.push({type: getkeyword(value)});
            } else {
                tokens.push({type:Identifier, name: value});
            }

        }
    }
}
 
/**
 * 
 * let num1 = 0;
 * if num1 < 2 then
 * print 777 - 242 ;
 * print 777 + 242 
 * else
 * print 777 * 242;
 * let num1 = num1 + 1;
 * print num1
 * fi
 * 
 * input = [{type:Identifier, name: 'num1'}, {type: Assign },{type:Num, value: 0 },
{type: Separator}, 
    {type: If}, {type:Identifier, name: 'num1'}, {type:Num, value: 2 }, {type: Operator, kind: Binary, operator: 'Lt',  precedence: 1}, 
{type: Then}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Sub',  precedence: 3},
{type: Separator}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Add',  precedence: 3},
{type: Else}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Mul',  precedence: 4},
{type: Separator}, 
{type:Identifier, name: 'num1'}, {type: Assign }, {type:Identifier, name: 'num1'}, {type:Num, value: 1 }, {type: Operator, kind: Binary, operator: 'Add',  precedence: 3},
{type: Separator}, 
{type: Print}, {type:Identifier, name: 'num1'},
{type: Fi} ];
 * 
 * 
 * 
 * 
 * let num1 = 0;
 * while num1 < 1 do
 * print 777 - 242 ;
 * print 777 * 242 ;
 * num1 = num1 + 1
 * od
 * input = [{type:Identifier, name: 'num1'}, {type: Assign },{type:Num, value: 0 },
{type: Separator}, 
    {type: While}, {type:Identifier, name: 'num1'}, {type:Num, value: 1 }, {type: Operator, kind: Binary, operator: 'Lt',  precedence: 1}, 
{type: Do}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Sub',  precedence: 3},
{type: Separator}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Mul',  precedence: 4},
{type: Separator}, 
{type:Identifier, name: 'num1'}, {type: Assign }, {type:Identifier, name: 'num1'}, {type:Num, value: 1 }, {type: Operator, kind: Binary, operator: 'Add',  precedence: 3},
{type: Od} ];
 * 
 * 
 * 
 * 
 */