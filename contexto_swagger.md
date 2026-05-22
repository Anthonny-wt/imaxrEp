# Contexto de la API (Swagger) y Base de Datos para Unity

Este documento describe la estructura de la API REST documentada en Swagger, la estructura de la base de datos subyacente (Supabase) y todo lo necesario para integrar y consumir estos servicios desde **Unity**.

---

## 1. ¿De qué trata el Swagger?

El Swagger (especificado en `lib/swagger-spec.ts`) documenta nuestra **API Proxy en Next.js** para la plataforma **EduXR CMS**. 

Su propósito principal es servir de guía para los desarrolladores de **Unity** (u otros clientes), indicando exactamente qué endpoints (URLs) están disponibles, qué datos deben enviar y qué respuestas van a recibir para interactuar con los modelos 3D y el sistema de autenticación. Hemos construido una API REST estándar (`/api/models`) para ocultar la sintaxis nativa de PostgREST y hacerla más amigable.

---

## 2. Notas sobre el Visor Swagger UI (Advertencias en Consola)

Si al navegar a la página de documentación (`/api-docs`) abres la consola de desarrollador del navegador, es posible que observes una advertencia como la siguiente:

> `Warning: Using UNSAFE_componentWillReceiveProps in strict mode is not recommended... Please update the following components: ModelCollapse`

**¿Qué significa esto y cómo afecta?**
- **No es un error de tu código:** El componente `ModelCollapse` mencionado en el error NO es parte de tu código, sino que pertenece a la librería de terceros `swagger-ui-react`.
- **Por qué ocurre:** Estás utilizando Next.js 15 y React 19 con el Modo Estricto (`StrictMode`) activado. La librería de Swagger UI aún contiene métodos antiguos del ciclo de vida de React que la versión 19 considera "inseguros".
- **Impacto:** Ninguno. Es solo un *warning* en modo de desarrollo. En producción esto no afectará en nada a tu aplicación. Solo desaparecerá cuando los desarrolladores del paquete `swagger-ui-react` lancen una actualización oficial para React 19.

---

## 3. Estructura de la Base de Datos

La base de datos principal consta de la tabla `models`, que almacena la información de los entornos y modelos XR.

### Tabla: `models`
| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| **`id`** | `UUID` (String) | Identificador único del modelo. |
| **`user_id`** | `UUID` | ID del usuario creador (Obligatorio - se asigna automáticamente en la API). |
| **`space_name`** | `String` | Nombre del espacio o modelo. |
| **`description`** | `String` | Descripción detallada del modelo. |
| **`file_url`** | `String` | URL pública donde está alojado el archivo `.glb` (en Supabase Storage). |
| **`pos_x`, `pos_y`, `pos_z`** | `Float` | Coordenadas del modelo en el espacio 3D. |
| **`is_active`** | `Boolean` | Indica si el modelo está activo o visible. |
| **`created_at`** | `DateTime` | Fecha y hora de creación del registro. |

---

## 4. Conexión desde Unity (Lo necesario)

Para conectar Unity a esta base de datos a través de la API REST:

### A. URL Base y Cabeceras (Headers)
- **URL Base:** `https://TU-PROYECTO.vercel.app` o `http://localhost:3000` (En desarrollo).
- **Headers Obligatorios en peticiones POST/PUT:**
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <TOKEN>` (Obtenido en el Login).

### B. Endpoints de Modelos (`/api/models`)

#### 1. Obtener todos los modelos
- **Endpoint:** `GET /api/models`
- **Uso en Unity:** Descarga el JSON con el array de modelos y sus coordenadas.

#### 2. Actualizar la posición de un modelo (Desde Unity)
- **Endpoint:** `PUT /api/models/{id}`
- **Body (JSON):**
  ```json
  {
    "space_name": "Nombre actual",
    "file_url": "URL actual",
    "pos_x": 2.5,
    "pos_y": 1.0,
    "pos_z": -1.0
  }
  ```

#### 3. Crear un nuevo modelo
- **Endpoint:** `POST /api/models`
- **Nota Importante:** El servidor Next.js se encargará de extraer tu `user_id` desde el token de acceso (`Bearer`) y lo inyectará en la base de datos automáticamente para evitar errores de restricción (Not-Null).
