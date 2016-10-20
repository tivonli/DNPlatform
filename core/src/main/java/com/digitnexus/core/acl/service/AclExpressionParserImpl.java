/**
 * 
 */
package com.digitnexus.core.acl.service;

import org.antlr.runtime.ANTLRStringStream;
import org.antlr.runtime.CommonTokenStream;
import org.antlr.runtime.RecognitionException;
import org.springframework.stereotype.Service;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.grammar.AclDslLexer;
import com.digitnexus.core.acl.grammar.AclDslParser;
import com.digitnexus.core.acl.grammar.AclDslToken;

/**
 * @author Santanu
 *
 */
@Service
public class AclExpressionParserImpl implements AclExpressionParser {

	/* (non-Javadoc)
	 * @see com.digitnexus.core.acl.service.AclExpressionParser#parseAclExpression(com.digitnexus.core.acl.dataobject.AclExpression)
	 */
	@Override
	public ASTNode parseAclExpression(AclExpression aclExpression) {
		ASTNode astNode = parseExpression(aclExpression.getExpression());
		astNode = postProcessAclExpression(astNode);
		return astNode;
	}

	/**
	 * 
	 * @param expression
	 * @return
	 */
	private ASTNode parseExpression(String expression) {
		try {
			// Create an input character stream from standard in
			ANTLRStringStream input = createInputStream(expression);
			// Create an ExprLexer that feeds from that stream
			AclDslLexer lexer = new AclDslLexer(input);
			// Create a stream of tokens fed by the lexer
			CommonTokenStream tokens = new CommonTokenStream(lexer);
			// Create a parser that feeds off the token stream
			AclDslParser parser = new AclDslParser(tokens);
			// Begin parsing at rule
			ASTNode aclTree = parser.aclExpression();
			return aclTree;
		} catch (RecognitionException e) {
			throw new RuntimeException(e);
		}
	}
	
	/**
	 * 
	 * @param expression
	 * @return
	 */
	private ANTLRStringStream createInputStream(String expression) {
		// Create an input character stream from the string passed
		ANTLRStringStream input = new ANTLRStringStream(expression);
		return input;			
	}
	
	/**
	 * 
	 * @param astNode
	 */
	private ASTNode postProcessAclExpression(ASTNode astNode) {
		return processCurrentUserToken(astNode);
	}
	
	/**
	 * 
	 * @param astNode
	 */
	private ASTNode processCurrentUserToken(ASTNode astNode) {
		replaceUsernameToken(astNode);
		if (replaceUserToken(astNode)) {
			ASTNode userIdNode = ASTNode.create("=")
					.left(AclDslToken.PARSED_CURRENT_USER + "." + AclDslToken.PARSED_CURRENT_USER_ID_PROPERTY)
					.right(AclDslToken.PARSED_CURRENT_USER_ID_TOKEN);
			astNode = ASTNode.create("and")
					.left(astNode)
					.right(userIdNode);
		}
		
		return astNode;
	}
	
	/**
	 * 
	 * @param astNode
	 * @return
	 */
	private boolean replaceUserToken(ASTNode astNode) {
		if (astNode == null) {
			return false;
		}
		boolean containsCurrentUserToken = astNode.getData().startsWith(AclDslToken.DSL_CURRENT_USER);
		if (containsCurrentUserToken) {
			astNode.data(astNode.getData().replace(AclDslToken.DSL_CURRENT_USER, AclDslToken.PARSED_CURRENT_USER));
		}
		
		containsCurrentUserToken = (replaceUserToken(astNode.getLeft()) || containsCurrentUserToken);
		containsCurrentUserToken = (replaceUserToken(astNode.getRight()) || containsCurrentUserToken);
		
		return containsCurrentUserToken;
	}
	
	private boolean replaceUsernameToken(ASTNode astNode) {
		if (astNode == null) {
			return false;
		}
		boolean containsCurrentUsernameToken = astNode.getData().startsWith(AclDslToken.DSL_CURRENT_USER_NAME);
		if (containsCurrentUsernameToken) {
			astNode.data(astNode.getData().replace(AclDslToken.DSL_CURRENT_USER_NAME, AclDslToken.PARSED_CURRENT_USER_ID_TOKEN));
		}
		
		containsCurrentUsernameToken = (replaceUsernameToken(astNode.getLeft()) || containsCurrentUsernameToken);
		containsCurrentUsernameToken = (replaceUsernameToken(astNode.getRight()) || containsCurrentUsernameToken);
		
		return containsCurrentUsernameToken;
	}
}
