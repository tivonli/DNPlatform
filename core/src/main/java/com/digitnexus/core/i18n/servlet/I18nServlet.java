package com.digitnexus.core.i18n.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.digitnexus.core.i18n.I18NUtil;



@WebServlet(name = "I18nServlet", urlPatterns = { "/I18n" })
public class I18nServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String key = req.getParameter("key");
		if (key != null && (!key.isEmpty())) {
			String i18nString = I18NUtil.getMessage(key,null, req.getLocale());
			if (!(i18nString == null || i18nString.isEmpty())) {
				resp.getWriter().write(i18nString);
				resp.getWriter().flush();
			}
		}
		resp.getWriter().write("");
		resp.getWriter().flush();

	}


}
