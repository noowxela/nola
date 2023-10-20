// import "styles/status.css";

export default function StatusComponent({ status }) {
  const statusClassNameMap = {
    //Merchant status
    Successful: "status-successful",
    "Refund Requested": "status-refund-requested",
    Failed: "status-failed",
    Refunded: "status-refunded",

    //Admin status
    ValidationSucceed: "status-successful",
    ValidationFailed: "status-failed",
    Active: "status-active",
    Inactive: "status-refund-requested",
    WaitingList: "status-pending-approval",
    PendingApproval: "status-pending-approval",
    "Pending Approval": "status-pending-approval",
    RegistrationNotAllowed: "status-registration-not-allowed",
    Scheduled: "status-refunded",
    Rejected: "status-failed",
    Expired: "status-failed",
    New: "status-new",

    Approved: "status-approved",
    Reload: "status-transaction-reload",
    Receive: "status-transaction-receive",
    Gift: "status-transaction-spend",
    Cashout: "status-transaction-cashout",
    Success: "status-successful",
    Male: "status-gender-male",
    Female: "status-gender-female",
  };

  return (
    <div className={`status-base ${statusClassNameMap[status]}`}>{status}</div>
  );
}
