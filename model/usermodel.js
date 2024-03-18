const db = require("../dbConfig/dbconfig");

const User = {
  create: (userData, callback) => {
    db.query("INSERT INTO users SET ?", userData, callback);
  },
  getAll: (callback) => {
    db.query("SELECT * FROM users", callback);
  },
  getById: (userId, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [userId], callback);
  },
  getByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null); // No user found with this email
      }
      return callback(null, results[0]); // Return the user object
    });
  },
  getByPhone: (phone, callback) => {
    db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null); // No user found with this phone number
      }
      return callback(null, results[0]); // Return the user object
    });
  },
  update: (userId, userData, callback) => {
    db.query("UPDATE users SET ? WHERE id = ?", [userData, userId], callback);
  },
  delete: (userId, callback) => {
    db.query("DELETE FROM users WHERE id = ?", [userId], callback);
  },
  verifyOTP: (email, phone, otp, callback) => {
    db.query(
      "SELECT * FROM users WHERE email = ? AND phone = ? AND otp = ?",
      [email, phone, otp],
      (err, results) => {
        if (err) {
          console.error(err);
          return callback(err, null);
        }
        if (results.length === 0) {
          return callback(null, false);
        }
        const userId = results[0].id;
        return callback(null, true, userId);
      }
    );
  },
};

const Product = {
 create: (userId, name, price, design, callback) => {
    // Check if the product name is PVC Card or Standee
    if (name === 'PVC Card' || name === 'Standee') {
      // Check if the user already has a product with the same name
      db.query(
        'SELECT * FROM products WHERE user_id = ? AND name = ?',
        [userId, name],
        (err, results) => {
          if (err) {
            console.error(err);
            return callback(err, null);
          }
          if (results.length > 0) {
            // If a product with the same name exists for the user, return an error
            return callback("Product already exists for this user", null);
          } else {
            // If no existing product found, proceed with insertion
            db.query(
              "INSERT INTO products (user_id, name, price, design) VALUES (?, ?, ?, ?)",
              [userId, name, price, design],
              (err, result) => {
                if (err) {
                  console.error(err);
                  return callback(err, null);
                } else {
                  return callback(null, result.insertId); // Return the ID of the newly inserted row
                }
              }
            );
          }
        }
      );
    } else {
      // For other product names, directly insert the product
      db.query(
        "INSERT INTO products (user_id, name, price, design) VALUES (?, ?, ?, ?)",
        [userId, name, price, design],
        (err, result) => {
          if (err) {
            console.error(err);
            return callback(err, null);
          } else {
            return callback(null, result.insertId); // Return the ID of the newly inserted row
          }
        }
      );
    }
  },
  // Method to retrieve the design image of a product by ID
  getDesignImageById: (productId, callback) => {
    db.query(
      "SELECT design FROM products WHERE id = ?",
      [productId],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }
        if (results.length === 0) {
          return callback(null, null);
        }
        // Extract the design image data from the results
        const designImage = results[0].design;
        return callback(null, designImage);
      }
    );
  },
  getById: (productId, callback) => {
    db.query(
      "SELECT * FROM products WHERE id = ?",
      [productId],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          // Assuming the result contains a single product row
          const product = results[0];
          callback(null, product);
        }
      }
    );
  },
};

const Pvcpersonal = {
  create: (data, callback) => {
    db.query(
      'NSERT INTO pvcpersonal (user_id, name, email, contacts, address, description, profile_picture,social_media,social_media_links,product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.user_id,
        data.name,
        data.email,
        data.contacts,
        data.address,
        data.description,
        data.profile_picture,
        data.social_media,
        data.social_media_links,
        data.product_id,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          callback(null, result.insertId); // Return the ID of the newly inserted row
        }
      }
    );
  },
  // Read operation
  read: (callback) => {
    db.query("SELECT * FROM pvcpersonal ", callback);
  },
  // Get profile data by ID
  getProfileDataById: (id, callback) => {
    db.query("SELECT * FROM pvcpersonal WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      // Extract the profile data from the results
      const profileData = results[0];
      return callback(null, profileData);
    });
  },

  // Update operation
  update: (id, data, callback) => {
    db.query(
      "UPDATE pvcpersonal SET name = ?, email = ?, contacts = ?, address = ?, description = ?, profile_picture = ?, social_media = ?, social_media_links = ?, product_id = ? WHERE id = ?",
      [
        data.name,
        data.email,
        data.contacts,
        data.address,
        data.description,
        data.profile_picture,
        data.social_media,
        data.social_media_links,
        data.product_id,
        id,
      ],
      callback
    );
  },

  // Delete operation
  delete: (id, callback) => {
    db.query("DELETE FROM pvcpersonal WHERE id = ?", [id], callback);
  },
};
const companyinfo = {
  create: (data, callback) => {
    db.query(
      "INSERT INTO companyinfo (user_id, company_name, email, contacts, address, description, profile_picture,social_media,social_media_links,product_id,review_link,web_address	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.user_id,
        data.company_name,
        data.email,
        data.contacts,
        data.address,
        data.description,
        data.profile_picture,
        data.social_media,
        data.social_media_links,
        data.product_id,
        data.review_link,
        data.web_address,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          callback(null, result.insertId); // Return the ID of the newly inserted row
        }
      }
    );
  },
    // Get profile data by ID
    getCompanyInfoById: (id, callback) => {
      db.query("SELECT * FROM companyinfo WHERE id = ?", [id], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        if (results.length === 0) {
          return callback(null, null);
        }
        // Extract the profile data from the results
        const profileData = results[0];
        return callback(null, profileData);
      });
    },
  // Read operation
  read: (callback) => {
    db.query("SELECT * FROM companyinfo", callback);
  },

  // Update operation
  update: (id, data, callback) => {
    db.query(
      "UPDATE companyinfo SET company_name = ?, email = ?, contacts = ?, address = ?, description = ?, profile_picture = ?, social_media = ?, social_media_links = ?, product_id = ?, review_link = ?, web_address = ? WHERE id = ?",
      [
        data.company_name,
        data.email,
        data.contacts,
        data.address,
        data.description,
        data.profile_picture,
        data.social_media,
        data.social_media_links,
        data.product_id,
        data.review_link,
        data.web_address,
        id,
      ],
      callback
    );
  },

  // Delete operation
  delete: (id, callback) => {
    db.query("DELETE FROM companyinfo WHERE id = ?", [id], callback);
  },
};


const paymentinfo = {
  create: (data, callback) => {
    db.query(
      'INSERT INTO paymentinfo (user_id, product_id,name,more_links	) VALUES (?, ?, ?, ?)',
      [
        data.user_id,
        data.product_id,
        data.name,
        data.more_links,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          callback(null, result.insertId); // Return the ID of the newly inserted row
        }
      }
    );
  },
    // Get profile data by ID
    getPaymentInfoById: (id, callback) => {
      db.query("SELECT * FROM paymentinfo WHERE id = ?", [id], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        if (results.length === 0) {
          return callback(null, null);
        }
        // Extract the profile data from the results
        const profileData = results[0];
        return callback(null, profileData);
      });
    },
  }
module.exports = { User, Product, Pvcpersonal, companyinfo,paymentinfo };
