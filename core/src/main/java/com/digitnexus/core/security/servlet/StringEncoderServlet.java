/**
 * 
 */
package com.digitnexus.core.security.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.digitnexus.core.security.util.StringEncoder;

/**
 * @author Adi Utility servlet to encode string's. Used mainly for password
 *         encoding
 */
@WebServlet(name = "stringEncoderServlet", urlPatterns = { "/stringEncoder" })
public class StringEncoderServlet extends HttpServlet {

	private static final long	serialVersionUID		= 1L;
	private static final String	PARAM_STRING_TO_ENCODE	= "stringToEncode";
	private static final String	PARAM_SALT				= "salt";

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.getWriter().print(StringEncoder.encode(req.getParameter(PARAM_STRING_TO_ENCODE), req.getParameter(PARAM_SALT)));
	}
}
