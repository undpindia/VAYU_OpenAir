import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card as BootstrapCard, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { taskCompleted } from '../../api/ApiService';
import { selectUid } from '../../redux/auth/authSlice';
import toast, { Toaster } from 'react-hot-toast';

const AssignedNew = ({ data, refreshAssignedData }) => {
  // console.log('data', data);
  const navigate = useNavigate();
  // const user_id = useSelector(selectUid);
  const [dataId, setDataId] = useState('');
  const [showDropdowns, setShowDropdowns] = useState(
    Array(data.length).fill(false)
  );
  const [assignedData, setAssignedData] = useState(data);
  const user_id = localStorage.getItem('user_id');
  const handleSvgClick = (index) => {
    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = !newShowDropdowns[index];
    setShowDropdowns(newShowDropdowns);
    setDataId(index);
  };
  const recorddata = (title, latitude, longitude) => {
    const lat = parseFloat(latitude).toFixed(7);
    const lng = parseFloat(longitude).toFixed(7);
    navigate('/record-data', {
      state: { locationName: title, userLocation: [lat, lng] },
    });
  };
  const openGoogleMaps = (latitude, longitude) => {
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  };
  const markTask = async () => {
    const bodyparam = {
      user_id: user_id,
      task_id: dataId,
      status: 'Complete',
    };
    console.log(bodyparam);
    try {
      const response = await taskCompleted(
        localStorage.getItem('access_token'),
        bodyparam
      );
      if (response.data.code === 202) {
        toast.success(response.data.message);
        refreshAssignedData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log();
    }
  };
  useEffect(() => {
    setAssignedData(data);
  }, [data]);
  return (
    <div>
      {assignedData.map((data) => (
        <div key={data.id}>
          <BootstrapCard className="new-card">
            <div className="d-flex justify-content-between align-items-center">
              <BootstrapCard.Title className="new-card-title">
                {data.location}
              </BootstrapCard.Title>
              <Dropdown
                show={showDropdowns[data.id]}
                onClick={() => handleSvgClick(data.id)}
              >
                <Dropdown.Toggle id="dropdown-basic">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18Z"
                      fill="#49454F"
                    />
                  </svg>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    className="dropdown-menu-item"
                    onClick={markTask}
                  >
                    Mark as completed
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="new-card-subtitle">{data.state}</div>
            {data.description !== '' && (
              <BootstrapCard.Body className="new-card-body">
                <BootstrapCard className="new-subcard">
                  {data.description}
                </BootstrapCard>
              </BootstrapCard.Body>
            )}

            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="card-btn">
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: '#fff',
                  }}
                  onClick={() => openGoogleMaps(data.lat, data.long)}
                >
                  Get Direction
                </Button>
              </div>

              <div className="card-btn">
                <Button
                  variant="secondary"
                  style={{
                    backgroundColor: '#31572c',
                    color: '#fff',
                  }}
                  onClick={() => recorddata(data.location, data.lat, data.long)}
                >
                  Record Data
                </Button>
              </div>
            </div>
          </BootstrapCard>
        </div>
      ))}
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default AssignedNew;
