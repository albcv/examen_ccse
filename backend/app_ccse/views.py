from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Pregunta, TipoExamen, ResultadoExamen
import random

@api_view(['POST'])
def login(request):

    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"Error": "Contraseña no válida"}, status=status.HTTP_400_BAD_REQUEST)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({"Token": token.key, "Usuario": serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        user = User.objects.get(username=serializer.data['username'])
        user.set_password(serializer.data['password'])
        user.save()

        token = Token.objects.create(user=user)

        return Response({'token': token.key, 'user':serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    # Eliminar el token del usuario
    request.user.auth_token.delete()
    return Response({"message": "Sesión cerrada correctamente"}, status=status.HTTP_200_OK)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def cantidad_preguntas(request):
    """
    Devuelve la cantidad de preguntas para cada tarea según el primer dígito del número.
    Además, calcula el total para el examen aleatorio (máximo 25).
    """
    preguntas = Pregunta.objects.all()
    
    tareas = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for pregunta in preguntas:
        num_str = str(pregunta.numero)
        if num_str and num_str[0].isdigit():
            primer_digito = int(num_str[0])
            if primer_digito in tareas:
                tareas[primer_digito] += 1
    
    total_preguntas = sum(tareas.values())
    aleatorio = min(total_preguntas, 25)  # Si hay menos de 25, se toman todas
    
    data = {
        'tarea1': tareas[1],
        'tarea2': tareas[2],
        'tarea3': tareas[3],
        'tarea4': tareas[4],
        'tarea5': tareas[5],
        'aleatorio': aleatorio,
    }
    
    return Response(data, status=status.HTTP_200_OK)




@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def preguntas_por_tipo(request, tipo_id):
    """
    Devuelve las preguntas para un tipo de examen.
    tipo_id: 1-5 para tareas específicas, 6 para examen aleatorio (25 preguntas aleatorias).
    """
    if tipo_id == 6:
        # Examen aleatorio: tomar 25 preguntas al azar de todas
        preguntas = list(Pregunta.objects.all())
        if len(preguntas) > 25:
            preguntas = random.sample(preguntas, 25)
        # Mezclar para mayor aleatoriedad
        random.shuffle(preguntas)
    else:
        try:
            tipo_examen = TipoExamen.objects.get(id=tipo_id)
        except TipoExamen.DoesNotExist:
            return Response({"error": "Tipo de examen no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Filtrar por primer dígito del número
        todas = Pregunta.objects.all().order_by('numero')
        preguntas = []
        for p in todas:
            num_str = str(p.numero)
            if num_str and num_str[0].isdigit() and int(num_str[0]) == tipo_id:
                preguntas.append(p)
    
    # Construir respuesta
    data = []
    for p in preguntas:
        opciones = []
        for po in p.pregunta_opciones.all().order_by('orden'):
            opciones.append({
                'id': po.opcion.id,
                'texto': po.opcion.texto,
                'es_correcta': po.es_correcta
            })
        data.append({
            'id': p.id,
            'numero': p.numero,
            'texto': p.texto,
            'opciones': opciones
        })
    
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def guardar_resultado(request):
    tipo_id = request.data.get('tipo_examen_id')
    calificacion = request.data.get('calificacion')
    
    if not tipo_id or calificacion is None:
        return Response({"error": "Faltan datos"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        tipo_examen = TipoExamen.objects.get(id=tipo_id)
    except TipoExamen.DoesNotExist:
        return Response({"error": "Tipo de examen no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
    resultado = ResultadoExamen.objects.create(
        user=request.user,
        tipo_examen=tipo_examen,
        calificacion=calificacion
    )
    
    return Response({"message": "Resultado guardado", "id": resultado.id}, status=status.HTTP_201_CREATED)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mis_resultados(request):
    resultados = ResultadoExamen.objects.filter(user=request.user).select_related('tipo_examen').order_by('-fecha_examen')
    
    data = []
    for r in resultados:
        data.append({
            'id': r.id,
            'examen': r.tipo_examen.tipo,
            'fecha': r.fecha_examen.strftime('%Y-%m-%d'),
            'calificacion': float(r.calificacion),
        })
    
    total_examenes = resultados.count()
    if total_examenes > 0:
        promedio = sum(float(r.calificacion) for r in resultados) / total_examenes
        mejor = max(float(r.calificacion) for r in resultados)
    else:
        promedio = 0
        mejor = 0
    
    stats = {
        'examsTaken': total_examenes,
        'averageScore': round(promedio, 2),
        'bestScore': round(mejor, 2),
    }
    
    return Response({
        'resultados': data,
        'stats': stats
    }, status=status.HTTP_200_OK)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    user = request.user
    resultados = ResultadoExamen.objects.filter(user=user)
    total_examenes = resultados.count()
    if total_examenes > 0:
        promedio = sum(float(r.calificacion) for r in resultados) / total_examenes
    else:
        promedio = 0

    data = {
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined.strftime('%Y-%m-%d'),
        'examsCompleted': total_examenes,
        'averageScore': round(promedio, 2),
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({"error": "Faltan campos"}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({"error": "Contraseña actual incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({"error": "La nueva contraseña debe tener al menos 6 caracteres"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Contraseña cambiada correctamente"}, status=status.HTTP_200_OK)



@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def borrar_historial(request):
    """
    Elimina todos los resultados de examen del usuario autenticado.
    """
    resultados = ResultadoExamen.objects.filter(user=request.user)
    count = resultados.count()
    resultados.delete()
    return Response({"message": f"Se eliminaron {count} resultados."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([])  
@permission_classes([])     
def health_check(request):
    """
    OK
    """
    return Response({"status": "ok"}, status=200)



@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def keep_alive(request):
    """
    Endpoint para mantener la base de datos activa.
    Ejecuta un SELECT mínimo a la base de datos.
    """
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1;")
        cursor.fetchone()
    return Response({"status": "ok", "db": "alive"}, status=200)