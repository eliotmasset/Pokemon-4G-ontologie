window.onload = function() {
    var sliders = document.getElementsByClassName("multi-range");
    for (let i=0; i<sliders.length; i++) {
        let slider=sliders[i];
        let lowerSlider = slider.querySelector('.lower'),
            upperSlider = slider.querySelector('.upper'),
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);

        upperSlider.oninput = function() {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);
            if( upperSlider.parentElement.parentElement.querySelector(".screen").id=="poids_screen")
                upperSlider.parentElement.parentElement.querySelector(".screen").innerHTML = lowerVal + " kg - " + upperVal + " kg";
            else
                upperSlider.parentElement.parentElement.querySelector(".screen").innerHTML = lowerVal + " m - " + upperVal + " m";

            if (upperVal < lowerVal + (lowerSlider.max/20)) {
                lowerSlider.value = upperVal - (lowerSlider.max/20);
                
                if (lowerVal == lowerSlider.min) {
                    upperSlider.value = (lowerSlider.max/20);
                }
            }
        };

        lowerSlider.oninput = function() {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);
            if( upperSlider.parentElement.parentElement.querySelector(".screen").id=="poids_screen")
                upperSlider.parentElement.parentElement.querySelector(".screen").innerHTML = lowerVal + " kg - " + upperVal + " kg";
            else
                upperSlider.parentElement.parentElement.querySelector(".screen").innerHTML = lowerVal + " m - " + upperVal + " m";

            if (lowerVal > upperVal - (lowerSlider.max/20)) {
            upperSlider.value = lowerVal + (lowerSlider.max/20);
            
            if (upperVal == upperSlider.max) {
                lowerSlider.value = parseInt(upperSlider.max) - (lowerSlider.max/20);
            }

            }
        };
        
    }

    var submit_button = document.querySelector(".submit");
    submit_button.onclick = function() {
        let json = {};
        json.values = {};
        json.types = {};
        json.combat = {};
        var types = document.querySelectorAll("#type .type");
        var types_combat = document.querySelectorAll("#table-combat input[type='checkbox']");
        for (let i=0; i<sliders.length; i++) {
            json.values[sliders[i].dataset.range] = {};
            json.values[sliders[i].dataset.range].min = sliders[i].querySelector('.lower').value;
            json.values[sliders[i].dataset.range].max = sliders[i].querySelector('.upper').value;
        }
        json.values.poids.min = json.values.poids.min * 1000;
        json.values.poids.max = json.values.poids.max * 1000;
        json.values.taille.min = json.values.taille.min * 100;
        json.values.taille.max = json.values.taille.max * 100;
        for (let i=0; i<types.length; i++) {
            json.types[types[i].querySelector("input[type='checkbox']").dataset.type] = types[i].querySelector("input[type='checkbox']").checked;
        }
        for (let i=0; i<types_combat.length; i++) {
            if(json.combat[types_combat[i].dataset.row]==undefined)
                json.combat[types_combat[i].dataset.row] = {};
            json.combat[types_combat[i].dataset.row][types_combat[i].dataset.col] = types_combat[i].checked;
        }
        
        // XML REQUEST

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/pokemon", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(json));
        xhr.onload = function() {
            if (xhr.status == 200) {
                let response=JSON.parse(xhr.responseText);
                console.log(response);
                openModal("modal-results", response);
            }
        }

        console.log(json);
        return false;
    }


    let list = document.getElementById("list-type");
    let combat = document.getElementById("table-combat");

    // XML REQUEST

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/types", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send("");
    xhr.onload = function() {
        if (xhr.status == 200) {
            let response=JSON.parse(xhr.responseText);
            Object.entries(response).forEach(function(entries) {
                let divType = document.createElement("div");
                divType.classList.add("type");
                let typeCheckBox = document.createElement("input");
                typeCheckBox.type = "checkbox";
                typeCheckBox.name = "type"+entries[1][0].toUpperCase() + entries[1].slice(1);
                typeCheckBox.dataset.type = entries[1];
                let label = document.createElement("label");
                label.for = typeCheckBox.name;
                label.innerHTML = "<img src=\"assets/badge-"+entries[1]+".png\" alt=\""+entries[1]+"\" /> "
                divType.appendChild(typeCheckBox);
                divType.appendChild(label);
                list.appendChild(divType);
                label.onclick = function() {
                    console.log(typeCheckBox.checked);
                    typeCheckBox.checked = !typeCheckBox.checked;
                }

                let tr = document.createElement("tr");
                let th = document.createElement("th");
                let img = document.createElement("img");
                img.src = "assets/"+entries[1]+".png";
                th.appendChild(img);
                let tdTresFort = document.createElement("td");
                let tdFort = document.createElement("td");
                let tdFaible = document.createElement("td");
                let tdTresFaible = document.createElement("td");
                let tdImmunise = document.createElement("td");

                tdTresFort.innerHTML =  "<input type=\"checkbox\" data-row=\""+entries[1]+"\" data-col=\"TresFort\" name=\""+entries[1]+"TrèsFort\" />"+
                                        "<img src=\"assets/ball.png\" alt=\"select\" /> "
                tdFort.innerHTML =  "<input type=\"checkbox\" data-row=\""+entries[1]+"\" data-col=\"Fort\" name=\""+entries[1]+"Fort\" />"+
                                        "<img src=\"assets/ball.png\" alt=\"select\" /> "
                tdFaible.innerHTML =  "<input type=\"checkbox\" data-row=\""+entries[1]+"\" data-col=\"Faible\" name=\""+entries[1]+"Faible\" />"+
                                        "<img src=\"assets/ball.png\" alt=\"select\" /> "
                tdTresFaible.innerHTML =  "<input type=\"checkbox\" data-row=\""+entries[1]+"\" data-col=\"TresFaible\" name=\""+entries[1]+"TrèsFaible\" />"+
                                        "<img src=\"assets/ball.png\" alt=\"select\" /> "
                tdImmunise.innerHTML =  "<input type=\"checkbox\" data-row=\""+entries[1]+"\" data-col=\"Immunise\" name=\""+entries[1]+"Immunisé\" />"+
                                        "<img src=\"assets/ball.png\" alt=\"select\" /> "
                tdTresFort.querySelector("img").onclick = function() {
                    tdTresFort.querySelector("input[type='checkbox']").checked = !tdTresFort.querySelector("input[type='checkbox']").checked;
                }
                tdFort.querySelector("img").onclick = function() {
                    tdFort.querySelector("input[type='checkbox']").checked = !tdFort.querySelector("input[type='checkbox']").checked;
                }
                tdFaible.querySelector("img").onclick = function() {
                    tdFaible.querySelector("input[type='checkbox']").checked = !tdFaible.querySelector("input[type='checkbox']").checked;
                }
                tdTresFaible.querySelector("img").onclick = function() {
                    tdTresFaible.querySelector("input[type='checkbox']").checked = !tdTresFaible.querySelector("input[type='checkbox']").checked;
                }
                tdImmunise.querySelector("img").onclick = function() {
                    tdImmunise.querySelector("input[type='checkbox']").checked = !tdImmunise.querySelector("input[type='checkbox']").checked;
                }
                tr.appendChild(th);
                tr.appendChild(tdTresFort);
                tr.appendChild(tdFort);
                tr.appendChild(tdFaible);
                tr.appendChild(tdTresFaible);
                tr.appendChild(tdImmunise);
                combat.appendChild(tr);
                
            });
        }
    }

}