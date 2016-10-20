// $ANTLR 3.4 E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g 2012-06-20 04:05:46

package com.digitnexus.core.acl.grammar;

import org.antlr.runtime.BitSet;
import org.antlr.runtime.MismatchedSetException;
import org.antlr.runtime.NoViableAltException;
import org.antlr.runtime.Parser;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.RecognizerSharedState;
import org.antlr.runtime.Token;
import org.antlr.runtime.TokenStream;

import com.digitnexus.core.acl.ast.ASTNode;

@SuppressWarnings({"all", "warnings", "unchecked"})
public class AclDslParser extends Parser {
    public static final String[] tokenNames = new String[] {
        "<invalid>", "<EOR>", "<DOWN>", "<UP>", "COMPARISON_OP", "EXPONENT", "FLOAT", "INT", "LOGICAL_OP", "L_PAREN", "NAME", "NESTED_PROPERTY", "NEWLINE", "R_PAREN", "STRING", "WS"
    };

    public static final int EOF=-1;
    public static final int COMPARISON_OP=4;
    public static final int EXPONENT=5;
    public static final int FLOAT=6;
    public static final int INT=7;
    public static final int LOGICAL_OP=8;
    public static final int L_PAREN=9;
    public static final int NAME=10;
    public static final int NESTED_PROPERTY=11;
    public static final int NEWLINE=12;
    public static final int R_PAREN=13;
    public static final int STRING=14;
    public static final int WS=15;

    // delegates
    public Parser[] getDelegates() {
        return new Parser[] {};
    }

    // delegators


    public AclDslParser(TokenStream input) {
        this(input, new RecognizerSharedState());
    }
    public AclDslParser(TokenStream input, RecognizerSharedState state) {
        super(input, state);
    }

    public String[] getTokenNames() { return AclDslParser.tokenNames; }
    public String getGrammarFileName() { return "E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g"; }



    // $ANTLR start "comparisonExpression"
    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:65:1: comparisonExpression returns [TreeNode value] : a= NESTED_PROPERTY b= COMPARISON_OP c= ( NESTED_PROPERTY | STRING | INT | FLOAT ) ;
    public final ASTNode comparisonExpression() throws RecognitionException {
        ASTNode value = null;


        Token a=null;
        Token b=null;
        Token c=null;

        try {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:66:2: (a= NESTED_PROPERTY b= COMPARISON_OP c= ( NESTED_PROPERTY | STRING | INT | FLOAT ) )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:66:4: a= NESTED_PROPERTY b= COMPARISON_OP c= ( NESTED_PROPERTY | STRING | INT | FLOAT )
            {
            a=(Token)match(input,NESTED_PROPERTY,FOLLOW_NESTED_PROPERTY_in_comparisonExpression392); 

            b=(Token)match(input,COMPARISON_OP,FOLLOW_COMPARISON_OP_in_comparisonExpression396); 

            c=(Token)input.LT(1);

            if ( (input.LA(1) >= FLOAT && input.LA(1) <= INT)||input.LA(1)==NESTED_PROPERTY||input.LA(1)==STRING ) {
                input.consume();
                state.errorRecovery=false;
            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                throw mse;
            }


            value = ASTNode.create((b!=null?b.getText():null)).left((a!=null?a.getText():null)).right((c!=null?c.getText():null));

            }

        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
        }

        finally {
        	// do for sure before leaving
        }
        return value;
    }
    // $ANTLR end "comparisonExpression"



