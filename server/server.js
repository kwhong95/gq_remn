const { ApolloServer, gql } = require('apollo-server');
const mongoose  = require('mongoose');
const dotenv = require("dotenv");
const User = require("./modules/user");

const typeDefs = gql`
    type RootQuery {
        user(id: ID!): User!
    }

    type RootMutation {
        addUser(userInput: UserInput!): User!
    }

    type User {
        _id: ID!
        email: String!
        password: String!
    }

    input UserInput {
        email: String!
        password: String!
    }
`;

const resolvers = {
	Query: {
		user: async (parent, args, context, info ) => {
			try {
				const user = await User.findOne({ _id: args.id });
				return { ...user._doc }
			} catch (e) {
				throw e;
			}
		},
	},
	Mutation: {
		addUser: async (parent, args, context, info) => {
			try {
				const user = new User({
					email: args.userInput.email,
					password: args.userInput.password,
				});
				const result = await user.save();

				return {
					...result._doc
				}
			} catch (e) {
				throw e;
			}
		},
	}
}

dotenv.config()

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = process.env.PORT || 5000;
mongoose.connect(`mongodb+srv://graphqluser:${process.env.MONGO_PASSWORD}@cluster0.iafgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	app.listen(PORT, () => {
		console.log(`Running running on port ${PORT}`);
	})
}).catch(err => {
	console.log(err);
});
