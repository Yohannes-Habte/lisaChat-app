import User from '../model/userModel.js';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/generateToken.js';

//====================================================
// Register user in the database
//====================================================
export const createUser = async (req, res, next) => {
  const { name, email, password, picture, isAdmin } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.status(400);
      throw new Error('The email has been arleady taken.');
    }

    if (!user) {
      const newUser = new User({
        name: name,
        email: email,
        password: password,
        picture: picture,
        isAdmin: isAdmin,
      });

      const savedUser = await newUser.save();

      // Token
      const token = generateToken(savedUser.i_d);

      // Send HTTP-only cookie to the client in the frontend and also the user data
      return res.status(201).json({
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        password: savedUser.password,
        picture: savedUser.picture,
        isAdmin: savedUser.isAdmin,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    return next(createError(403, 'User could not be created!'));
  }
};

//====================================================
// Login user into the database
//====================================================

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(
        createError(400, 'This email does not exist. Please sign up!')
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(createError(400, 'Invalid password! Please try again.'));
    }

    if (user && isPasswordValid) {
      // Token
      const token = generateToken(user._id);

      // Send HTTP-only cookie to the client in the frontend and also the user data
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.picture,
        isAdmin: user.isAdmin,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'User could not log in. Please try again!'));
  }
};

//====================================================
// Update user data
//====================================================

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    next(createError(500, 'User could not be updated. Please try again!'));
  }
};

//====================================================
// Get all users from the database
//====================================================

export const allUsers = async (req, res, next) => {
  try {
    // Searching the user using "name" or "email" requires query
    const searchUser = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {}; // else nothing will be done

    // Find users except the user who is logged in. In this case, remember to authorize the user logged in using "req.user._id". $ne = not equal to
    const users = await User.find(searchUser);

    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    next(createError(500, 'Database could not be queried!'));
  }
};

//====================================================
// Delete one user from the database
//====================================================

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(createError(400, 'User does not found'));
    } else {
      return res
        .status(200)
        .json(`${user.name} has been successfully deleted.`);
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Database could not be queried!'));
  }
};

//====================================================
// Delete all users from the database
//====================================================

export const deleteUsers = async (req, res, next) => {
  try {
    await User.deleteMany();
    return res.status(200).json(`All users have been successfully deleted.`);
  } catch (error) {
    console.log(error);
    next(createError(500, 'Database could not be queried!'));
  }
};
