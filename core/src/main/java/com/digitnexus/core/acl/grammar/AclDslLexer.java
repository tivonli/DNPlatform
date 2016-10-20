// $ANTLR 3.4 E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g 2012-06-20 04:05:46

package com.digitnexus.core.acl.grammar;


import org.antlr.runtime.*;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked"})
public class AclDslLexer extends Lexer {
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
    // delegators
    public Lexer[] getDelegates() {
        return new Lexer[] {};
    }

    public AclDslLexer() {} 
    public AclDslLexer(CharStream input) {
        this(input, new RecognizerSharedState());
    }
    public AclDslLexer(CharStream input, RecognizerSharedState state) {
        super(input,state);
    }
    public String getGrammarFileName() { return "E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g"; }

    // $ANTLR start "INT"
    public final void mINT() throws RecognitionException {
        try {
            int _type = INT;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:12:5: ( ( '0' .. '9' )+ )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:12:7: ( '0' .. '9' )+
            {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:12:7: ( '0' .. '9' )+
            int cnt1=0;
            loop1:
            do {
                int alt1=2;
                int LA1_0 = input.LA(1);

                if ( ((LA1_0 >= '0' && LA1_0 <= '9')) ) {
                    alt1=1;
                }


                switch (alt1) {
            	case 1 :
            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
            	    {
            	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9') ) {
            	        input.consume();
            	    }
            	    else {
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        recover(mse);
            	        throw mse;
            	    }


            	    }
            	    break;

            	default :
            	    if ( cnt1 >= 1 ) break loop1;
                        EarlyExitException eee =
                            new EarlyExitException(1, input);
                        throw eee;
                }
                cnt1++;
            } while (true);


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "INT"

    // $ANTLR start "FLOAT"
    public final void mFLOAT() throws RecognitionException {
        try {
            int _type = FLOAT;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:16:5: ( ( '0' .. '9' )+ '.' ( '0' .. '9' )* ( EXPONENT )? | '.' ( '0' .. '9' )+ ( EXPONENT )? | ( '0' .. '9' )+ EXPONENT )
            int alt8=3;
            alt8 = dfa8.predict(input);
            switch (alt8) {
                case 1 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:16:9: ( '0' .. '9' )+ '.' ( '0' .. '9' )* ( EXPONENT )?
                    {
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:16:9: ( '0' .. '9' )+
                    int cnt2=0;
                    loop2:
                    do {
                        int alt2=2;
                        int LA2_0 = input.LA(1);

                        if ( ((LA2_0 >= '0' && LA2_0 <= '9')) ) {
                            alt2=1;
                        }


                        switch (alt2) {
                    	case 1 :
                    	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
                    	    {
                    	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9') ) {
                    	        input.consume();
                    	    }
                    	    else {
                    	        MismatchedSetException mse = new MismatchedSetException(null,input);
                    	        recover(mse);
                    	        throw mse;
                    	    }


                    	    }
                    	    break;

                    	default :
                    	    if ( cnt2 >= 1 ) break loop2;
                                EarlyExitException eee =
                                    new EarlyExitException(2, input);
                                throw eee;
                        }
                        cnt2++;
                    } while (true);


                    match('.'); 

                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:16:25: ( '0' .. '9' )*
                    loop3:
                    do {
                        int alt3=2;
                        int LA3_0 = input.LA(1);

                        if ( ((LA3_0 >= '0' && LA3_0 <= '9')) ) {
                            alt3=1;
                        }


                        switch (alt3) {
                    	case 1 :
                    	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
                    	    {
                    	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9') ) {
                    	        input.consume();
                    	    }
                    	    else {
                    	        MismatchedSetException mse = new MismatchedSetException(null,input);
                    	        recover(mse);
                    	        throw mse;
                    	    }


                    	    }
                    	    break;

                    	default :
                    	    break loop3;
                        }
                    } while (true);


                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:16:37: ( EXPONENT )?
                    int alt4=2;
                    int LA4_0 = input.LA(1);

                    if ( (LA4_0=='E'||LA4_0=='e') ) {
                        alt4=1;
                    }
                    switch (alt4) {
                        case 1 :
                            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:16:37: EXPONENT
                            {
                            mEXPONENT(); 


                            }
                            break;

                    }


                    }
                    break;
                case 2 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:17:9: '.' ( '0' .. '9' )+ ( EXPONENT )?
                    {
                    match('.'); 

                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:17:13: ( '0' .. '9' )+
                    int cnt5=0;
                    loop5:
                    do {
                        int alt5=2;
                        int LA5_0 = input.LA(1);

                        if ( ((LA5_0 >= '0' && LA5_0 <= '9')) ) {
                            alt5=1;
                        }


                        switch (alt5) {
                    	case 1 :
                    	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
                    	    {
                    	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9') ) {
                    	        input.consume();
                    	    }
                    	    else {
                    	        MismatchedSetException mse = new MismatchedSetException(null,input);
                    	        recover(mse);
                    	        throw mse;
                    	    }


                    	    }
                    	    break;

                    	default :
                    	    if ( cnt5 >= 1 ) break loop5;
                                EarlyExitException eee =
                                    new EarlyExitException(5, input);
                                throw eee;
                        }
                        cnt5++;
                    } while (true);


                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:17:25: ( EXPONENT )?
                    int alt6=2;
                    int LA6_0 = input.LA(1);

                    if ( (LA6_0=='E'||LA6_0=='e') ) {
                        alt6=1;
                    }
                    switch (alt6) {
                        case 1 :
                            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:17:25: EXPONENT
                            {
                            mEXPONENT(); 


                            }
                            break;

                    }


                    }
                    break;
                case 3 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:18:9: ( '0' .. '9' )+ EXPONENT
                    {
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:18:9: ( '0' .. '9' )+
                    int cnt7=0;
                    loop7:
                    do {
                        int alt7=2;
                        int LA7_0 = input.LA(1);

                        if ( ((LA7_0 >= '0' && LA7_0 <= '9')) ) {
                            alt7=1;
                        }


                        switch (alt7) {
                    	case 1 :
                    	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
                    	    {
                    	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9') ) {
                    	        input.consume();
                    	    }
                    	    else {
                    	        MismatchedSetException mse = new MismatchedSetException(null,input);
                    	        recover(mse);
                    	        throw mse;
                    	    }


                    	    }
                    	    break;

                    	default :
                    	    if ( cnt7 >= 1 ) break loop7;
                                EarlyExitException eee =
                                    new EarlyExitException(7, input);
                                throw eee;
                        }
                        cnt7++;
                    } while (true);


                    mEXPONENT(); 


                    }
                    break;

            }
            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "FLOAT"

