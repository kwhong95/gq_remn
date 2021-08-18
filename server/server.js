const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const expressPlayground = require('graphql-playground-middleware-express').default
const mongoose = require('mongoose');
const dotenv = require('dotenv');

app.use(bodyParser.json());
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.use(
	'/graphql',
	graphqlHTTP({
		schema: buildSchema(`
			type RootQuery {
				hello: String!
			}
			
			type RootMutation {
				somemutation: String
			}
			
			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`),
		rootValue: {
			hello: () => {
				return 'Hello Back!!'
			}
		},
		graphiql: true
	})
)

const PORT = process.env.PORT || 5000;

dotenv.config()

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


