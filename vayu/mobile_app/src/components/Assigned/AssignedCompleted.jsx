import { Card as BootstrapCard, Button } from 'react-bootstrap';

const AssignedCompleted = ({ data }) => {
  console.log('data', data);

  const openGoogleMaps = (latitude, longitude) => {
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div>
      {data.map(
        (data) =>
          data.status === 'Complete' && (
            <div key={data.id}>
              <BootstrapCard className="new-card">
                <div className="d-flex justify-content-between align-items-center">
                  <BootstrapCard.Title className="new-card-title">
                    {data.location}
                  </BootstrapCard.Title>
                </div>
                <div className="new-card-subtitle"> {data.state}</div>
                <BootstrapCard.Body className="new-card-body">
                  <BootstrapCard className="new-subcard">
                    {data.description}
                  </BootstrapCard>
                </BootstrapCard.Body>
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
                      // onClick={() =>
                      //   recorddata( 'Patliputra Industrial Area',data.lat, data.long)
                      // }
                      disabled={true}
                    >
                      Record Data
                    </Button>
                  </div>
                </div>
              </BootstrapCard>
            </div>
          )
      )}
    </div>
  );
};

export default AssignedCompleted;
