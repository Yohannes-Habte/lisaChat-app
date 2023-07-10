import React, { useContext, useState } from 'react';
import './Login.scss';
import { GiFlowerPot, GiCottonFlower, GiFireFlower } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { ACTION, UserChatContext } from '../../context/ChatProvider';
import SetCookie from '../../hooks/SetCookie';

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  // Global state variable
  const { dispatch } = useContext(UserChatContext);
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDisplay, setPasswordDisplay] = useState(false);
  const [loading, setLoadding] = useState(false);

  // update regitration input data
  const updateData = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  // Password display and hide function
  const paswordDisplayController = () => {
    setPasswordDisplay(!passwordDisplay);
  };

  // Reste input
  const reset = () => {
    setEmail('');
    setLoadding('');
  };

  // Submit handler
  const submitHandlder = async (e) => {
    e.preventDefault();
    setLoadding(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all the fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoadding(false);
      return;
    }

    try {
      // user
      const userLogin = {
        email: email,
        password: password,
      };

      // axios
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + '/api/users/login',
        userLogin
      );

      dispatch({ type: ACTION.USER_LOGIN, payload: data });
      // Save in the Local storage
      // localStorage.setItem('user', JSON.stringify(data));
      SetCookie("userInfo", JSON.stringify(data))

      // Reset inpute data
      reset();

      // Success notification
      toast({
        title: 'Log in is successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // navigate to chat
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error occured!',
        description: error.response.data.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoadding(false);
    }
  };

  return (
    <section className="login-section">
      <h2 className="login-title">Login for Free</h2>
      <form action="" onSubmit={submitHandlder} className="login-form">
        <div className="label-input">
          <FaStar className="email-required-icon" />
          <label htmlFor="email"> Email </label>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={updateData}
            placeholder="Enter Email"
          />
        </div>

        <div className="label-input">
          <FaStar className="password-required-icon" />
          <label htmlFor="password"> Password </label>
          <input
            type={passwordDisplay ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={updateData}
            placeholder="Enter Password"
          />

          <span
            className="password-show-hide"
            onClick={paswordDisplayController}
          >
            {passwordDisplay ? 'hide' : 'show'}
          </span>
        </div>

        <div>
          <button className="login-btn"> Log In </button>
        </div>
        {/* user credentials */}
        <div>
          <button
            onClick={() => {
              setEmail('guest@example.com');
              setPassword('123456');
            }}
            className="login-btn"
          >
            Get Guest User Credentials
          </button>
        </div>
      </form>
      <figure className="login-icons">
        <GiFlowerPot className="icon" />
        <GiCottonFlower className="icon" />
        <GiFireFlower className="icon" />
      </figure>
    </section>
  );
};

export default Login;
