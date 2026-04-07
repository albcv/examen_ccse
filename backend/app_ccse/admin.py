from django.contrib import admin
from .models import Pregunta, Opcion, PreguntaOpcion, TipoExamen, ResultadoExamen

# Inline para gestionar las opciones directamente desde la pregunta
class PreguntaOpcionInline(admin.TabularInline):
    model = PreguntaOpcion
    extra = 1  # Número de filas vacías para añadir nuevas
    fields = ('opcion', 'es_correcta', 'orden')
    autocomplete_fields = ['opcion']  # Si tienes muchos registros, mejora la búsqueda

@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ('numero', 'texto_resumido')
    search_fields = ('numero', 'texto')
    ordering = ('numero',)
    inlines = [PreguntaOpcionInline]

    def texto_resumido(self, obj):
        return obj.texto[:75] + '...' if len(obj.texto) > 75 else obj.texto
    texto_resumido.short_description = 'Texto'

@admin.register(Opcion)
class OpcionAdmin(admin.ModelAdmin):
    list_display = ('id', 'texto_resumido')
    search_fields = ('texto',)
    ordering = ('id',)

    def texto_resumido(self, obj):
        return obj.texto[:75] + '...' if len(obj.texto) > 75 else obj.texto
    texto_resumido.short_description = 'Texto'

@admin.register(PreguntaOpcion)
class PreguntaOpcionAdmin(admin.ModelAdmin):
    list_display = ('pregunta_numero', 'opcion_resumida', 'es_correcta', 'orden')
    list_filter = ('pregunta__numero', 'es_correcta')
    search_fields = ('pregunta__numero', 'opcion__texto')
    ordering = ('pregunta__numero', 'orden', 'id')

    def pregunta_numero(self, obj):
        return obj.pregunta.numero
    pregunta_numero.short_description = 'N° Pregunta'
    pregunta_numero.admin_order_field = 'pregunta__numero'

    def opcion_resumida(self, obj):
        return obj.opcion.texto[:50] + '...' if len(obj.opcion.texto) > 50 else obj.opcion.texto
    opcion_resumida.short_description = 'Opción'

@admin.register(TipoExamen)
class TipoExamenAdmin(admin.ModelAdmin):
    list_display = ('id', 'tipo')
    search_fields = ('tipo',)

@admin.register(ResultadoExamen)
class ResultadoExamenAdmin(admin.ModelAdmin):
    list_display = ('user', 'tipo_examen', 'calificacion', 'fecha_examen')
    list_filter = ('tipo_examen', 'fecha_examen')
    search_fields = ('user__username', 'tipo_examen__tipo')
    ordering = ('-fecha_examen',)