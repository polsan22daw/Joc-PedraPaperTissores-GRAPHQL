
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
 
// schema de GraphQL, ! vol dir que NO POT SER NULL
const esquema = buildSchema(`
input partidaInput {
    numJugador: Int!
    puntuacio: Int!
    tipusMoviment: String!
    torn: Int!
}
type partida {
    codi: Int!
    numJugador: Int!
    puntuacio: Int!
    tipusMoviment: String!
    torn: Int!
}
type Query {
    partidesActives: [partida]
}
type Mutation {
    crearPartida(codi: Int!, input: partidaInput): partida
    acabarPartida(codi: Int!, numJugador: Int!): Boolean
    tirarMoviment(codi: Int!, numJugador: Int!, tipusMoviment: String!): Boolean
}
`);
 
// aquesta arrel té una funció per a cada endpoint de l'API

// Normalment seria una BD
const arrel = {
    partidesActives: () => {
        return partides;
    },
    crearPartida: ({ codi, input }) => {
        let partid = new partida(codi, input.numJugador, input.puntuacio, input.tipusMoviment, input.torn);
        partides.push(partid);
        return partid;
    },
    acabarPartida: ({ codi, numJugador }) => {
        let partid = partides.find(p => p.codiPartida == codi);
        if (partid) {
            partid.numJugador = numJugador;
            return true;
        }
        return false;
    },
    tirarMoviment: ({ codi, numJugador, tipusMoviment }) => {
        let partid = partides.find(p => p.codiPartida == codi);
        if (partid) {
            partid.numJugador = numJugador;
            partid.tipusMoviment = tipusMoviment;
            return true;
        }
        return false;
    }
};

class partida {
    constructor(codiPartida, numJugador, puntuacio, tipusMoviment, torn) {
        this.codiPartida = codiPartida;
        this.numJugador = numJugador;
        this.puntuacio = puntuacio;
        this.tipusMoviment = tipusMoviment;
        this.torn = torn;
    }
}

class moviment {
    constructor(tipusMoviment) {
        this.tipusMoviment = tipusMoviment;
    }
}

let partides = [];

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: esquema,
    rootValue: arrel,
    graphiql: true,
}));
app.listen(4000);
console.log('Executant servidor GraphQL API a http://localhost:4000/graphql');