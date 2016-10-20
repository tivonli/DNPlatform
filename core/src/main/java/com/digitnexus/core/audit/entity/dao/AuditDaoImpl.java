package com.digitnexus.core.audit.entity.dao;

import java.io.Serializable;
import java.util.List;

import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.dao.BaseDaoImpl;

/**
 * 
 * @author adi
 * 
 */

@Repository
public class AuditDaoImpl extends BaseDaoImpl implements AuditDao {

	@Override
	public long getRevisionCount(Class<?> entityClass, Serializable id) {

		return ((Number) getAuditReader().createQuery().forRevisionsOfEntity(entityClass, false, true).add(AuditEntity.id().eq(id))
				.addProjection(AuditEntity.revisionNumber().max()).getSingleResult()).longValue();
	}

	@Override
	public List<?> getRevisions(Class<?> entityClass, Serializable id, int start, int numberOfResults) {
		return getAuditReader().createQuery().forRevisionsOfEntity(entityClass, true, true).setFirstResult(start)
				.setMaxResults(numberOfResults).getResultList();
	}

	@Override
	public boolean isAudited(Class<?> entityClass) {
		return getAuditReader().isEntityClassAudited(entityClass);
	}

	private AuditReader getAuditReader() {
		return AuditReaderFactory.get(getSession());
	}

}
