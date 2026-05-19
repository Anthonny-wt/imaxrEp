# 🎮 Guía de Conexión: Unity y Supabase

Esta guía documenta la forma moderna de conectar la aplicación de Realidad Mixta (Unity) con el CMS (Supabase). A diferencia del backend anterior, Unity se conectará directamente a la API REST nativa de Supabase o utilizará el SDK de Supabase para C#.

## 1. La Clase C# (Lo que Unity Recibe)

La estructura principal que tu aplicación Unity debe utilizar para deserializar los datos de los modelos ha cambiado. Ahora es mucho más directa y rápida:

```csharp
using System;

[Serializable]
public class ModelData
{
    public string id;              // UUID asignado por Supabase
    public string space_name;      // Nombre del espacio/modelo
    public string description;     // Descripción
    public string file_url;        // URL directa para descargar el .glb
    
    // Coordenadas espaciales incluidas en el mismo objeto
    public float pos_x;            
    public float pos_y;
    public float pos_z;
    
    public DateTime created_at;    // Fecha de creación
}
```

---

## 2. Consumo mediante API REST (Lo que Unity Envía/Recibe)

Supabase provee una API REST instantánea.
**URL Base de tu proyecto:** `https://<tu-id-de-proyecto>.supabase.co/rest/v1`

Todas las peticiones desde Unity necesitan incluir dos cabeceras (`Headers`):
- `apikey`: `<tu-anon-key-de-supabase>`
- `Authorization`: `Bearer <tu-anon-key-de-supabase>`

### 📥 Obtener todos los modelos (GET)

Unity solo necesita consultar la tabla `models`.

- **Endpoint:** `GET /rest/v1/models?select=*`
- **Lo que Unity envía:** (Solo los headers, sin body).
- **Lo que Unity recibe:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "space_name": "Sala de Reuniones",
    "description": "Entorno XR con mesa central",
    "file_url": "https://<tu-id>.supabase.co/storage/v1/object/public/glb_models/models/archivo.glb",
    "pos_x": 0.5,
    "pos_y": 1.2,
    "pos_z": -2.0,
    "created_at": "2024-05-19T10:00:00Z"
  }
]
```

### 📥 Obtener un solo modelo por ID (GET)

- **Endpoint:** `GET /rest/v1/models?id=eq.<id-del-modelo>&select=*`

### 📤 Subir o Modificar Coordenadas desde Unity (OPCIONAL)

Normalmente, el CMS web es el encargado de subir los archivos `.glb` y ajustar las coordenadas visualmente. Sin embargo, si Unity necesita actualizar las coordenadas (por ejemplo, si el usuario arrastra el modelo en Quest 3 y quiere guardar su nueva posición), usarás un `PATCH`.

- **Endpoint:** `PATCH /rest/v1/models?id=eq.<id-del-modelo>`
- **Lo que Unity envía (Body JSON):**
```json
{
  "pos_x": 1.5,
  "pos_y": 2.0,
  "pos_z": -1.5
}
```

---

## 3. Descarga Directa del Modelo 3D (`.glb`)

La columna `file_url` contiene la ruta completa y pública hacia el modelo 3D. 
En Unity, puedes pasar este string directamente a tu script de carga de modelos (por ejemplo, usando [GLTFast](https://github.com/atteneder/glTFast)):

```csharp
var gltf = new GltfImport();
bool success = await gltf.Load(modelData.file_url);
if (success) {
    gltf.InstantiateMainScene(transform);
}
```

No necesitas autenticación adicional para descargar el modelo `.glb`, ya que el bucket `glb_models` debe estar configurado como **Público** en Supabase.
