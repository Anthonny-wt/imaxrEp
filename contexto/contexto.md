# IMAXR / EduXR CMS — Contexto completo del proyecto

Documento maestro de referencia para desarrollo, integración con Unity y despliegue. Consolida la información del código fuente y los archivos previos en `contexto/`.

---

## 1. Resumen del proyecto

| Aspecto | Detalle |
|--------|---------|
| **Nombre del paquete** | `eduxr-cms` |
| **Marca pública** | **IMAXR** (landing) |
| **Panel interno** | **EduXR CMS** |
| **Propósito** | CMS web para gestionar modelos 3D (`.glb`) usados en experiencias XR/Unity: subir entornos, previsualizarlos en 3D y definir coordenadas espaciales (`pos_x`, `pos_y`, `pos_z`) que Unity consume en tiempo de ejecución |
| **Equipo / origen** | Equipo XR & AI en Huancayo, Perú |
| **Sitio relacionado** | [https://imaxr.netlify.app/](https://imaxr.netlify.app/) |
| **Backend legacy (referencia)** | API .NET en `eduxr.somee.com` — **reemplazada por Supabase** en esta versión del CMS |

---

## 2. Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | **Next.js 16** (App Router) |
| UI | **React 19**, **Tailwind CSS 4** |
| Gestor de paquetes | **pnpm** |
| Auth + DB + Storage | **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) |
| 3D en web | **Three.js**, **@react-three/fiber**, **@react-three/drei** |
| Formularios / upload | **react-hook-form**, **react-dropzone** |
| Iconos | **lucide-react** |
| API docs UI | **swagger-ui-react** + spec en `lib/swagger-spec.ts` |
| Tipografía | **Geist** (next/font) |

---

## 3. Estructura del repositorio

```
imaxrEp/
├── app/                          # App Router (páginas)
│   ├── page.tsx                  # Landing IMAXR
│   ├── layout.tsx                # Layout raíz (metadata EduXR CMS)
│   ├── globals.css
│   ├── login/page.tsx            # Login Supabase
│   ├── api-docs/page.tsx         # Swagger UI para Unity
│   └── dashboard/
│       ├── layout.tsx            # Shell con Layout.tsx
│       ├── page.tsx              # Lista de modelos
│       ├── upload/page.tsx       # Subida de .glb
│       └── model/[id]/page.tsx   # Editor espacial 3D
├── components/
│   ├── landing/Hero3D.tsx        # Fondo de partículas 3D
│   ├── ui/Layout.tsx             # Header dashboard + logout
│   ├── ModelCard.tsx             # Tarjeta con preview 3D + CRUD
│   ├── UploadForm.tsx            # Drag & drop .glb → Storage + DB
│   └── SpatialEditor.tsx         # Visor + sliders X/Y/Z
├── utils/supabase/
│   ├── client.ts                 # Cliente browser
│   ├── server.ts                 # Cliente server (cookies)
│   └── middleware.ts             # Sesión + protección rutas
├── lib/swagger-spec.ts           # OpenAPI para /api-docs
├── proxy.ts                      # Proxy de sesión (equiv. middleware Next 16)
├── contexto/                     # Documentación del proyecto
│   ├── contexto.md               # Este archivo
│   ├── proyecto.md
│   ├── LEVANTAR_SERVICIO.md
│   ├── CONEXION_UNITY.md
│   └── endppoint.md              # API legacy EduXR (.NET)
├── test_supabase.js              # Script de prueba RLS (no commitear keys)
├── package.json
└── next.config.ts
```

---

## 4. Rutas y flujos de la aplicación

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing IMAXR con Hero 3D, features, enlaces a API Docs y Login |
| `/login` | Público (redirige si ya hay sesión) | `signInWithPassword` → `/dashboard` |
| `/dashboard` | **Autenticado** | Grid de `ModelCard` con modelos de Supabase |
| `/dashboard/upload` | **Autenticado** | Formulario: nombre, descripción, archivo `.glb` |
| `/dashboard/model/[id]` | **Autenticado** | `SpatialEditor`: preview GLB + guardar `pos_x/y/z` |
| `/api-docs` | Público | Swagger UI con spec Supabase REST |

### Protección de rutas