    // $ANTLR start "LOGICAL_OP"
    public final void mLOGICAL_OP() throws RecognitionException {
        try {
            int _type = LOGICAL_OP;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:22:2: ( 'AND' | 'OR' | 'and' | 'or' )
            int alt9=4;
            switch ( input.LA(1) ) {
            case 'A':
                {
                alt9=1;
                }
                break;
            case 'O':
                {
                alt9=2;
                }
                break;
            case 'a':
                {
                alt9=3;
                }
                break;
            case 'o':
                {
                alt9=4;
                }
                break;
            default:
                NoViableAltException nvae =
                    new NoViableAltException("", 9, 0, input);

                throw nvae;

            }

            switch (alt9) {
                case 1 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:22:4: 'AND'
                    {
                    match("AND"); 



                    }
                    break;
                case 2 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:23:4: 'OR'
                    {
                    match("OR"); 



                    }
                    break;
                case 3 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:24:4: 'and'
                    {
                    match("and"); 



                    }
                    break;
                case 4 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:25:4: 'or'
                    {
                    match("or"); 



                    }
                    break;

            }
            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "LOGICAL_OP"

    // $ANTLR start "COMPARISON_OP"
    public final void mCOMPARISON_OP() throws RecognitionException {
        try {
            int _type = COMPARISON_OP;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:29:2: ( '>' | '<' | '>=' | '=>' | '<=' | '=<' | '!=' | '=' | 'like' )
            int alt10=9;
            switch ( input.LA(1) ) {
            case '>':
                {
                int LA10_1 = input.LA(2);

                if ( (LA10_1=='=') ) {
                    alt10=3;
                }
                else {
                    alt10=1;
                }
                }
                break;
            case '<':
                {
                int LA10_2 = input.LA(2);

                if ( (LA10_2=='=') ) {
                    alt10=5;
                }
                else {
                    alt10=2;
                }
                }
                break;
            case '=':
                {
                switch ( input.LA(2) ) {
                case '>':
                    {
                    alt10=4;
                    }
                    break;
                case '<':
                    {
                    alt10=6;
                    }
                    break;
                default:
                    alt10=8;
                }

                }
                break;
            case '!':
                {
                alt10=7;
                }
                break;
            case 'l':
                {
                alt10=9;
                }
                break;
            default:
                NoViableAltException nvae =
                    new NoViableAltException("", 10, 0, input);

                throw nvae;

            }

            switch (alt10) {
                case 1 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:29:4: '>'
                    {
                    match('>'); 

                    }
                    break;
                case 2 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:30:4: '<'
                    {
                    match('<'); 

                    }
                    break;
                case 3 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:31:4: '>='
                    {
                    match(">="); 



                    }
                    break;
                case 4 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:32:4: '=>'
                    {
                    match("=>"); 



                    }
                    break;
                case 5 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:33:4: '<='
                    {
                    match("<="); 



                    }
                    break;
                case 6 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:34:4: '=<'
                    {
                    match("=<"); 



                    }
                    break;
                case 7 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:35:4: '!='
                    {
                    match("!="); 



                    }
                    break;
                case 8 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:36:4: '='
                    {
                    match('='); 

                    }
                    break;
                case 9 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:37:4: 'like'
                    {
                    match("like"); 



                    }
                    break;

            }
            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "COMPARISON_OP"

    // $ANTLR start "NAME"
    public final void mNAME() throws RecognitionException {
        try {
            int _type = NAME;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:41:7: ( ( 'a' .. 'z' | 'A' .. 'Z' | '_' ) ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )* )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:41:9: ( 'a' .. 'z' | 'A' .. 'Z' | '_' ) ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )*
            {
            if ( (input.LA(1) >= 'A' && input.LA(1) <= 'Z')||input.LA(1)=='_'||(input.LA(1) >= 'a' && input.LA(1) <= 'z') ) {
                input.consume();
            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;
            }


            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:41:33: ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )*
            loop11:
            do {
                int alt11=2;
                int LA11_0 = input.LA(1);

                if ( ((LA11_0 >= '0' && LA11_0 <= '9')||(LA11_0 >= 'A' && LA11_0 <= 'Z')||LA11_0=='_'||(LA11_0 >= 'a' && LA11_0 <= 'z')) ) {
                    alt11=1;
                }


                switch (alt11) {
            	case 1 :
            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
            	    {
            	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9')||(input.LA(1) >= 'A' && input.LA(1) <= 'Z')||input.LA(1)=='_'||(input.LA(1) >= 'a' && input.LA(1) <= 'z') ) {
            	        input.consume();
            	    }
            	    else {
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        recover(mse);
            	        throw mse;
            	    }


            	    }
            	    break;

            	default :
            	    break loop11;
                }
            } while (true);


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "NAME"

    // $ANTLR start "NESTED_PROPERTY"
    public final void mNESTED_PROPERTY() throws RecognitionException {
        try {
            int _type = NESTED_PROPERTY;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:45:2: ( NAME ( '.' NAME )* )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:45:4: NAME ( '.' NAME )*
            {
            mNAME(); 


            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:45:9: ( '.' NAME )*
            loop12:
            do {
                int alt12=2;
                int LA12_0 = input.LA(1);

                if ( (LA12_0=='.') ) {
                    alt12=1;
                }


                switch (alt12) {
            	case 1 :
            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:45:10: '.' NAME
            	    {
            	    match('.'); 

            	    mNAME(); 


            	    }
            	    break;

            	default :
            	    break loop12;
                }
            } while (true);


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "NESTED_PROPERTY"

    // $ANTLR start "STRING"
    public final void mSTRING() throws RecognitionException {
        try {
            int _type = STRING;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:48:8: ( '\\'' ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )* ( '%' )? '\\'' )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:48:10: '\\'' ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )* ( '%' )? '\\''
            {
            match('\''); 

            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:48:15: ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )*
            loop13:
            do {
                int alt13=2;
                int LA13_0 = input.LA(1);

                if ( ((LA13_0 >= '0' && LA13_0 <= '9')||(LA13_0 >= 'A' && LA13_0 <= 'Z')||LA13_0=='_'||(LA13_0 >= 'a' && LA13_0 <= 'z')) ) {
                    alt13=1;
                }


                switch (alt13) {
            	case 1 :
            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
            	    {
            	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9')||(input.LA(1) >= 'A' && input.LA(1) <= 'Z')||input.LA(1)=='_'||(input.LA(1) >= 'a' && input.LA(1) <= 'z') ) {
            	        input.consume();
            	    }
            	    else {
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        recover(mse);
            	        throw mse;
            	    }


            	    }
            	    break;

            	default :
            	    break loop13;
                }
            } while (true);


            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:48:49: ( '%' )?
            int alt14=2;
            int LA14_0 = input.LA(1);

            if ( (LA14_0=='%') ) {
                alt14=1;
            }
            switch (alt14) {
                case 1 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:48:49: '%'
                    {
                    match('%'); 

                    }
                    break;

            }


            match('\''); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "STRING"

    // $ANTLR start "L_PAREN"
    public final void mL_PAREN() throws RecognitionException {
        try {
            int _type = L_PAREN;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:51:9: ( '(' )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:51:11: '('
            {
            match('('); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "L_PAREN"

    // $ANTLR start "R_PAREN"
    public final void mR_PAREN() throws RecognitionException {
        try {
            int _type = R_PAREN;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:53:9: ( ')' )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:53:11: ')'
            {
            match(')'); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "R_PAREN"

    // $ANTLR start "WS"
    public final void mWS() throws RecognitionException {
        try {
            int _type = WS;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:55:5: ( ( ' ' | '\\t' ) )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:55:9: ( ' ' | '\\t' )
            {
            if ( input.LA(1)=='\t'||input.LA(1)==' ' ) {
                input.consume();
            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;
            }


            _channel=HIDDEN;

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "WS"

    // $ANTLR start "NEWLINE"
    public final void mNEWLINE() throws RecognitionException {
        try {
            int _type = NEWLINE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:60:8: ( ( '\\r' )? '\\n' )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:60:9: ( '\\r' )? '\\n'
            {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:60:9: ( '\\r' )?
            int alt15=2;
            int LA15_0 = input.LA(1);

            if ( (LA15_0=='\r') ) {
                alt15=1;
            }
            switch (alt15) {
                case 1 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:60:9: '\\r'
                    {
                    match('\r'); 

                    }
                    break;

            }


            match('\n'); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "NEWLINE"

    // $ANTLR start "EXPONENT"
    public final void mEXPONENT() throws RecognitionException {
        try {
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:64:10: ( ( 'e' | 'E' ) ( '+' | '-' )? ( '0' .. '9' )+ )
            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:64:12: ( 'e' | 'E' ) ( '+' | '-' )? ( '0' .. '9' )+
            {
            if ( input.LA(1)=='E'||input.LA(1)=='e' ) {
                input.consume();
            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;
            }


            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:64:22: ( '+' | '-' )?
            int alt16=2;
            int LA16_0 = input.LA(1);

            if ( (LA16_0=='+'||LA16_0=='-') ) {
                alt16=1;
            }
            switch (alt16) {
                case 1 :
                    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
                    {
                    if ( input.LA(1)=='+'||input.LA(1)=='-' ) {
                        input.consume();
                    }
                    else {
                        MismatchedSetException mse = new MismatchedSetException(null,input);
                        recover(mse);
                        throw mse;
                    }


                    }
                    break;

            }


            // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:64:33: ( '0' .. '9' )+
            int cnt17=0;
            loop17:
            do {
                int alt17=2;
                int LA17_0 = input.LA(1);

                if ( ((LA17_0 >= '0' && LA17_0 <= '9')) ) {
                    alt17=1;
                }


                switch (alt17) {
            	case 1 :
            	    // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:
            	    {
            	    if ( (input.LA(1) >= '0' && input.LA(1) <= '9') ) {
            	        input.consume();
            	    }
            	    else {
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        recover(mse);
            	        throw mse;
            	    }


            	    }
            	    break;

            	default :
            	    if ( cnt17 >= 1 ) break loop17;
                        EarlyExitException eee =
                            new EarlyExitException(17, input);
                        throw eee;
                }
                cnt17++;
            } while (true);


            }


        }
        finally {
        	// do for sure before leaving
        }
    }
    // $ANTLR end "EXPONENT"

    public void mTokens() throws RecognitionException {
        // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:8: ( INT | FLOAT | LOGICAL_OP | COMPARISON_OP | NAME | NESTED_PROPERTY | STRING | L_PAREN | R_PAREN | WS | NEWLINE )
        int alt18=11;
        alt18 = dfa18.predict(input);
        switch (alt18) {
            case 1 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:10: INT
                {
                mINT(); 


                }
                break;
            case 2 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:14: FLOAT
                {
                mFLOAT(); 


                }
                break;
            case 3 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:20: LOGICAL_OP
                {
                mLOGICAL_OP(); 


                }
                break;
            case 4 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:31: COMPARISON_OP
                {
                mCOMPARISON_OP(); 


                }
                break;
            case 5 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:45: NAME
                {
                mNAME(); 


                }
                break;
            case 6 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:50: NESTED_PROPERTY
                {
                mNESTED_PROPERTY(); 


                }
                break;
            case 7 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:66: STRING
                {
                mSTRING(); 


                }
                break;
            case 8 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:73: L_PAREN
                {
                mL_PAREN(); 


                }
                break;
            case 9 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:81: R_PAREN
                {
                mR_PAREN(); 


                }
                break;
            case 10 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:89: WS
                {
                mWS(); 


                }
                break;
            case 11 :
                // E:\\eclipse workspace\\LearnAntlr\\grammar\\acl\\AclDsl.g:1:92: NEWLINE
                {
                mNEWLINE(); 


                }
                break;

        }

    }


    protected DFA8 dfa8 = new DFA8(this);
    protected DFA18 dfa18 = new DFA18(this);
    static final String DFA8_eotS =
        "\5\uffff";
    static final String DFA8_eofS =
        "\5\uffff";
    static final String DFA8_minS =
        "\2\56\3\uffff";
    static final String DFA8_maxS =
        "\1\71\1\145\3\uffff";
    static final String DFA8_acceptS =
        "\2\uffff\1\2\1\1\1\3";
    static final String DFA8_specialS =
        "\5\uffff}>";
    static final String[] DFA8_transitionS = {
            "\1\2\1\uffff\12\1",
            "\1\3\1\uffff\12\1\13\uffff\1\4\37\uffff\1\4",
            "",
            "",
            ""
    };

    static final short[] DFA8_eot = DFA.unpackEncodedString(DFA8_eotS);
    static final short[] DFA8_eof = DFA.unpackEncodedString(DFA8_eofS);
    static final char[] DFA8_min = DFA.unpackEncodedStringToUnsignedChars(DFA8_minS);
    static final char[] DFA8_max = DFA.unpackEncodedStringToUnsignedChars(DFA8_maxS);
    static final short[] DFA8_accept = DFA.unpackEncodedString(DFA8_acceptS);
    static final short[] DFA8_special = DFA.unpackEncodedString(DFA8_specialS);
    static final short[][] DFA8_transition;

    static {
        int numStates = DFA8_transitionS.length;
        DFA8_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA8_transition[i] = DFA.unpackEncodedString(DFA8_transitionS[i]);
        }
    }

    class DFA8 extends DFA {

        public DFA8(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 8;
            this.eot = DFA8_eot;
            this.eof = DFA8_eof;
            this.min = DFA8_min;
            this.max = DFA8_max;
            this.accept = DFA8_accept;
            this.special = DFA8_special;
            this.transition = DFA8_transition;
        }
        public String getDescription() {
            return "15:1: FLOAT : ( ( '0' .. '9' )+ '.' ( '0' .. '9' )* ( EXPONENT )? | '.' ( '0' .. '9' )+ ( EXPONENT )? | ( '0' .. '9' )+ EXPONENT );";
        }
    }
    static final String DFA18_eotS =
        "\1\uffff\1\17\1\uffff\4\22\1\uffff\2\22\6\uffff\2\22\2\uffff\1\31"+
        "\1\22\1\31\1\22\1\31\1\uffff\1\31\1\22\1\7";
    static final String DFA18_eofS =
        "\35\uffff";
    static final String DFA18_minS =
        "\1\11\1\56\1\uffff\4\56\1\uffff\2\56\6\uffff\2\56\2\uffff\5\56\1"+
        "\uffff\3\56";
    static final String DFA18_maxS =
        "\1\172\1\145\1\uffff\4\172\1\uffff\2\172\6\uffff\2\172\2\uffff\5"+
        "\172\1\uffff\3\172";
    static final String DFA18_acceptS =
        "\2\uffff\1\2\4\uffff\1\4\2\uffff\1\7\1\10\1\11\1\12\1\13\1\1\2\uffff"+
        "\1\5\1\6\5\uffff\1\3\3\uffff";
    static final String DFA18_specialS =
        "\35\uffff}>";
    static final String[] DFA18_transitionS = {
            "\1\15\1\16\2\uffff\1\16\22\uffff\1\15\1\7\5\uffff\1\12\1\13"+
            "\1\14\4\uffff\1\2\1\uffff\12\1\2\uffff\3\7\2\uffff\1\3\15\11"+
            "\1\4\13\11\4\uffff\1\11\1\uffff\1\5\12\11\1\10\2\11\1\6\13\11",
            "\1\2\1\uffff\12\1\13\uffff\1\2\37\uffff\1\2",
            "",
            "\1\23\1\uffff\12\21\7\uffff\15\21\1\20\14\21\4\uffff\1\21\1"+
            "\uffff\32\21",
            "\1\23\1\uffff\12\21\7\uffff\21\21\1\24\10\21\4\uffff\1\21\1"+
            "\uffff\32\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\15\21"+
            "\1\25\14\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\21\21"+
            "\1\26\10\21",
            "",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\10\21"+
            "\1\27\21\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\32\21",
            "",
            "",
            "",
            "",
            "",
            "",
            "\1\23\1\uffff\12\21\7\uffff\3\21\1\30\26\21\4\uffff\1\21\1"+
            "\uffff\32\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\32\21",
            "",
            "",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\32\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\3\21"+
            "\1\32\26\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\32\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\12\21"+
            "\1\33\17\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\32\21",
            "",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\32\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\4\21"+
            "\1\34\25\21",
            "\1\23\1\uffff\12\21\7\uffff\32\21\4\uffff\1\21\1\uffff\32\21"
    };

    static final short[] DFA18_eot = DFA.unpackEncodedString(DFA18_eotS);
    static final short[] DFA18_eof = DFA.unpackEncodedString(DFA18_eofS);
    static final char[] DFA18_min = DFA.unpackEncodedStringToUnsignedChars(DFA18_minS);
    static final char[] DFA18_max = DFA.unpackEncodedStringToUnsignedChars(DFA18_maxS);
    static final short[] DFA18_accept = DFA.unpackEncodedString(DFA18_acceptS);
    static final short[] DFA18_special = DFA.unpackEncodedString(DFA18_specialS);
    static final short[][] DFA18_transition;

    static {
        int numStates = DFA18_transitionS.length;
        DFA18_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA18_transition[i] = DFA.unpackEncodedString(DFA18_transitionS[i]);
        }
    }

    class DFA18 extends DFA {

        public DFA18(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 18;
            this.eot = DFA18_eot;
            this.eof = DFA18_eof;
            this.min = DFA18_min;
            this.max = DFA18_max;
            this.accept = DFA18_accept;
            this.special = DFA18_special;
            this.transition = DFA18_transition;
        }
        public String getDescription() {
            return "1:1: Tokens : ( INT | FLOAT | LOGICAL_OP | COMPARISON_OP | NAME | NESTED_PROPERTY | STRING | L_PAREN | R_PAREN | WS | NEWLINE );";
        }
    }
 

}