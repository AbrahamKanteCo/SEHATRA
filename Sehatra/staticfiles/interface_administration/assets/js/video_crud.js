function afficherAlert(title,message,icon){
    var message =message;
    var title =title;
    swal({
        title: title,
        text: message,
        timer: 3000,
        icon:icon,
        showConfirmButton: false
    });
}
function appendIfValueExists(formData, id, fieldName) {
    const element = document.getElementById(id);
    const value = element.value;
    console.log(value)
    if (value) {
        console.log("mISY")
        formData.append(fieldName, value);
    }
}

document.getElementById("add-button").addEventListener("click", function() {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    const formData = new FormData();
    formData.append("titre", document.getElementById("titre").value);
    formData.append("description_longue", document.getElementById("description_longue").value);
    formData.append("description_courte", document.getElementById("description_courte").value);
    formData.append("artistes", document.getElementById("artistes").value);
    appendIfValueExists(formData, "duree", "duree");
    appendIfValueExists(formData, "date_sortie", "date_sortie");
    appendIfValueExists(formData, "organisateur", "organisateur");
    appendIfValueExists(formData, "stripe_price_id", "stripe_price_id");
    appendIfValueExists(formData, "action", "action");
    appendIfValueExists(formData, "live", "live");
    appendIfValueExists(formData, "artiste", "artiste");
    appendIfValueExists(formData, "tarif_ariary", "tarif_ariary");
    appendIfValueExists(formData, "tarif_dollar", "tarif_dollar");
    appendIfValueExists(formData, "tarif_euro", "tarif_euro");
    appendIfValueExists(formData, "youtube", "youtube");
    appendIfValueExists(formData, "lien_video", "lien_video");
    if(document.getElementById("photo_de_couverture").files.length>0){
        formData.append("photo_de_couverture", document.getElementById("photo_de_couverture").files[0]);
    }
    formData.append("en_ligne", document.getElementById("en_ligne").checked);
    formData.append("levee_de_fond", document.getElementById("levee_de_fond").checked);
    formData.append("gratuit", document.getElementById("gratuit").checked);
    formData.append("is_live", document.getElementById("is_live").checked);
    formData.append("is_film", document.getElementById("is_film").checked);
    formData.append("a_la_une", document.getElementById("a_la_une").checked);

    const loadingSwal = swal({
        title: "Ajout",
        text: "En cours...",
        icon: "info",
        buttons: false, 
        closeOnClickOutside: false, 
        closeOnEsc: false
    });

    fetch(`/administration/videos/ajouter/`, {
        method: "POST",
        body: formData,
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.status==201){
            afficherAlert("Ajout",data.message,'success')
            location.reload();
        }
        else{
            swal("Erreur", data.message, "error");
        }
    })
    .catch(error => {
        swal("Erreur", error, "error");
    });
});
document.getElementById("update-button").addEventListener("click", function() {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];

    const formData = new FormData();
    formData.append("titre", document.getElementById("update_titre").value);
    formData.append("artistes", document.getElementById("update_artistes").value);
    formData.append("description_longue",document.getElementById("update_description_longue").value);
    formData.append("description_courte",document.getElementById("update_description_courte").value);

    appendIfValueExists(formData,"select_organisateur","organisateur");
    appendIfValueExists(formData,"update_duree","duree");
    appendIfValueExists(formData,"select_action","action");
    appendIfValueExists(formData,"select_live","live");
    appendIfValueExists(formData, "select_artiste","artiste");
    appendIfValueExists(formData, "update_date_sortie","date_sortie");
    appendIfValueExists(formData, "update_stripe_price_id","stripe_price_id");
    appendIfValueExists(formData, "update_tarif_ariary","tarif_ariary");
    appendIfValueExists(formData, "update_tarif_dollar","tarif_dollar");
    appendIfValueExists(formData, "update_tarif_euro","tarif_euro");
    appendIfValueExists(formData, "update_youtube","youtube");
    appendIfValueExists(formData, "update_lien_video","lien_video");
    if (document.getElementById("update_photo_de_couverture").files.length > 0) {
        formData.append("photo_de_couverture", document.getElementById("update_photo_de_couverture").files[0]);
    }
    formData.append("en_ligne", document.getElementById("update_en_ligne").checked);
    formData.append("levee_de_fond", document.getElementById("update_levee_de_fond").checked);
    formData.append("gratuit", document.getElementById("update_gratuit").checked);
    formData.append("is_live", document.getElementById("update_is_live").checked);
    formData.append("is_film", document.getElementById("update_is_film").checked);
    formData.append("a_la_une", document.getElementById("update_a_la_une").checked);
    videoId=document.getElementById('update-videos-id').value;

    fetch(`/administration/videos/${videoId}/update/`, {
        method: "PUT",
        body: formData,
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.status == 201) {
            afficherAlert("Update", data.message, 'success')
            location.reload();
        } else {
            swal("Erreur", data.message, "error");
        }
    })
    .catch(error => {
        swal("Erreur", error, "error");
    });
});
function afficherDetailsArtiste(details) {
    document.getElementById("update_titre").value=details.video.titre;
    document.getElementById("update_duree").value=details.video.duree;
    document.getElementById("update_date_sortie").value=details.video.date_sortie;
    document.getElementById("update_organisateur").value=details.video.organisateur;
    document.getElementById("update_stripe_price_id").value=details.video.stripe_price_id;
    document.getElementById("update_artistes").value=details.video.artistes;
    document.getElementById("update_tarif_ariary").value=details.video.tarif_ariary;
    document.getElementById("update_tarif_dollar").value=details.video.tarif_dollar;
    document.getElementById("update_tarif_euro").value=details.video.tarif_euro;
    document.getElementById("update_youtube").value=details.video.youtube;
    document.getElementById("update_description_longue").value=details.video.description_longue;
    document.getElementById("update_description_courte").value=details.video.description_courte;
    document.getElementById("update_lien_video").value=details.video.lien_video;
    document.getElementById("update_photo_de_couverture").files[0]=details.video.photo_de_couverture;
    document.getElementById("update_en_ligne").checked=details.video.en_ligne;
    document.getElementById("update_levee_de_fond").checked=details.video.levee_de_fond;
    document.getElementById("update_gratuit").checked=details.video.gratuit;
    document.getElementById("update_is_live").checked=details.video.is_live;
    document.getElementById("update_is_film").checked=details.video.is_film;
    document.getElementById("update_a_la_une").checked=details.video.a_la_une;

    ///////////1
    var select = document.createElement("select");
        select.className = "search-box";
        select.name = "artiste";
        select.id="select_artiste";
        
        var defaultOption = document.createElement("option");
        defaultOption.className = "hemant";
        defaultOption.text = "Choisissez une artiste";
        defaultOption.value=""
        select.appendChild(defaultOption);
        
        for (let i = 0; i < details.artiste.length; i++) {
            var option = document.createElement("option");
            option.className = "hemant";
            option.value = details.artiste[i].id;
            option.text = details.artiste[i].nom;
        
            if (details.artiste[i].id == details.video.artiste) {
                option.selected = true;
            }
        
            select.appendChild(option);
        }
        const userSelect=document.getElementById("update_artiste")
        userSelect.innerHTML = "";
        userSelect.appendChild(select);

        //////2

        var select1 = document.createElement("select");
        select1.className = "search-box";
        select1.name = "organisateur";
        select1.id="select_organisateur";
        
        var defaultOption1 = document.createElement("option");
        defaultOption1.className = "hemant";
        defaultOption1.text = "Choisissez un organisateur";
        defaultOption1.value=""
        select1.appendChild(defaultOption1);
        
        for (let i = 0; i < details.organisateur.length; i++) {
            var option = document.createElement("option");
            option.className = "hemant";
            option.value = details.organisateur[i].id;
            option.text = details.organisateur[i].nom;
        
            if (details.organisateur[i].id == details.video.organisateur) {
                option.selected = true;
            }
        
            select1.appendChild(option);
        }
        const userSelect1=document.getElementById("update_organisateur")
        userSelect1.innerHTML = "";
        userSelect1.appendChild(select1);


        /////////////////////////3
        var select2 = document.createElement("select");
        select2.className = "search-box";
        select2.name = "live";
        select2.id="select_live";
    
        
        var defaultOption2 = document.createElement("option");
        defaultOption2.className = "hemant";
        defaultOption2.text = "Choisissez un live";
        defaultOption2.value=""
        select2.appendChild(defaultOption2);
        
        for (let i = 0; i < details.live.length; i++) {
            var option = document.createElement("option");
            option.className = "hemant";
            option.value = details.live[i].id;
            option.text = details.live[i].titre;
        
            if (details.live[i].id == details.video.live) {
                option.selected = true;
            }
        
            select2.appendChild(option);
        }
        const userSelect2=document.getElementById("update_live")
        userSelect2.innerHTML = "";
        userSelect2.appendChild(select2);

         /////////////////////////4
         var select3 = document.createElement("select");
         select3.className = "search-box";
         select3.name = "action";
         select3.id="select_action";
         
         var defaultOption3 = document.createElement("option");
         defaultOption3.className = "hemant";
         defaultOption3.text = "Choisissez une action";
         defaultOption3.value=""
         select3.appendChild(defaultOption3);
         
         for (let i = 0; i < details.action.length; i++) {
             var option = document.createElement("option");
             option.className = "hemant";
             option.value = details.action[i].id;
             option.text = details.action[i].titre;
         
             if (details.action[i].id == details.video.action) {
                 option.selected = true;
             }
         
             select3.appendChild(option);
         }
         const userSelect3=document.getElementById("update_action")
         userSelect3.innerHTML = "";
         userSelect3.appendChild(select3);
        $(select).SumoSelect({ csvDispCount: 3, search: true, searchText: 'Enter here.' });
        $(select1).SumoSelect({ csvDispCount: 3, search: true, searchText: 'Enter here.' });
        $(select2).SumoSelect({ csvDispCount: 3, search: true, searchText: 'Enter here.' });
        $(select3).SumoSelect({ csvDispCount: 3, search: true, searchText: 'Enter here.' });

}
function modifier(id){
var videoId = id;
    
fetch(`/administration/videos/${videoId}/detail/`, {
    method: "GET",
})
.then(response => response.json())
.then(data => {
    console.log(data)
    document.getElementById('update-videos-id').value=videoId
    afficherDetailsArtiste(data)
    var modal = new bootstrap.Modal(document.getElementById('form-videos-update'));
    modal.show();
});

}
function supprimer(id) {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    var videoId = id;

    swal({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous vraiment supprimer ce vidéo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
    },
    function(isConfirm){
        if (isConfirm) {
            fetch(`/administration/videos/${videoId}/delete/`, {
                method: "DELETE",
                headers: {
                    'X-CSRFToken': csrftoken
                }
            })
            .then(response => {
                swal("Message", "Vidéo supprimé avec succès", "success");
                location.reload();
            });
        } else {
            swal("Message", "Suppression annulée", "info");
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector("form").submit();
        }
    });
});