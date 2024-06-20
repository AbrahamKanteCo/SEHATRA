function afficherAlert(title,message,etat){
    var message =message;
    var title =title;
    swal({
        title: title,
        text: message,
        timer: 3000,
        icon:etat,
        showConfirmButton: false
    });
}
const nomInput = document.getElementById("update-nom");
const userSelect = document.getElementById("update-user");
const youtubeInput = document.getElementById("update-youtube");
const slugInput = document.getElementById("update-slug");
const enligneCheckbox = document.getElementById("update-enligne");
const photodeprofil = document.getElementById("update-photodeprofil-preview");
const photodecouverture = document.getElementById("update-photodecouverture-preview");
const photodeprofilInput = document.getElementById("update-photodeprofil");
const photodecouvertureInput = document.getElementById("update-photodecouverture");


document.getElementById("add-button").addEventListener("click",function(){
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];

    const formData = new FormData();
    formData.append("nom", document.getElementById("nom").value);
    formData.append("user", document.getElementById("user").value);
    formData.append("youtube", document.getElementById("youtube").value);
    if(document.getElementById("photo_de_profil").files.length> 0){
    formData.append("photo_de_profil", document.getElementById("photo_de_profil").files[0]);
    }
    if(document.getElementById("photo_de_couverture").files.length>0){
    formData.append("photo_de_couverture", document.getElementById("photo_de_couverture").files[0]);
    }
    formData.append("en_ligne",document.getElementById("en_ligne").checked);

    const loadingSwal = swal({
        title: "Ajout",
        text: "En cours...",
        icon: "info",
        buttons: false, 
        closeOnClickOutside: false, 
        closeOnEsc: false
    });

    fetch(`/administration/artistes/ajouter/`, {
        method: "POST",
        body: formData,
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => response.json())
    .then(data => {
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
})

document.getElementById("update-button").addEventListener("click", function() {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    const formData = new FormData();

    formData.append("nom", nomInput.value);
    formData.append("user", document.getElementById("select_user").value);
    formData.append("youtube", youtubeInput.value);
    formData.append("slug", slugInput.value);

    if (photodeprofilInput.files.length > 0) {
        formData.append("photo_de_profil", photodeprofilInput.files[0]);
    }

    if (photodecouvertureInput.files.length > 0) {
        formData.append("photo_de_couverture", photodecouvertureInput.files[0]);
    }

    formData.append("en_ligne", enligneCheckbox.checked);
    artisteId = document.getElementById('update-artiste-id').value;

    const loadingSwal = swal({
        title: "Modification",
        text: "En cours...",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    });

    fetch(`/administration/artistes/${artisteId}/update/`, {
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
    nomInput.value = details.artiste.nom;
    userSelect.value = details.artiste.user;
    youtubeInput.value = details.artiste.youtube;
    slugInput.value = details.artiste.slug;
    enligneCheckbox.checked = details.artiste.en_ligne;
    if(details.artiste.photo_de_profil!=null){
    photodeprofil.src=details.artiste.photo_de_profil;
    }
    if(details.artiste.photo_de_couverture!=null){
    photodecouverture.src=details.artiste.photo_de_couverture
    }
    var select = document.createElement("select");
    select.className = "search-box";
    select.name = "user";
    select.id="select_user";
    
    var defaultOption = document.createElement("option");
    defaultOption.className = "hemant";
    defaultOption.text = "Choisissez un utilisateur";
    select.appendChild(defaultOption);
    
    for (let i = 0; i < details.users.length; i++) {
        var option = document.createElement("option");
        option.className = "hemant";
        option.value = details.users[i].id;
        option.text = details.users[i].username;
    
        if (details.users[i].id == details.artiste.user) {
            option.selected = true;
        }
    
        select.appendChild(option);
    }
    userSelect.innerHTML = "";
    userSelect.appendChild(select);
    $(select).SumoSelect({ csvDispCount: 3, search: true, searchText: 'Enter here.' });
                           
    
}
function detail(id){
var artisteId = id;
    
fetch(`/administration/artistes/${artisteId}/detail/`, {
    method: "GET",
})
.then(response => response.json())
.then(data => {
    document.getElementById('update-artiste-id').value=artisteId
    afficherDetailsArtiste(data)
    var modal = new bootstrap.Modal(document.getElementById('form-artiste-update'));
    modal.show();
});

}
function supprimerartiste(id) {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    
    var artisteId = id;

    swal({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous vraiment supprimer cet artiste ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
    },
    function(isConfirm){
        if (isConfirm) {
            fetch(`/administration/artistes/${artisteId}/delete/`, {
                method: "DELETE",
                headers: {
                    'X-CSRFToken': csrftoken
                }
            })
            .then(response => {
                swal("Message", "Artiste supprimé avec succès", "success");
                location.reload()
            });
        } else {
            swal("Message", "Suppression annulée", "info");
        }
    });
}



photodeprofilInput.addEventListener("change", function() {
    const selectedFile = photodeprofilInput.files[0];
    if (selectedFile) {
        photodeprofilPreview.src = URL.createObjectURL(selectedFile);
    }
});

photodecouvertureInput.addEventListener("change", function() {
    const selectedFile = photodecouvertureInput.files[0];
    if (selectedFile) {
        photodecouverturePreview.src = URL.createObjectURL(selectedFile);
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector("form").submit();
        }
    });
});