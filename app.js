
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
    tirarMoviment(codiPartida: ID!, jugador: String!, moviment: String!): String
}
`);
 
// aquesta arrel té una funció per a cada endpoint de l'API

let partides = [];
movJug1 = "";
movJug2 = "";
contador = 0;

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
    tirarMoviment: ({ codiPartida, jugador, moviment }) => {
        let partida = partides.find(p => p.codiPartida == codiPartida);
        if (!partida) {
            return "La partida no existeix!";
        }
        if (partida.torn == jugador) {
            partida.jugador = jugador;
            partida.moviment = "????";
            if (partida.torn == "jug1") {
                movJug1 = moviment;
                partida.torn = "jug2";
                ++contador;
            }else{
                movJug2 = moviment;
                partida.torn = "jug1";
                ++contador;
            }
        }else{
            return "No es el teu torn, espera a que l'altre jugador faci el seu moviment";
        }
        if (contador == 2) {
            contador = 0;
            if (movJug1 == "paper" && movJug2 == "pedra") {
                partida.vicJug1++;
                if(partida.vicJug1 == 3){
                    return "FELICITATS jugador 1, has guanyat!";
                }else if (partida.vicJug2 == 3){
                    return "FELICITATS jugador 2, has guanyat!";
                }else{
                    return "El jugador 1 ha escollit PAPER, el Jugador 2 PEDRA. El Jugador 1 ha guanyat aquesta ronda";
                }
            }else if (movJug1 == "pedra" && movJug2 == "paper") {
                partida.vicJug2++;
                if(partida.vicJug1 == 3){
                    return "FELICITATS jugador 1, has guanyat!";
                }else if (partida.vicJug2 == 3){
                    return "FELICITATS jugador 2, has guanyat!";
                }else{
                    return "El jugador 1 ha escollit PEDRA, el Jugador 2 PAPER. El Jugador 2 ha guanyat aquesta ronda";   
                }
            }else if (movJug1 == "paper" && movJug2 == "tisores") {
                partida.vicJug2++;
                if(partida.vicJug1 == 3){
                    return "FELICITATS jugador 1, has guanyat!";
                }else if (partida.vicJug2 == 3){
                    return "FELICITATS jugador 2, has guanyat!";
                }else{
                    return "El jugador 1 ha escollit PAPER, el Jugador 2 TISORES. El Jugador 2 ha guanyat aquesta ronda";
                }
            }else if (movJug1 == "tisores" && movJug2 == "paper") {
                partida.vicJug1++;
                if(partida.vicJug1 == 3){
                    return "FELICITATS jugador 1, has guanyat!";
                }else if (partida.vicJug2 == 3){
                    return "FELICITATS jugador 2, has guanyat!";
                }else{
                    return "El jugador 1 ha escollit TISORES, el Jugador 2 PAPER. El Jugador 1 ha guanyat aquesta ronda";
                }
            }else if (movJug1 == "pedra" && movJug2 == "tisores") {
                partida.vicJug1++;
                if(partida.vicJug1 == 3){
                    return "FELICITATS jugador 1, has guanyat!";
                }else if (partida.vicJug2 == 3){
                    return "FELICITATS jugador 2, has guanyat!";
                }else{
                    return "El jugador 1 ha escollit PEDRA, el Jugador 2 TISORES. El Jugador 1 ha guanyat aquesta ronda";
                }
            }else if (movJug1 == "tisores" && movJug2 == "pedra") {
                partida.vicJug2++;
                if(partida.vicJug1 == 3){
                    return "FELICITATS jugador 1, has guanyat!";
                }else if (partida.vicJug2 == 3){
                    return "FELICITATS jugador 2, has guanyat!";
                }else{
                    return "El jugador 1 ha escollit TISORES, el Jugador 2 PEDRA. El Jugador 2 ha guanyat aquesta ronda";
                }
            }else if(movJug1 == movJug2){
                movJug1 = "";
                movJug2 = "";
                partida.torn = "jug1";
                return "Els dos jugadors heu triat "+moviment +". Es un EMPAT!";
            }
        }    
        else{
            return "El jugador " + partida.torn + " ha de fer el seu moviment!";
        }
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