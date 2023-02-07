
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// schema de GraphQL, ! vol dir que NO POT SER NULL
const esquema = buildSchema(`
input partidaInput {
    jugador: String = ""
    moviment: String = ""
    torn: String = "jug1"
    vicJug1: Int = 0
    vicJug2: Int = 0
}
type Partida {
    codiPartida: ID
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
    acabarPartida(codiPartida: ID!): String
    tirarMoviment(codiPartida: ID!, jugador: String!, moviment: String!): Boolean
}
`);
 
// aquesta arrel té una funció per a cada endpoint de l'API

let partides = [];

const arrel = {
    consultarPartides: () => {
        return partides;
    },
    consultarPartida: ({codiPartida}) => {
        let partida = partides.find(p => p.codiPartida == codiPartida);
        if (partida) {
            return partida;
        }
        return null;
        },
    crearPartida: ({ codiPartida, input }) => {
        if (partides.find(p => p.codiPartida == codiPartida)) {
            return "a";
        }
        novaPartida = new Partida(codiPartida, input);
        partides.push(novaPartida);
        return novaPartida;
    },
    acabarPartida: ({ codiPartida }) => {
        let partida = partides.find(p => p.codiPartida == codiPartida);
        if (!partida) {
            return "No pots eliminar una partida que no existeix!";
        }
        let index = partides.indexOf(partida);
        partides.splice(index, 1);
        return "Partida eliminada!";
    },
    tirarMoviment: ({ codi, jugador, moviment }) => {
        let partida = partides.find(p => p.codiPartida == codi);
        if (partida) {
            partida.jugador = jugador;
            partida.moviment = moviment;
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