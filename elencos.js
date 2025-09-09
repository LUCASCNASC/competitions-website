// Dados dos elencos - pode ser expandido facilmente!
const ELENCOS = {
  "1911": [
    "Casemiro do Amaral", "Francisco Police",  "Onofre", "Lepre", "Alfredo", "Aristides",
    "Fúlvio", "Peres", "Luiz Fabbi", "César Nunes", "Jorge Campbell"
  ],
  "1912": [
    "Casemiro do Amaral", "Francisco Police", "Casemiro González", "Fúlvio", "César Nunes",
    "Aristides", "Peres", "Luiz Fabbi", "Alfredo", "Lepre"
  ],
  "1913": [
    "Casemiro do Amaral", "Aristides",  "Casemiro (zagueiro)", "Francisco Police",  "Alfredo",
    "Lepre", "Fúlvio", "Peres", "Luiz Fabbi", "Rodrigues", "César Nunes"
  ],
  "1914": [
    "Fúlvio",  "Casemiro do Amaral", "Casemiro González",  "Francisco Police",  "Bianco",
    "César (César Nunes)", "Aristides", "Peres", "Amílcar Barbuy", "Dias", "Neco"
  ],
  "1920": [
    "Casemiro do Amaral", "Bianco", "Amílcar Barbuy", "Neco", "Peres", "Aristides",
    "Apparecido Fernandes", "Rodrigues", "Corinto", "João da Silva"
  ],
  "1921": [
    "Casemiro do Amaral", "Bianco", "Amílcar Barbuy", "Neco", "Peres", "Aristides",
    "Apparecido Fernandes", "Rodrigues", "Corinto", "João da Silva"
  ],
  "1922": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Rodrigues", "Apparecido Fernandes",
    "Corinto", "João da Silva", "Peres", "Filó (Anfilogino Guarisi)"
  ],
  "1923": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Rodrigues", "Apparecido Fernandes",
    "Corinto", "João da Silva",  "Peres", "Filó"
  ],
  "1924": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Rodrigues", "Apparecido Fernandes",
    "Corinto", "João da Silva", "Peres", "Filó"
  ],
  "1925": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Rodrigues", "Apparecido Fernandes",
    "Corinto", "João da Silva", "Filó", "Del Debbio"
  ],
  "1926": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Del Debbio", "Rodrigues",
    "Apparecido Fernandes", "Corinto", "Filó", "João da Silva"
  ],
  "1927": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Del Debbio", "Filó", "Rosenfeld",
    "Armando Del Debbio", "Rodolfo Carbone", "João da Silva"
  ],
  "1928": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Del Debbio", "Filó", "Rodolfo Carbone",
    "Armando Del Debbio", "Rosenfeld", "João da Silva"
  ],
  "1929": [
    "Tuffy Neugen", "Bianco", "Amílcar Barbuy", "Neco", "Del Debbio", "Filó",
    "Rodolfo Carbone", "Armando Del Debbio", "Rosenfeld", "João da Silva"
  ],
  "1930": [
    "Tuffy Neugen", "Del Debbio", "Filó", "Neco", "Amílcar Barbuy", "Rodolfo Carbone",
    "Rosenfeld", "Armando Del Debbio",
    "Grané", "João da Silva"
  ],
  "1931": [
    "Tuffy Neugen", "Del Debbio", "Filó", "Neco", "Amílcar Barbuy", "Rodolfo Carbone",
    "Armando Del Debbio", "Grané", "Gambinha", "Rosenfeld"
  ],
  "1932": [
    "Tuffy Neugen", "Del Debbio", "Filó", "Neco", "Amílcar Barbuy", "Rodolfo Carbone",
    "Armando Del Debbio", "Grané", "Gambinha", "Rosenfeld"
  ],
  "1933": [
    "José Castelli (Rato)", "Del Debbio", "Filó", "Neco", "Armando Del Debbio",
    "Rodolfo Carbone", "Grané", "Gambinha", "Rosenfeld", "Juninho"
  ],
  "1934": [
    "José Castelli (Rato)", "Del Debbio", "Filó", "Neco", "Armando Del Debbio",
    "Rodolfo Carbone", "Grané", "Gambinha", "Rosenfeld", "Juninho"
  ],
  "1935": [
    "José Castelli (Rato)", "Del Debbio", "Filó", "Neco",  "Armando Del Debbio",
    "Rodolfo Carbone", "Grané", "Gambinha", "Rosenfeld", "Juninho"
  ],
  "1936": [
    "José Castelli (Rato)", "Del Debbio", "Filó", "Neco", "Armando Del Debbio", "Rodolfo Carbone",
    "Grané", "Gambinha", "Rosenfeld", "Juninho"
  ],
  "1937": [
    "José Castelli (Rato)", "Del Debbio", "Filó", "Neco", "Armando Del Debbio", "Rodolfo Carbone",
    "Grané", "Gambinha", "Rosenfeld", "Juninho"
  ],
  "1938": [
    "Teleco", "José Castelli (Rato)", "Del Debbio", "Filó", "Armando Del Debbio", "Rodolfo Carbone",
    "Grané", "Gambinha", "Rosenfeld", "Juninho"
  ],
  "1939": [
    "Teleco", "José Castelli (Rato)", "Del Debbio", "Filó", "Armando Del Debbio", "Rodolfo Carbone",
    "Grané", "Gambinha", "Rosenfeld", "Juninho"
  ],
  "2012": [
    "Cássio", "Chicão", "Fábio Santos", "Paulinho", "Danilo",
    "Alex", "Jorge Henrique", "Emerson Sheik", "Alessandro", "Ralf", "Leandro Castán",
    "Júlio César", "Wallace", "Willian Arão", "Douglas", "Guilherme", "Marquinhos", "Ramírez",
    "Romarinho", "Weldinho", "Adriano", "Matheus", "Paulo André", "Edenílson", "Gilsinho",
    "Liedson", "Vitor Júnior", "Cachito Ramírez", "Zizão", "Pedro Henrique", "Igor", "Anderson Polga",
    "Paulo Victor", "Felipe", "Giovanni", "Renan", "Paulinho Dias", "Antonio Carlos", "Bruno", "Diego",
    "Francisco", "João Vitor", "Lucas", "Matheus", "Pedro", "Rafael", "Samuel", "Victor", "Wesley"
  ],
  "2013": [
    "Cássio", "Chicão", "Fábio Santos", "Paulinho", "Danilo",
    "Jorge Henrique", "Emerson Sheik", "Alessandro", "Ralf",
    "Júlio César", "Wallace", "Willian Arão", "Douglas", "Guilherme", "Marquinhos", "Ramírez",
    "Romarinho", "Matheus", "Paulo André", "Edenílson",
    "Pedro Henrique",
    "Paulo Victor", "Felipe", "Giovanni","Paulinho Dias", "Antonio Carlos", "Bruno", "Diego",
    "Francisco", "João Vitor", "Lucas", "Matheus", "Pedro", "Rafael", "Samuel", "Victor", "Wesley"
  ],
  "2014": [
    "Cássio"
  ],
  "1999": [
    "Dida", "Rincón", "Ricardinho", "Edílson", "Marcelinho Carioca",
    "Vampeta", "Luizão", "Kléber", "André Santos", "Edu", "João Carlos",
    "Fernando Baiano", "Gilmar", "Marcos Senna", "Márcio Costa", "João Paulo", "André Luiz",
    "Sérgio Manoel", "Fábio Luciano", "Márcio", "Jorge Wagner", "Andrezinho", "Adilson", "Marcus Vinícius",
    "Jackson", "Marcelo", "Everton", "Zé Elias", "Fabinho", "Fábio Baiano", "Gustavo Nery", "Vampeta Jr.",
    "Ivan", "Leandro", "Luciano", "Marcinho", "Nilson", "Paulo Almeida", "Rafael", "Rodrigo", "Roger",
    "Silvio", "Thiago", "Valmir", "Washington", "William", "Xandão", "Yago", "Zé Roberto", "Zé Maria"
  ],
  "2015": [
    "Cássio", "Fagner", "Felipe", "Gil", "Uendel",
    "Ralf", "Elias", "Renato Augusto", "Jádson", "Malcom", "Vagner Love",
    "Walter", "Yago", "Rodriguinho", "Bruno Henrique", "Danilo", "Lucca", "Edílson", "Mendoza",
    "Cristian", "Matheus Pereira", "Marciel", "Guilherme Arana", "Pedro Henrique", "Léo Príncipe",
    "Matheus Vidotto", "Alan Mineiro", "André", "Balbuena", "Giovanni Augusto", "Gustavo",
    "Jean", "Léo Jabá", "Marlone", "Maycon", "Moises", "Romero", "Wendel", "Willians", "Zé Paulo",
    "Douglas", "Gabriel Vasconcelos", "Guilherme", "Léo", "Léo Santos", "Marcelo", "Marciel", "Matheus",
    "Pedro", "Rildo"
  ],
  "2024": [
    "Carlos Miguel", "Fagner", "Caetano", "Cacá", "Matheus Bidu",
    "Raniele", "Maycon", "Wesley", "Gustavo Mosquito", "Yuri Alberto", "Fausto Vera",
    "Cássio", "Hugo", "Biro", "Gabriel Moscardo", "Felipe Augusto", "Pedro Henrique",
    "Ryan", "Giovane", "Léo Mana", "Luan", "Matheus Araújo", "Bruno Méndez", "Murillo",
    "Roni", "Paulinho", "Arthur", "Cauê", "Gabriel Pereira", "Gabriel Silva", "João Pedro",
    "Keven", "Léo Natel", "Lucas Piton", "Mandaca", "Matheus Donelli", "Matheus França",
    "Raul Gustavo", "Reginaldo", "Richard", "Robert Renan", "Thiago", "Vítor", "Wesley Gassova",
    "Zé Vitor", "Adson", "Du Queiroz", "Júnior Moraes", "Matheus Matias"
  ]
};