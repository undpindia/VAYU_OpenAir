import OfflineImg from '../../../assets/img/images/offline-screen.svg';

const OfflineScreen = () => {
  return (
    <div className="offline-screen-container">
      <div className="offline-screen-container__img-wrapper">
        <img src={OfflineImg} alt="offline" />
      </div>

      <div className="offline-screen-container__message">
        <span>Your device is offline</span>
      </div>
    </div>
  );
};

export default OfflineScreen;
