var cpt = 0;

function getUrl(name) {
    let url="";
    switch (name) {
        case "acier":
            url="<img src=\"assets/badge-acier.png\" />";
            break;
        case "combat":
            url="<img src=\"assets/badge-combat.png\" />";
            break;
        case "dragon":
            url="<img src=\"assets/badge-dragon.png\" />";
            break;
        case "eau":
            url="<img src=\"assets/badge-eau.png\" />";
            break;
        case "Electrik":
            url="<img src=\"assets/badge-electrik.png\" />";
            break;
        case "feu":
            url="<img src=\"assets/badge-feu.png\" />";
            break;
        case "glace":
            url="<img src=\"assets/badge-glace.png\" />";
            break;
        case "insecte":
            url="<img src=\"assets/badge-insecte.png\" />";
            break;
        case "normal":
            url="<img src=\"assets/badge-normal.png\" />";
            break;
        case "plante":
            url="<img src=\"assets/badge-plante.png\" />";
            break;
        case "poison":
            url="<img src=\"assets/badge-poison.png\" />";
            break;
        case "psy":
            url="<img src=\"assets/badge-psy.png\" />";
            break;
        case "roche":
            url="<img src=\"assets/badge-roche.png\" />";
            break;
        case "sol":
            url="<img src=\"assets/badge-sol.png\" />";
            break;
        case "spectre":
            url="<img src=\"assets/badge-spectre.png\" />";
            break;
        case "tenebre":
            url="<img src=\"assets/badge-tenebre.png\" />";
            break;
        case "vol":
            url="<img src=\"assets/badge-vol.png\" />";
            break;
    
        default:
            break;
    }
    return url;
}

function setPokemon(modal, results) {
    if(cpt < Object.keys(results).length-1 && cpt==0) {
        document.getElementById("pokedex_left").classList.add("disable");
        document.getElementById("pokedex_right").classList.remove("disable");
    }
    if(cpt == Object.keys(results).length-1 && cpt > 0) {
        document.getElementById("pokedex_right").classList.add("disable");
        document.getElementById("pokedex_left").classList.remove("disable");
    } 
    if(cpt == 0 && Object.keys(results).length-1==cpt) {
        document.getElementById("pokedex_left").classList.add("disable");
        document.getElementById("pokedex_right").classList.add("disable");
    }
    if(cpt > 0 && cpt < Object.keys(results).length-1) {
        document.getElementById("pokedex_left").classList.remove("disable");
        document.getElementById("pokedex_right").classList.remove("disable");
    }
    
    document.getElementById("pokedex_left").onclick = function() {
        if(cpt > 0) {
            cpt--;
            var audio = document.getElementById("audio_touche");
            audio.pause();
            audio.currentTime = 0;
            audio.play();
            setPokemon(modal, results);
        }
    }
    document.getElementById("pokedex_right").onclick = function() {
        if(cpt < Object.keys(results).length-1) {
            cpt++;
            var audio = document.getElementById("audio_touche");
            audio.pause();
            audio.currentTime = 0;
            audio.play();
            setPokemon(modal, results);
        }
    }

    if(results[cpt] != undefined) {
        document.getElementById("pokedex_name").innerHTML=results[cpt].name + " #"+results[cpt].id;
        document.getElementById("pokedex_infos").innerHTML=results[cpt].poids/1000 + " kg, "+ results[cpt].taille/100 + " m";
        if(results[cpt].legendaire) {
            document.getElementById("pokedex_infos").innerHTML+=", l??gendaire";
        }
        document.getElementById("pokedex_img").src=results[cpt].png;
        
        var enter = true;
        document.getElementById("pokedex_type").innerHTML="";
        Object.entries(results[cpt].type).forEach(([key, value]) => {
            if (enter)
                document.getElementById("pokedex_type").innerHTML=getUrl(value);
            else
                document.getElementById("pokedex_type").innerHTML+=getUrl(value);
            enter = false;
        });
        
        enter = true;
        document.getElementById("pokedex_tres_faible").innerHTML="";
        Object.entries(results[cpt].TresFaible).forEach(([key, value]) => {
            if(enter)
                document.getElementById("pokedex_tres_faible").innerHTML="Tres faible contre : <br/>";
            document.getElementById("pokedex_tres_faible").innerHTML+=getUrl(value);
            enter = false;
        });
        enter = true;
        document.getElementById("pokedex_faible").innerHTML="";
        Object.entries(results[cpt].Faible).forEach(([key, value]) => {
            if(enter)
                document.getElementById("pokedex_faible").innerHTML="Faible contre : <br/>";
            document.getElementById("pokedex_faible").innerHTML+=getUrl(value);
            enter = false;
        });
        enter = true;
        document.getElementById("pokedex_fort").innerHTML="";
        Object.entries(results[cpt].Fort).forEach(([key, value]) => {
            if(enter)
                document.getElementById("pokedex_fort").innerHTML="Fort contre : <br/>";
            document.getElementById("pokedex_fort").innerHTML+=getUrl(value);
            enter = false;
        });
        enter = true;
        document.getElementById("pokedex_tres_fort").innerHTML="";
        Object.entries(results[cpt].TresFort).forEach(([key, value]) => {
            if(enter)
                document.getElementById("pokedex_tres_fort").innerHTML="Tres fort contre : <br/>";
            document.getElementById("pokedex_tres_fort").innerHTML+=getUrl(value);
            enter = false;
        });
        enter = true;
        document.getElementById("pokedex_immunise").innerHTML="";
        Object.entries(results[cpt].Immunise).forEach(([key, value]) => {
            if(enter)
                document.getElementById("pokedex_immunise").innerHTML="Immunis?? contre : <br/>";
            document.getElementById("pokedex_immunise").innerHTML+=getUrl(value);
            enter = false;
        });
    }
    else {
        document.getElementById("pokedex_name").innerHTML="Pokemon introuvable";
        document.getElementById("pokedex_infos").innerHTML="";
        document.getElementById("pokedex_img").src="assets/ball.png";
        document.getElementById("pokedex_left").classList.add("disable");
        document.getElementById("pokedex_right").classList.add("disable");
        document.getElementById("pokedex_type").innerHTML="";
        document.getElementById("pokedex_tres_faible").innerHTML="";
        document.getElementById("pokedex_faible").innerHTML="";
        document.getElementById("pokedex_fort").innerHTML="";
        document.getElementById("pokedex_tres_fort").innerHTML="";
        document.getElementById("pokedex_immunise").innerHTML="";
    }

    modal.onclick = function(e) {
        if(e.target == modal) {
            closeModal(modal.id);
        }
    }
}

function openModal(id, results) {
    var audio = document.getElementById("audio_pokedex");
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    cpt = 0;
    var modal = document.getElementById(id);
    modal.classList.remove("close");
    modal.classList.add("open");
    modal.style.display = "flex";

    setPokemon(modal, results);
}

function closeModal(id) {
    var modal = document.getElementById(id);
    modal.classList.add("close");
    modal.classList.remove("open");
    setTimeout(function() {
        modal.style.display = "none";
    }, 800);
}