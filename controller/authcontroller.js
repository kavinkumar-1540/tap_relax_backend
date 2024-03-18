const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/usermodel').User;
const nodemailer = require('nodemailer');

// Function to generate random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP via email
async function sendOTPByEmail(email, otp) {
  // Create nodemailer transporter using your email service credentials
  let transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'Gmail'
  auth: {
    user: 'kavinkumar7834@gmail.com',
    pass: 'fvbmnimjhaxygvyy',
  },
  });

  // Send email with OTP
  await transporter.sendMail({
    from: 'kavinkumar7834@gmail.com',
    to: email,
    subject: 'OTP for Login/Register',
    text: `Your OTP for login/register is: ${otp}`
  });
}

exports.register = (req, res) => {
    const userData = req.body;
  console.log(userData);
    // Check if email or phone already exist
    User.getByEmail(userData.email, (err, userByEmail) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error checking email existence.');
      }
      
      // If email already exists, return error message
      if (userByEmail) {
        return res.status(400).send('Email already exists.');
      }
  
      User.getByPhone(userData.phone, (err, userByPhone) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error checking phone number existence.');
        }
  
        // If phone number already exists, return error message
        if (userByPhone) {
          return res.status(400).send('Phone number already exists.');
        }
  
        // If email and phone number are unique, proceed with registration
        const otp = generateOTP(); // Generate OTP
        const hashedPassword = bcrypt.hashSync(userData.password, 8);
        userData.password = hashedPassword;
        userData.otp = otp; // Add OTP to user data
  
        User.create(userData, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error registering user.');
          }
  
          // Send OTP via email
          sendOTPByEmail(userData.email, otp)
            .then(() => {
              res.status(200).send('User registered successfully. OTP sent to email.');
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error sending OTP via email.');
            });
        });
      });
    });
  };
  

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.getByEmail(email, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error finding user.');
    } else {
      if (!user) {
        res.status(404).send('User not found.');
      } else {
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
          res.status(401).send('Invalid password.');
        } else {
          const otp = generateOTP(); // Generate OTP
          user.otp = otp; // Update OTP in user data

          // Update user with new OTP
          User.update(user.id, { otp: otp }, (updateErr, result) => {
            if (updateErr) {
              console.error(updateErr);
              res.status(500).send('Error updating OTP.');
            } else {
              // Send OTP via email
              sendOTPByEmail(user.email, otp)
                .then(() => {
                  res.status(200).send('OTP sent to email.');
                })
                .catch((error) => {
                  console.error(error);
                  res.status(500).send('Error sending OTP via email.');
                });
            }
          });
        }
      }
    }
  });
};

exports.verifyOTP = (req, res) => {
    const { otp, email, phone } = req.body;

    User.verifyOTP(email, phone, otp, (err, isValid,userId) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error verifying OTP.');
        }

        if (!isValid) {
            return res.status(401).send('Invalid OTP.');
        }

        res.status(200).json({ message: 'OTP verified successfully.', userId });
    });
};
