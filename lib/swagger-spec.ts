export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EduXR CMS API (Supabase REST)',
    version: '1.0.0',
    description: 'Documentación de los endpoints REST generados automáticamente por Supabase para la plataforma EduXR. **Importante para Unity:** Debes enviar los headers `apikey` y `Authorization: Bearer <token>` en todas las peticiones.',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1` : 'https://TU-PROYECTO.supabase.co/rest/v1',
      description: 'API Principal (Supabase)',
    },
  ],
  paths: {
    '/models': {
      get: {
        summary: 'Obtener todos los modelos 3D',
        description: 'Devuelve un arreglo con todos los entornos y modelos XR disponibles. En Unity, puedes anexar `?select=*` a la URL.',
        tags: ['Modelos'],
        parameters: [
          {
            name: 'id',
            in: 'query',
            description: 'Filtrar por ID (Ej: `eq.123e4567-e89b-12d3-a456-426614174000`)',
            required: false,
            schema: { type: 'string' }
          },
          {
            name: 'select',
            in: 'query',
            description: 'Campos a seleccionar (Ej: `*`)',
            required: false,
            schema: { type: 'string', default: '*' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de modelos obtenida exitosamente.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ModelData'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Crear un nuevo modelo',
        description: 'Sube un nuevo registro de modelo. Normalmente esto se hace desde el CMS Web, no desde Unity.',
        tags: ['Modelos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ModelDataInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Modelo creado'
          }
        }
      },
      patch: {
        summary: 'Actualizar un modelo existente',
        description: 'Útil si desde Unity necesitas guardar una nueva coordenada para el modelo. Usa el parámetro `id=eq.<id>` en la query string para apuntar al modelo exacto.',
        tags: ['Modelos'],
        parameters: [
          {
            name: 'id',
            in: 'query',
            description: 'ID del modelo a actualizar (Ej: `eq.123e...`)',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  pos_x: { type: 'number' },
                  pos_y: { type: 'number' },
                  pos_z: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          '204': {
            description: 'Modelo actualizado exitosamente'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ModelData: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' },
          space_name: { type: 'string', example: 'Sala de Anatomía' },
          description: { type: 'string', example: 'Modelo interactivo del corazón humano' },
          file_url: { type: 'string', example: 'https://xxx.supabase.co/storage/v1/object/public/glb_models/models/corazon.glb' },
          pos_x: { type: 'number', example: 1.5 },
          pos_y: { type: 'number', example: 0.0 },
          pos_z: { type: 'number', example: -2.5 },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      ModelDataInput: {
        type: 'object',
        required: ['space_name', 'file_url'],
        properties: {
          space_name: { type: 'string' },
          description: { type: 'string' },
          file_url: { type: 'string' },
          pos_x: { type: 'number', default: 0 },
          pos_y: { type: 'number', default: 0 },
          pos_z: { type: 'number', default: 0 }
        }
      }
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'apikey'
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    }
  },
  security: [
    { ApiKeyAuth: [] },
    { BearerAuth: [] }
  ]
}
