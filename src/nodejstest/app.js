const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const { buildSchema } = require('graphql');
const bycrypt = require('bcryptjs');
const Event = require('./models/event');
const User = require('./models/user');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);


// const user = userId => {
//   return User.findById(userId)
//   .then(user => {
//     return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
//   })
//   .catch(err => {
//     throw err;
//   })
// };

// const events = eventIds => {
//   return Event.find({ _id: {$in : eventIds }})
//   .then(events => {
//     return events.map(event => {
//       return { ...event._doc, _id: event.id, creator: user.bind(this, event.creator) }
//     })
//   })
//   .catch(err => {
//     throw err;
//   })
// };

// app.use(
//   '/graphql',
//   graphqlHttp({
//     schema: buildSchema(`
//         type Event {
//           _id: ID!
//           title: String!
//           description: String!
//           price: Float!
//           date: String!
//           creator: User!
//         }
//         type User{
//           _id: ID!
//           email: String!
//           passowrd: String
//           createdEvents: [Event!]
//         }
//         input EventInput {
//           title: String!
//           description: String!
//           price: Float!
//           date: String!
//         }
//         input UserInput {
//           email: String!
//           password: String!
//         }
//         type RootQuery {
//             events: [Event!]!
//         }
//         type RootMutation {
//             createEvent(eventInput: EventInput): Event
//             createUser(userInput: UserInput): User
//         }
//         schema {
//             query: RootQuery
//             mutation: RootMutation
//         }
//     `),
//     rootValue: {
//       events: () => {
//         return Event.find().populate('creator')
//         .then(events => {
//           return events.map(event => {
//             return {
//               ...event._doc,
//               _id: event.id,
//               creator: user.bind(this, event._doc.creator)
//              };
//           });
//         }).catch(
//           err => {
//             throw err;
//           }
//         );
//       },
//       createEvent: args => {
//         const event = new Event({
//           title: args.eventInput.title,
//           description: args.eventInput.description,
//           price: +args.eventInput.price,
//           date: new Date(args.eventInput.date),
//           creator: '5da8d6dee6cdce5dfc4513fa'
//         });
//         let createdEvent;
//         return event
//         .save()
//         .then(result => {
//           createdEvent = {...result._doc, _id: result._doc._id.toString()};
//           return User.findById('5da8d6dee6cdce5dfc4513fa')
//         })
//         .then(user => {
//           console.log(user);
//           if(!user){
//             throw new Error('User not found');
//           }
//           user.createdEvents.push(event);
//           return user.save();
//         })
//         .then(result => {
//           console.log(result);
//           return createdEvent;
//         })
//         .catch(err => {
//           console.log(err);
//           throw err;
//         });
//       },
//       createUser: args => {
//         return User.findOne({email: args.userInput.email})
//         .then(user => {
//           if(user){
//             throw new Error('User exists already');
//           }
//           return bycrypt.hash(args.userInput.password, 12);
//         })
//         .then(hashedPassword => {
//           const user = new User({
//             email: args.userInput.email,
//             password: hashedPassword
//           });
//           return user.save();
//         })
//         .then(result => {
//             console.log(result);
//             return {...result._doc, _id: result.id };
//           })
//         .catch(err => {
//             console.log(err);
//             throw err;
//         });
//       }
//     },
//     graphiql: true
//   })
// );
console.log(process.env.CONNECT_STRING);
mongoose.connect(
  // `mongodb+srv://${process.env.MONGO_USER}:${
  //   process.env.MONGO_PASSWORD
  // }@kayunwebsite-lotvj.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  process.env.CONNECT_STRING
  , { useUnifiedTopology: true,useNewUrlParser: true }
  ).then(() => {
    app.listen(3000);
    console.log("Listening on port 3000!");
  }).catch(err => {
    console.log(err);
  });

