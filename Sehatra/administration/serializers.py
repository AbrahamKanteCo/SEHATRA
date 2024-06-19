# serializers.py
from rest_framework import serializers

from paiement.models import Billet, Paiement
from .models import Video_facebook
from plateforme.models import Action, Association, Live, Organisateur, Artiste, Video
from django.contrib.auth.models import User


class VideoArtisteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__' 

 
class AssociationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = '__all__'

class ArtisteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artiste
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class LiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Live
        fields = '__all__'

class OrganisteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisateur
        fields = '__all__'

class OrganisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisateur
        fields = ('id', 'nom','slug') 

class VideoSerializer(serializers.ModelSerializer):
    organisateur_detail = OrganisateurSerializer(source='organisateur', read_only=True)
    billet_date = serializers.DateTimeField(read_only=True)
    is_bought = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = '__all__'  
        extra_fields = ['organisateur_detail','billet_date','is_bought']

    def get_field_names(self, declared_fields, info):
        expanded_fields = super(VideoSerializer, self).get_field_names(declared_fields, info)

        if getattr(self.Meta, 'extra_fields', None):
            return expanded_fields + self.Meta.extra_fields
        else:
            return expanded_fields
    def get_is_bought(self, obj):
        is_bought = False
        user = self.context['request'].user
        billet_query = Billet.objects.filter(user=user, video=obj, valide=True)
        if billet_query.exists():
            billet = billet_query.first()  
            paiement_exists = Paiement.objects.filter(billet__id=billet.id, valide=True).exists()
            if paiement_exists:
                is_bought = True
        return is_bought



class ArtisteMobileSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True, source='artiste_video')
    class Meta:
        model = Artiste
        fields = ('nom', 'photo_de_profil', 'photo_de_couverture', 'youtube', 'slug', 'en_ligne', 'videos')

       
class OrganisateurMobileSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True, source='organisateur_video')

    class Meta:
        model = Organisateur
        fields = ('nom', 'photo_de_profil', 'description','slug', 'videos')

class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = '__all__'

class AssociationMobileSerializer(serializers.ModelSerializer):
    actions = ActionSerializer(many=True, read_only=True, source='association_action')
    videos = VideoSerializer(many=True, read_only=True, source='association_action__action_video')

    class Meta:
        model = Association
        fields = ('nom', 'photo_de_profil', 'description','slug', 'actions','videos')



class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video_facebook
        fields = '__all__'