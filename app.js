const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const discussionRoutes = require('./routes/discussionRoutes.js');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log("Mongodb connected!"))
  .catch((error) => console.error('Error connecting to Mongodb:', error));
  
app.use(userRoutes);
app.use(discussionRoutes);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
      },
    });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
