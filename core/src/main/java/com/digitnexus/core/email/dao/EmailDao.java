package com.digitnexus.core.email.dao;

import java.util.List;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Email;

public interface EmailDao extends BaseDao {

	List<Email> findEmailMsgsByMaxAttempt();

}
