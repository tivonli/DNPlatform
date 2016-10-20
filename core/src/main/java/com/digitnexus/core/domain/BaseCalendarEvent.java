/**
 * 
 */
package com.digitnexus.core.domain;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;

/**
 * This is a base class for objects which need to show itself in the calendar view
 * as an event
 * @author Adi
 */
@MappedSuperclass
public abstract class BaseCalendarEvent extends DataObject {

	private static final long serialVersionUID = -6824672845812355629L;

	private String title;
	private String description;
	private boolean allDay;
	private Timestamp start;
	private Timestamp end;
	
	/**
	 * Some unique identifier of the event, for the UI.
	 * Implementing class may use the primary key for this purpose.
	 * 
	 * @return
	 */
	@Transient
	public abstract String getEventId();

	/**
	 * @return the title
	 */
	@Column(name="title", nullable=false, length=16)
	@ListViewColumn(order=10)
	@EditViewField(order=10)
	public String getTitle() {
		return title;
	}

	/**
	 * @param title the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the description
	 */
	@Column(name="description", length=128)
	@ListViewColumn(order=50)
	@EditViewField(order=50)
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the allDay
	 */
	@Column(name="day_long", nullable=false)
	@ListViewColumn(order=40)
	@EditViewField(order=40)
	public boolean isAllDay() {
		return allDay;
	}

	/**
	 * @param allDay the allDay to set
	 */
	public void setAllDay(boolean allDay) {
		this.allDay = allDay;
	}

	/**
	 * @return the startTime
	 */
	@Column(name="start_time", nullable=false)
	@ListViewColumn(order=20)
	@EditViewField(order=20,displayType=DisplayType.DATETIME)
	@NotNull
	public Timestamp getStart() {
		return start;
	}

	/**
	 * @param start the start to set
	 */
	public void setStart(Timestamp start) {
		this.start = start;
	}

	/**
	 * @return the endTime
	 */
	@Column(name="end_time", nullable=false)
	@ListViewColumn(order=30)
	@EditViewField(order=30,displayType=DisplayType.DATETIME)
	@NotNull
	public Timestamp getEnd() {
		return end;
	}

	/**
	 * @param end the end to set
	 */
	public void setEnd(Timestamp end) {
		this.end = end;
	}
}
