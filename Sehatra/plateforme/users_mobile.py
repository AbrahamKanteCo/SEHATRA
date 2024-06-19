from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from administration.serializers import ArtisteMobileSerializer, ArtisteSerializer, AssociationMobileSerializer, OrganisateurMobileSerializer, VideoSerializer
from plateforme.models import Artiste, Association, Organisateur, Video
from django.db.models import F


"""
Récupérer les informations de l'utilisateur connecté
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_list_concert_live(request):
    videos = Video.objects.filter(en_ligne=True, is_film=False)
    serializer = VideoSerializer(videos, many=True,context={'request': request})
    data = serializer.data
    return JsonResponse(data, safe=False, encoder=UnicodeJSONEncoder)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_list_film(request):
    videos = Video.objects.filter(en_ligne=True, is_film=True)
    serializer = VideoSerializer(videos, many=True,context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_list_live(request):
    videos = Video.objects.filter(en_ligne=True, is_film=False, is_live=True)
    serializer = VideoSerializer(videos, many=True,context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_live_a_la_une(request):
    user = request.user
    try:
        video_recente = Video.objects.filter(en_ligne=True, is_film=False, is_live=True).latest('date_sortie')
        serializer = VideoSerializer(video_recente,context={'request': request}) 
    except Video.DoesNotExist:
        return Response({'message': 'Aucune vidéo trouvée.'}, status=404)

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getArtiste(request):
    user = request.user
    try:
        artistes = Artiste.objects.filter(en_ligne=True).prefetch_related('artiste_video') 
        serializer = ArtisteMobileSerializer(artistes,many=True,context={'request': request}) 
    except Video.DoesNotExist:
        return Response({'message': 'Aucune artiste trouvée.'}, status=404)

    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrganisateur(request):
    user = request.user
    try:
        organisateurs = Organisateur.objects.filter(en_ligne=True).prefetch_related('organisateur_video') 
        serializer = OrganisateurMobileSerializer(organisateurs,many=True,context={'request': request}) 
    except Video.DoesNotExist:
        return Response({'message': 'Aucune organisateur trouvée.'}, status=404)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAssociation(request):
    user = request.user
    try:
        associations = Association.objects.filter(en_ligne=True).prefetch_related('association_action__action_video').prefetch_related('association_action')
        serializer = AssociationMobileSerializer(associations,many=True,context={'request': request}) 
    except Video.DoesNotExist:
        return Response({'message': 'Aucune association trouvée.'}, status=404)

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMesVideosFilm(request):
    user = request.user
    try:
        mes_videos =Video.objects.filter(en_ligne=True, video_billet__billet_paiement__valide=True,video_billet__valide=True,video_billet__user=user,is_film=True).annotate(billet_date=F('video_billet__billet_paiement__date'))
        serializer = VideoSerializer(mes_videos,many=True,context={'request': request}) 
    except Video.DoesNotExist:
        return Response({'message': 'Aucune vidéo trouvée.'}, status=404)

    return Response(serializer.data)

from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse

class UnicodeJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, str):
            return obj.encode('utf-8').decode('utf-8')
        return super().default(obj)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMesVideosConcert(request):
    user = request.user
    try:
        mes_videos = Video.objects.filter(en_ligne=True, video_billet__billet_paiement__valide=True,video_billet__valide=True,video_billet__user=user,is_film=False).annotate(billet_date=F('video_billet__billet_paiement__date'))
        serializer = VideoSerializer(mes_videos,many=True,context={'request': request}) 
    except Video.DoesNotExist:
        return Response({'message': 'Aucune vidéo trouvée.'}, status=404)

    data = serializer.data
    return JsonResponse(data, safe=False, encoder=UnicodeJSONEncoder)
