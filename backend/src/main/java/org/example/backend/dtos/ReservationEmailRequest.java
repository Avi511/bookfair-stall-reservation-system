package org.example.backend.dtos;

public class ReservationEmailRequest {

    private String to;
    private String businessName;
    private String stall;

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getStall() {
        return stall;
    }

    public void setStall(String stall) {
        this.stall = stall;
    }
}
