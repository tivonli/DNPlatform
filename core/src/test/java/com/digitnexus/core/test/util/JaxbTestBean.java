package com.digitnexus.core.test.util;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name = "TestBean")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder = {
    "evtId",
    "srcIp",
    "ant"
})
public class JaxbTestBean {
	
	  @XmlElement(name = "evt_id")
	    private String evtId;
	  
	    @XmlElement(name = "src_ip")
	    private String srcIp;
	    
	    protected String ant;

		public String getEvtId() {
        	return evtId;
        }

		public void setEvtId(String evtId) {
        	this.evtId = evtId;
        }

		public String getSrcIp() {
        	return srcIp;
        }

		public void setSrcIp(String srcIp) {
        	this.srcIp = srcIp;
        }

		public String getAnt() {
        	return ant;
        }

		public void setAnt(String ant) {
        	this.ant = ant;
        }
	    
	    

}
