const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const user = require("./routes/userroutes")
const auth = require("./routes/authroutes")
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Increase the limit to 50mb (or any size you need)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(user)
app.use(auth)


app.listen(PORT, () => {
  console.log("TAP & RELAX Server is running on http://localhost:" + PORT);
});
