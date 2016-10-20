package com.digitnexus.core.entity.listener;

import com.digitnexus.core.entity.DeleteEvent;
import com.digitnexus.core.entity.EntityEvent;
import com.digitnexus.core.entity.PostSaveEvent;
import com.digitnexus.core.entity.PreSaveEvent;
import com.digitnexus.core.entity.ValidateEvent;
/**
 * Subclasses can listen to more than one event
 * @author Adi
 *
 * @param <T>
 */
public abstract class AbstractEntityEventListener<T> implements EntityEventListener<T> {

	@Override
	public void onApplicationEvent(EntityEvent<T> event) {
		if (event instanceof PostSaveEvent) {
			onPostSave((PostSaveEvent<T>) event);
		} else if (event instanceof PreSaveEvent) {
			onPreSave((PreSaveEvent<T>) event);
		} else if (event instanceof ValidateEvent) {
			onValidate((ValidateEvent<T>) event);
		} else {
			onDelete((DeleteEvent<T>) event);
		}

	}

	public void onPostSave(PostSaveEvent<T> entityEvent) {
	};

	public void onPreSave(PreSaveEvent<T> entityEvent) {
	};

	public void onValidate(ValidateEvent<T> entityEvent) {
	};

	public void onDelete(DeleteEvent<T> entityEvent) {
	};

}
