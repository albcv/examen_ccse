from django.db import models
from django.contrib.auth.models import User  


class TipoExamen(models.Model):
    """Modelo para tipos de exámenes"""
    tipo = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Tipo de examen"
    )
    
    def __str__(self):
        return self.tipo
    
    class Meta:
        verbose_name = "Tipo de examen"
        verbose_name_plural = "Tipos de examen"


class Pregunta(models.Model):
    texto = models.TextField(unique=True)  
    numero = models.IntegerField(unique=True)  
    
    opciones = models.ManyToManyField(
        'Opcion', 
        through='PreguntaOpcion',
        through_fields=('pregunta', 'opcion'),
        related_name='preguntas'
    )
    
    def __str__(self):
        return f"Pregunta {self.numero}"
    
    class Meta:
        ordering = ['numero']
        verbose_name = "Pregunta"
        verbose_name_plural = "Preguntas"


class Opcion(models.Model):
    texto = models.TextField(unique=True)  
    
    def __str__(self):
        return self.texto[:50]
    
    class Meta:
        verbose_name = "Opción"
        verbose_name_plural = "Opciones"


class PreguntaOpcion(models.Model):
    """Modelo intermedio para la relación muchos a muchos"""
    pregunta = models.ForeignKey(
        Pregunta, 
        on_delete=models.CASCADE,
        related_name='pregunta_opciones'
    )
    opcion = models.ForeignKey(
        Opcion, 
        on_delete=models.CASCADE,
        related_name='opcion_preguntas'
    )
    es_correcta = models.BooleanField(
        default=False,
        verbose_name="¿Es correcta para esta pregunta?"
    )
    orden = models.IntegerField(
        default=0,
        verbose_name="Orden de aparición"
    )
    
    class Meta:
        # Una opción solo puede aparecer una vez por pregunta
        unique_together = ['pregunta', 'opcion']
        ordering = ['orden', 'id']
        verbose_name = "Relación Pregunta-Opción"
        verbose_name_plural = "Relaciones Pregunta-Opción"
    
    def __str__(self):
        correcta = "✓" if self.es_correcta else "✗"
        return f"Pregunta {self.pregunta.numero} - Opción: {self.opcion.texto[:30]} {correcta}"


class ResultadoExamen(models.Model):
    """Modelo para almacenar los resultados de los exámenes de los usuarios"""
    user = models.ForeignKey(
        User,  
        on_delete=models.CASCADE,
        related_name='resultados_examen',
        verbose_name="Usuario"
    )
    tipo_examen = models.ForeignKey(
        TipoExamen,
        on_delete=models.CASCADE,
        related_name='resultados',
        verbose_name="Tipo de examen"
    )
    calificacion = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name="Calificación"
    )
    fecha_examen = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Fecha del examen"
    )
    
    class Meta:
       
        unique_together = ['user', 'tipo_examen', 'calificacion', 'fecha_examen']
        ordering = ['-fecha_examen']  
        verbose_name = "Resultado de examen"
        verbose_name_plural = "Resultados de examen"
    
    def __str__(self):
        return f"{self.user.username} - {self.tipo_examen}: {self.calificacion} ({self.fecha_examen.date()})"