# Aprende Jugando 🎈

App educativa para niños, hecha con [Expo](https://expo.dev) (React Native +
TypeScript), con **un solo código fuente para Android e iOS**. Está pensada
para crecer: nuevos juegos se agregan como módulos independientes sin tocar
el resto de la app.

## Módulos incluidos

1. **🔢 Números** — Primeros pasos de aritmética: contar objetos y sumas
   sencillas con opciones de respuesta múltiple.
2. **✏️ Letras** — Aprender a dibujar letras: trazado libre sobre una letra
   guía (A–Z y Ñ), con lectura en voz alta de la letra y su palabra.
3. **📖 Palabras** — Aprender a leer las primeras palabras: escuchar una
   palabra y elegir la imagen/palabra correcta entre opciones.

Cada módulo guarda su propio progreso (estrellas) en el dispositivo con
`AsyncStorage`, visible tanto dentro del juego como en la pantalla principal.

## Estructura del proyecto

```
src/
  core/               Contratos y utilidades compartidas
    types.ts          Interfaz LearningModule que debe cumplir cada módulo
    moduleRegistry.ts Lista de módulos activos (punto único de registro)
    ProgressContext.tsx  Progreso persistente por módulo (estrellas)
    widgets.tsx        Componentes de UI reutilizables (botones, estrellas…)
  modules/
    arithmetic/        Módulo 1
    letters/            Módulo 2
    reading/             Módulo 3
  navigation/
    RootNavigator.tsx   Stack de navegación: Home + una pantalla por módulo
  screens/
    HomeScreen.tsx       Pantalla principal con la grilla de módulos
  theme/
    theme.ts             Colores, tipografía y espaciados compartidos
```

### Cómo agregar un módulo nuevo

1. Crea una carpeta en `src/modules/<nombre>` con tu pantalla (componente
   React que use `useNavigation()` para volver a Home).
2. Agrégalo al arreglo `MODULES` en `src/core/moduleRegistry.ts` con id,
   título, color, emoji y el componente.
3. Listo — aparece automáticamente en Home con su propia tarjeta y barra de
   progreso, sin editar nada más.

## Requisitos

- Node.js 20+
- npm
- Para probar en el teléfono: la app [Expo Go](https://expo.dev/go)
  (Android/iOS) o un emulador/simulador
- Para compilar binarios: cuenta gratuita en [EAS](https://expo.dev/eas)
  (`npx eas login`)

## Desarrollo

```bash
npm install
npm start          # abre Metro/Expo dev tools, escanea el QR con Expo Go
npm run android    # abre en emulador/dispositivo Android conectado
npm run ios        # abre en simulador iOS (requiere macOS + Xcode)
```

## Compilar para Android

Build local (requiere Android Studio/SDK):

```bash
npx expo run:android
```

Build en la nube con EAS (genera un `.apk`/`.aab` listo para instalar o
subir a Google Play):

```bash
npx eas build --platform android --profile preview
```

## Compilar para iOS

Build local (requiere macOS + Xcode):

```bash
npx expo run:ios
```

Build en la nube con EAS (no requiere Mac, genera un `.ipa`):

```bash
npx eas build --platform ios --profile preview
```

> Para publicar en la App Store necesitas una cuenta de Apple Developer
> (de pago) y usar `--profile production` junto con `eas submit`.

## Notas

- Los íconos/splash en `assets/` son los del template de Expo; reemplázalos
  por el arte final de la app antes de publicarla (`icon.png`,
  `android-icon-*.png`, `splash-icon.png`).
- El identificador de paquete (`com.aprendejugando.app`) en `app.json` es un
  valor de ejemplo; cámbialo por el que uses en Google Play / App Store
  Connect antes de publicar.
- La app usa `expo-speech` para leer letras y palabras en voz alta (voz del
  sistema en español) y `AsyncStorage` para progreso local — no requiere
  backend ni conexión a internet para jugar.
