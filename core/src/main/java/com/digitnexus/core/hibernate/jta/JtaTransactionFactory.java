package com.digitnexus.core.hibernate.jta;


import org.hibernate.engine.transaction.spi.TransactionCoordinator;

public class JtaTransactionFactory extends org.hibernate.engine.transaction.internal.jta.JtaTransactionFactory {
	
	private static final long	serialVersionUID	= 1295064489274915333L;

	@Override
	public JtaTransaction createTransaction(TransactionCoordinator transactionCoordinator) {
				return new JtaTransaction(transactionCoordinator);
	}

}
