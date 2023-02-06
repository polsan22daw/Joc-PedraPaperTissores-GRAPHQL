
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// schema de GraphQL, ! vol dir que NO POT SER NULL
const esquema = buildSchema(`
input partidaInput {
    jugador: String
    moviment: String
    torn: String
    vicJug1: Int
    vicJug2: Int
}
type Partida {
    codiPartida: ID!
    jugador: String
    moviment: String
    torn: String
    vicJug1: Int
    vicJug2: Int
}

type Query {
    consultarPartides: [Partida]
    consultarPartida(codiPartida: ID!): Partida
}
type Mutation {
    crearPartida(codiPartida: ID!, input: partidaInput): Partida
    acabarPartida(codiPartida: ID!): Boolean
    tirarMoviment(codiPartida: ID!, jugador: String!, moviment: String!): Boolean
}
`);
 
// aquesta arrel té una funció per a cada endpoint de l'API

const partides = {};

const arrel = {
    consultarPartides: () => {
        return Object.keys(partides).map(codiPartida => new Partida(codiPartida, partides[codiPartida]));
    },
    consultarPartida: ({ codiPartida }) => {
        return partides[codiPartida];
    },
    crearPartida: ({ codiPartida, input }) => {
        let novaPartida = partides.find(p => p.codiPartida == codiPartida);
        if (novaPartida) {
            return novaPartida;
        }
        novaPartida = new Partida(codiPartida, input);
        partides.push(novaPartida);
        return novaPartida;
    },
    acabarPartida: ({ codiPartida }) => {
        delete partides[codiPartida];
    },
    tirarMoviment: ({ codiPartida, jugador, moviment }) => {
        let partid = partides.find(p => p.codiPartida == codiPartida);
        if (partid) {
            partid.jugador = jugador;
            partid.moviment = moviment;
            return true;
        }
        return false;
    }
};

class Partida {
    constructor(codiPartida, {jugador, moviment, torn, vicJug1, vicJug2}) {
      this.codiPartida = codiPartida;
      this.jugador = jugador;
      this.moviment = moviment;
      this.torn = torn;
      this.vicJug1 = vicJug1;
      this.vicJug2 = vicJug2;
    }
}



const app = express();
app.use('/graphql', graphqlHTTP({
    schema: esquema,
    rootValue: arrel,
    graphiql: true,
}));
app.listen(4000);
console.log('Executant servidor GraphQL API a http://localhost:4000/graphql');