    // $ANTLR start "logicalExpression"
    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:69:1: logicalExpression returns [TreeNode value] : a= comparisonExpression (b= LOGICAL_OP c= comparisonExpression )* ;
    public final ASTNode logicalExpression() throws RecognitionException {
        ASTNode value = null;


        Token b=null;
        ASTNode a =null;

        ASTNode c =null;


        try {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:70:2: (a= comparisonExpression (b= LOGICAL_OP c= comparisonExpression )* )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:70:4: a= comparisonExpression (b= LOGICAL_OP c= comparisonExpression )*
            {
            pushFollow(FOLLOW_comparisonExpression_in_logicalExpression427);
            a=comparisonExpression();

            state._fsp--;


            value = a;

            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:70:48: (b= LOGICAL_OP c= comparisonExpression )*
            loop1:
            do {
                int alt1=2;
                int LA1_0 = input.LA(1);

                if ( (LA1_0==LOGICAL_OP) ) {
                    int LA1_2 = input.LA(2);

                    if ( (LA1_2==NESTED_PROPERTY) ) {
                        int LA1_3 = input.LA(3);

                        if ( (LA1_3==COMPARISON_OP) ) {
                            int LA1_4 = input.LA(4);

                            if ( ((LA1_4 >= FLOAT && LA1_4 <= INT)||LA1_4==NESTED_PROPERTY||LA1_4==STRING) ) {
                                alt1=1;
                            }


                        }


                    }


                }


                switch (alt1) {
            	case 1 :
            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:70:49: b= LOGICAL_OP c= comparisonExpression
            	    {
            	    b=(Token)match(input,LOGICAL_OP,FOLLOW_LOGICAL_OP_in_logicalExpression434); 

            	    pushFollow(FOLLOW_comparisonExpression_in_logicalExpression438);
            	    c=comparisonExpression();

            	    state._fsp--;



            	    				if ((b!=null?b.getText():null) != null) {
            	    					if (c != null) {
            	    						//the sub tree in the parenthesised block get precedence
            	    						//so that is kept down the tree
            	    				 		value = ASTNode.create((b!=null?b.getText():null)).left(value).right(c);
            	    				 	}
            	    			 	}

            	    }
            	    break;

            	default :
            	    break loop1;
                }
            } while (true);


            }

        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
        }

        finally {
        	// do for sure before leaving
        }
        return value;
    }
    // $ANTLR end "logicalExpression"



    // $ANTLR start "parenthesisedLogicalExpression"
    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:80:1: parenthesisedLogicalExpression returns [TreeNode value] : a= L_PAREN b= logicalExpression c= R_PAREN ;
    public final ASTNode parenthesisedLogicalExpression() throws RecognitionException {
        ASTNode value = null;


        Token a=null;
        Token c=null;
        ASTNode b =null;


        try {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:81:2: (a= L_PAREN b= logicalExpression c= R_PAREN )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:81:4: a= L_PAREN b= logicalExpression c= R_PAREN
            {
            a=(Token)match(input,L_PAREN,FOLLOW_L_PAREN_in_parenthesisedLogicalExpression462); 

            pushFollow(FOLLOW_logicalExpression_in_parenthesisedLogicalExpression466);
            b=logicalExpression();

            state._fsp--;


            c=(Token)match(input,R_PAREN,FOLLOW_R_PAREN_in_parenthesisedLogicalExpression470); 

            value = b;

            }

        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
        }

        finally {
        	// do for sure before leaving
        }
        return value;
    }
    // $ANTLR end "parenthesisedLogicalExpression"



