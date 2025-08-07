  const express = require('express');
  const app = express();
  const accountsRoutes = require('./routes/accounts');
  const cors =require("cors");
 const pawnticket = require('./routes/pawnticket');

  app.use(express.json());
  app.use(cors({origin: 'http://localhost:5173'}));

  app.use('/api/accounts', accountsRoutes); 
  app.use('/pawnticket',pawnticket);

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
