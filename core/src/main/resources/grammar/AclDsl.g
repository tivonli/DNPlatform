grammar AclDsl;

@header {
package com.digitnexus.core.acl.grammar;

import com.digitnexus.core.acl.ast.ASTNode;
}
@lexer::header{
package com.digitnexus.core.acl.grammar;
}

INT :	'0'..'9'+
    ;

FLOAT
    :   ('0'..'9')+ '.' ('0'..'9')* EXPONENT?
    |   '.' ('0'..'9')+ EXPONENT?
    |   ('0'..'9')+ EXPONENT
    ;

LOGICAL_OP
	:	'AND'
	|	'OR'
	|	'and'
	|	'or'
	;

RELATIONAL_OP
	:	'>'
	|	'<'
	|	'>='
	|	'=>'	
	|	'<='
	|	'=<'	
	|	'!='
	|	'='
	|	'like'
	;

//Valid names for variables - it can contain alpha numeric and _ characters
NAME  :	('a'..'z'|'A'..'Z'|'_') ('a'..'z'|'A'..'Z'|'0'..'9'|'_')*
      ;

NESTED_PROPERTY 
	:	NAME ('.' NAME)*
	;
	
STRING	:	'\'' ('a'..'z'|'A'..'Z'|'0'..'9'|'_')* '%'? '\''
	;

L_PAREN	:	'(';

R_PAREN	:	')';

WS  :   ( ' '
        | '\t'
        ) {$channel=HIDDEN;}
    ;

NEWLINE:'\r'? '\n' ;

fragment
EXPONENT : ('e'|'E') ('+'|'-')? ('0'..'9')+ ;	

comparisonExpression returns [ASTNode value]
	:	a=NESTED_PROPERTY b=RELATIONAL_OP c=(NESTED_PROPERTY|STRING|INT|FLOAT) {$value = ASTNode.create($b.text).left($a.text).right($c.text);}
	;

logicalExpression returns [ASTNode value]
	:	a=comparisonExpression {$value = $a.value;} (b=LOGICAL_OP c=comparisonExpression {
				if ($b.text != null) {
					if ($c.value != null) {
						//the sub tree in the parenthesised block get precedence
						//so that is kept down the tree
				 		$value = ASTNode.create($b.text).left($value).right($c.value);
				 	}
			 	}})*	
	; 
	
parenthesisedLogicalExpression returns [ASTNode value]
	:	a=L_PAREN b=logicalExpression c=R_PAREN {$value = $b.value;}
	;

aclExpression returns [ASTNode value]
	:	(a1=logicalExpression {$value = $a1.value;} | a2=parenthesisedLogicalExpression {$value = $a2.value;} )? 
		(b=LOGICAL_OP {$value = ASTNode.create($b.text).left($value);} 
		(c1=parenthesisedLogicalExpression {
			if ($c1.value != null) {
				//the sub tree in the parenthesised block get precedence
				//so that is kept down the tree
		 		$value.right($c1.value);
		 	}
		} | c2=logicalExpression {
			if ($c2.value != null) {
				//the sub tree in the parenthesised block get precedence
				//so that is kept down the tree
		 		$value.right($c2.value);
		 	}
		}))*
	;

/*
prog	:	stat+
	;

stat	:	expr NEWLINE
	|	NAME '=' expr NEWLINE
	|	NEWLINE	
	;

expr	:	multExpr (('+'|'-') multExpr)*
	;
	
multExpr:	atom ('*' atom)*
	;

atom	:	INT
	|	NAME
	|	'(' expr ')'
	; 
*/	




