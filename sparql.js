// Parse a SPARQL query to a JSON object
var SparqlClient = require('sparql-client');
var util = require('util');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const XMLHttpRequest = require('xhr2');
const { param } = require('express/lib/request');

function refractorTypes(json) {
  let response = {};
  let cpt = 0;
  Object.entries(json).forEach(([key, value]) => {
    response[cpt] = RegExp(/[^#]*$/gm).exec(value.binding["uri"])[0]
    cpt++;
  });
  return response;
}

function refractor(json) {
  let response = {};
  let pokemons = {};
  let cpt = 0;
  Object.entries(json).forEach(([key, value]) => {
    response[cpt] = {};
    let already_in = false;
    let key_in = 0;
    Object.entries(value.binding).forEach(([key2, value2]) => {
      switch (value2["@name"]) {
        case "pokemon":
          let name = RegExp(/[^#]*$/gm).exec(value2["uri"])[0];

          if(pokemons[name]==undefined) {
            pokemons[name] = cpt;
            response[cpt]["name"] = name;
            response[already_in?key_in:cpt]["TresFort"] = [];
            response[already_in?key_in:cpt]["Fort"] = [];
            response[already_in?key_in:cpt]["Faible"] = [];
            response[already_in?key_in:cpt]["TresFaible"] = [];
            response[already_in?key_in:cpt]["Immunise"] = [];
            response[already_in?key_in:cpt]["type"] = [];
          } else {
            already_in = true;
            key_in = pokemons[name];
          }
          break;
        case "fofo":
          if(response[already_in?key_in:cpt]["TresFort"].indexOf(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]) == -1)
            response[already_in?key_in:cpt]["TresFort"].push(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]);
          break;
        case "fo":
          if(response[already_in?key_in:cpt]["Fort"].indexOf(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]) == -1)
            response[already_in?key_in:cpt]["Fort"].push(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]);
          break;
        case "fa":
          if(response[already_in?key_in:cpt]["Faible"].indexOf(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]) == -1)
            response[already_in?key_in:cpt]["Faible"].push(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]);
          break;
        case "fafa":
          if(response[already_in?key_in:cpt]["TresFaible"].indexOf(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]) == -1)
            response[already_in?key_in:cpt]["TresFaible"].push(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]);
          break;
        case "i":
          if(response[already_in?key_in:cpt]["Immunise"].indexOf(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]) == -1)
            response[already_in?key_in:cpt]["Immunise"].push(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]);
          break;
        case "taille":
          response[already_in?key_in:cpt]["taille"] = +(value2["literal"]["#text"]);
          break;
        case "poids":
          response[already_in?key_in:cpt]["poids"] = +(value2["literal"]["#text"]);
          break;
        case "type":
          if(response[already_in?key_in:cpt]["type"].indexOf(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]) == -1)
            response[already_in?key_in:cpt]["type"].push(RegExp(/[^#]*$/gm).exec(value2["uri"])[0]);
          break;
        case "png":
          response[already_in?key_in:cpt]["png"] = value2["literal"];
          break;
        default:
          console.log("error : \"" + value2["@name"] + "\" is not a valid key");
          break;
      }
    });
    if(already_in) {
      delete response[cpt];
      cpt--;
    }
    cpt++;
  });
  return response;
}


app.use(bodyParser.json())

  app.get('/', (req,res) => {
    res.send('Hello World')
  })

  app.get('/Pokedex.owl', (req,res) => {
    // return pokedex.owl at pokedex.owl
    res.sendFile("./assets/Pokedex.owl", { root: __dirname })
  })

  app.get('/types', async (req,res) => {
    var query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
    "PREFIX owl: <http://www.w3.org/2002/07/owl#> "+
    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> "+
    "PREFIX poke: <http://www.semanticweb.org/paulcazals/ontologies/2022/4/pokedex#> "+
    "SELECT ?type "+
    "WHERE { ?type a poke:Type }";

    //xml post request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/query", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"query": query}));
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if(JSON.parse(xhr.responseText).sparql.results != undefined) {
          var response = refractorTypes(JSON.parse(xhr.responseText).sparql.results.result);
          res.json(response);
          return;
        }
        res.json({});
      }
    }
  });

  app.post('/pokemon', async (req, res, next) => {
    let params = req.body;
    var query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
      "PREFIX owl: <http://www.w3.org/2002/07/owl#> "+
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
      "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> "+
      "PREFIX poke: <http://www.semanticweb.org/paulcazals/ontologies/2022/4/pokedex#> "+
      "SELECT * "+
      "WHERE { ?pokemon a poke:Pokemon_4G. ?pokemon poke:poids_Pokemon ?poids. ?pokemon poke:Taille_Pokemon ?taille. ?pokemon poke:appartient_au_type ?type . ?pokemon poke:link_png ?png . OPTIONAL{?pokemon poke:est_très_résistent_contre ?fofo}. OPTIONAL{?pokemon poke:est_résistent_contre ?fo} . OPTIONAL{?pokemon poke:est_faible_contre ?fa}. OPTIONAL{?pokemon poke:est_très_faible_contre ?fafa}. OPTIONAL{?pokemon poke:est_immunisé_contre ?i}.";

    query+="{";
    let types = Object.keys(params.types);
    let start = true;
    Object.keys(params.types).forEach(function(type){
      if(params.types[type]) {
        if(!start)
          query += " UNION ";
        query += "{?pokemon poke:appartient_au_type poke:"+type+"}";
        start = false;
      }
    });
    query+=" }"

    let poids = params.values.poids;
    query+= ". FILTER(?poids >= "+poids.min+" && ?poids <= "+poids.max+") ";

    let taille = params.values.taille;
    query+= ". FILTER(?taille >= "+taille.min+" && ?taille <= "+taille.max+") . {";
    start = true;
    Object.keys(params.combat).forEach(function(type){
      let start2 = true;
      if(!start)
        query += " . ";
      query+="{ ";
      Object.keys(params.combat[type]).forEach(function(attr){
        if(params.combat[type][attr]) {
          if(!start2)
            query += " UNION ";
          switch(attr) {
            case "TresFort":
              query += "{?pokemon poke:est_très_résistent_contre poke:"+type+"}";
              break;
            case "Fort":
              query += "{?pokemon poke:est_résistent_contre poke:"+type+"}";
              break;
            case "Faible":
              query += "{?pokemon poke:est_faible_contre poke:"+type+"}";
              break;
            case "TresFaible":
              query += "{?pokemon poke:est_très_faible_contre poke:"+type+"}";
              break;
            case "Immunise":
              query += "{?pokemon poke:est_immunisé_face poke:"+type+"}";
              break;
          }
          start2 = false;
        }
      });
      query+=" }";
      start = false;
    });



    query+="}}"


    //xml post request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/query", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"query": query}));
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if(JSON.parse(xhr.responseText).sparql.results != undefined) {
          var response = refractor(JSON.parse(xhr.responseText).sparql.results.result);
          console.log(response);
          res.json(response);
          return;
        }
        res.json({});
      }
    }
  })


  app.listen(3000,() => {
    console.log("Server up and running")
  })