- `utils/supabase/middleware.ts` → función `updateSession`
- Invocada desde `proxy.ts` con matcher que excluye estáticos e imágenes
- Sin usuario en rutas `/dashboard/*` → redirect a `/login`
- Usuario autenticado en `/login` → redirect a `/dashboard`

---

## 5. Variables de entorno

Crear `.env.local` en la raíz (no subir a Git):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu_proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu_anon_key>
```

> El proyecto documenta `.env.local.example` en `LEVANTAR_SERVICIO.md`; si no existe en el repo, usar el bloque anterior.

---

## 6. Supabase — Base de datos, storage y auth

### 6.1 Tabla `models`

| Columna | Tipo | Uso |
|---------|------|-----|
| `id` | `uuid` | PK |
| `space_name` | `text` | Nombre del espacio/modelo |
| `description` | `text` | Descripción opcional |
| `file_url` | `text` | URL pública del `.glb` en Storage |
| `pos_x` | `numeric` | Posición X (default `0`) |
| `pos_y` | `numeric` | Posición Y (default `0`) |
| `pos_z` | `numeric` | Posición Z (default `0`) |
| `created_at` | `timestamptz` | Fecha de creación |
| `user_id` | `uuid` | Usuario que subió el modelo (insert en `UploadForm`) |
| `is_active` | `boolean` | Activo/inactivo (toggle en `ModelCard`; opcional en registros viejos) |

### 6.2 Storage

- **Bucket:** `glb_models`
- **Público:** sí (Unity y el visor web leen `file_url` sin auth extra)
- **Ruta de subida:** `models/<nombre_aleatorio>_<timestamp>.glb`
- **Políticas RLS:** permitir `INSERT` y `SELECT` a usuarios autenticados (y lectura pública del objeto según configuración del bucket)

### 6.3 Autenticación

- Método: **Email / Password** (Supabase Auth)
- Crear al menos un usuario admin en el panel de Supabase → Authentication

### 6.4 Flujo de subida (CMS)

1. Usuario autenticado arrastra/selecciona `.glb`
2. `supabase.storage.from('glb_models').upload(...)`
3. `getPublicUrl(filePath)` → `file_url`
4. `insert` en `models` con `space_name`, `description`, coords en 0, `user_id`

### 6.5 Flujo del editor espacial

1. Server Component carga modelo por `id`
2. `SpatialEditor` renderiza GLB con `@react-three/drei` (`useGLTF`)
3. Sliders/inputs X, Y, Z (-10 … 10, paso 0.1)
4. `update` en `models` al guardar coordenadas

---

## 7. Integración con Unity

Unity **no usa** el backend .NET legacy; se conecta a la **REST API de Supabase**.

### 7.1 URL base

```
https://<tu_proyecto>.supabase.co/rest/v1
```

### 7.2 Headers obligatorios

```
apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>
Authorization: Bearer <anon_key_o_access_token>
```

Para datos protegidos por RLS, usar el `access_token` del login (`/auth/v1/token?grant_type=password`).

### 7.3 Clase C# de referencia

```csharp
[Serializable]
public class ModelData
{
    public string id;
    public string space_name;
    public string description;
    public string file_url;
    public float pos_x;
    public float pos_y;
    public float pos_z;
    public DateTime created_at;
    public bool? is_active;
}
```

### 7.4 Endpoints principales

| Acción | Método | Endpoint |
|--------|--------|----------|
| Listar modelos | GET | `/rest/v1/models?select=*` |
| Filtrar por ID | GET | `/rest/v1/models?id=eq.<uuid>&select=*` |
| Solo activos (ejemplo) | GET | `/rest/v1/models?is_active=eq.true&select=*` |
| Actualizar posición | PATCH | `/rest/v1/models?id=eq.<uuid>` body: `{ pos_x, pos_y, pos_z }` |
| Login | POST | `/auth/v1/token?grant_type=password` body: `{ email, password }` |

### 7.5 Carga del GLB en Unity

Usar `file_url` directamente (bucket público), por ejemplo con **GLTFast**:

```csharp
var gltf = new GltfImport();
bool success = await gltf.Load(modelData.file_url);
if (success) gltf.InstantiateMainScene(transform);
```

Documentación ampliada: ver `CONEXION_UNITY.md` y `/api-docs` en el CMS.

---

## 8. API legacy (solo referencia histórica)

El archivo `endppoint.md` describe la API **antigua** en `http://www.eduxr.somee.com` (usuarios, modelos, `ModelMoreData`, texturas, compartir modelos, etc.).

