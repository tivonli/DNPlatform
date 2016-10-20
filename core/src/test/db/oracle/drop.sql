drop table "USERS" cascade constraints;

--Quartz tables
delete from qrtz_job_listeners;
delete from qrtz_trigger_listeners;
delete from qrtz_fired_triggers;
delete from qrtz_simple_triggers;
delete from qrtz_cron_triggers;
delete from qrtz_blob_triggers;
delete from qrtz_triggers;
delete from qrtz_job_details;
delete from qrtz_calendars;
delete from qrtz_paused_trigger_grps;
delete from qrtz_locks;
delete from qrtz_scheduler_state;

drop table qrtz_calendars;
drop table qrtz_fired_triggers;
drop table qrtz_trigger_listeners;
drop table qrtz_blob_triggers;
drop table qrtz_cron_triggers;
drop table qrtz_simple_triggers;
drop table qrtz_triggers;
drop table qrtz_job_listeners;
drop table qrtz_job_details;
drop table qrtz_paused_trigger_grps;
drop table qrtz_locks;
drop table qrtz_scheduler_state;

alter table ACT_ID_MEMBERSHIP 
    drop CONSTRAINT ACT_FK_MEMB_GROUP;
    
alter table ACT_ID_MEMBERSHIP 
    drop CONSTRAINT ACT_FK_MEMB_USER;

drop index ACT_IDX_MEMB_GROUP;
drop index ACT_IDX_MEMB_USER;

drop table  ACT_ID_INFO;
drop table  ACT_ID_MEMBERSHIP;
drop table  ACT_ID_GROUP;
drop table  ACT_ID_USER;

drop index ACT_IDX_HI_PRO_INST_END;
drop index ACT_IDX_HI_PRO_I_BUSKEY;
drop index ACT_IDX_HI_ACT_INST_START;
drop index ACT_IDX_HI_ACT_INST_END;
drop index ACT_IDX_HI_DETAIL_PROC_INST;
drop index ACT_IDX_HI_DETAIL_ACT_INST;
drop index ACT_IDX_HI_DETAIL_TIME;
drop index ACT_IDX_HI_DETAIL_NAME;

drop table ACT_HI_PROCINST;
drop table ACT_HI_ACTINST;
drop table ACT_HI_TASKINST;
drop table ACT_HI_DETAIL;
drop table ACT_HI_COMMENT;
drop table ACT_HI_ATTACHMENT;

drop table ACT_CY_CONN_CONFIG;
drop table ACT_CY_CONFIG;
drop table ACT_CY_LINK;
drop table ACT_CY_PEOPLE_LINK;
drop table ACT_CY_TAG;
drop table ACT_CY_COMMENT;
drop table ACT_CY_V_FOLDER;
drop table ACT_CY_PROCESS_SOLUTION;

drop index ACT_IDX_BYTEAR_DEPL ;
drop index ACT_IDX_EXE_PROCINST ;
drop index ACT_IDX_EXE_PARENT ;
drop index ACT_IDX_EXE_SUPER;
drop index ACT_IDX_TSKASS_TASK;
drop index ACT_IDX_TASK_EXEC;
drop index ACT_IDX_TASK_PROCINST;
drop index ACT_IDX_TASK_PROCDEF;
drop index ACT_IDX_VAR_EXE;
drop index ACT_IDX_VAR_PROCINST;
drop index ACT_IDX_VAR_BYTEARRAY;
drop index ACT_IDX_JOB_EXCEPTION;

drop index ACT_IDX_EXEC_BUSKEY;
drop index ACT_IDX_TASK_CREATE;
drop index ACT_IDX_IDENT_LNK_USER;
drop index ACT_IDX_IDENT_LNK_GROUP;

alter table ACT_GE_BYTEARRAY 
    drop CONSTRAINT ACT_FK_BYTEARR_DEPL;

alter table ACT_RU_EXECUTION
    drop CONSTRAINT ACT_FK_EXE_PROCINST;

alter table ACT_RU_EXECUTION 
    drop CONSTRAINT ACT_FK_EXE_PARENT;

alter table ACT_RU_EXECUTION 
    drop CONSTRAINT ACT_FK_EXE_SUPER;
    
alter table ACT_RU_IDENTITYLINK
    drop CONSTRAINT ACT_FK_TSKASS_TASK;

alter table ACT_RU_TASK
	drop CONSTRAINT ACT_FK_TASK_EXE;

alter table ACT_RU_TASK
	drop CONSTRAINT ACT_FK_TASK_PROCINST;
	
alter table ACT_RU_TASK
	drop CONSTRAINT ACT_FK_TASK_PROCDEF;
    
alter table ACT_RU_VARIABLE
    drop CONSTRAINT ACT_FK_VAR_EXE;
    
alter table ACT_RU_VARIABLE
	drop CONSTRAINT ACT_FK_VAR_PROCINST;

alter table ACT_RU_VARIABLE
    drop CONSTRAINT ACT_FK_VAR_BYTEARRAY;

alter table ACT_RU_JOB
    drop CONSTRAINT ACT_FK_JOB_EXCEPTION;

drop table  ACT_GE_PROPERTY;
drop table  ACT_GE_BYTEARRAY;
drop table  ACT_RE_DEPLOYMENT;
drop table  ACT_RE_PROCDEF;
drop table  ACT_RU_IDENTITYLINK;
drop table  ACT_RU_VARIABLE;
drop table  ACT_RU_TASK;
drop table  ACT_RU_EXECUTION;
drop table  ACT_RU_JOB;

