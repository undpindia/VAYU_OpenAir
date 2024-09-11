import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import vayu from '../../assets/img/images/vayu.svg';
import axios from 'axios';


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSignin = () => {
    navigate('/');
  };
  const forgotHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const data = {
        email: email,
      };
      axios
        .post(`${import.meta.env.VITE_REACT_API_URL}/user/api/v1/forgot-password`, data)
        .then((response) => {
          console.log('response', response);
          if (response.data.code === 200 && response.data.success === true) {
            toast.success(response.data.message);
            setEmail('');
            }else{
              toast.error(response.data.message);
              setEmail('');
            } 
        })
        .catch((error) => {
          console.log(error)
          {
            toast.error('Something went wrong. Please try again.');
          }
        });
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <div className="forgot-password-container d-block py-0">
      <div className="forgot-password-container__logo-text">
        {/* <h1>VAYU</h1> */}
        <img src={vayu} alt="icon" />
      </div>

      <div className="forgot-password-container__forgot-password-card">
        <h1 className="forgot-password-container__forgot-password-card--title-forgot-password">Forgot Password</h1>

        <Row className="g-0 w-100">
          <Col md="12" lg="5" xl="4" className="col-wrapper">
            <Card className="card-forgot-password">
              <Card.Body>
                <Form 
                onSubmit={forgotHandler}
                >
                  <div className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Row className="g-3">
                    <Col md="12">
                      <Button
                        type="submit"
                        className="forgot-password-container__forgot-password-card--btn-forgot-password"
                        disabled={!email}
                      >
                        Reset
                      </Button>
                    </Col>
                    <div className="mb-4">
                      <span
                        className="forgot-password-container__forgot-password-card--sign-in"
                      >
                      <span onClick={handleSignin}>Sign In</span>
                      </span>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default ForgotPassword;
