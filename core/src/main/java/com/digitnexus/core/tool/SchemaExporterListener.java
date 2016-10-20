/**
 * 
 */
package com.digitnexus.core.tool;

import org.hibernate.cfg.Configuration;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.hibernate.tool.hbm2ddl.SchemaUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEvent;
import org.springframework.stereotype.Component;

import com.digitnexus.core.event.AbstractContextRefreshListener;
import com.digitnexus.core.spring.ServiceLocator;
import com.digitnexus.core.spring.hibernate4.LocalSessionFactoryBean;

/**
 * This class exports the database using hibernate {@link SchemaUpdate} tool.
 *  
 * @author Santanu
 */
@Component
public class SchemaExporterListener extends AbstractContextRefreshListener{
	
	private final Logger logger=LoggerFactory.getLogger(getClass());

	//all important LocalSessionFactoryBean instance which has the hibernate configuration
	private LocalSessionFactoryBean	sessionFactoryBean;

	//boolean indicates whether to drop the tables and recreate
	//this should be read from some properties file
	private boolean					drop	= false;
	//If true generate or update schema
	@Value("${autoSchema}")
	private boolean autoSchema;

	/*
	 * (non-Javadoc)
	 * @see org.springframework.context.ApplicationListener#onApplicationEvent(org.springframework.context.ApplicationEvent)
	 */
	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		
		if(!autoSchema){
			logger.info("Schema create or update is disabled");
			return;
		}
		
		//we need to obtain the FactoryBean instance here because that is the only
		//bean which can give us the hibernate Configuration object
		LocalSessionFactoryBean sessionFactoryBean = getSessionFactoryBean();
		//here we do not use the updateSchema method of this factory bean. Because it does not
		//allow us to capture the update scripts executed. They will be important for maintenance
		Configuration hibernateConfig = sessionFactoryBean.getConfiguration();
		//we need to update the connection provider in the configuration
		//this connection provider by all likelyhood is going to be a LocalDataSourceConnectionProvider

		SchemaExport schemaExport = new SchemaExport(hibernateConfig);
		//loved if the output were well formatted, but but...
		//this SchemaUpdate api does something really foolish. It tries to execute a formatted string
		//which may have a lot of character which the database may not like. instead ie could have
		//executed the unformatted sql and log the formatted sql. 
		schemaExport.setFormat(false);
		//add it to the output file ..no harm in that
		schemaExport.setOutputFile(getCreateQueryFilePath());
		//we continue even in case of error. the reason is for old entities
		//the create will fail
		schemaExport.setHaltOnError(false);
		if (drop) {
			//here we drop all the tables
			schemaExport.drop(false, true);
		}
		//here we create...
		schemaExport.execute(false, true, false, true);
		//now we update the schema. this is to take care of any db updates
		SchemaUpdate schemaUpdate = new SchemaUpdate(hibernateConfig);
		//again for the same reason explained below we do not format
		schemaUpdate.setFormat(false);
		//stop progressing in case of an error
		schemaUpdate.setHaltOnError(true);
		//write the script to a file for future reference
		schemaUpdate.setOutputFile(getUpdateQueryFilePath());
		//first boolean to stop printing the query on console
		//second boolean to execute the query, otherwise this will just log the query to the output file 
		schemaUpdate.execute(false, true);

	}

	/**
	 * @return the raw {@link LocalSessionFactoryBean} object
	 */
	public LocalSessionFactoryBean getSessionFactoryBean() {
		if (sessionFactoryBean == null) {
			sessionFactoryBean = (LocalSessionFactoryBean) ServiceLocator.getService("&sessionFactory");
		}
		return sessionFactoryBean;
	}

	/**
	 * @return the file path where the db scripts are written. Defaults to updateScript.sql
	 */
	private String getUpdateQueryFilePath() {
		return "updateScript.sql";
	}

	/**
	 * @return the file path where the db scripts are written. Defaults to createScript.sql
	 */
	private String getCreateQueryFilePath() {
		return "createScript.sql";
	}

	
	@Override
	public int getOrder() {
		return 100;
	}
}
