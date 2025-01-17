
import datetime
import locale
from django.db.models import Sum, Count, Case, When, F, IntegerField
from django.http import JsonResponse
from django.shortcuts import render
from administration.interface_administration import marquer_notification_read, send_notification
from administration.models import NotificationFCM, PageAnalytics, VenteParPays, Video_facebook
from paiement.models import Billet, Paiement
from django.contrib.humanize.templatetags.humanize import intcomma
from plateforme.models import Artiste, Organisateur, Video
from django.db.models.functions import TruncMonth,Coalesce
from django.db.models import Q,Avg
from django.core.paginator import Paginator



prix_ariary_euro=4700
pourcentage_artiste=60/100
pagination=10

def ventes_video_artiste(request):
    id=request.user.id
    debut_28 = datetime.datetime.now() - datetime.timedelta(days=28)
    since = debut_28.strftime("%Y-%m-%d")
    ventes_par_video = Video.objects.annotate(
        nombre_ventes=Count(
            "video_billet__billet_paiement__id",
            distinct=True,
            filter=Q(
                video_billet__billet_paiement__valide=True,
                video_billet__valide=True,
                video_billet__gratuit=False,
                video_billet__billet_paiement__date__gte=since,
                organisateur__user=id,
            ),
        )
    ).values("titre", "nombre_ventes", "photo_de_couverture", "organisateur__nom")
    notifications = NotificationFCM.objects.filter(user=2).order_by("-created_at")[:5]
    context = {"ventes_video": ventes_par_video, "notifications": notifications}

    return render(request, "ventes_video_artiste.html", context)
def transactions_artistes(request):
    id=request.user.id
    transactions = Paiement.objects.filter(billet__gratuit=False,billet__video__organisateur__user=id).order_by("-date")
    transactions_valide = transactions.filter(
        billet__gratuit=False, valide=True
    )
    mvola = transactions_valide.filter(
        mode__nom="Mvola",
    ).count()
    orange = transactions_valide.filter(
        mode__nom="Orange Money",
    ).count()
    stripe = transactions_valide.filter(
        mode__nom="Stripe",
    ).count()

    transactions_echec = transactions.filter(
        valide=False,
        
    )
    mvola_echec = transactions_echec.filter(
        mode__nom="Mvola",
        
    ).count()
    orange_echec = transactions_echec.filter(
        mode__nom="Orange Money",
        
    ).count()
    stripe_echec = transactions_echec.filter(
        mode__nom="Stripe",
        
    ).count()

    total = transactions.count()
    context = {
        "total": total,
        "total_mvola":mvola+mvola_echec,
        "total_orange":orange+orange_echec,
        'total_stripe':stripe+stripe_echec,
        "mvola_valide": mvola,
        "orange_valide": orange,
        "stripe_valide": stripe,
        "mvola_echec": mvola_echec,
        "orange_echec": orange_echec,
        "stripe_echec": stripe_echec,
        "valide": transactions_valide.count(),
        "echec": transactions_echec.count(),
        "notifications": NotificationFCM.objects.filter(user=2).order_by("-created_at")[
            :5
        ],
    }
    return render(request, "transactions_artiste.html", context)

def statistiques_vues_nouveaux_utilisateurs_json(request):
    id=request.user.id
    date_actuelle = datetime.datetime.now()

    videos = Video.objects.filter(organisateur__user=id)
    conditions = [Q(path__icontains=video.slug) for video in videos]

    filtre_pages = Q()
    for condition in conditions:
        filtre_pages |= condition

    statistiques_pages = (
        PageAnalytics.objects.filter(
            date__year=date_actuelle.year, date__month__lte=date_actuelle.month
        )
        .filter(filtre_pages)
        .annotate(mois=TruncMonth("date"))
        .values("mois")
        .annotate(
            nombre_vues=Sum("vue"),
            nombre_nouveaux_utilisateurs=Sum("nouveauutilisateur"),
        )
        .order_by("mois")
    )

    donnees_statistiques = {}

    for mois in range(1, date_actuelle.month + 1):
        mois_str = date_actuelle.replace(day=1, month=mois).strftime("%B")
        donnees_statistiques[mois_str] = {
            "mois": mois_str,
            "nombre_vues": 0,
            "nombre_nouveaux_utilisateurs": 0,
        }

    for resultat in statistiques_pages:
        mois_str = resultat["mois"].strftime("%B")
        donnees_statistiques[mois_str] = {
            "mois": mois_str,
            "nombre_vues": resultat["nombre_vues"],
            "nombre_nouveaux_utilisateurs": resultat["nombre_nouveaux_utilisateurs"],
        }

    return JsonResponse({"statistiques_pages": donnees_statistiques})

