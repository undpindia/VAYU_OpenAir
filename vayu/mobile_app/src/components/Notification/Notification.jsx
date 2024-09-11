import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Header2 from "../UI/Header/Header_2";
import ArrowRightIcon from "../../assets/img/screen-icons/arrow-right.svg";
import { useNavigate } from "react-router-dom";
import { getNotification } from "../../api/ApiService";
import moment from "moment";
import image from "../../assets/img/images/notification.svg";
import OfflineScreen from "../UI/OfflineScreen/OfflineScreen";
import { Button } from "react-bootstrap";
import CircularLoader from '../UI/CircularLoader/CircularLoader';

const Notification = () => {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [newClickedIndex, setNewClickedIndex] = useState(null);
  const [prevClickedIndex, setPrevClickedIndex] = useState(null);
  const [todayNotifications, setTodayNotifications] = useState([]);
  const [previousNotifications, setPreviousNotifications] = useState([]);
  const [showNewFullMessage, setShowNewFullMessage] = useState([]);
  const [showPrevFullMessage, setShowPrevFullMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotification = useRef(async () => {
    const bodyparam = {
      user_id: user_id,
    };
    try {
      const response = await getNotification(
        localStorage.getItem("access_token"),
        bodyparam
      );
      setNotification(response);
      setIsLoading(true);
    } catch (error) {
      console.log("");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchNotification.current();
  }, [isOnline]);
  useEffect(() => {
    // Filter notifications based on the current date
    if (
      notification &&
      notification.data &&
      notification.data.success === true
    ) {
      // Sort notifications by date in descending order
      const sortedNotifications = notification.data.data.sort(
        (a, b) =>
          moment(b.created_at).valueOf() - moment(a.created_at).valueOf()
      );
      // Find the latest date
      const latestDate =
        sortedNotifications.length > 0
          ? moment(sortedNotifications[0].created_at).format("DD MMM YYYY")
          : null;

      const todayNotifications = sortedNotifications.filter(
        (item) => moment(item.created_at).format("DD MMM YYYY") === latestDate
      );
      const previousNotifications = sortedNotifications.filter(
        (item) => moment(item.created_at).format("DD MMM YYYY") !== latestDate
      );

      setTodayNotifications(todayNotifications);
      setPreviousNotifications(previousNotifications);
    }
  }, [notification]);
  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener("online", handleStatusChange);

    // Listen to the offline status
    window.addEventListener("offline", handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [isOnline]);

  const handleNewItemClick = (index) => {
    setNewClickedIndex(index === newClickedIndex ? null : index);
  };

  const handlePrevItemClick = (index) => {
    setPrevClickedIndex(index === prevClickedIndex ? null : index);
  };
  const toggleShowFullMessage = (index) => {
    setShowNewFullMessage((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const toggleShowPrevFullMessage = (index) => {
    setShowPrevFullMessage((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const handleNewClick = (index) => {
    handleNewItemClick(index);
    toggleShowFullMessage(index);
  };
  const handlePrevClick = (index) => {
    handlePrevItemClick(index);
    toggleShowPrevFullMessage(index);
  };
  return (
    <div>
      <Header2 heading="Notification" showNotification={false} />
      {isOnline ? (
        isLoading ? 
        <div className="notification-container">
          {loading ? (
            <div></div>
          ) : notification &&
            notification.data &&
            notification.data.success === true ? (
            <div>
              {todayNotifications.length > 0 && (
                <div className="notification-container__heading">
                  <h1>New</h1>
                </div>
              )}
              {todayNotifications.map((item, index) => (
                <div
                  className="notification-container__item"
                  key={index}
                  onClick={() => handleNewClick(index)}
                >
                  <div className="notification-container__item--content">
                    <div className="item--content-heading">
                      {newClickedIndex === index
                        ? item?.message
                        : item.message.length > 10
                        ? item?.message.slice(0, 10) + "..."
                        : item?.message}
                    </div>
                    {item.message.length > 10 && (
                      <span>
                        {showNewFullMessage[index] ? "Show less" : "Show more"}
                      </span>
                    )}
                    <span>
                      {moment(item?.created_at).format("DD MMM YYYY")}
                    </span>
                  </div>

                  {/* <div className="notification-container__item--icon">
                  <img src={ArrowRightIcon} alt="Arrow Right Icon" onClick={() => handleItemClick(index)}/>
                </div> */}
                </div>
              ))}
              <div className="notification-container__previous">
                {previousNotifications.length > 0 && (
                  <div className="notification-container__heading">
                    <h1>Previous</h1>
                  </div>
                )}
                {previousNotifications.map((item, index) => (
                  <div
                    className="notification-container__item"
                    key={index}
                    onClick={() => handlePrevClick(index)}
                  >
                    <div className="notification-container__item--content">
                      <div className="item--content-heading">
                        {prevClickedIndex === index
                          ? item?.message
                          : item.message.length > 10
                          ? item?.message.slice(0, 10) + "..."
                          : item?.message}
                      </div>
                      {item.message.length > 10 && (
                        <span>
                          {showPrevFullMessage[index]
                            ? "Show less"
                            : "Show more"}
                        </span>
                      )}
                      <span>
                        {moment(item?.created_at).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="notification-img-container">
              <img src={image} alt="image" className="notification-img" />
            </div>
          )}
        </div> :
        <><CircularLoader/></>
      ) : (
        <div className="notification-container">
          <OfflineScreen />
        </div>
      )}
    </div>
  );
};

export default Notification;
