package com.digitnexus.core.tx;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.DefaultTransactionStatus;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
/**
 * Extended {@link org.springframework.transaction.jta.JtaTransactionManager} to manage transaction synchornizations
 * @author Adi
 *
 */
public class JtaTransactionManager extends org.springframework.transaction.jta.JtaTransactionManager implements
		TransactionSynchronizationRegistry {
	private final Logger	logger	= LoggerFactory.getLogger(getClass());
	private static final long			serialVersionUID			= 1L;

	List<TransactionSynchronization>	transactionSynchronizations	= new ArrayList<TransactionSynchronization>();

	@Override
	public void addTransactionSyncronization(TransactionSynchronization transactionSynchronization) {
		transactionSynchronizations.add(transactionSynchronization);
		logger.debug("Added synchronization, "+transactionSynchronization.getClass());

	}
	
	@Override
	protected void prepareSynchronization(DefaultTransactionStatus status, TransactionDefinition definition) {
		super.prepareSynchronization(status, definition);
		if(!transactionSynchronizations.isEmpty()){
			for(TransactionSynchronization transactionSynchronization:transactionSynchronizations){
				TransactionSynchronizationManager.registerSynchronization(transactionSynchronization);
			}
		}
	}

}
