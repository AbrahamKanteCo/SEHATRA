function afficherAlert(title,message){
    var message =message;
    var title =title;
    swal({
        title: title,
        text: message,
        timer: 3000,
        showConfirmButton: false
    });
}
const titreInput = document.getElementById("update-titre");
const dateliveInput = document.getElementById("update-datelive");
const heureInput = document.getElementById("update-heure");
const debutCheckbox = document.getElementById("update-debut");
const enligneCheckbox = document.getElementById("update-en_ligne");

document.getElementById("add-button").addEventListener("click", function() {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    const formData = new FormData();
    formData.append("titre", document.getElementById("titre").value);
    formData.append("date", document.getElementById("date").value);
    formData.append("heure", document.getElementById("heure").value);
    formData.append("debut", document.getElementById("debut").checked);
    formData.append("en_ligne", document.getElementById("en_ligne").checked);

    const loadingSwal = swal({
        title: "Ajout",
        text: "En cours...",
        icon: "info",
        buttons: false, 
        closeOnClickOutside: false, 
        closeOnEsc: false
    });
    fetch(`/administration/lives/ajouter/`, {
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
});
document.getElementById("update-button").addEventListener("click", function() {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    const formData = new FormData();
    formData.append("titre", titreInput.value);
    formData.append("date", dateliveInput.value);
    formData.append("heure", heureInput.value);
    formData.append("debut", debutCheckbox.checked);
    formData.append("en_ligne", enligneCheckbox.checked);
    liveId=document.getElementById('update-live-id').value;

    const loadingSwal = swal({
        title: "Update",
        text: "En cours...",
        icon: "info",
        buttons: false, 
        closeOnClickOutside: false, 
        closeOnEsc: false
    });
    fetch(`/administration/lives/${liveId}/update/`, {
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
function afficherDetailsLive(details) {
    titreInput.value = details.titre;
    dateliveInput.value = details.date;
    heureInput.value = details.heure;
    enligneCheckbox.checked = details.en_ligne;
    debutCheckbox.checked = details.debut;
}
function detail(id){
var liveId = id;            
fetch(`/administration/lives/${liveId}/detail/`, {
    method: "GET",
})
.then(response => response.json())
.then(data => {
    document.getElementById('update-live-id').value=liveId
    afficherDetailsLive(data)
    var modal = new bootstrap.Modal(document.getElementById('form-live-update'));
    modal.show();
});

}
function supprimerlive(id) {
    var liveid = id;
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];

    swal({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous vraiment supprimer cet live ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
    },
    function(isConfirm){
        if (isConfirm) {
            fetch(`/administration/lives/${liveid}/delete/`, {
                method: "DELETE",
                headers: {
                    'X-CSRFToken': csrftoken
                }
            })
            .then(response => {
                swal("Message", "Live supprimé avec succès", "success");
                location.reload()
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