package com.digitnexus.core.web.ui.config.dataobject;

import com.digitnexus.core.web.ui.config.annotation.Compare;
import com.digitnexus.core.web.ui.config.annotation.CompareType;

/**
 * Represent values from {@link Compare} annotation
 * @author Xing
 *
 */
public class CompareMeta{
	
	private CompareType type;
	private String[] targets;
	
	
	public CompareMeta(CompareType type, String[] targets) {
		this.type = type;
		this.targets = targets;
	}

	public CompareType getType() {
		return type;
	}

	public String[] getTargets() {
		return targets;
	}
	
}
