
/**
 * Parser type
 */
 const EXPRESSION = 1;
 const IFSTATEMENT = 2;
 const WHILESTATEMENT = 3;
 const SKIP = 4;
 const PRINTSTATEMENT = 5;
 const ASSIGNMENTSTATEMENT = 6;

/**
 * OP Codes
 */
 const MPUSH = 1;
 const MOP = 2;
 const MLOAD = 3;
 const MSTORE = 4;
 const MBLOCK = 5;
 const MEXITBLOCK = 6;
 const MJUMP = 7;
 const MJUMPIFZERO = 8;
 const MPUSHI = 9;
 const MSKIP = 11;
 const MADD = 12;
 const MAND = 13;
 const MDIV = 14;
 const MEQ = 15;
 const MGT = 16;
 const MLT = 17;
 const MMUL = 18;
 const MNOT = 19;
 const MOR = 21;
 const MSUB = 22;
 const MPRNT = 23;

/**
 * Expressions
 */

const ADD = 1;
const SUB = 2;
const DIV = 3;
const MUL = 4;
const LT = 5;
const GT = 6;
const EQ = 7;
const AND = 8;
const OR = 9;
const NUM = 11;
const IDENTIFIER = 12;
const NOT = 13;


/**
 * Tokens
 */

 const Add = 1;
 const Sub = 2;
 const Div = 3;
 const Mul = 4;
 const Lt = 5;
 const Gt = 6;
 const Eq = 7;
 const And = 8;
 const Or = 9;
 const Num = 11;
 const Identifier = 12;
 const If = 13;
 const While = 14;
 const Fi = 15;
 const Do = 16;
 const Od = 17;
 const Else = 18;
 const Then = 19;
 const Assign = 21;
 const Separator = 22;
 const Operator = 23;
 const Skip = 24;
 const Print = 24;

 const  Binary = 31;
 const  Unary = 32;



module.exports = {
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
MPRNT,
EXPRESSION,
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
Skip,
Print,
Operator,
Binary,
Unary
    
};
