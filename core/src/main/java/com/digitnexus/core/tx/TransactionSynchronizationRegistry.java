package com.digitnexus.core.tx;

import org.springframework.transaction.support.TransactionSynchronization;

public interface TransactionSynchronizationRegistry {
 
	/**
	 * Register synchronization with registry.Implementing class will take care of registering with every new synchronization.
	 * See {@link JtaTransactionManager}
	 * @param transactionSynchronization
	 */
	void addTransactionSyncronization(TransactionSynchronization transactionSynchronization);
}
