
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
    codiPartida: ID!
    jugador: String
    moviment: String
    torn: String!
    vicJug1: Int!
    vicJug2: Int!
}

type Query {
    consultarPartides: [Partida]
}
type Mutation {
    crearPartida(codiPartida: ID!, input: partidaInput): Partida
    acabarPartida(codiPartida: ID!, jugador: String!): Boolean
    tirarMoviment(codiPartida: ID!, jugador: String!, moviment: String!): Boolean
}
`);
// como crear una partida
// mutation {
//     crearPartida(codiPartida: 1, input: {jugador: "jug1", moviment: "piedra", torn: "jug1", vicJug1: 0, vicJug2: 0}) {
//         codiPartida
//         jugador
//         moviment
//         torn
//         vicJug1
//         vicJug2
//     }
// }

 
// aquesta arrel té una funció per a cada endpoint de l'API

let partides = [];

const arrel = {
    consultarPartides: () => {
        return partides;
    },
    crearPartida: ({ codi, input }) => {
        let novaPartida = partides.find(p => p.codiPartida == codi);
        if (novaPartida) {
            return novaPartida;
        }
        novaPartida = new Partida(codi, input);
        partides.push(novaPartida);
        return novaPartida;
    },
    acabarPartida: ({ codi, jugador }) => {
        let partid = partides.find(p => p.codiPartida == codi);
        if (partid) {
            partid.jugador = jugador;
            return true;
        }
        return false;
    },
    tirarMoviment: ({ codi, jugador, moviment }) => {
        let partid = partides.find(p => p.codiPartida == codi);
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