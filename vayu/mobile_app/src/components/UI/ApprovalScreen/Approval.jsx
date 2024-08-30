import Approvalimg from '../../../assets/img/images/approval-pending.svg';

const ApprovalScreen = () => {
  return (
    <div className="approval-screen-container">
      <div className="approval-screen-container__img-wrapper">
        <img src={Approvalimg} alt="approval" />
      </div>
      <div className="approval-screen-container__message">
        <h1>Approval Pending</h1>
        <span>Your account is not yet approved by the admin. You can check back in 48 hours.</span>
      </div>
    </div>
  );
};

export default ApprovalScreen;