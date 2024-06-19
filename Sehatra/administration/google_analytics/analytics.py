import datetime
import re
import pandas as pd
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange
from google.analytics.data_v1beta.types import Dimension
from google.analytics.data_v1beta.types import Metric
from google.analytics.data_v1beta.types import RunReportRequest
from google.analytics.data_v1beta.types import OrderBy
from google.oauth2.service_account import Credentials
from google.auth import exceptions
from django.conf import settings


from ..models import PageAnalytics, VenteParPays

from django.apps import apps  
import json
# from paiement.models import Paiement,Billet,ModePaiement
# from plateforme.models import Video
# from django.contrib.auth.models import User



# def stockerDonnee():
#     with open('data-sehatra.json', 'r') as json_file:
#         data = json.load(json_file)

#     for entry_data in data:
#         model_name = entry_data["model"]
#         if model_name=="paiement.paiement":
#             fields = entry_data["fields"]
#             billet_id = fields.get("billet", None)
#             mode_id = fields.get("mode", None)

#             try:
#                 billet = Billet.objects.get(pk=billet_id)
#                 mode_paiement = ModePaiement.objects.get(pk=mode_id)

#                 paiement_instance = Paiement(
#                     id=entry_data["pk"],
#                     billet=billet,
#                     date=fields.get("date",None),
#                     mode=mode_paiement,
#                     valide=fields.get("valide", False),
#                     telephone=fields.get("telephone", None),
#                     token=fields.get("token", None),
#                     notif_token=fields.get("notif_token", None)
#                 )
#                 paiement_instance.save()

#             except Billet.DoesNotExist:
#                 print(f"Le billet avec l'ID {billet_id} n'a pas été trouvé.")


# stockerDonnee()


SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


country_mapping = {
        "Madagascar": "mg",
        "France": "fr",
        "Mauritius": "mu",
        "United States": "us",
        "Germany": "de",
        "Canada": "ca",
        "China": "cn",
        "Kuwait": "kw",
        "Réunion": "re",
        "Brazil": "br",
        "Netherlands": "nl",
        "Belgium": "be",
        "Indonesia": "id",
        "Italy": "it",
        "Saudi Arabia": "sa",
        "Switzerland": "ch",
        "Sweden": "se",
        "United Kingdom": "gb",
        "Jordan": "jo",
        "Iraq": "iq",
        "Ireland": "ie",
        "Congo - Kinshasa": "cd",
        "India": "in",
        "Morocco": "ma",
        "United Arab Emirates": "ae",
        "Algeria": "dz",
        "Austria": "at",
        "Burkina Faso": "bf",
        "Cameroon": "cm",
        "Comoros": "km",
        "Rwanda": "rw",
        "Sri Lanka": "lk",
        "Taiwan": "tw",
        "Czechia": "cz",
        "Côte d’Ivoire": "ci",
        "Equatorial Guinea": "gq",
        "Guinea": "gn",
        "Hungary": "hu",
        "Kenya": "ke",
        "Lebanon": "lb",
        "Lithuania": "lt",
        "Malawi": "mw",
        "Malaysia": "my",
        "Mali": "ml",
        "New Caledonia": "nc",
        "New Zealand": "nz",
        "Norway": "no",
        "Paraguay": "py",
        "Seychelles": "sc",
        "South Africa": "za",
        "South Korea": "kr",
        "Spain": "es",
        "Romania": "ro",
        "Mexico":"mx",
        "Philippines":"ph",
        "Egypt": "eg",
    }


def authentification():
    global AUTH
    auth = settings.AUTH_GOOGLE
    AUTH=auth

AUTH=authentification()



def get_credentials():
    authentification()
    return Credentials.from_service_account_file(settings.GOOGLE_CREDENTIALS, scopes=SCOPES)



def dataVenteParPays(since, until):
    since = since.date()
    until = until.date()

    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)

    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="pagePath"), Dimension(name="country"), Dimension(name="date")],
        date_ranges=[DateRange(start_date=str(since), end_date=str(until))],
    )

    response = client.run_report(request)

    data = []
    for row in response.rows:
        page_path = row.dimension_values[0].value
        country = row.dimension_values[1].value
        date_vente_str = row.dimension_values[2].value

        formatted_date = f"{date_vente_str[:4]}-{date_vente_str[4:6]}-{date_vente_str[6:8]}"
        date_vente = datetime.datetime.strptime(formatted_date, "%Y-%m-%d").date()

        if re.search(r'/paiement', page_path):
            match = re.search(r'/paiement/([A-Z0-9]+)/', page_path)
            if match:
                slug = match.group(1)
                data.append([slug, country, date_vente])

    output = pd.DataFrame(data, columns=['slug', 'pays', 'date'])

    grouped_output = output.groupby('slug').agg({
        'pays': 'first',
        'date': 'first'
    }).reset_index()

    for row in grouped_output.iterrows():
        row_data = row[1]
        if row_data["pays"] in country_mapping:
            VenteParPays.objects.create(slug=row_data['slug'], pays=row_data['pays'], date_vente=row_data['date'],codepays=country_mapping[row_data["pays"]])
        
        else :
            VenteParPays.objects.create(slug=row_data['slug'], pays=row_data['pays'], date_vente=row_data['date'],codepays=None)


