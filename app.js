const express = require('express')
const app = express();
const {graphqlHTTP}= require('express-graphql')
const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema} = require('graphql')

const seedData = [
    {id: 1, language: 'Python', loved:true},
    {id: 2, language: 'Javascript', loved:true},
    {id: 3, language: 'Scala', loved:true}
]

//every graphQl server has two core component it needs to work which is : Schema and Resolver
//Schema: is basically a model of the data that can be fetched through the graphQL server
//Resolver: basically tells graphQl how to populate each field in the schema with data

const languageType = new GraphQLObjectType({
    name: 'language',
    description: 'ProgrammingLanguage',
    //fields contains parameters of the data we want to export
    fields:{
        id: {
            type: GraphQLInt
        },
        language:{
            type: GraphQLString
        },
        loved:{
            type: GraphQLBoolean
        }
    }
})
const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'This is the rootQuery',
    //fields contains parameters of the data we want to export
    fields:{
        languages: {
            type: GraphQLList(languageType),
            resolve: ()=> seedData
        },
        language: {
            type: languageType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args, context, info)=> {seedData.find(language=> language.id == args.id)}
        }
    }
})
const rootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: 'This is the rootMutation',
    //fields contains parameters of the data we want to export
    fields:{
        language: {
            type: languageType,
            args: {
                language: {type: GraphQLString},
                language: {type: GraphQLBoolean}
            },
            resolve: (parent,args, context, info)=> {
                const newLanguage = {id: seedData.length + 1, language: args.language, loved: args.loved}
                seedData.push(newLanguage)
                return newLanguage
            }
        }       
    }
})

const schema = new GraphQLSchema({query: rootQuery, mutation: rootMutation})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

const PORT = 7070

app.listen(PORT, ()=>{console.log(`listening on ${PORT}`)})