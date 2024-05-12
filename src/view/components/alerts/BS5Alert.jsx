import React from 'react'

export const ALERT_TYPES = {
    INFO: 0,
    DANGER: 1,
    DEFAULT: 2,
    WARNING: 3,
    SUCCESS: 4,
};

//TODO
export default function BS5Alert() {

    const getAlertType = (type) => {
        switch (type) {
            case ALERT_TYPES.INFO:
                return {
                    class: "info",
                };
            case ALERT_TYPES.DANGER:
                return {
                    class: "danger",
                };
            case ALERT_TYPES.DEFAULT:
                return {
                    class: "default",
                };
            case ALERT_TYPES.WARNING:
                return {
                    class: "warning",
                };
            case ALERT_TYPES.SUCCESS:
                return {
                    class: "success",
                };
            default:
                return {
                    class: "default",
                };
        }
    };


    return (
        <div className={`alert alert-danger alert-dismissible fade show`} role="alert">
            <strong>Holy guacamole!</strong> You should check in on some of those fields below.
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
}