    // $ANTLR start "aclExpression"
    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:84:1: aclExpression returns [TreeNode value] : (a1= logicalExpression |a2= parenthesisedLogicalExpression )? (b= LOGICAL_OP (c1= parenthesisedLogicalExpression |c2= logicalExpression ) )* ;
    public final ASTNode aclExpression() throws RecognitionException {
        ASTNode value = null;


        Token b=null;
        ASTNode a1 =null;

        ASTNode a2 =null;

        ASTNode c1 =null;

        ASTNode c2 =null;


        try {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:85:2: ( (a1= logicalExpression |a2= parenthesisedLogicalExpression )? (b= LOGICAL_OP (c1= parenthesisedLogicalExpression |c2= logicalExpression ) )* )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:85:4: (a1= logicalExpression |a2= parenthesisedLogicalExpression )? (b= LOGICAL_OP (c1= parenthesisedLogicalExpression |c2= logicalExpression ) )*
            {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:85:4: (a1= logicalExpression |a2= parenthesisedLogicalExpression )?
            int alt2=3;
            int LA2_0 = input.LA(1);

            if ( (LA2_0==NESTED_PROPERTY) ) {
                alt2=1;
            }
            else if ( (LA2_0==L_PAREN) ) {
                alt2=2;
            }
            switch (alt2) {
                case 1 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:85:5: a1= logicalExpression
                    {
                    pushFollow(FOLLOW_logicalExpression_in_aclExpression490);
                    a1=logicalExpression();

                    state._fsp--;


                    value = a1;

                    }
                    break;
                case 2 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:85:50: a2= parenthesisedLogicalExpression
                    {
                    pushFollow(FOLLOW_parenthesisedLogicalExpression_in_aclExpression498);
                    a2=parenthesisedLogicalExpression();

                    state._fsp--;


                    value = a2;

                    }
                    break;

            }


            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:86:3: (b= LOGICAL_OP (c1= parenthesisedLogicalExpression |c2= logicalExpression ) )*
            loop4:
            do {
                int alt4=2;
                int LA4_0 = input.LA(1);

                if ( (LA4_0==LOGICAL_OP) ) {
                    alt4=1;
                }


                switch (alt4) {
            	case 1 :
            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:86:4: b= LOGICAL_OP (c1= parenthesisedLogicalExpression |c2= logicalExpression )
            	    {
            	    b=(Token)match(input,LOGICAL_OP,FOLLOW_LOGICAL_OP_in_aclExpression511); 

            	    value = ASTNode.create((b!=null?b.getText():null)).left(value);

            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:87:3: (c1= parenthesisedLogicalExpression |c2= logicalExpression )
            	    int alt3=2;
            	    int LA3_0 = input.LA(1);

            	    if ( (LA3_0==L_PAREN) ) {
            	        alt3=1;
            	    }
            	    else if ( (LA3_0==NESTED_PROPERTY) ) {
            	        alt3=2;
            	    }
            	    else {
            	        NoViableAltException nvae =
            	            new NoViableAltException("", 3, 0, input);

            	        throw nvae;

            	    }
            	    switch (alt3) {
            	        case 1 :
            	            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:87:4: c1= parenthesisedLogicalExpression
            	            {
            	            pushFollow(FOLLOW_parenthesisedLogicalExpression_in_aclExpression521);
            	            c1=parenthesisedLogicalExpression();

            	            state._fsp--;



            	            			if (c1 != null) {
            	            				//the sub tree in the parenthesised block get precedence
            	            				//so that is kept down the tree
            	            		 		value.right(c1);
            	            		 	}
            	            		

            	            }
            	            break;
            	        case 2 :
            	            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:93:7: c2= logicalExpression
            	            {
            	            pushFollow(FOLLOW_logicalExpression_in_aclExpression529);
            	            c2=logicalExpression();

            	            state._fsp--;



            	            			if (c2 != null) {
            	            				//the sub tree in the parenthesised block get precedence
            	            				//so that is kept down the tree
            	            		 		value.right(c2);
            	            		 	}
            	            		

            	            }
            	            break;

            	    }


            	    }
            	    break;

            	default :
            	    break loop4;
                }
            } while (true);


            }

        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
        }

        finally {
        	// do for sure before leaving
        }
        return value;
    }
    // $ANTLR end "aclExpression"

    // Delegated rules


 

    public static final BitSet FOLLOW_NESTED_PROPERTY_in_comparisonExpression392 = new BitSet(new long[]{0x0000000000000010L});
    public static final BitSet FOLLOW_COMPARISON_OP_in_comparisonExpression396 = new BitSet(new long[]{0x00000000000048C0L});
    public static final BitSet FOLLOW_set_in_comparisonExpression400 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_comparisonExpression_in_logicalExpression427 = new BitSet(new long[]{0x0000000000000102L});
    public static final BitSet FOLLOW_LOGICAL_OP_in_logicalExpression434 = new BitSet(new long[]{0x0000000000000800L});
    public static final BitSet FOLLOW_comparisonExpression_in_logicalExpression438 = new BitSet(new long[]{0x0000000000000102L});
    public static final BitSet FOLLOW_L_PAREN_in_parenthesisedLogicalExpression462 = new BitSet(new long[]{0x0000000000000800L});
    public static final BitSet FOLLOW_logicalExpression_in_parenthesisedLogicalExpression466 = new BitSet(new long[]{0x0000000000002000L});
    public static final BitSet FOLLOW_R_PAREN_in_parenthesisedLogicalExpression470 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_logicalExpression_in_aclExpression490 = new BitSet(new long[]{0x0000000000000102L});
    public static final BitSet FOLLOW_parenthesisedLogicalExpression_in_aclExpression498 = new BitSet(new long[]{0x0000000000000102L});
    public static final BitSet FOLLOW_LOGICAL_OP_in_aclExpression511 = new BitSet(new long[]{0x0000000000000A00L});
    public static final BitSet FOLLOW_parenthesisedLogicalExpression_in_aclExpression521 = new BitSet(new long[]{0x0000000000000102L});
    public static final BitSet FOLLOW_logicalExpression_in_aclExpression529 = new BitSet(new long[]{0x0000000000000102L});

}