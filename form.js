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

            if (upperVal < lowerVal + (lowerSlider.max/15)) {
                lowerSlider.value = upperVal - (lowerSlider.max/15);
                
                if (lowerVal == lowerSlider.min) {
                    upperSlider.value = (lowerSlider.max/15);
                }
            }
        };

        lowerSlider.oninput = function() {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);

            if (lowerVal > upperVal - (lowerSlider.max/15)) {
            upperSlider.value = lowerVal + (lowerSlider.max/15);
            
            if (upperVal == upperSlider.max) {
                lowerSlider.value = parseInt(upperSlider.max) - (lowerSlider.max/15);
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
}