**Mapeo conceptual → Supabase actual:**

| Legacy | Actual |
|--------|--------|
| `spacename`, `urlmodel` | `space_name`, `file_url` |
| `ModelMoreData` (posición en tabla aparte) | `pos_x`, `pos_y`, `pos_z` en `models` |
| `iduser` | `user_id` + Supabase Auth |
| Subida de texturas / API TextureFiles | No implementado en este CMS (solo `.glb`) |
| Compartir modelos entre usuarios | No implementado aún |

Swagger externo legacy: [imaxr-backend en Vercel](https://imaxr-backend-adriands-projects-45ef5f98.vercel.app/docs) (si sigue activo).

---

## 9. Componentes clave (comportamiento)

| Componente | Responsabilidad |
|------------|-----------------|
| `Hero3D` | Canvas con nube de puntos (`maath/random`) |
| `UploadForm` | Dropzone solo `.glb`, upload Storage + insert DB |
| `ModelCard` | Mini visor 3D rotatorio, activar/desactivar, eliminar, ir al editor |
| `SpatialEditor` | Canvas grande + controles de posición + guardar en Supabase |
| `Layout` | Navbar dashboard, cerrar sesión |
| `swagger-spec.ts` | Spec OpenAPI embebida para desarrolladores Unity |

---

## 10. Comandos de desarrollo y despliegue

### Requisitos

- Node.js **20+**
- **pnpm** (`corepack enable pnpm` o `npm i -g pnpm`)
- Proyecto Supabase configurado

### Local

```bash
pnpm install
pnpm dev
```

App en **http://localhost:3000**

### Producción

```bash
pnpm build
pnpm start
```

Despliegue típico: **Vercel** o **Netlify** (variables `NEXT_PUBLIC_SUPABASE_*` en el panel del host).

---

## 11. Scripts npm

| Script | Comando |
|--------|---------|
| Desarrollo | `pnpm dev` |
| Build | `pnpm build` |
| Producción | `pnpm start` |
| Lint | `pnpm lint` |

---

## 12. Decisiones de arquitectura

1. **Supabase como BaaS único** — Auth, Postgres, Storage y REST sin servidor .NET intermedio.
2. **Coordenadas en la misma fila del modelo** — Simplifica Unity y el editor web (antes `ModelMoreData` separado).
3. **Bucket GLB público** — Descarga directa desde Quest/Unity sin firmar URLs.
4. **Server + Client Components** — Lectura en servidor (`createClient` server), mutaciones en cliente (`UploadForm`, `SpatialEditor`, `ModelCard`).
5. **`proxy.ts`** — Refresco de sesión Supabase en cada request (patrón Next.js reciente).

---

## 13. Seguridad y buenas prácticas

- No commitear `.env.local` ni claves en `test_supabase.js` (mover credenciales a variables de entorno).
- Configurar **RLS** en `models` y políticas del bucket según quién puede leer/escribir.
- El anon key es público en el cliente; la seguridad depende de **RLS** y políticas de Storage.
- Rotar keys si alguna quedó expuesta en el repositorio.

---

## 14. Pendientes / mejoras posibles

- [ ] Eliminar archivo del Storage al borrar un modelo en `ModelCard`
- [ ] Filtrar dashboard por `user_id` del usuario logueado
- [ ] Registro de usuarios desde el CMS (solo login hoy)
- [ ] Compartir modelos entre usuarios (existía en API legacy)
- [ ] Soporte de texturas (`urltexture` legacy)
- [ ] Alinear `params` async en `model/[id]/page.tsx` con convención Next.js 15+
- [ ] Añadir `.env.local.example` en la raíz si falta

---

## 15. Índice de documentación en `contexto/`

| Archivo | Contenido |
|---------|-----------|
| **contexto.md** | Este documento (visión global) |
| `proyecto.md` | Resumen corto stack + esquema DB |
| `LEVANTAR_SERVICIO.md` | Guía paso a paso para levantar el servicio |
| `CONEXION_UNITY.md` | Guía detallada Unity ↔ Supabase |
| `endppoint.md` | Endpoints API .NET legacy (referencia) |

---

*Última actualización: mayo 2026 — generado a partir del análisis del código fuente del repositorio.*
