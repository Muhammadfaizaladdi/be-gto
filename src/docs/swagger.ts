import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Gto",
        description: "Dokumentasi API Gto"
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server"
        },
        {
            url: "https://be-19s9nbhxu-faizals-projects-4fbfbfc6.vercel.app/api",
            description: "Deploy Server"
        }
    ],

    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
            }
        },
        schemas: {
            LoginRequest: {
                identifier: "faizal@email.com",
                password: "123"
            },
            RegisterRequest: {
                fullname: "Maman",
                username: "maman2025",
                email: "maman2025@yopmail.com",
                password: "123Hahaha",
                confirmPassword: "123Hahaha"
            },
            ActivationRequest: {
                code: "ABcdef"
            }
        }
    },
}

const outputFile = './swagger_output.json'
const endpointsFile = ["../routes/api.ts"]

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc)