def pageStatistique(since,until):
    since = since.date()
    until = until.date()
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)

    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="pagePath"), Dimension(name="unifiedScreenName"),Dimension(name="date")],
        metrics=[Metric(name="activeUsers"),Metric(name="screenPageViews"),Metric(name="bounceRate"),Metric(name="averageSessionDuration"),Metric(name="newUsers")],
        date_ranges=[DateRange(start_date=str(since), end_date=str(until))],
    )

    response = client.run_report(request)

    data = []
    for row in response.rows:
        page_path = row.dimension_values[0].value
        screen_name = row.dimension_values[1].value
        users=row.metric_values[0].value
        screen_pageviews = row.metric_values[1].value
        bouncerate = float(row.metric_values[2].value)
        tempsmoyenne=float(row.metric_values[3].value)
        newuser=row.metric_values[4].value
        date=row.dimension_values[2].value
        formatted_date = f"{date[:4]}-{date[4:6]}-{date[6:8]}"
        date_final = datetime.datetime.strptime(formatted_date, "%Y-%m-%d").date()
        if screen_name != "(not set)" and "/paiement" not in page_path:    
            data.append([page_path, screen_name, screen_pageviews,bouncerate, tempsmoyenne, users,newuser,date_final])

    output = pd.DataFrame(data, columns=['Page Path', 'Screen Name', 'Vue de la page','Bounce Rate','Temps Moyenne ','Utilisateur','Nouveau utilisateur','Date'])

    output['Vue de la page'] = pd.to_numeric(output['Vue de la page'], errors='coerce')
    output = output.sort_values(by='Vue de la page', ascending=False)

    for index, row in output.iterrows():
        PageAnalytics.objects.create(
            path=row['Page Path'],
            screenname=row['Screen Name'],
            utilisateur=row['Utilisateur'],
            bouncerate=row['Bounce Rate'],
            temps_moyenne=row['Temps Moyenne '],
            nouveauutilisateur=row['Nouveau utilisateur'],
            vue=row['Vue de la page'],
            date=row['Date']
        )
    return output

def getUtilisateurActive(datedebut, datefin):
    try:
        credentials = get_credentials()
        client = BetaAnalyticsDataClient(credentials=credentials)
        request = RunReportRequest(
            property='properties/'+AUTH['property_id'],
            dimensions=[Dimension(name="date")],
            metrics=[Metric(name="activeUsers")],
            date_ranges=[DateRange(start_date=datedebut, end_date=datefin)]
        )
        response = client.run_report(request)
        total_utilisateur=0
        for row in response.rows:
            total_utilisateur+=int(row.metric_values[0].value)

        return total_utilisateur

    except exceptions.DefaultCredentialsError:
        print("Erreur d'authentification. Assurez-vous que vos identifiants sont corrects.")
        return None



def demographicsByLanguage(since,until):
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)
    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="language")], 
        metrics=[Metric(name="activeUsers"), Metric(name="newUsers")],
        date_ranges=[DateRange(start_date=since, end_date=until)], 
    )

    response = client.run_report(request)

    data = []
    for row in response.rows:
        langue = row.dimension_values[0].value
        users=row.metric_values[0].value
        newusers = row.metric_values[1].value
        data.append([langue, users, newusers])

    output = pd.DataFrame(data, columns=['Langue', 'Utilisateurs', 'Nouveau utilisateurs'])

    return output

def SourceDesClics(since, until):
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)

    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="sessionSourceMedium")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=since, end_date=until)],
    )

    response = client.run_report(request)

    platforms = ["youtube.com", "facebook.com", "instagram.com", "direct", "google.com"]
    platform_totals = {platform: 0 for platform in platforms}

    for row in response.rows:
        source = row.dimension_values[0].value.lower()
        for platform in platforms:
            if platform in source:
                active_users = int(row.metric_values[0].value)
                platform_totals[platform] += active_users

    data = [[source, active_users] for source, active_users in platform_totals.items()]

    output = pd.DataFrame(data, columns=['Source', 'Active Users'])
    output = output.sort_values(by='Active Users', ascending=False)

    output.reset_index(drop=True, inplace=True)

    return output


