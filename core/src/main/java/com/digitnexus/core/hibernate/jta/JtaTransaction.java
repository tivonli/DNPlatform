package com.digitnexus.core.hibernate.jta;

import javax.transaction.SystemException;
import javax.transaction.UserTransaction;

import org.hibernate.engine.transaction.spi.TransactionCoordinator;
import org.hibernate.internal.CoreMessageLogger;
import org.jboss.logging.Logger;

public class JtaTransaction extends org.hibernate.engine.transaction.internal.jta.JtaTransaction {
	
	private static final CoreMessageLogger LOG = Logger.getMessageLogger(CoreMessageLogger.class, JtaTransaction.class.getName());

	protected JtaTransaction(TransactionCoordinator transactionCoordinator) {
		super(transactionCoordinator);
	}
	
	@Override
	public void markRollbackOnly() {
		UserTransaction userTransaction=getUserTransaction();
		if(userTransaction==null){
			userTransaction=jtaPlatform().retrieveUserTransaction();
		}
		
		LOG.trace( "Marking transaction for rollback only" );
		try {
			userTransaction.setRollbackOnly();
			LOG.debug( "set JTA UserTransaction to rollback only" );
		}
		catch (SystemException e) {
			LOG.debug( "Unable to mark transaction for rollback only", e );
		}
		
	}

}
