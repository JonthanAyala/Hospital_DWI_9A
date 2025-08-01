# 🏥 Sistema Hospitalario - Frontend

Sistema de gestión hospitalaria desarrollado en React con autenticación JWT y roles de usuario.

## 🚀 Características

- **Autenticación JWT** con Context API
- **3 Roles de usuario**: Admin, Secretaria, Enfermera
- **Rutas protegidas** por rol
- **Validaciones de formularios** con Regex
- **Arquitectura modular** y escalable
- **Interfaz responsive** y moderna

## 👥 Roles y Funcionalidades

### 👨‍💼 Administrador (ADMIN)
- Registrar usuarios del sistema
- Ver lista completa de usuarios
- Gestión de roles y permisos

### 👩‍💼 Secretaria (SECRETARIA)
- Registrar nuevas camas hospitalarias
- Ver camas por piso
- Transferir enfermeras entre pisos
- Gestión de asignaciones

### 👩‍⚕️ Enfermera (ENFERMERA)
- Ver camas asignadas
- Registrar nuevos pacientes
- Ver lista de pacientes
- Dar de alta a pacientes

## 🛠️ Tecnologías

- **React 19** - Framework frontend
- **React Router DOM** - Navegación y rutas
- **Axios** - Cliente HTTP para API
- **Context API** - Manejo de estado global
- **CSS3** - Estilos y responsive design

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.js       # Botón personalizado
│   ├── FormField.js    # Campo de formulario
│   ├── Navbar.js       # Barra de navegación
│   ├── PrivateRoute.js # Rutas protegidas
│   └── Table.js        # Tabla de datos
├── contexts/           # Contextos de React
│   └── AuthContext.js  # Contexto de autenticación
├── pages/              # Páginas de la aplicación
│   ├── admin/          # Páginas del administrador
│   ├── secretaria/     # Páginas de secretaria
│   ├── enfermera/      # Páginas de enfermera
│   ├── Login.js        # Página de login
│   └── Unauthorized.js # Página de acceso denegado
├── services/           # Servicios y configuraciones
│   └── axios.js        # Configuración de Axios
├── utils/              # Utilidades y validaciones
│   └── validations.js  # Funciones de validación
├── App.js              # Componente principal
└── index.js            # Punto de entrada
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd hospital-front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

4. **Ejecutar en modo desarrollo**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🔗 API Backend

El frontend se conecta a una API REST desarrollada en Spring Boot. Asegúrate de que el backend esté ejecutándose en `http://localhost:8080`.

### Endpoints principales:
- `POST /api/auth` - Autenticación
- `GET /api/users` - Lista de usuarios
- `POST /api/users/register` - Registrar usuario
- `GET /api/beds` - Lista de camas
- `POST /api/beds` - Registrar cama
- `GET /api/patients` - Lista de pacientes
- `POST /api/patients` - Registrar paciente

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. El usuario se autentica con usuario y contraseña
2. El servidor devuelve un token JWT
3. El token se almacena en localStorage
4. Todas las peticiones incluyen el token en el header Authorization
5. El token se valida automáticamente en cada petición

## ✅ Validaciones

### Campos validados:
- **Email**: Formato válido con regex (para registro de usuarios)
- **Usuario**: 3-20 caracteres alfanuméricos y guiones bajos (para login)
- **Teléfono**: 10 dígitos numéricos
- **ID de Cama**: Formato CAMA-XX (ej: CAMA-01)
- **Campos requeridos**: Validación de campos obligatorios

### Regex utilizados:
```javascript
email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
username: /^[a-zA-Z0-9_]{3,20}$/
phone: /^[0-9]{10}$/
bedId: /^CAMA-\d{2}$/
```

## 🎨 Estilos y UI

- **Diseño responsive** para móviles y desktop
- **Sistema de colores** consistente
- **Componentes reutilizables** con CSS modular
- **Estados de carga** y feedback visual
- **Mensajes de error** informativos

## 🚀 Scripts Disponibles

```bash
npm start      # Ejecutar en modo desarrollo
npm build      # Construir para producción
npm test       # Ejecutar tests
npm eject      # Exponer configuración (irreversible)
```

## 🔄 Manejo de Estados

### Context API
- **AuthContext**: Manejo de autenticación y usuario logueado
- **Estados globales**: Token, información del usuario, roles

### Estados locales
- **Formularios**: Datos de entrada y validaciones
- **UI**: Loading, errores, modales

## 🛡️ Seguridad

- **Rutas protegidas** por autenticación
- **Validación de roles** en componentes
- **Interceptores Axios** para manejo automático de tokens
- **Redirección automática** en caso de token expirado
- **Sanitización** de datos de entrada

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (hasta 767px)

## 🐛 Manejo de Errores

- **Errores de red**: Reintentos automáticos
- **Errores de autenticación**: Redirección al login
- **Errores de validación**: Mensajes específicos por campo
- **Errores 403/401**: Página de acceso denegado

## 🚀 Deployment

### Build de producción
```bash
npm run build
```

### Variables de entorno para producción
```env
REACT_APP_API_URL=https://api.hospital.com/api
```

---

## 👨‍💻 Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature
3. Hacer commits descriptivos
4. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
