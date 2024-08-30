import { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import DataSuccessImg from '../../assets/img/images/tick-green.svg';
import { useNavigate } from 'react-router-dom';

const SignupSuccess = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className="data-success-container">
        <div className="data-success-container__img-wrapper">
          <img src={DataSuccessImg} alt="online" />
        </div>

        <div className="data-success-container__message">
          <h1>Sign Up Successful</h1>
          <span
            style={{
              lineHeight: '1.5',
              width: '90%',
            }}
          >
            Your account has been created successfully. Please log in to
            continue.
          </span>
        </div>

        <div className="data-success-container__btn-wrapper">
          <Button
            className="data-success-container__btn-wrapper--button"
            onClick={() => navigate('/')}
            style={{
              width: 250,
              backgroundColor: '#31572c',
              color: '#fff',
              border: '1px solid #31572c',
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default SignupSuccess;
