const searchInput = document.getElementById("search-input");
const zone=document.getElementById("mainContactList");
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
document.getElementById("add-button").addEventListener("click", function() {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];

    const formData = new FormData();
    formData.append("nom", document.getElementById("nom").value);
    formData.append("user", document.getElementById("user").value);
    formData.append("youtube", document.getElementById("youtube").value);
    formData.append("facebook", document.getElementById("facebook").value);
    formData.append("siteweb", document.getElementById("siteweb").value);
    formData.append("description",document.getElementById("description").value);
    if(document.getElementById("photo_de_profil").files.length> 0){
        formData.append("photo_de_profil", document.getElementById("photo_de_profil").files[0]);
        }
        if(document.getElementById("photo_de_couverture").files.length>0){
        formData.append("photo_de_couverture", document.getElementById("photo_de_couverture").files[0]);
        }
    formData.append("en_ligne", document.getElementById("en_ligne").checked);
    formData.append("is_association", document.getElementById("is_association").checked);

    const loadingSwal = swal({
        title: "Ajout",
        text: "En cours...",
        icon: "info",
        buttons: false, 
        closeOnClickOutside: false, 
        closeOnEsc: false
    });

    fetch(`/administration/organisateurs/ajouter/`, {
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
const nomInput = document.getElementById("update-nom");
const userSelect = document.getElementById("update-user");
const youtubeInput = document.getElementById("update-youtube");
const slugInput = document.getElementById("update-slug");
const enligneCheckbox = document.getElementById("update-enligne");
const associationCheckbox = document.getElementById("update-is_association");
const photodeprofil = document.getElementById("update-photodeprofil-preview");
const photodecouverture = document.getElementById("update-photodecouverture-preview");
const photodeprofilInput = document.getElementById("update-photodeprofil");
const photodecouvertureInput = document.getElementById("update-photodecouverture");
const sitewebInput = document.getElementById("update-siteweb");
const facebookInput = document.getElementById("update-facebook");
const descriptionInput = document.getElementById("update-description");
document.getElementById("update-button").addEventListener("click", function() {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    const formData = new FormData();
    formData.append("nom", nomInput.value);
    formData.append("user",document.getElementById("select_user").value);
    formData.append("youtube", youtubeInput.value);
    formData.append("facebook", facebookInput.value);
    formData.append("siteweb", sitewebInput.value);
    formData.append("description", descriptionInput.value);
    if (photodeprofilInput.files.length > 0) {
        formData.append("photo_de_profil", photodeprofilInput.files[0]);
    }

    if (photodecouvertureInput.files.length > 0) {
        formData.append("photo_de_couverture", photodecouvertureInput.files[0]);
    }
    formData.append("en_ligne", enligneCheckbox.checked);
    formData.append("is_association", associationCheckbox.checked);
    organisateurId=document.getElementById('update-organisateur-id').value;

    const loadingSwal = swal({
        title: "Update",
        text: "En cours...",
        icon: "info",
        buttons: false, 
        closeOnClickOutside: false, 
        closeOnEsc: false
    });

    fetch(`/administration/organisateurs/${organisateurId}/update/`, {
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
    nomInput.value = details.organisateur.nom;
    userSelect.value = details.organisateur.user;
    youtubeInput.value = details.organisateur.youtube;
    slugInput.value = details.organisateur.slug;
    facebookInput.value = details.organisateur.facebook;
    descriptionInput.value = details.organisateur.description;
    descriptionInput.placeholder = details.organisateur.description;
    sitewebInput.value = details.organisateur.siteweb;
    enligneCheckbox.checked = details.organisateur.en_ligne;
    associationCheckbox.checked = details.organisateur.is_assocation;
    if(details.organisateur.photo_de_profil!=null){
        photodeprofil.src=details.organisateur.photo_de_profil;
        }
        if(details.organisateur.photo_de_couverture!=null){
        photodecouverture.src=details.organisateur.photo_de_couverture
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
        
            if (details.users[i].id == details.organisateur.user) {
                option.selected = true;
            }
        
            select.appendChild(option);
        }
        userSelect.innerHTML = "";
        userSelect.appendChild(select);
        $(select).SumoSelect({ csvDispCount: 3, search: true, searchText: 'Enter here.' });
}
function modifierorganisateur(id){
var organisateurId = id;
    
fetch(`/administration/organisateurs/${organisateurId}/detail/`, {
    method: "GET",
})
.then(response => response.json())
.then(data => {
    document.getElementById('update-organisateur-id').value=organisateurId
    afficherDetailsArtiste(data)
    console.log(data)
    var modal = new bootstrap.Modal(document.getElementById('form-organisateur-update'));
    modal.show();
});

}
function supprimerorganisateur(id) {
    const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    var organisateurid = id;

    swal({
        title: "Êtes-vous sûr ?",
        text: "Voulez-vous vraiment supprimer cet organisateur ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
    },
    function(isConfirm){
        if (isConfirm) {
            fetch(`/administration/organisateurs/${organisateurid}/delete/`, {
                method: "DELETE",
                headers: {
                    'X-CSRFToken': csrftoken
                }
            })
            .then(response => {
                swal("Message", "Organisateur supprimé avec succès", "success");
                location.reload();
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
function details(id,nom){
    const detailsOrganisateurs = document.getElementById("details-organisateurs");
    fetch(`/administration/detailorganisateur/?id=`+id+`&&nom=`+nom, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data=> {
        const elements = document.querySelectorAll('[id^="partienav"]');
        elements.forEach(element => {
            element.classList.remove('selected');
        });
        const details = data.details;
        const partieselected=document.getElementById('partienav'+details.id);
        partieselected.classList.add('selected');
        const content = `
<div class="main-content-body main-content-body-contacts">
<div class="main-contact-info-header">
<div class="media">
    <div class="main-img-user brround">
        ${details.photo_de_profil && details.photo_de_profil.file_exists ? `<img alt="" src="/media/${details.photo_de_profil}" class="w-100 h-100 brround">`:`<img alt="" src="/static/images/sehatra.png" class="w-100 h-100 brround">`}
        <a href="javascript:void(0)"><svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 18.08V19h.92l9.06-9.06-.92-.92z" opacity=".3"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.20-.45-.29-.71-.29s-.51.10-.70.29l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19z"/></svg></a>
    </div>
    <div class="media-body">
        <h4>${details.nom}</h4>
        <p><span class="badge bg-light rounded-pill">Utilisateur: ${details.user.username}</span></p>
        <nav class="nav">
            ${details.en_ligne ? '<span class="text-muted"><i class="fa fa-check text-success"></i> En ligne</span>' : ''}
            ${details.is_association ? '<span class="text-muted"><i class="fa fa-check text-success"></i> Association</span>' : ''}
        </nav>
    </div>
</div>
<div class="main-contact-action">
    <a href="javascript:void(0)"  onclick="modifierorganisateur(${details.id})" class="btn btn-white btn-svgs"><svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 18.08V19h.92l9.06-9.06-.92-.92z" opacity=".3"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.20-.45-.29-.71-.29s-.51.10-.70.29l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19z"/></svg><span>Modifier</span></a>
    <a href="javascript:void(0)" onclick="supprimerorganisateur(${details.id})" class="btn btn-danger btn-svgs"><svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 9h8v10H8z" opacity=".3"/><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"/></svg><span>Supprimer</span></a>
</div>
</div>
<div class="main-contact-info-body">
<div class="media-list pt-0">
    <div class="media py-4 border-top mt-0">
        <div class="media-body">
            <div class="d-flex">
                <div class="media-icon bg-light text-primary me-3 mt-1">
                    <i class="fa fa-align-left"></i>
                </div>
                <div>
                    <label>Description</label> <span class="font-weight-semibold fs-14">${details.description}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="media py-4 border-top mt-0">
        <div class="media-body">
            <div class="d-flex">
                <div class="media-icon bg-light text-primary me-3 mt-1">
                    <i class="fa fa-youtube-play"></i>
                </div>
                <div>
                    <label>Youtube</label> <span class="font-weight-semibold fs-14"><a href="${details.youtube}">${details.youtube}</a></span>
                </div>
            </div>
            <div class="d-flex">
                <div class="media-icon bg-light text-primary me-3 mt-1">
                    <i class="fa fa-globe"></i>
                </div>
                <div>
                    <label>Site Web</label> <span class="font-weight-semibold fs-14"><a href="${details.siteweb}">${details.siteweb}</a></span>
                </div>
            </div>
            <div class="d-flex">
                <div class="media-icon bg-light text-primary me-3 mt-1">
                    <i class="fa fa-facebook-official" aria-hidden="true"></i>
                </div>
                <div>
                    <label>Facebook</label> <span class="font-weight-semibold fs-14"><a href="${details.facebook}">${details.facebook}</a></span>
                </div>
            </div>
        </div>
    </div>
    <div class="media py-4 border-top mt-0">
        <div class="media-body">
            <div class="d-flex">
                <div class="media-icon bg-light text-primary me-3 mt-1">
                    <i class="fa fa-map-marker"></i>
                </div>
                <div>
                    <label>Slug</label> <span class="font-weight-semibold fs-14">${details.slug}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="media mb-0 py-4 border-top mt-0">
        <div class="media-body">
            <div class="d-flex">
                <div class="media-icon bg-light text-primary me-3 mt-1">
                    <i class="fa fa-image"></i>
                </div>
                <div style="width: 100%;">
                    <label>Photo de couverture</label>
                    ${details.photo_de_couverture && details.photo_de_couverture.file_exists ? `<img src="/media/${details.photo_de_couverture}" alt="image" style="width: 100%; height: 100%; object-fit: cover;">` : `<img src="/static/images/sehatra-2.png" alt="image" style="width: 100%; height: 100%; object-fit: cover;">`}
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</div>
`;

detailsOrganisateurs.innerHTML = content;

    })
    .catch(error => {
        console.error(error);
    });
}
document.addEventListener("DOMContentLoaded", function() {
    
    searchInput.addEventListener("input", function(event) {
        if(searchInput.value!=""){
            event.preventDefault();
            fetch(`/administration/organisateur/recherche?search=`+searchInput.value, {
                method: "GET",
            })
            .then(response => response.json())
            .then(data=> {
                zone.innerHTML = "";
    
                for(var i=0;i< data.organisateurs.length;i++)
                {
                    const div = document.createElement("div");
                    div.className = "main-contact-item";
                    div.id="partienav"+data.organisateurs[i].id;
                    div.innerHTML = `
                        <div class="main-img-user online">
                            ${data.organisateurs[i].photo_de_profil && data.organisateurs[i].photo_de_profil.file_exists ? `<img src="/media/${data.organisateurs[i].photo_de_profil}" alt="photo_de_profil" class="avatar avatar-md brround">` : `<img src="/static/images/sehatra.png" alt="photo_de_profil" class="avatar avatar-md brround">`}
                        </div>
                        <div class="main-contact-body">
                            <a href="#"  onclick="details(${data.organisateurs[i].id},'${data.organisateurs[i].nom}');"><h6>${data.organisateurs[i].nom}</h6>
                            <span class="phone">${data.organisateurs[i].user.username}</span></a>
                        </div>
                    `;
                    zone.appendChild(div);
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    });
});