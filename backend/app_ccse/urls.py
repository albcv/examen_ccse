from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('cantidad-preguntas/', views.cantidad_preguntas, name='cantidad_preguntas'),
    path('preguntas/tipo/<int:tipo_id>/', views.preguntas_por_tipo, name='preguntas_por_tipo'),
    path('guardar-resultado/', views.guardar_resultado, name='guardar_resultado'),
    path('mis-resultados/', views.mis_resultados, name='mis_resultados'),
    path('perfil/', views.perfil_usuario, name='perfil'),
    path('cambiar-password/', views.cambiar_password, name='cambiar_password'),
    path('borrar-historial/', views.borrar_historial, name='borrar_historial'),

    path('health/', views.health_check, name='health'),  
    path('keep-alive/', views.keep_alive, name='keep-alive'),
 
]