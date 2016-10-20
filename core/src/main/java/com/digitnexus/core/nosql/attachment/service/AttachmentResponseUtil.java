package com.digitnexus.core.nosql.attachment.service;

import java.util.HashMap;
import java.util.Map;

import com.digitnexus.core.nosql.domain.AttachmentObject;

public final class AttachmentResponseUtil {
	private AttachmentResponseUtil() {

	}

	public static Map<String, String> createAttachmentMetaMap(AttachmentObject attachment) {
		Map<String, String> responseData = new HashMap<String, String>();
		responseData.put("name", attachment.getFileName());
		responseData.put("id", (attachment.getId() != null)?attachment.getId().toString():"");
		responseData.put("size", attachment.getLength() + "");
		responseData.put("url", "rest/attachment/" + attachment.getId());
		responseData.put("delete_type", "DELETE");
		responseData.put("delete_url", "rest/attachment/" + attachment.getId());
		return responseData;
	}

}
