package com.digitnexus.core.test.tx;

import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;

import com.digitnexus.core.tx.TransactionSynchronizationRegistry;

/**
 * This class is to just to avoid spring dependency errors
 * @author Adi
 *
 */
@Component
public class EmptyTransactionSynchronizationRegistry implements TransactionSynchronizationRegistry {

	@Override
	public void addTransactionSyncronization(TransactionSynchronization transactionSynchronization) {
		// TODO Auto-generated method stub

	}

}
