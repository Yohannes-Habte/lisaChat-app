import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

//=====================================================================
// Function that generate a token for the user
//=====================================================================
export const generateToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return accessToken;
};

//=====================================================================
// Function that Authorize the user
//=====================================================================

export const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      // Decode token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log('Decoded token', decodedToken);
      // user in the database
      const user = await User.findById(decodedToken.id);
      req.user = user;
      next();
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  } catch (error) {
    console.log(error);
  }
};

//=====================================================================
// Function that Authorize the Admin
//=====================================================================

export const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      throw new Error('User is unauthrorized!');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User does not exist in the database!');
    }

    if (user && user.isAdmin) {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