def statistiques_ventes_artiste_json(request, annee):
    id = request.user.id
    date_actuelle = datetime.datetime.now()

    if int(annee) == date_actuelle.year:
        statistiques_ventes = (
            Paiement.objects.filter(
                valide=True,
                billet__gratuit=False,
                billet__video__organisateur__user_id=id,
                date__year=annee,
                date__month__lte=date_actuelle.month,
            )
            .annotate(mois=TruncMonth("date"))
            .values("mois")
            .annotate(
                nombre_ventes=Count("id"),
                revenues=Sum(
                    Case(
                        When(mode=3, then=F("billet__video__tarif_euro") * prix_ariary_euro),
                        default=F("billet__video__tarif_ariary"),
                        output_field=IntegerField(),
                    )
                )
                * pourcentage_artiste,
            )
            .order_by("mois")
        )
    else:
        # Affiche tous les mois de l'année
        statistiques_ventes = (
            Paiement.objects.filter(
                valide=True,
                billet__gratuit=False,
                billet__video__organisateur__user_id=id,
                date__year=annee,
            )
            .annotate(mois=TruncMonth("date"))
            .values("mois")
            .annotate(
                nombre_ventes=Count("id"),
                revenues=Sum(
                    Case(
                        When(mode=3, then=F("billet__video__tarif_euro") * prix_ariary_euro),
                        default=F("billet__video__tarif_ariary"),
                        output_field=IntegerField(),
                    )
                )
                * pourcentage_artiste,
            )
            .order_by("mois")
        )

    donnees_statistiques = {}
    locale.setlocale(locale.LC_TIME, "fr_FR")

    for mois in range(1, 13):
        mois_str = date_actuelle.replace(day=1, month=mois).strftime("%B")
        donnees_statistiques[mois_str] = {
            "mois": mois_str,
            "nombre_ventes": 0,
            "revenues": 0,
        }

    for resultat in statistiques_ventes:
        mois_str = resultat["mois"].strftime("%B")
        donnees_statistiques[mois_str] = {
            "mois": mois_str,
            "nombre_ventes": resultat["nombre_ventes"],
            "revenues": resultat["revenues"],
        }

    return JsonResponse({"statistiques_ventes": donnees_statistiques})


from background_task import background

from django.contrib.auth.models import User

def envoi_notification_artiste(request):
    aujourd_hui = datetime.date.today()
    hier = aujourd_hui - datetime.timedelta(days=1)
    debut_journee = datetime.datetime.combine(hier, datetime.datetime.min.time())

    fin_journee = datetime.datetime.combine(hier, datetime.datetime.max.time())
    artistes = Organisateur.objects.filter(en_ligne=True)
    for artiste in artistes:
        user = artiste.user
        paiements = Paiement.objects.filter(
            valide=True, billet__gratuit=False,billet__video__organisateur__user=user.id,date__range=(debut_journee,fin_journee)
        ).order_by("-date")
        somme = Paiement.calculer_paiement(paiements)
        revenus = somme * 40 / 100
        ventes=paiements.count()
        body = "Il y a "+str(ventes)+" ventes hier, ce qui fait un revenu de "+str(intcomma(revenus))+"Ariary."
        if(ventes>0) :
            send_notification(
            "https://sehatra.com/administration/ventes_video_artiste",
            user.id,
            "Ventes",
            body,
        )
        
# def programmerNotificationArtiste():
#     now = datetime.datetime.now()
#     midnight = now.replace(hour=17, minute=20, second=0)
#     if now > midnight:
#         midnight += datetime.timedelta(days=1)

#     envoi_notification_artiste(repeat=60*24, repeat_until=None)


