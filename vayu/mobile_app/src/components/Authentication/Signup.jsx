import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { useState } from 'react'; //useEffect
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
// import { useDispatch } from "react-redux";
import vayu from '../../assets/img/images/vayu.svg';
import DropdownSignup from '../UI/Dropdown/DropdownSignup';
// import { signUp } from '../../api/ApiService';
import Datepicker from '../UI/DatePicker/DatePicker';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setDate(selectedDate.getDate() + 1);
      // Format the date to yyyy-MM-dd format
      const formattedDate = selectedDate.toISOString().split('T')[0];
      // Update the state with the new date
      setSelectedDate(formattedDate);
    } else {
      // If date is null (deleted), set selectedDate to null
      setSelectedDate(null);
    }
  };
  const handleMobileChange = (e) => {
    let inputValue = e.target.value;
    // Remove any non-numeric characters
    inputValue = inputValue.replace(/\D/g, '');
    // Limit to 10 digits
    inputValue = inputValue.slice(0, 10);
    setMobile(inputValue);
  };
  const handleStateSelect = (state) => {
    setSelectedState(state);
    // Reset district selection when state changes
    setSelectedDistrict('');
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
  };
  let districtOptions = [];
  if (selectedState === 'Bihar') {
    districtOptions = ['Patna'];
  } else if (selectedState === 'Haryana') {
    districtOptions = ['Gurgaon'];
  }
  // console.log('dist', districtOptions);
  // const isAuthenticated = useSelector(selectIsAuthenticated);
  const handleGenderSelect = (gender) => {
    setGender(gender);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleNameChange = (e) => {
    let inputValue = e.target.value;
    // Remove any non-alphabet characters
    inputValue = inputValue.replace(/[^A-Za-z\s]/g, '');
    console.log(inputValue)
    setUserName(inputValue);
    
  };
  const handlePasswordChange = (e) => {
    let inputValue = e.target.value;
    // Truncate input to 12 characters if it exceeds
    inputValue = inputValue.slice(0, 12);
    setPassword(inputValue);
  };
  const handleConfirmPasswordChange = (e) => {
    let inputValue = e.target.value;
    // Truncate input to 12 characters if it exceeds
    inputValue = inputValue.slice(0, 12);
    setConfirmPassword(inputValue);
  };
  const signupHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (
      !username ||
      !email ||
      !mobile ||
      !gender ||
      !selectedDate ||
      !selectedState ||
      !selectedDistrict ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return toast.error('Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Regex patterns for password complexity requirements
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  
    if (
      !uppercaseRegex.test(password) ||
      !lowercaseRegex.test(password) ||
      !numberRegex.test(password) ||
      !specialCharRegex.test(password)
    ) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }
    try {
      const data = {
        email: email,
        current_password: password,
        confirm_password: confirmPassword,
        name: username,
        mobile: mobile,
        gender: gender,
        dob: selectedDate,
        address: address,
        district: selectedDistrict,
        state: selectedState,
      };

      axios
        .post(`${import.meta.env.VITE_REACT_API_URL}/user/api/v1/signup`, data)
        .then((response) => {
          // console.log('response', response);
          if (response.status === 201 && response.data.success === true) {
            // toast.success('Sign Up Successful');
            return navigate(
              '/sign-up-success'
            );
            }else{
              toast.error(response.data.data);
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

  // After dispatch actions are complete, navigate to home page
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(`${import.meta.env.VITE_REACT_BASE_URL}/home`);
  //   }
  // }, [isAuthenticated, navigate]);

  const handleSignin = () => {
    navigate('/');
  };
  return (
    <div className="signup-container d-block py-0">
      <div className="Signup-container__logo-text">
        {/* <h1>VAYU</h1> */}
        <img src={vayu} alt="icon" />
      </div>

      <div className="signup-container__signup-card">
        <h1 className="signup-container__signup-card--title-signup">Sign Up</h1>

        <Row className="g-0 w-100">
          <Col md="12" lg="5" xl="4" className="col-wrapper">
            <Card className="card-sign-up">
              <Card.Body>
                <Form onSubmit={signupHandler}>
                  <div className="mb-4">
                    <Form.Control
                      type="name"
                      placeholder="Name"
                      onChange={handleNameChange}
                      value={username}
                    />
                  </div>
                  <div className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Email address"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <Form.Control
                      type="number"
                      placeholder="Mobile No."
                      onChange={handleMobileChange}
                      value={mobile}
                    />
                  </div>
                  {/* <div className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Gender"
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div> */}
                  <div className="mb-4">
                    <DropdownSignup
                      options={["Male", "Female"]}
                      text="Gender"
                      onSelect={handleGenderSelect}
                      // onSelect={(value) => setCategory(value)}
                    />
                  </div>
                  <div className="mb-4">
                    <Datepicker onSelectDate={handleDateSelect} />
                  </div>

                  <div className="mb-4">
                    <DropdownSignup
                      options={["Bihar", "Haryana"]}
                      text="State"
                      onSelect={handleStateSelect}
                      // onSelect={(value) => setCategory(value)}
                    />
                  </div>
                  <div className="mb-4">
                    <DropdownSignup
                      options={districtOptions}
                      text="District"
                      onSelect={handleDistrictSelect}
                    />
                  </div>
                  <div className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Address"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={handlePasswordChange}
                      inputMode="password"
                      value={password}
                    />
                    <div
                      type="button"
                      className="signup-container__signup-card--toggle-password-btn"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        style={{ color: "black" }}
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      onChange={handleConfirmPasswordChange}
                      inputMode="password"
                      value={confirmPassword}
                    />
                    <div
                      type="button"
                      className="signup-container__signup-card--toggle-confirm-password-btn"
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        style={{ color: "black" }}
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col md="12">
                      <Button
                        type="submit"
                        className="signup-container__signup-card--btn-sign-up"
                        disabled={
                          !email ||
                          !username ||
                          !mobile ||
                          !gender ||
                          !selectedDate ||
                          !selectedState ||
                          !selectedDistrict ||
                          !address ||
                          !password ||
                          !confirmPassword
                        }
                      >
                        Sign Up
                      </Button>
                    </Col>
                    <div className="mb-4">
                      <span className="signup-container__signup-card--sign-in">
                        <span onClick={handleSignin}>
                          Existing User ? Sign In
                        </span>
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

export default Signup;
