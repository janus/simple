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

const {vm} = require('./vm');
const {generateIR} = require('./ir');

function notSentinelToken(token) {
    return token.type !== Separator && token.type !== Do && token.type !== Skip && token.type !== Fi && token.type !== Od && token.type !== Then && token.type !== Else;
}
//||  token.type !== Do || token.type !== Skip || token.type !== Fi || token.type !== Od || token.type !== Then;
function expression(tokens, index) {
    let valuesAndVariables = [];
    let operators = [];
    let expressions = [];
    let len = tokens.length;
    let i = index ;
    let moperators = {Add: {type: ADD}, Sub: {type: SUB}, Mul: {type:MUL}, Div: {type: DIV}, Lt: {type: LT}, Gt: {type: GT}, Eq: {type: EQ}, Or: {type: OR}, And: {type: AND}, Not: {type: NOT}};
    while(i < len && notSentinelToken(tokens[i])){
        switch(tokens[i].type){
            case Num:
                valuesAndVariables.push({type: NUM, value: tokens[i].value});
                i++;
                break;
            case Identifier:
                valuesAndVariables.push({type: IDENTIFIER, name: tokens[i].name});
                i++;
                break;
            case Operator:
                if(operators.length === 0) {
                    operators.push(moperators[tokens[i].operator]);
                } else if(operators.length > 0 && tokens[i].precedence > operators[operators.length - 1].precedence) {
                    operators.push(moperators[tokens[i].operator]);
                } else if(operators.length > 0 && tokens[i].precedence < operators[operators.length - 1].precedence) {
                    if(tokens[i].kind === Binary) {
                        if(expressions.length === 0) {
                            let right = valuesAndVariables.pop();
                            let left = valuesAndVariables.pop();
                            expressions.push(left);
                            expressions.push(right);
                            if(moperators[tokens[i].operator] !== undefined){
                                expressions.push(moperators[tokens[i].operator]);
                            } else {
                                throw new Error(`Operator not defined ${tokens[i].operator}`);
                            }
                        } else if(expressions.length > 0)  {
                            let right = valuesAndVariables.pop();
                            expressions.push(right);
                            if(moperators[tokens[i].operator] !== undefined){
                                expressions.push(moperators[tokens[i].operator]);
                            } else {
                                throw new Error(`Operator not defined ${tokens[i].operator}`);
                            }
                        } else {
                            throw new Error("Expected left and right operands");
                        }     
                    } else if (tokens[i].kind === Unary){
                        if(valuesAndVariables.length >= 1 && moperators[tokens[i].operator].type === NOT) {
                            let right = valuesAndVariables.pop();
                            expressions.push(right);
                            expressions.push({type: NOT});
                        } else {
                            throw new Error("Expected one operand");
                        }

                    } 

                }
                i++;
                break;
                default:
                    console.log(tokens[i]);
                    throw new Error(`Token not recongnised ${tokens[i]}`);
        }

    }
    while(operators.length > 0 ){
        console.log(operators);
        if (expressions.length === 0 && operators[operators.length - 1].type !== NOT) {
            let right = valuesAndVariables.pop();
            let left = valuesAndVariables.pop();
            expressions.push(left);
            expressions.push(right);
            expressions.push(operators.pop());
        } else if (valuesAndVariables.length > 0 && operators.length > 0) {
            let right = valuesAndVariables.pop();
            expressions.push(right);
            expressions = expressions.push(operators.pop());
        } else if (operators.length > 0) {
            expressions = expressions.push(operators.pop());
        } 
    }
    if (valuesAndVariables.length > 0 && expressions.length === 0) {
        return [valuesAndVariables, i];

    } else if(valuesAndVariables.length > 0) {
        console.log(valuesAndVariables);
        throw new Error("Operand left unused");
    }
    return [expressions, i];

}