def dashboardartiste(request):
    id=request.user.id
    marquer_notification_read(request)
    # 28 derniers jours
    debut_28 = datetime.datetime.now() - datetime.timedelta(days=28)
    until=datetime.datetime.now().strftime("%Y-%m-%d")
    since = debut_28.strftime("%Y-%m-%d")
    last_month = (debut_28 - datetime.timedelta(days=28)).strftime("%Y-%m-%d")

    # oeuvre
    videos = Video.objects.filter(organisateur__user=id)
    resultats = []

    for video in videos:
        slug_video = video.slug

        total_vues = (
            PageAnalytics.objects.filter(
                path__icontains=slug_video, date__gte=since
            ).aggregate(total_vues=Sum("vue"))["total_vues"]
            or 0
        )
        nb_ventes = Paiement.objects.filter(
            valide=True,
            billet__gratuit=False,
            date__gte=since,
            billet__video_id=video.id,
        ).order_by("-date")
        resultats.append(
            {"titre": video.titre, "total_vues": total_vues, "ventes": len(nb_ventes)}
        )

    # revenue
    paiements = Paiement.objects.filter(
        valide=True,
        billet__gratuit=False,
        billet__video__organisateur__user=id,
    ).order_by("-date")
    somme = Paiement.calculer_paiement(paiements)
    revenus = somme * pourcentage_artiste

    # revenu last month
    paiements_last_month = Paiement.objects.filter(
        valide=True,
        billet__gratuit=False,
        date__range=(last_month, since),
        billet__video__organisateur__user=id,
    ).order_by("-date")
    revenus_last_month = (Paiement.calculer_paiement(paiements_last_month)) * pourcentage_artiste
    revenus_difference = revenus - revenus_last_month

    # vente
    ventes = len(paiements)
    ventes_last_month = len(paiements_last_month)
    ventes_difference = ventes - ventes_last_month

    # nombre de contenues
    videos = Video.objects.filter(organisateur__user=id)
    contenus = len(videos)

    # nombre de contenues le mois dernier
    videos_last_month = Video.objects.filter(
        organisateur__user=id, date_sortie__range=(last_month, since)
    )
    contenus_last_month = len(videos_last_month)
    contenus_difference = contenus - contenus_last_month
    # publications
    publications = Video_facebook.objects.filter(video__organisateur__user=id)
    pub = len(publications)

    # publication le mois dernier

    publications_last_month = Video_facebook.objects.filter(
        video__organisateur__user=id, date_publication__range=(last_month, since)
    )
    pub_last_month = len(publications_last_month)
    pub_difference = pub - pub_last_month

    # vente par pays

    ventes_valides = VenteParPays.objects.filter(
        Q(
            slug__in=Billet.objects.filter(gratuit=False, video__organisateur__user=id).values_list(
                "slug", flat=True
            )
        )
        & Q(
            slug__in=Paiement.objects.filter(valide=True).values_list(
                "billet__slug", flat=True
            )
        ),
        date_vente__range=(since, until),
    )

    ventes_groupees = ventes_valides.values("pays").annotate(nombre_ventes=Count("id"))

    paiements_28 = Paiement.objects.filter(
        valide=True,
        billet__gratuit=False,
        billet__video__organisateur__user=id,
        date__range=(since,until)
    ).order_by("-date")
    #billet manuelle
    somme_ventes = ventes_groupees.aggregate(somme_ventes=Coalesce(Sum("nombre_ventes"), 0))
    total_ventes = somme_ventes.get("somme_ventes", 0)
    manuelle="Aucun"
    if(total_ventes < ventes):
        manuelle=str(paiements_28.count()-total_ventes)
    
    date_actuelle = datetime.datetime.now()
    resultats_tries = sorted(resultats, key=lambda x: (x["total_vues"], x["ventes"]), reverse=True)[:2]


    context = {
        "revenue": revenus,
        "venteparpays": ventes_groupees,
        "revenue_last_month": revenus_last_month,
        "revenue_difference": revenus_difference,
        "ventes": ventes,
        "oeuvres": resultats_tries,
        "vente_last_month": ventes_last_month,
        "ventes_difference": ventes_difference,
        "contenues": contenus,
        "contenues_last_month": contenus_last_month,
        "contenues_difference": contenus_difference,
        "publications": pub,
        "publications_last_month": pub_last_month,
        "publications_difference": pub_difference,
        "notifications": NotificationFCM.objects.filter(user=2).order_by("-created_at")[
            :5
        ],
        "date_actuelle": date_actuelle,
        "annees": list(range(2022, date_actuelle.year + 1)),
        "manuelle":manuelle
    }
    return render(request, "dashboard-artiste.html", context)