def demographieParPays(since,until):
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)
    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="country")], 
        metrics=[ Metric(name="activeUsers"), Metric(name="newUsers")],
        date_ranges=[DateRange(start_date=since, end_date=until)], 
    )

    response = client.run_report(request)

    data = []
    for row in response.rows:
        country = row.dimension_values[0].value
        users=row.metric_values[0].value
        newusers = row.metric_values[1].value
        if(country!="(not set)"):
            data.append([country, users, newusers])

    output = pd.DataFrame(data, columns=['Pays', 'Utilisateurs', 'Nouveau utilisateurs'])

    return output


def demographieParVille(since,until):
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)
    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="city")], 
        metrics=[Metric(name="activeUsers"), Metric(name="newUsers")],
        date_ranges=[DateRange(start_date=since, end_date=until)], 
    )

    response = client.run_report(request)

    data = []
    for row in response.rows:
        ville = row.dimension_values[0].value
        users=row.metric_values[0].value
        newusers = row.metric_values[1].value
        data.append([ville, users, newusers])

    output = pd.DataFrame(data, columns=['Ville', 'Utilisateurs', 'Nouveau utilisateurs'])

    return output

def export_to_txt(dataframe, filename):
    try:
        dataframe.to_csv(filename, sep='\t', index=False)
        print(f"Les données ont été exportées avec succès dans {filename}")
    except Exception as e:
        print(f"Une erreur s'est produite lors de l'exportation des données : {str(e)}")

def StatistiquePagesArtiste(since, until):
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)

    pages_incluses = ['/video/feo-sy-gitara/','/video/madagasikara-sy-ny-dihy/']

    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="unifiedScreenName"),Dimension(name="pagePath")],
        metrics=[Metric(name="activeUsers"), Metric(name="screenPageViews"), Metric(name="bounceRate"), Metric(name="averageSessionDuration")],
        date_ranges=[DateRange(start_date=since, end_date=until)],
    )

    response = client.run_report(request)

    data = []
    for row in response.rows:
        screen_name = row.dimension_values[0].value
        pagepath = row.dimension_values[1].value
        users = row.metric_values[0].value
        screen_pageviews = row.metric_values[1].value
        bouncerate = row.metric_values[2].value
        tempsmoyenne = row.metric_values[3].value
        
        if pagepath in pages_incluses:
            data.append([screen_name,pagepath, screen_pageviews, bouncerate, tempsmoyenne, users])

    output = pd.DataFrame(data, columns=['Screen Name','Page path', 'Vue de la page', 'Bounce Rate', 'Temps Moyenne ', 'Utilisateur'])

    return output

def ContenueArtiste(since, until,page):
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)

    request = RunReportRequest(
        property='properties/'+AUTH['property_id'],
        dimensions=[Dimension(name="unifiedScreenName"),Dimension(name="pagePath")],
        metrics=[Metric(name="newUsers"), Metric(name="screenPageViews")],
        date_ranges=[DateRange(start_date=since, end_date=until)],
    )

    response = client.run_report(request)

    data = []
    for row in response.rows:
        screen_name = row.dimension_values[0].value
        pagepath = row.dimension_values[1].value
        users = row.metric_values[0].value
        screen_pageviews = row.metric_values[1].value
        
        if re.search(page, pagepath):
            data.append([screen_name,pagepath, screen_pageviews,users])

    output = pd.DataFrame(data, columns=['Screen Name','Page path', 'Vue de la page', 'Utilisateur'])

    return output


def PourcentageVisiteurs(since, until):
    credentials = get_credentials()
    client = BetaAnalyticsDataClient(credentials=credentials)

    pages_incluses = ['/video/feo-sy-gitara/', '/video/madagasikara-sy-ny-dihy/']

    request = RunReportRequest(
        property='properties/' + AUTH['property_id'],
        dimensions=[Dimension(name="unifiedScreenName"), Dimension(name="country"), Dimension(name="pagePath")],
        metrics=[Metric(name="activeUsers"), Metric(name="screenPageViews"), Metric(name="bounceRate"),
                 Metric(name="averageSessionDuration")],
        date_ranges=[DateRange(start_date=since, end_date=until)],
    )

    response = client.run_report(request)

    total_visiteurs = 0
    total_visiteurs_madagascar = 0
    total_visiteurs_international = 0

    for row in response.rows:
        country = row.dimension_values[1].value
        users = int(row.metric_values[0].value)
        total_visiteurs += users

        if country == 'Madagascar':
            total_visiteurs_madagascar += users
        else:
            total_visiteurs_international += users

    pourcentage_madagascar = (total_visiteurs_madagascar / total_visiteurs) * 100
    pourcentage_international = (total_visiteurs_international / total_visiteurs) * 100

    return pourcentage_madagascar, pourcentage_international