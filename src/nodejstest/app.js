const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const Event = require('./models/event');
const User = require('./models/user');
const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        type User{
          _id: ID!
          email: String!
          passowrd: String
        }
        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        input UserInput {
          email: String!
          password: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find().then(events => {
          return events.map(event => {
            return {...event._doc , _id: event.id };
          });
        }).catch(
          err => {
            throw err;
          }
        );
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5da8d6dee6cdce5dfc4513fa'
        });
        let createEvent;
        return event
        .save()
        .then(result => {
          createEvent = {...result._doc, _id: result._doc._id.toString()};
          return User.findById('5da8d6dee6cdce5dfc4513fa')
        })
        .then(user => {
          console.log(user);
          if(!user){
            throw new Error('User not found');
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(result => {
          console.log(result);
          return createEvent;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
      },
      createUser: args => {
        return User.findOne({email: args.userInput.email})
        .then(user => {
          if(user){
            throw new Error('User exists already');
          }
          return bycrypt.hash(args.userInput.password, 12);
        })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          return user.save();
        })
        .then(result => {
            console.log(result);
            return {...result._doc, _id: result.id };
          })
        .catch(err => {
            console.log(err);
            throw err;
        });
      }
    },
    graphiql: true
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@kayunwebsite-lotvj.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useUnifiedTopology: true,useNewUrlParser: true }
  ).then(() => {
    app.listen(3000);
    console.log("Listening on port 3000!");
  }).catch(err => {
    console.log(err);
  });
