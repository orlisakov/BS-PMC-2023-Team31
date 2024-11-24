const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const adminRoutes = require('./routes/adminRoute');
const usersRoutes = require('./routes/userRoute');
const volunteerRoutes = require('./routes/volunteerRoute');
const associationRoutes = require('./routes/associationRoute');
const eventRoutes = require('./routes/eventRoute');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', adminRoutes); 
app.use('/', usersRoutes); 
app.use('/', volunteerRoutes); 
app.use('/', associationRoutes); 
app.use('/', eventRoutes); 


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});