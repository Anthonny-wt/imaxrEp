
**Sitio Web:** [https://imaxr.netlify.app/](https://imaxr.netlify.app/)  
**Swagger:** [https://imaxr-backend-adriands-projects-45ef5f98.vercel.app/docs](https://imaxr-backend-adriands-projects-45ef5f98.vercel.app/docs)

---

## Servicio de Autenticación
* **Método:** POST
* **Url:** *(No especificada)*

**Datos de envío:**
Code output
File generated successfully.

```json
{
    "email": "abc@email.com",
    "password": "abc123$$"
}
Datos de respuesta satisfactoria:

JSON
{
    "iduser": 100,
    "username": "Paco Paco",
    "email": "abc@email.com",
    "state": true
}
Servicio registrar usuario
Método: POST

Url: (No especificada)

Datos de envío:

JSON
{
    "username": "Paco Paco",
    "email": "abc@email.com",
    "password": "abc123$$",
    "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
    "state": true,
    "hashKey": ""
}
Datos de respuesta satisfactoria:

JSON
{
    "iduser": 100
}
Servicio obtener usuario
Método: GET

Url: (No especificada)

Datos de envío:

JSON
{
    "iduser": 3
}
Datos de respuesta satisfactoria:

JSON
{
    "iduser": 100,
    "username": "Paco Paco",
    "email": "abc@email.com",   
    "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
    "state": true
}
Servicio actualizar datos usuario
Método: PUT

Url: (No especificada)

Datos de envío:

JSON
{
    "iduser": 100,
    "username": "Paco Paco",
    "email": "abc@email.com",
    "password": "abc123$$"
}
Datos de respuesta satisfactoria:

JSON
True
Servicio eliminar usuario
Método: POST

Url: (No especificada)

Datos de envío:

JSON
{
    "iduser": 100
}
Datos de respuesta satisfactoria:

JSON
{
    "iduser": 100,
    "state": false
}
Servicio crear modelos 3d
Método: POST

Url: (No especificada)

Datos de envío (Tabla Nueva):

JSON
{
    "iduser": 100,
    "spacename": "Modelo 3d 100",
    "description": "Modelo 3d de prueba 100",
    "urlmodel": "https://",
    "urltexture": "https://",
    "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
    "state": true
}
Datos de respuesta satisfactoria:

JSON
{
    "idmodel": 200
}
Servicio obtener modelo 3d
Método: GET

Url: (No especificada)

Datos de envío:

JSON
{
    "idmodel": 200
}
Datos de respuesta satisfactoria:

JSON
{
    "idmodel": 200,
    "iduser": 100,
    "spacename": "Modelo 3d 200",
    "description": "Modelo 3d de prueba 200",
    "urlmodel": "https://",
    "urltexture": "https://",
    "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
    "state": true
}
Servicio obtener todos los modelos 3d por usuario
Método: GET

Url: (No especificada)

Datos de envío:

JSON
{
    "iduser": 100
}
Datos de respuesta satisfactoria:

JSON
{
    "models": [  
        {
            "idmodel": 200,
            "iduser": 100,
            "spacename": "Modelo 3d 200",
            "description": "Modelo 3d de prueba 200",
            "urlmodel": "https://",
            "urltexture": "https://",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "idmodel": 201,
            "iduser": 100,
            "spacename": "Modelo 3d 201",
            "description": "Modelo 3d de prueba 201",
            "urlmodel": "https://",
            "urltexture": "https://",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "idmodel": 202,
            "iduser": 100,
            "spacename": "Modelo 3d 202",
            "description": "Modelo 3d de prueba 202",
            "urlmodel": "https://",
            "urltexture": "https://",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        }
    ]
}
Servicio actualizar información modelo 3d
Método: PUT

Url: http://www.eduxr.somee.com/api/Model/Actualizar

Datos de envío:

JSON
{
    "idmodel": 201,
    "iduser": 100,
    "spacename": "Modelo 3d 201",
    "description": "Modelo 3d de prueba 201"
}
Datos de respuesta satisfactoria:

JSON
True
Servicio eliminar modelo 3d
Método: DELETE

Url: http://www.eduxr.somee.com/api/Model/EliminarModelo

Datos de envío:

JSON
{
    "idmodel": 200
}
Datos de respuesta satisfactoria:

JSON
{
    "idmodel": 200,
    "state": false
}
Servicio crear información adicional del modelo 3d
Método: POST

Url: http://www.eduxr.somee.com/api/ModelMoreData/Registrar

Datos de envío:

JSON
{
    "idmodel": 200,
    "description": "Modelo 3d información adicional añadida de prueba 100",
    "image": "",
    "positionAxisX": "",
    "positionAxisY": "",
    "positionAxisZ": "",
    "distance": "",
    "verticalOffset": "",
    "state": true
}
Datos de respuesta satisfactoria:

JSON
{
    "idmoredata": 200
}
Servicio obtener información adicional del modelo 3d
Método: GET

Url: http://www.eduxr.somee.com/api/ModelMoreData/ObtenerModeloMoreDataPorID?id=15

Datos de envío:

JSON
{
    "idmoredata": 200
}
Datos de respuesta satisfactoria:

JSON
{
    "idmodel": 200,
    "description": "Modelo 3d información adicional añadida de prueba 100",
    "image": "",
    "positionAxisX": "",
    "positionAxisY": "",
    "positionAxisZ": "",
    "distance": "",
    "verticalOffset": "",
    "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
    "state": true
}
Servicio obtener todas los informaciones adicionales del modelo 3d
Método: GET

Url: http://www.eduxr.somee.com/api/ModelMoreData/ObtenerModeloMoreDaraPorModelo?idmodelo=1

Datos de envío:

JSON
{
    "idmodel": 100
}
Datos de respuesta satisfactoria:

JSON
{
    "moredata": [  
        {
            "idmoredata": 200,
            "idmodel": 200,
            "description": "Modelo 3d información adicional añadida de prueba 100",
            "image": "",
            "positionAxisX": "",
            "positionAxisY": "",
            "positionAxisZ": "",
            "distance": "",
            "verticalOffset": "",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "idmoredata": 201,
            "idmodel": 200,
            "description": "Modelo 3d información adicional añadida de prueba 100",
            "image": "",
            "positionAxisX": "",
            "positionAxisY": "",
            "positionAxisZ": "",
            "distance": "",
            "verticalOffset": "",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "idmoredata": 202,
            "idmodel": 200,
            "description": "Modelo 3d información adicional añadida de prueba 100",
            "image": "",
            "positionAxisX": "",
            "positionAxisY": "",
            "positionAxisZ": "",
            "distance": "",
            "verticalOffset": "",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        }
    ]
}
Servicio actualizar información adicional del modelo 3d
Método: PUT

Url: (No especificada)

Datos de envío:

JSON
{
    "idmoredata": 201,
    "idmodel": 100,
    "description": "Modelo 3d información adicional añadida de prueba 100"
}
Datos de respuesta satisfactoria:

JSON
True
Servicio eliminar información adicional del modelo 3d
Método: DELETE

Url: (No especificada)

Datos de envío:

JSON
{
    "idmoredata": 200
}
Datos de respuesta satisfactoria:

JSON
{
    "idmoredata": 200,
    "state": false
}
Servicio subir textura
Método: POST

Url: http://www.eduxr.somee.com/api/TextureFiles/upload

Datos de respuesta satisfactoria (Devuelve):

JSON
{
  "url": "[http://www.eduxr.somee.com/api/TextureFiles/tm.jpg](http://www.eduxr.somee.com/api/TextureFiles/tm.jpg)"
}
Método: GET

Url: http://www.eduxr.somee.com/api/TextureFiles/ (Asumida base, ver respuesta)

Datos de envío:

JSON
{
    "textureName": "nombre.jpg"
}
Datos de respuesta satisfactoria (Devuelve):
http://www.eduxr.somee.com/api/TextureFiles/nombre.jpg

Servicio obtener usuario por email
Método: GET

Url: (No especificada)

Datos de envío:

JSON
{
    "email": "abc@email.com"
}
Datos de respuesta satisfactoria:

JSON
{
    "iduser": 100,
    "username": "Paco Paco",
    "state": true
}
Servicio compartir modelos 3d a un usuario
Método: POST

Url: (No especificada)

Datos de envío:

JSON
{
    "idmodel": 200,
    "iduser": 200,
    "state": true,
    "datetimeshared": "2024-01-11T16:27:12.5999071-05:00"
}
Datos de respuesta satisfactoria:

JSON
true
Servicio obtener información del modelo 3d para compartir
Método: GET

Url: (No especificada)

Datos de envío:

JSON
{
    "idmodel": 200
}
Datos de respuesta satisfactoria:

JSON
{
    "usersShared": [  
        {
            "iduser": 100,
            "datetimeshared": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "iduser": 200,
            "datetimeshared": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "iduser": 300,
            "datetimeshared": "2024-01-11T16:27:12.5999071-05:00",
            "state": false
        }
    ]
}
Servicio obtener todos los modelos 3d compartidos a un usuario
Método: GET

Url: (No especificada)

Datos de envío:

JSON
{
    "iduser": 100
}
Datos de respuesta satisfactoria:

JSON
{
    "modelsSharedWithMe": [  
        {
            "idmodel": 200,
            "iduser": 100,
            "spacename": "Modelo 3d 200",
            "description": "Modelo 3d de prueba 200",
            "urlmodel": "https://",
            "urltexture": "https://",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "idmodel": 201,
            "iduser": 100,
            "spacename": "Modelo 3d 201",
            "description": "Modelo 3d de prueba 201",
            "urlmodel": "https://",
            "urltexture": "https://",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        },
        {
            "idmodel": 202,
            "iduser": 100,
            "spacename": "Modelo 3d 202",
            "description": "Modelo 3d de prueba 202",
            "urlmodel": "https://",
            "urltexture": "https://",
            "datetimecreated": "2024-01-11T16:27:12.5999071-05:00",
            "state": true
        }
    ]
}
"""

with open('Documentacion_Endpoints_EduXR.md', 'w', encoding='utf-8') as f:
f.write(markdown_content)

print("File generated successfully.")

Tu archivo Markdown (.md) está listo.

[file-tag: code-generated-file-0-1779205064291604569]

He estructurado la información que enviaste utilizando encabezados para separar cada servicio, n