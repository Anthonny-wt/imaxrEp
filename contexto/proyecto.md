# EduXR CMS - Contexto del Proyecto

Este directorio contiene la documentación técnica y contextual de la plataforma EduXR CMS.

## Stack Tecnológico
- **Framework**: Next.js (App Router)
- **Gestor de Paquetes**: pnpm
- **Estilos**: Tailwind CSS
- **Autenticación y Backend**: Supabase
- **Renderizado 3D**: @react-three/fiber y @react-three/drei

## Estructura de Base de Datos (Supabase)
### Tabla: `models`
- `id` (uuid, primary key)
- `space_name` (text)
- `description` (text)
- `file_url` (text) - URL pública del archivo `.glb` en el storage
- `pos_x` (numeric, default 0)
- `pos_y` (numeric, default 0)
- `pos_z` (numeric, default 0)
- `created_at` (timestamp)

*Nota: Por simplicidad, unificaremos los campos de transformación espacial en la misma tabla de modelos.*

### Storage Bucket
- `glb_models`: Para almacenar los archivos 3D de forma pública.


