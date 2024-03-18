const User = require('../model/usermodel').User;
const Product = require('../model/usermodel').Product;
const PVCPersonal  = require('../model/usermodel').Pvcpersonal;
const companyInfo  = require('../model/usermodel').companyinfo;
const paymentinfo  = require('../model/usermodel').paymentinfo;

exports.getAllUsers = (req, res) => {
    User.getAll((err, users) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching users.');
      } else {
        res.status(200).json(users);
      }
    });
  };
  
  exports.getUserById = (req, res) => {
    const userId = req.params.id;
  
    User.getById(userId, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching user.');
      } else {
        if (!user) {
          res.status(404).send('User not found.');
        } else {
          res.status(200).json(user);
        }
      }
    });
  };
  
  exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
  
    User.update(userId, userData, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating user.');
      } else {
        res.status(200).send('User updated successfully.');
      }
    });
  };
  
  exports.deleteUser = (req, res) => {
    const userId = req.params.id;
  
    User.delete(userId, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error deleting user.');
      } else {
        res.status(200).send('User deleted successfully.');
      }
    });
    console.error('Error creating product:', err);
  };

  exports.createProduct = (req, res) => {
    const { userId, name, price } = req.body;
    const design = req.file.buffer; // Assuming the image file is uploaded using Multer
    
    // Check if the user ID is provided
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }
  
    Product.create(userId, name, price, design, (err, result) => {
      if (err === "Product already exists for this user") {
        return res.status(409).send('Product already exists for this user.');
      }
      if (err) {
        console.error(err);
        return res.status(500).send('Error creating product.');
      }
      res.status(200).send({ message: 'Product created successfully.', result });
    });
  };
  exports.getImage = (req, res) => {
    const productId = req.params.productId;
  // Retrieve the product by ID using the Product model
  Product.getDesignImageById(productId, (err, product) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving product' });
    } else if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      // Send the design image as the response
        // Convert the blob data to a Base64 string
        const base64Img = Buffer.from(product).toString('base64');

        // Send the profile data to the frontend
        res.json(base64Img); // Send the image data stored in the database
    }
  });
  };
    // Route to get profile picture by ID
exports.getProfilePictureById = (req, res) => {

  const userId = req.params.id; // Assuming the user ID is passed as a parameter in the request

  // Call the database function to retrieve profile data by ID
  PVCPersonal.getProfileDataById(userId, (err, profileData) => {
    if (err) {
      // Handle error
      console.error("Error fetching profile data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    
    if (!profileData) {
      // No profile data found for the given ID
      return res.status(404).json({ error: "Profile not found" });
    }

    // Convert profile picture to base64
    const profilePictureBase64 = Buffer.from(profileData.profile_picture).toString('base64');
    
    // Include profile picture in base64 format along with other profile data
    const profileDataWithBase64 = {
      ...profileData,
      profile_picture_base64: profilePictureBase64
    };

    // Profile data found, send it in the response
    res.status(200).json(profileDataWithBase64);
  });
}


 
  exports.createPvcpersonal = (req, res) => {
    const data = {
      product_id: req.body.product_id,
      user_id: req.body.user_id,
      name: req.body.name,
      email: JSON.stringify(req.body.emails),
      contacts: JSON.stringify(req.body.contacts),
      address: req.body.address,
      description: req.body.description,
      profile_picture: req.file.buffer,
      social_media: JSON.stringify(req.body.social_media),
      social_media_links: JSON.stringify(req.body.social_media_links)
    };
  
    PVCPersonal.create(data, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error creating pvcpersonal data.');
      } else {
        res.status(200).json({message:'Pvcpersonal data created successfully.',result});
      }
    });
  };
  exports.createcompanyinfo = (req, res) => {
    const data = {
      product_id: req.body.product_id,
      user_id: req.body.user_id,
      company_name: req.body.company_name,
      review_link: req.body.review_link,
      web_address	: req.body.web_address,
      email: JSON.stringify(req.body.emails),
      contacts: JSON.stringify(req.body.contacts),
      address: req.body.address,
      description: req.body.description,
      profile_picture: req.file.buffer,
      social_media: JSON.stringify(req.body.social_media),
      social_media_links: JSON.stringify(req.body.social_media_links)
    };
  
    companyInfo.create(data, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error creating pvcpersonal data.');
      } else {
        res.status(200).json({message:'Company Info data created successfully.',result});
      }
    });
  };
  exports.createPaymentinfo = (req, res) => {
    console.log(req.body);
    const data = {
      product_id: req.body.product_id,
      user_id: req.body.user_id,
      name: JSON.stringify(req.body.name),
      more_links: JSON.stringify(req.body.more_links),
    };
  
    paymentinfo.create(data, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error creating pvcpersonal data.');
      } else {
        res.status(200).json({message:'payment Info data created successfully.',result});
      }
    });
  };

  exports.getpaymentById = (req, res) => {
    const userId = req.params.id;
  
    paymentinfo.getPaymentInfoById(userId, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching user.');
      } else {
        if (!user) {
          res.status(404).send('User not found.');
        } else {
          res.status(200).json(user);
        }
      }
    });
  };
  exports.getPersonal = (req, res) => {
    PVCPersonal.read((err, users) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching users.');
      } else {
        // console.log(users);
        const Img = Buffer.from(users[0].profile_picture).toString('base64');
        res.status(200).json(Img);
      }
    });
  };

  exports.getCompanyInfo = (req, res) => {

    const userId = req.params.id; // Assuming the user ID is passed as a parameter in the request
    companyInfo.getCompanyInfoById(userId, (err, profileData) => {
      if (err) {
        // Handle error
        console.error("Error fetching profile data:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      
      if (!profileData) {
        // No profile data found for the given ID
        return res.status(404).json({ error: "Profile not found" });
      }
      const profilePictureBase64 = Buffer.from(profileData.profile_picture).toString('base64');
      const profileDataWithBase64 = {
        ...profileData,
        profile_picture_base64: profilePictureBase64
      };
  
      // Profile data found, send it in the response
      res.status(200).json(profileDataWithBase64);
    });
  }


  
