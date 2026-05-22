export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EduXR CMS API',
    version: '1.0.0',
    description: 'Documentación de los endpoints REST de la plataforma EduXR (Next.js Proxy API).',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      description: 'Servidor API',
    },
  ],
  paths: {
    '/api/models': {
      get: {
        summary: 'Obtener todos los modelos 3D',
        description: 'Devuelve un array con todos los entornos y modelos XR disponibles.',
        tags: ['Models'],
        responses: {
          '200': {
            description: 'Lista de modelos obtenida exitosamente.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Model'
                  }
                }
              }
            }
          },
          '500': {
            description: 'Error interno del servidor.'
          }
        }
      },
      post: {
        summary: 'Crear un nuevo modelo',
        description: 'Crea un nuevo registro de modelo en la base de datos.',
        tags: ['Models'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ModelInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Modelo creado exitosamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Model'
                }
              }
            }
          },
          '400': {
            description: 'Datos inválidos o campos faltantes.'
          },
          '500': {
            description: 'Error interno del servidor.'
          }
        }
      }
    },
    '/api/models/{id}': {
      get: {
        summary: 'Obtener un modelo por ID',
        description: 'Devuelve un solo objeto modelo dado su UUID.',
        tags: ['Models'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'UUID del modelo',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'Modelo encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Model'
                }
              }
            }
          },
          '404': {
            description: 'Modelo no encontrado.'
          },
          '500': {
            description: 'Error interno del servidor.'
          }
        }
      },
      put: {
        summary: 'Actualizar un modelo',
        description: 'Actualiza un modelo existente dado su UUID.',
        tags: ['Models'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'UUID del modelo a actualizar',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ModelInput'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Modelo actualizado exitosamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Model'
                }
              }
            }
          },
          '400': {
            description: 'Datos inválidos o campos faltantes.'
          },
          '404': {
            description: 'Modelo no encontrado.'
          },
          '500': {
            description: 'Error interno del servidor.'
          }
        }
      },
      delete: {
        summary: 'Eliminar un modelo',
        description: 'Elimina un modelo y devuelve un mensaje de éxito.',
        tags: ['Models'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'UUID del modelo a eliminar',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'Modelo eliminado exitosamente.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Modelo no encontrado.'
          },
          '500': {
            description: 'Error interno del servidor.'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Model: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' },
          space_name: { type: 'string', example: 'Sala de Anatomía' },
          description: { type: 'string', nullable: true, example: 'Modelo interactivo del corazón humano' },
          file_url: { type: 'string', example: 'https://xxx.supabase.co/storage/v1/object/public/glb_models/models/corazon.glb' },
          pos_x: { type: 'number', format: 'float', example: 1.5 },
          pos_y: { type: 'number', format: 'float', example: 0.0 },
          pos_z: { type: 'number', format: 'float', example: -2.5 },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      ModelInput: {
        type: 'object',
        required: ['space_name', 'file_url', 'pos_x', 'pos_y', 'pos_z'],
        properties: {
          space_name: { type: 'string' },
          description: { type: 'string' },
          file_url: { type: 'string' },
          pos_x: { type: 'number', format: 'float' },
          pos_y: { type: 'number', format: 'float' },
          pos_z: { type: 'number', format: 'float' }
        }
      }
    }
  }
}
