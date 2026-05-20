<div align="center">

<img width="1200" height="475" alt="Impostor Pro Ultra Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🕵️ El Impostor Pro Ultra

**El juego de mesa digital premium para descubrir al impostor entre tus amigos.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

</div>

---

## 📖 ¿Qué es El Impostor Pro Ultra?

El Impostor Pro Ultra es una **aplicación web progresiva (PWA)** de alto rendimiento diseñada para jugar al clásico juego de deducción social en un único dispositivo móvil, pasándolo de mano en mano. 

La mayoría de los jugadores reciben la palabra civil secreta, pero uno o más jugadores adoptan el rol de **Impostores** sin conocerla. A través del debate, las pistas sutiles y la astucia, el grupo deberá desenmascarar a los impostores antes de que logren mimetizarse.

---

## ✨ Características y Protocolos Avanzados

### 🏆 Sistema de Progresión y Logros (XP & Prestige)
* **XP System**: Gana puntos de experiencia al jugar partidas, detectar al impostor o ganar como infiltrado.
* **Logros y Coleccionables**: Desbloquea medallas de bronce/plata/oro, títulos legendarios y coleccionables temáticos.
* **Prestigio**: Sube de rango y desbloquea cosméticos visuales premium para tu interfaz.
* **Perfiles & Leaderboard**: Consulta estadísticas detalladas de cada agente y clasificaciones locales en tiempo real.
* **Control de Notificaciones**: Opción en los Ajustes de Interfaz para desactivar los popups de subida de nivel y desbloqueos para partidas fluidas.

### 🎭 Protocolo Renuncia (Role Transfer)
* Permite al impostor transferir de forma anónima su rol a otro jugador bajo estrictas reglas de orden de turnos válidos para equilibrar la partida.
* Modal de consulta de identidad de lectura en la pantalla de resultados con rediseño responsivo, desplazamiento en pantalla vertical y un botón prominente de validación física (*"Ya he revisado mi rol"*).

### ⚡ Protocolo Nexus (Alianza de Impostores)
* En partidas con múltiples impostores, el sistema Nexus revela automáticamente quiénes son los aliados de infiltración.
* Cabeceras dinámicas que adaptan el texto según los cómplices restantes (*"EL OTRO IMPOSTOR ES"* o *"LOS OTROS IMPOSTORES SON"*) con diseño de alto contraste y brillo en rojo neón.

### 🚀 Optimización y Rendimiento Móvil (Zero-Lag UX)
* **Lazy Loading**: Categorías distribuidas en 7 archivos independientes de carga asíncrona (`customCategoriesPart1` a `customCategoriesPart7`) para minimizar el bundle principal y acelerar el renderizado inicial.
* **CSS Hardware Acceleration**: El botón de "Mantener para revelar" ha sido reescrito usando transiciones CSS y `scaleX` nativo para evitar re-renders cíclicos del árbol React a 60 FPS, manteniendo fría la CPU del dispositivo.
* **Time to Reveal**: Ajustado a 1.0 segundo exacto con visibilidad inactiva (glassmorphism al 8% de opacidad y bordes nítidos).

---

## 🎮 Modos de Juego

| Modo | Mecánica Principal |
|------|--------------------|
| **Clásico** | Un impostor infiltrado sin conocer la palabra secreta. |
| **Party Mode** | Desafíos de bebida aleatorios e intensidad de juego según las rondas jugadas. |
| **Magistrado** | Un alcalde con voto doble en caso de empate durante el escrutinio. |
| **Arquitecto** | Un jugador elige o baraja la palabra de la categoría antes de iniciar el turno. |
| **Oráculo** | El impostor puede seleccionar y filtrar pistas para confundir a los civiles. |
| **Nexus** | Coordina la alianza de impostores revelando a los cómplices entre sí. |
| **Renuncia** | Habilita la rendición estratégica y el traspaso de roles a mitad del juego. |

---

## 🏗️ Estructura del Proyecto

```text
Ultraimpostor/
├── components/
│   ├── views/              # Vistas principales (Setup, Revealing, Results)
│   ├── progression/        # Sistema de medallas, leaderboard y perfiles XP
│   ├── categorySelector/   # Selector de temas y cuadrícula de categorías
│   ├── manual/             # Reglas, tutoriales y guías interactivas de protocolos
│   ├── IdentityCard.tsx    # Tarjeta de revelación táctil con giroscopio simulado
│   ├── DebugConsole.tsx    # Panel avanzado para simular estados y eventos troll
│   └── ...
├── hooks/
│   ├── useGameState.ts     # Engine principal de la máquina de estados del juego
│   ├── useAudioSystem.ts   # Controladores de efectos de sonido y ambientación
│   └── useProgression.ts   # Cálculo de XP, desbloqueo de insignias y niveles
├── categories.ts           # Listado de categorías nativas
├── customCategoriesPart*.ts# Módulos de temas cargados por chunks dinámicos
├── constants.ts            # Esquemas de color, paletas HSL y configuraciones
├── types.ts                # Contratos y tipos estáticos de TypeScript
├── sw.js                   # Service Worker personalizado para caché local
├── vite.config.ts          # Configuración de compilación con rollup y manual chunks
└── App.tsx                 # Enrutador principal de vistas
```

---

## 🛠️ Stack Tecnológico

* **Framework UI**: React 18 (Hooks, Suspense, Lazy Loading)
* **Lenguaje**: TypeScript 5
* **Estilos**: Tailwind CSS 3 & HSL Tailored Custom CSS
* **Build System**: Vite 5 con Rollup manual split
* **Drag & Drop**: @dnd-kit (para ordenación táctil de jugadores)
* **Animaciones & Efectos**: Canvas Confetti y animaciones CSS optimizadas por GPU
* **Iconografía**: Lucide React
* **PWA**: vite-plugin-pwa (soporte offline completo)

---

## 🚀 Instalación y Uso Local

### Requisitos
* Node.js v18 o superior
* npm v9 o superior

### Pasos
```bash
# 1. Clona el repositorio
git clone https://github.com/javirerffggg/Ultraimpostor.git
cd Ultraimpostor

# 2. Instala las dependencias
npm install

# 3. Levanta el servidor local de desarrollo
npm run dev
```

El servidor estará listo en [http://localhost:5173](http://localhost:5173).

### Scripts
* `npm run dev`: Inicia el servidor de desarrollo local.
* `npm run build`: Compila los bundles optimizados y genera el manifiesto PWA.
* `npm run preview`: Levanta un servidor local apuntando al bundle compilado de producción.

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados © 2026 javirerffggg.
