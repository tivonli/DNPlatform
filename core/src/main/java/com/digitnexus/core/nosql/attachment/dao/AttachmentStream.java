/**
 * 
 */
package com.digitnexus.core.nosql.attachment.dao;

import java.io.IOException;
import java.io.InputStream;

import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.spring.ServiceLocator;

/**
 * This class may need to be removed completely as this may not be required at all
 * The default InputStream itself serves the same purpose.
 * 
 * @author Santanu
 */
public class AttachmentStream extends InputStream {

	private static AttachmentDao attachmentDao = null;
	
	private final Object attachmentId;
	private InputStream actualAttachmentStream;
	
	/**
	 * @param attachmentId
	 */
	public AttachmentStream(Object attachmentId) {
		this.attachmentId = attachmentId;
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#read(byte[])
	 */
	@Override
	public int read(byte[] b) throws IOException {
		loadIfRequired();
		return actualAttachmentStream.read(b);
	}



	/* (non-Javadoc)
	 * @see java.io.InputStream#read(byte[], int, int)
	 */
	@Override
	public int read(byte[] b, int off, int len) throws IOException {
		loadIfRequired();
		return actualAttachmentStream.read(b, off, len);
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#skip(long)
	 */
	@Override
	public long skip(long n) throws IOException {
		loadIfRequired();
		return actualAttachmentStream.skip(n);
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#available()
	 */
	@Override
	public int available() throws IOException {
		loadIfRequired();
		return actualAttachmentStream.available();
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#close()
	 */
	@Override
	public void close() throws IOException {
		loadIfRequired();
		actualAttachmentStream.close();
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#mark(int)
	 */
	@Override
	public synchronized void mark(int readlimit) {
		loadIfRequired();
		actualAttachmentStream.mark(readlimit);
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#reset()
	 */
	@Override
	public synchronized void reset() throws IOException {
		loadIfRequired();
		actualAttachmentStream.reset();
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#markSupported()
	 */
	@Override
	public boolean markSupported() {
		return false;
	}

	/* (non-Javadoc)
	 * @see java.io.InputStream#read()
	 */
	@Override
	public int read() throws IOException {
		loadIfRequired();
		return actualAttachmentStream.read();
	}

	/**
	 * 
	 */
	private void loadIfRequired() {
		if (actualAttachmentStream == null) {
			AttachmentObject attachmentObject = getAttachmentDao().loadAttachment(attachmentId);
			actualAttachmentStream = attachmentObject.getData();
		}
	}

	/**
	 * @return the attachmentDao
	 */
	public static AttachmentDao getAttachmentDao() {
		if (attachmentDao == null) {
			attachmentDao = ServiceLocator.getService(AttachmentDao.class);
		}
		return attachmentDao;
	}
}
