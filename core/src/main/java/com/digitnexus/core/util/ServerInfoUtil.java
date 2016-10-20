/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.util;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.exception.DigitNexusRuntimeException;

/**
 * Util class for get server info
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2013-4-15
 * @since 3.1
 */
public class ServerInfoUtil {
	
	private static final Logger log = LoggerFactory.getLogger(ServerInfoUtil.class);
	
	public static String getHostName() {
		InetAddress addr = null;
		try {
			addr = InetAddress.getLocalHost();
		} catch (UnknownHostException e) {
			throw new DigitNexusRuntimeException(e);
		}
		return addr.getHostName();
	}

	public static String getMac() {
		InetAddress address = null;
		byte[] mac = null;
		try {
			address = InetAddress.getLocalHost();
			mac = NetworkInterface.getByInetAddress(address)
			        .getHardwareAddress();
		} catch (Exception e) {
			throw new DigitNexusRuntimeException(e);
		}
		
		if (mac == null) {
			return address.getHostName();
		}

		StringBuilder sb = new StringBuilder();

		for (int i = 0; i < mac.length; i++) {
			if (i != 0) {
				sb.append("-");
			}
			String s = Integer.toHexString(mac[i] & 0xFF);
			sb.append(s.length() == 1 ? 0 + s : s);
		}

		return sb.toString().toUpperCase();
	}
	
	public static String getProcessId() {
		RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
		String processName = runtimeMXBean.getName();
		log.debug(processName);
		String pid = null;
		if (processName.indexOf('@') != -1) {
			pid = processName.substring(0, processName.indexOf('@'));
		} else {
			throw new DigitNexusRuntimeException("not support os!");
		}
		return pid;
	}

}
