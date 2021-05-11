const express = require('express');

const cors = require('cors');
const { PORT, CORS_ALLOWED_ORIGINS, inTestEnv } = require('./env');
const emailer = require('./emailer');

const app = express();
app.use(express.json());

/* ********************** app settings ********************** */
app.set('x-powered-by', false); // for security

const allowedOrigins = CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// route for contact mail

app.post('/contact', (req, res) => {
  const { email, name, subject, description } = req.body;
  // error handlings joi
  emailer.sendMail(
    {
      from: 'youcefboutrig92@outlook.fr',
      to: 'youcefboutrig92@gmail.com',
      subject,
      text: `${name} tried to reach you with this message : ${description} from this email : ${email}`,
      html: `${name} tried to reach you with this message : ${description} from this email : ${email}`,
    },
    (err, info) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else console.log(info);
      res.sendStatus(200);
    }
  );
});

/* ********************** server setup ********************** */
app.listen(PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${PORT}`);
  }
});

/* ********************** process setup : improves error reporting ********************** */
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});
