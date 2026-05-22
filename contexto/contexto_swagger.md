# Contexto de la API (Swagger) y Base de Datos para Unity

Este documento describe la estructura de la API REST documentada en Swagger, la estructura de la base de datos subyacente (Supabase) y todo lo necesario para integrar y consumir estos servicios desde **Unity**.

---

## 1. ¿De qué trata el Swagger?

El Swagger (especificado en `lib/swagger-spec.ts`) documenta la **API REST generada automáticamente por Supabase** para la plataforma **EduXR CMS**. 

Su propósito principal es servir de guía para los desarrolladores de **Unity** (u otros clientes), indicando exactamente qué endpoints (URLs) están disponibles, qué datos deben enviar y qué respuestas van a recibir para interactuar con los modelos 3D y el sistema de autenticación.

La API cubre principalmente dos áreas:
1. **Modelos 3D:** Obtener, crear y actualizar información de los modelos y sus posiciones en el espacio.
2. **Autenticación:** Iniciar sesión para obtener un token de acceso seguro.

---

## 2. Estructura de la Base de Datos

De acuerdo a la especificación, la base de datos principal consta de una tabla (probablemente llamada `models`), que almacena la información de los entornos y modelos XR.

### Tabla: `models`
| Campo | Tipo de Dato | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| **`id`** | `UUID` (String) | Identificador único del modelo. | `d290f1ee-6c54-4b01-90e6-d701748f0851` |
| **`space_name`** | `String` | Nombre del espacio o modelo. | `"Sala de Anatomía"` |
| **`description`** | `String` | Descripción detallada del modelo. | `"Modelo interactivo del corazón..."` |
| **`file_url`** | `String` | URL pública donde está alojado el archivo `.glb` (en Supabase Storage). | `"https://.../corazon.glb"` |
| **`pos_x`** | `Float` (Number)| Coordenada X del modelo en el espacio 3D. | `1.5` |
| **`pos_y`** | `Float` (Number)| Coordenada Y del modelo en el espacio 3D. | `0.0` |
| **`pos_z`** | `Float` (Number)| Coordenada Z del modelo en el espacio 3D. | `-2.5` |
| **`created_at`** | `DateTime` | Fecha y hora de creación del registro. | `"2026-05-22T10:00:00Z"` |

---

## 3. Conexión desde Unity (Lo necesario)

Para conectar Unity a esta base de datos a través de la API REST, necesitas tener en cuenta 3 aspectos clave: **URL Base**, **Autenticación/Cabeceras (Headers)** y los **Endpoints**.

### A. URL Base y Credenciales
Necesitarás en Unity variables para la URL de tu proyecto y la clave pública (Anon Key).
- **URL Base:** `https://TU-PROYECTO.supabase.co`
- **Headers Obligatorios en TODAS las peticiones:**
  - `apikey`: `<TU_SUPABASE_ANON_KEY>`
  - `Authorization`: `Bearer <TOKEN>` (Depende del endpoint, ver abajo).
  - `Content-Type`: `application/json` (para peticiones POST/PATCH).

### B. Flujo de Autenticación (Login)
Antes de modificar datos, Unity necesita iniciar sesión.

- **Endpoint:** `POST /auth/v1/token?grant_type=password`
- **Headers:** 
  - `apikey`: `<anon_key>`
- **Body (JSON):**
  ```json
  {
    "email": "admin@imaxr.com",
    "password": "mi_password_secreto"
  }
  ```
- **Respuesta:** Obtendrás un JSON con un `access_token`. **Este token debes guardarlo en memoria en Unity**. A partir de ahora, todas las peticiones seguras llevarán el header:
  `Authorization: Bearer <access_token>`

### C. Endpoints para los Modelos 3D (Tabla `models`)

#### 1. Obtener todos los modelos (Para cargar en la escena)
- **Endpoint:** `GET /rest/v1/models?select=*`
- **Headers:** `apikey: <anon_key>`, `Authorization: Bearer <access_token>` o `<anon_key>` (si es acceso público).
- **Uso en Unity:** Unity descarga este JSON, lo procesa, e instancia los modelos usando las URLs (`file_url`) y los posiciona usando `pos_x`, `pos_y`, `pos_z`.

#### 2. Actualizar la posición de un modelo (Desde Unity al servidor)
Si el usuario en Unity mueve un modelo, Unity debe avisar a la base de datos de la nueva posición.
- **Endpoint:** `PATCH /rest/v1/models?id=eq.<ID_DEL_MODELO>` (¡Ojo al `id=eq.` en la URL!)
- **Headers:** `apikey: <anon_key>`, `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "pos_x": 2.5,
    "pos_y": 1.0,
    "pos_z": -1.0
  }
  ```

#### 3. Crear un nuevo modelo
Generalmente esto se hace desde la web CMS, pero si Unity necesita subir un registro:
- **Endpoint:** `POST /rest/v1/models`
- **Headers:** `apikey: <anon_key>`, `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "space_name": "Nuevo Espacio",
    "description": "Descripción",
    "file_url": "https://...",
    "pos_x": 0,
    "pos_y": 0,
    "pos_z": 0
  }
  ```

---

## 4. Consejos para el desarrollador de Unity (C#)

Para consumir esto en Unity, se recomienda usar `UnityWebRequest`. 
Ejemplo rápido de un GET para obtener modelos en C#:

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class SupabaseManager : MonoBehaviour
{
    private string baseUrl = "https://TU-PROYECTO.supabase.co";
    private string apiKey = "TU_ANON_KEY";
    private string accessToken = "TOKEN_OBTENIDO_EN_LOGIN";

    public IEnumerator GetModels()
    {
        string url = baseUrl + "/rest/v1/models?select=*";
        using (UnityWebRequest webRequest = UnityWebRequest.Get(url))
        {
            webRequest.SetRequestHeader("apikey", apiKey);
            webRequest.SetRequestHeader("Authorization", "Bearer " + accessToken);

            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.ConnectionError || webRequest.result == UnityWebRequest.Result.ProtocolError)
            {
                Debug.LogError("Error: " + webRequest.error);
            }
            else
            {
                Debug.Log("Modelos: " + webRequest.downloadHandler.text);
                // Aquí debes parsear el JSON y spawnear tus GameObjects
            }
        }
    }
}
```
