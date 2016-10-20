/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.id;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.digitnexus.core.util.ServerInfoUtil;

/**
 * util class for generate message id
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2013-1-18
 * @since 3.1
 */
public class SimpleIdGenerateUtil {

//	private static final Logger log = LoggerFactory
//	        .getLogger(SimpleIdGenerateUtil.class);

	private static final String SPLITTER = "-";

	 private static final SimpleDateFormat df = new
	 SimpleDateFormat("yyyyMMdd");

	private static Calendar date;
	
	private static String strDate;

//	private static AtomicLong counter = new AtomicLong(1);
	private static long counter = 1;

	private static int host;

	private static String pid;

	/**
	 * generate message id, make by this rule: date-host-pid-counter
	 * 
	 * @return the unique message id 
	 */
	public static synchronized String generateId() {
		if (date == null) { // initial id prefix
			date = Calendar.getInstance();
			 strDate = df.format(date.getTime());
			host = Math.abs(ServerInfoUtil.getHostName().hashCode());
			pid = ServerInfoUtil.getProcessId();
		} else {
			Calendar today = Calendar.getInstance();
			if (today.get(Calendar.DATE) != date.get(Calendar.DATE)) {
				date = today;
				strDate = df.format(date.getTime());
				counter = 1;
			}

		}
		return new StringBuilder(strDate).append(SPLITTER).append(host)
		        .append(SPLITTER).append(pid).append(SPLITTER)
		        .append(counter++).toString();
	}

}