def artistevideo(request):
    id=request.user.id
    marquer_notification_read(request)
    videos = Video.objects.filter(organisateur__user=id).order_by("-date_sortie")
    paginator = Paginator(videos, pagination)

    page_number = request.GET.get("page")
    paginated_video = paginator.get_page(page_number)
    context = {
        "videos": paginated_video,
        "notifications": NotificationFCM.objects.filter(user=id).order_by("-created_at")[
            :5
        ],
    }
    return render(request, "artiste_videos.html", context)

def rechercheartistevideo(request):
    id=request.user.id
    if request.GET.get("search"):
        keyword = request.GET.get("search")
        videos = Video.objects.filter(
            Q(titre__icontains=keyword) | Q(date_sortie__icontains=keyword)
        )
    else:
        videos = Video.objects.filter(organisateur__user=id).order_by("-date_sortie")

    paginator = Paginator(videos, pagination)

    page_number = request.GET.get("page")
    paginated_video = paginator.get_page(page_number)
    context = {
        "videos": paginated_video,
        "notifications": NotificationFCM.objects.filter(user=id).order_by("-created_at")[
            :5
        ],
    }
    return render(request, "artiste_videos.html", context)


def statistiquevideoartiste(request, video):
    id=request.user.id
    marquer_notification_read(request)
    since = (datetime.datetime.now() - datetime.timedelta(days=28)).strftime("%Y-%m-%d")
    until = datetime.datetime.now().strftime("%Y-%m-%d")
    videos = Video.objects.filter(id=video).first()
    # revenus
    paiements = Paiement.objects.filter(
        valide=True, billet__gratuit=False, date__range=(since,datetime.datetime.now()), billet__video__id=video
    ).order_by("-date")
    somme = Paiement.calculer_paiement(paiements)
    revenus = somme * pourcentage_artiste

    # publication lié
    publications = Video_facebook.objects.filter(video=videos.id,date_publication__range=(since,datetime.datetime.now()))

    # nombre de vue
    total_vues = (
        PageAnalytics.objects.filter(
            path__icontains=videos.slug, date__gte=since
        ).aggregate(total_vues=Sum("vue"))["total_vues"]
        or 0
    )

    context = {
        "ventes": len(paiements),
        "revenue": revenus,
        "notifications": NotificationFCM.objects.filter(user=id).order_by("-created_at")[
            :5
        ],
        "video": videos,
        "publications": publications,
        "vues": total_vues,
    }

    return render(request, "statistique-artiste.html", context)


def pages_artistes(request):
    id=request.user.id
    # 28 derniers jours
    debut_28 = datetime.datetime.now() - datetime.timedelta(days=28)
    since = debut_28.strftime("%Y-%m-%d")

    # oeuvre
    videos = Video.objects.filter(organisateur__user=id)

    resultats = []
    total_vues = 0
    total_ventes=0

    for video in videos:
        slug_video = video.slug

        vues = (
            PageAnalytics.objects.filter(
                path__icontains=slug_video, date__range=(since,datetime.datetime.now())
            ).aggregate(total_vues=Sum("vue"))["total_vues"]
            or 0
        )
        total_vues+=vues
        nb_ventes = Paiement.objects.filter(
            valide=True,
            billet__gratuit=False,
            date__gte=since,
            billet__video_id=video.id,
        ).order_by("-date")
        total_ventes+= len(nb_ventes)
        resultats.append(
            {"titre": video.titre, "total_vues": vues, "ventes": len(nb_ventes)}
        )


    context = {"pages": resultats,"total_vue":total_vues,"total_ventes":total_ventes,"notifications": NotificationFCM.objects.filter(user=id).order_by("-created_at")[
            :5
        ],}
    return render(request, "pages-artiste.html", context)


