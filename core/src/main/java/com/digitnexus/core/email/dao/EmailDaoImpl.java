/**
 * 
 */
package com.digitnexus.core.email.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.domain.Email;
import com.digitnexus.core.email.scheduler.EmailMessageScheduler;

/**
 * @author Adi
 *
 */
@Repository
public class EmailDaoImpl extends BaseDaoImpl implements EmailDao {
    @Autowired
	private EmailMessageScheduler emailMessageScheduler;
	@SuppressWarnings("unchecked")
	@Override
	public List<Email> findEmailMsgsByMaxAttempt() {
		return find("from Email as msg where msg.loopCounter < "  + emailMessageScheduler.getMaxAttemptCount());
	}

}
