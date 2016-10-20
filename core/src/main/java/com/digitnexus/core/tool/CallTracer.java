package com.digitnexus.core.tool;

import java.util.Deque;
import java.util.LinkedList;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;
import org.springframework.util.StopWatch.TaskInfo;

public class CallTracer {
	
	private static Logger logger = LoggerFactory.getLogger(CallTracer.class);
	
	private static Deque<Deque<NestedTaskInfo>> messageQueue = new LinkedList<Deque<NestedTaskInfo>>();
	
	private static ThreadLocal<CallTracer> localCallTracer = new ThreadLocal<CallTracer>() {

		/* (non-Javadoc)
		 * @see java.lang.ThreadLocal#initialValue()
		 */
		@Override
		protected CallTracer initialValue() {
			return new CallTracer();
		}
		
	};
	
	static {
		Timer timer = new Timer();
		timer.schedule(new PrintingTask(), 10000, 10000);
	}
	
	public static CallTracer currentInstance() {
		return localCallTracer.get();
	}
	
	private Deque<StopWatch> stopWatchQueue = new LinkedList<StopWatch>();
	private Deque<NestedTaskInfo> messages = new LinkedList<NestedTaskInfo>();
	
	public void start(String taskName) {
		StopWatch stopWatch = new StopWatch();
		NestedTaskInfo taskInfo = messages.peek();
		if (taskInfo != null && !taskInfo.isClosed()) {
			taskInfo = taskInfo.getActiveNode();
			taskInfo.addChild(new NestedTaskInfo());
		} else {
			messages.add(new NestedTaskInfo());
		}
		stopWatch.start(taskName);
		stopWatchQueue.push(stopWatch);
	}
	
	public void stop() {
		StopWatch stopWatch = stopWatchQueue.pop();
		if (stopWatch != null) {
			stopWatch.stop();
			TaskInfo taskInfo = stopWatch.getLastTaskInfo();
			NestedTaskInfo nestedTaskInfo = messages.peek();
			nestedTaskInfo = nestedTaskInfo.getActiveNode();
			nestedTaskInfo.setTaskInfo(taskInfo);
			nestedTaskInfo.close();
		}
		
		if (isComplete()) {
			messageQueue.add(resetAndGetMessages());
		}
	}
	
	public boolean isComplete() {
		return stopWatchQueue.isEmpty();
	}
	
	private Deque<NestedTaskInfo> resetAndGetMessages() {
		Deque<NestedTaskInfo> messagesCopy = new LinkedList<NestedTaskInfo>(messages);
		messages.clear();
		return messagesCopy;
	}
	
	private static class PrintingTask extends TimerTask {
		@Override
		public void run() {
			Deque<NestedTaskInfo> messages = null;
			while ((messages = messageQueue.poll()) != null) {
				for (NestedTaskInfo message:messages) {
					message.prettyPrint();
				}
				logger.trace("");
			}
		}
	}
	
	private class NestedTaskInfo {
		private boolean closed;
		private TaskInfo taskInfo;
		private final LinkedList<NestedTaskInfo> childTasks = new LinkedList<CallTracer.NestedTaskInfo>();
		
		/**
		 * @param taskInfo the taskInfo to set
		 */
		public void setTaskInfo(TaskInfo taskInfo) {
			this.taskInfo = taskInfo;
		}

		/**
		 * @return the closed
		 */
		public boolean isClosed() {
			return closed;
		}

		/**
		 * 
		 */
		public void close() {
			this.closed = true;
		}

		/**
		 * @param childTask
		 */
		public void addChild(NestedTaskInfo childTask) {
			childTasks.add(childTask);
		}
		
		public NestedTaskInfo getActiveNode() {
			if (closed) {
				return null;
			}
			for (NestedTaskInfo childTask:childTasks) {
				if (!childTask.isClosed()) {
					return childTask.getActiveNode();
				}
			}
			
			return this;
		}
		
		public void prettyPrint() {
			prettyPrint(0);
		}
		
		private void prettyPrint(int nesting) {
			logger.trace(StringUtils.repeat(" ", 4 * nesting) + "[" + taskInfo.getTaskName() + "] took " + taskInfo.getTimeMillis() + "ms");
			for (NestedTaskInfo childTask:childTasks) {
				childTask.prettyPrint(nesting + 1);
			}
		}
	}
}