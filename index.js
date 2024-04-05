import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// types 
import { typeDefs } from "./typeDefs.js"

// db
import db from './_db.js'


const resolvers = {
    Query: {
        games() {
            return db.games
        },
        game(_, args) {
            return db.games.find((game) => game.id === args.id)
        },
        authors() {
            return db.authors
        },
        author(_, args) {
            return db.authors.find((author) => author.name === args.name)
        },
        reviews() {
            return db.reviews
        },
        review(_, args) {
            return db.reviews.find((review) => review.id === args.id )
        }
    },
    Game: {
        reviews(parent) { 
            return db.reviews.filter((review) => review.game_id === parent.id)
        }
    }, 
    Review: {
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id)
        },
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id)
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter(review =>  review.author_id === parent.id)
        }
    },
    Mutation: {
        deleteGame(_, args) {
           return db.games.filter(game => game.id !== args.id)
        },
        addGame(_, args) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 1000).toString()
            }
            db.games.push(game)
            return game
        },
        updateGame(_, args) {
            db.games = db.games.map((g) => {
                if(g.id == args.id) {
                    return {...g, ...args.edits}
                }
                return g
            })
            return db.games.find(g => g.id === args.id)
        }
    }

}


// Server setup
const server = new ApolloServer({

    typeDefs, // definitions of the types of data graph schema
    resolvers  // handles the query 

})


const port = 4000
const { url } = await startStandaloneServer(server, {
    listen: { port  }
}) 


console.log("Server is ready at port ✋", port)



// Apollo server query example //

/*query GamesQuery {
    reviews {
      content
      id
    }
  
}*/
  

/*query GamesQuery($id : ID!) {
    review(id : $id) {
      content
      id
    }
}*/



/*query ReviewQuery($id : ID!) {
    review(id: $id) {
      content,
      rating,
      id,
      game {
        title
      } 
      author {
        name
      }
    }
}*/
  


/*query GamesQuery($id : ID!) {
    game(id: $id) {
      title,
      platform,
      id,
      reviews {
        content
        rating,
      },
  
    }
}*/
  

/*query AuthorQuery($name : String!) {
    author(name: $name) {
      name
      reviews {
        content
        id
        game {
          id
          title
        }
      }
  
    }
}*/


