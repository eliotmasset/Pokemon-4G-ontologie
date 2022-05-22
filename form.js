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


    var types = document.querySelectorAll("#type .type");
    for (let i=0; i<types.length; i++) {
        let type = types[i];
        let checkbox = type.querySelector("input[type='checkbox']");
        let label = type.querySelector("label");
        label.onclick = function() {
            checkbox.checked = !checkbox.checked;
        }
    }

    var types_combat = document.querySelectorAll("#table-combat input[type='checkbox']");
    for (let i=0; i<types_combat.length; i++) {
        let type = types_combat[i].parentElement;
        let checkbox = types_combat[i];
        let img = type.querySelector("img");
        img.onclick = function() {
            checkbox.checked = !checkbox.checked;
        }
    }

    var submit_button = document.querySelector(".submit");
    submit_button.onclick = function() {
        let json = {};
        json.values = {};
        json.types = {};
        json.combat = {};
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
                openModal("modal-results", response);
            }
        }

        console.log(json);
        return false;
    }
}