function parse(tokens, target, index) {
    let i = index || 0;
    let len = tokens.length;
    let parsed = [];
    while(i < len){
        switch(tokens[i].type){
            case Num:
                let [parsedExpression, j] = expression(tokens, i);
                i = j;
                parsed.concat(parsedExpression);
                break;
            case Identifier:
                {
                    if(i + 1 < len && tokens[i + 1].type === Assign) {
                        let [parsedExpression, j] = expression(tokens, i + 2);
                        let assignment = {type: ASSIGNMENTSTATEMENT, identifier: tokens[i].name, expression: parsedExpression};
                        parsed.push(assignment);
                        i = j;
                    } else {
                        let [parsedExpression, j] = expression(tokens, i);
                        i = j;
                        parsed.concat(parsedExpression);
                    } 
                }
                break;
            case Print:
                {
                    let [parsedExpression, j] = expression(tokens, i + 1);
                    let assignment = {type: PRINTSTATEMENT, expression: parsedExpression};
                    parsed.push(assignment);
                    i = j;
                }
                break;
            case While:
                {
                    let [parsedExpression, j] = expression(tokens, i + 1);
                    if(j < len && tokens[j].type === Do) {
                        let [parsedStatement, k] = parse(tokens, Od, j+1);
                        let whilestatement = {type: WHILESTATEMENT, conditional: parsedExpression, statement: parsedStatement};
                        parsed.push(whilestatement);
                        i = k;
                    } else {
                        throw new Error('Expected Do but found something else');
                    }
                }
                break;
            case If:
                {
                    let [parsedExpression, j] = expression(tokens, i + 1);
                    if(j < len && tokens[j].type === Then) {
                        let [thenStatement, k] = parse(tokens, Else, j+1);
                        console.log(tokens[k].type);
                        let [elsestatement, l] = parse(tokens, Fi, k);
                        let statement = {type: IFSTATEMENT, conditional: parsedExpression, thenstatement: thenStatement, elsestatement: elsestatement};
                        parsed.push(statement);
                        i = l;
                    } else {
                        throw new Error('Expected Then but found something else');
                    }
                }
                break;
            case Separator:
                console.log(parsed);
                i++;
                break;
            case Skip:
                parsed.push({type: SKIP});
                i++;
                break;
            case Od:
            case Else:
            case Fi:
                if (target === tokens[i].type) {
                    return [parsed, ++i];
                } else {
                    throw new Error(`Unexpected token ${tokens[i]}`);
                }   
        }
    }
    return [parsed, i];
}

let input = [{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Add',  precedence: 3}, 
{type: Separator}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Sub',  precedence: 3},
{type: Separator}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Mul',  precedence: 4}];


input = [{type:Identifier, name: 'num1'}, {type: Assign },{type:Num, value: 0 },
{type: Separator}, 
    {type: While}, {type:Identifier, name: 'num1'}, {type:Num, value: 1 }, {type: Operator, kind: Binary, operator: 'Lt',  precedence: 1}, 
{type: Do}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Sub',  precedence: 3},
{type: Separator}, 
{type: Print}, {type:Num, value: 777 }, {type:Num, value: 242 }, {type: Operator, kind: Binary, operator: 'Mul',  precedence: 4},
{type: Separator}, 
{type:Identifier, name: 'num1'}, {type: Assign }, {type:Identifier, name: 'num1'}, {type:Num, value: 1 }, {type: Operator, kind: Binary, operator: 'Add',  precedence: 3},
{type: Od} ];

//input = [{type:Identifier, name: 'num1'}, {type: Assign },{type:Num, value: 5 }];


//console.log(parse(input)[0][0].expression);

input = [{type:Identifier, name: 'num1'}, {type: Assign },{type:Num, value: 0 },
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

let parsed = parse(input);
console.log(parsed[0]);
//console.log(parsed[0][0].expression);
let irs = generateIR(parsed[0]);
console.log(irs);
let resulti = vm(irs);
//console.log(resulti);
//console.log(vm(generateIR()));