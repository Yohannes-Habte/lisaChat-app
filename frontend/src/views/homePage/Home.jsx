import React, { useEffect, useState } from 'react';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import Login from '../../components/login/Login';
import Register from '../../components/register/Register';

const Home = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(0);

  // Function to manage tabs
  const tabsToggle = (index) => {
    setToggle(index);
  };

  // UseEffect Hook
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      navigate('/chats');
    }
  }, []);


  return (
    <main className="home-page">
      <section className="home-container">
        <h1 className="home-title"> Lisa ChatApp </h1>
        <div className="blog-tabs">
          <div
            onClick={() => tabsToggle(0)}
            className={toggle === 0 ? 'tabs active-tabs' : 'tabs'}
          >
            Log In
          </div>

          <div
            onClick={() => tabsToggle(1)}
            className={toggle === 1 ? 'tabs active-tabs' : 'tabs'}
          >
            Sign Up
          </div>
        </div>

        <div className="account-container">
          <div
            onClick={() => tabsToggle(0)}
            className={toggle === 0 ? 'account active-account' : 'account'}
          >
            <Login />
          </div>

          <div
            onClick={() => tabsToggle(1)}
            className={toggle === 1 ? 'account active-account' : 'account'}
          >
            <Register />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
