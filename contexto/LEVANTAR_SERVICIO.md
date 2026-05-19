# 🚀 EduXR CMS - Guía para Levantar el Servicio

Este documento describe los pasos necesarios y las consideraciones clave para ejecutar el panel de control EduXR CMS en un entorno local y de producción.

## 📌 Requisitos Previos

1. **Node.js**: Se recomienda la versión `20.x` o superior.
2. **Gestor de paquetes**: El proyecto está configurado para usar **pnpm** (recomendado sobre npm para evitar problemas de dependencias y vulnerabilidades).
   - *Si no tienes pnpm, instálalo con:* `npm install -g pnpm` o actívalo con `corepack enable pnpm`
3. **Cuenta de Supabase**: Necesitarás las credenciales de un proyecto de Supabase (URL y Anon Key).

---

## 🛠️ Configuración del Entorno (Variables)

Antes de levantar el proyecto, debes configurar las variables de entorno. 
1. Busca el archivo `.env.local.example` en la raíz del proyecto.
2. Cópialo o renómbralo como `.env.local`.
3. Edita los valores para conectarte a tu instancia de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu_id_de_proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...<tu_anon_key>
```

> **⚠️ Importante:** ¡Nunca subas el archivo `.env.local` a GitHub! Está excluido en el `.gitignore` por defecto.

---

## 💻 Instalación y Ejecución

Para iniciar el proyecto en tu máquina local, abre la terminal en la raíz del proyecto y ejecuta:

1. **Instalar dependencias:**
   ```bash
   npx pnpm install
   ```

2. **Levantar el servidor en modo desarrollo:**
   ```bash
   npx pnpm run dev
   ```

3. El servicio estará disponible en **[http://localhost:3000](http://localhost:3000)**.

---

## 📦 Base de Datos y Storage en Supabase

Para que el CMS funcione correctamente, asegúrate de que tu proyecto de Supabase cuenta con lo siguiente:

### 1. Storage (Almacenamiento de Archivos)
- Crea un bucket (Storage) llamado **`glb_models`**.
- El bucket **debe ser público** para que Unity y `@react-three/fiber` puedan acceder directamente a las URL de los modelos `.glb`.
- Asegúrate de configurar las **Políticas (RLS)** del bucket para permitir "Insert" y "Select" a usuarios autenticados.

### 2. Tabla de Datos (`models`)
La aplicación espera interactuar con una tabla llamada `models` estructurada de la siguiente forma:

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Llave primaria (generada automáticamente) |
| `space_name` | `text` | Nombre asignado al espacio/modelo |
| `description` | `text` | Breve descripción opcional |
| `file_url` | `text` | URL pública del archivo `.glb` en el bucket |
| `pos_x` | `numeric` | Coordenada X (defecto `0`) |
| `pos_y` | `numeric` | Coordenada Y (defecto `0`) |
| `pos_z` | `numeric` | Coordenada Z (defecto `0`) |
| `created_at` | `timestamp`| Fecha de creación (generada automáticamente) |

### 3. Autenticación (Auth)
- El panel requiere iniciar sesión para acceder al `/dashboard`.
- Ve a Supabase -> Authentication y crea al menos un usuario administrador usando el método de `Email/Password`.

---

## 🏗️ Construcción para Producción

Cuando estés listo para desplegar (ej. en Vercel, Netlify o un VPS):

```bash
npx pnpm run build
```
Esto generará una versión optimizada de la aplicación. Luego puedes iniciarla con:
```bash
npx pnpm run start
```
