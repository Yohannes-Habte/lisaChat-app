import React, { useContext, useState } from 'react';
import './Register.scss';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ACTION, UserChatContext } from '../../context/ChatProvider';
import SetCookie from '../../hooks/SetCookie';

const Register = () => {
  const navigate = useNavigate();
  // Global state variable
  const {dispatch} = useContext(UserChatContext)
  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [picture, setPicture] = useState('');
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);

  // useToast is used to display information
  const toast = useToast();

  // update regitration input data
  const updateData = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  // Password display and hide function
  const paswordDisplay = () => {
    setDisplay(!display);
  };

  // Function to reset input data
  const reset = () => {
    setName('');
    setEmail('');
    setPicture('');
    setPassword('');
    setConfirmPassword('');
    setDisplay(false);
    setDisplay(false);
  };

  // Upload images details details
  const uploadImageDetails = async (picture) => {
    setLoading(true);
    if (picture === undefined) {
      toast({
        title: 'Please select an image.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    if (
      picture.type === 'image/jpeg' ||
      picture.type === 'image/png' ||
      picture.type === 'image/jpg'
    ) {
      const FileData = new FormData();
      FileData.append('file', picture);
      FileData.append('upload_preset', 'lisaConsultFiles');
      FileData.append('cloud_name', 'lisaconsult');

      try {
        const { data } = await axios.post(
          'https://api.cloudinary.com/v1_1/lisaconsult/image/upload',
          FileData
        );
        setPicture(data.url);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'botton',
      });
      setLoading(false);
      return;
    }
  };

  // Submit handler
  const submitHandlder = async (event) => {
    event.preventDefault();
    setLoading(true);
    // check all fields are filled properly
    if (!name || !email || !password || !confirmPassword || !picture) {
      toast({
        title: 'Please fill all the fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    // check password match
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      // new user data
      const newUser = {
        name: name,
        email: email,
        password: password,
        picture: picture,
      };

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + `/api/users/register`,
        newUser,
      );
      dispatch({type: ACTION.USER_LOGIN, payload: data})

      // localStorage.setItem('userInfo', JSON.stringify(data));
      SetCookie("userInfo", JSON.stringify(data))
      setLoading(false);
      reset();
      toast({
        title: 'Registration is successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      // navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error Occured.',
        description: error.response.data.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  return (
    <section className="register-section">
      <h2 className="register-title"> Create Account for Free</h2>
      <form onSubmit={submitHandlder} className="register-form">
        <div className="label-input">
          <label htmlFor="name"> Name </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={updateData}
            placeholder="Enter Name"
          />
        </div>

        <div className="label-input">
          <label htmlFor="email"> Email </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={updateData}
            placeholder="Enter Email"
          />
        </div>

        <div className="label-input">
          <label htmlFor="password"> Password </label>
          <input
            type={display ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={updateData}
            placeholder="Enter Password"
          />
          <span className="password-display-manager" onClick={paswordDisplay}>
            {display ? 'hide' : 'show'}
          </span>
        </div>

        <div className="label-input">
          <label htmlFor="confirmPassword"> Confirm Password </label>
          <input
            type={display ? 'text' : 'password'}
            name="confirmPassword"
            onChange={updateData}
            value={confirmPassword}
            placeholder="Confirm Password"
          />

          <span className="password-display-manager" onClick={paswordDisplay}>
            {display ? 'hide' : 'show'}
          </span>
        </div>

        <div className="label-input">
          <label htmlFor="picture"> Upload Picture </label>
          <input
            type="file"
            name="picture"
            accept="image/*"
            onChange={(e) => uploadImageDetails(e.target.files[0])} // accept only one image
          />
        </div>

        <button className="register-btn">Sign Up</button>
      </form>
    </section>
  );
};

export default Register;
