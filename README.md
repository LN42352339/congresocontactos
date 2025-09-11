# 📱 Congreso Contactos

Proyecto **React Native (TypeScript)** para **Android** y **iOS**, conectado a **Firebase (Auth, Firestore, Storage)**.

> Este README está pensado para que **funcione en cualquier PC o Mac** al descargar el **ZIP** desde GitHub o clonar el repositorio.

---

## 🧭 Contenido

* [Requisitos](#-requisitos)
* [Tecnologías](#-tecnologías)
* [Estructura del proyecto](#-estructura-del-proyecto)
* [Configuración de Firebase](#-configuración-de-firebase)
* [Instalación (ZIP o Git)](#-instalación-zip-o-git)
* [Configuración por sistema operativo](#-configuración-por-sistema-operativo)

  * [Windows](#windows)
  * [macOS](#macos)
  * [Linux](#linux)
* [Comandos útiles (scripts)](#-comandos-útiles-scripts)
* [Ejecutar la app](#-ejecutar-la-app)
* [Solución de problemas (FAQ)](#-solución-de-problemas-faq)
* [Buenas prácticas de Git](#-buenas-prácticas-de-git)

---

## ✅ Requisitos

* **Node.js**: 18.x o 20.x LTS recomendado
* **npm** 10+ o **yarn** 1.x
* **Java JDK** 17 (recomendado para Android Gradle Plugin moderno)
* **Android Studio** con SDKs y emulador (para Android)
* **Xcode** 15+ (solo macOS, para iOS)
* **CocoaPods** (solo iOS): `sudo gem install cocoapods`

> Verifica tus versiones:

```bash
node -v
npm -v
java -version
```

---

## 🧰 Tecnologías

* React Native (CLI)
* TypeScript
* Firebase (Auth, Firestore, Storage)
* Gradle / Android SDK
* Xcode + CocoaPods (iOS)

---

## 🗂 Estructura del proyecto

```
congresocontactos/
├── android/
├── ios/
├── src/
│   ├── presentation/
│   ├── domain/
│   ├── data/
│   └── ...
├── App.tsx
├── package.json
├── tsconfig.json
├── babel.config.js
└── README.md
```

---

## 🔐 Configuración de Firebase

### Archivos necesarios

* **Android**: `android/app/google-services.json`
* **iOS**: `ios/GoogleService-Info.plist`

> Si estos archivos no están en el repo, descárgalos desde tu proyecto de Firebase y colócalos en las rutas indicadas.

### Dependencias típicas

En `package.json` verás librerías como:

* `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`, `@react-native-firebase/storage`

> **Importante (Android)**: Asegúrate que `android/build.gradle` y `android/app/build.gradle` tengan los plugins de Google Services y Firebase. En iOS, corre `pod install`.

---

## ⬇️ Instalación (ZIP o Git)

### Opción A: Descargar ZIP

1. Ve al repo en GitHub → **Code** → **Download ZIP**.
2. Extrae el ZIP.
3. Abre una terminal en la carpeta del proyecto.

### Opción B: Clonar con Git

```bash
git clone https://github.com/LN42352339/congresocontactos.git
cd congresocontactos
```

### Instalar dependencias (obligatorio en cualquier máquina)

```bash
npm install
# o
yarn install
```

---

## 🖥 Configuración por sistema operativo

### Windows

1. Instala **Android Studio** y durante el setup marca:

   * Android SDK
   * Android SDK Platform
   * Android Virtual Device
2. Configura variables de entorno (si es necesario):

   * `ANDROID_HOME` → `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`
   * Agrega a `PATH`:

     * `%ANDROID_HOME%\platform-tools`
     * `%ANDROID_HOME%\emulator`
3. Conecta un dispositivo Android con **depuración USB** o crea un **AVD** en Android Studio.

### macOS

1. Instala **Xcode** desde App Store y acepta licencias:

   ```bash
   sudo xcode-select --switch /Applications/Xcode.app
   sudo xcodebuild -runFirstLaunch
   ```
2. Instala **CocoaPods**:

   ```bash
   sudo gem install cocoapods
   ```
3. Instala pods del proyecto iOS:

   ```bash
   cd ios && pod install && cd ..
   ```
4. Instala **Android Studio** si también compilarás para Android.

### Linux

1. Instala **Android Studio** y SDKs.
2. Variables de entorno en `~/.bashrc` o `~/.zshrc`:

   ```bash
   export ANDROID_HOME="$HOME/Android/Sdk"
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
   ```
3. Usa dispositivo físico o emulador para Android.

---

## 🏃 Comandos útiles (scripts)

En la raíz del proyecto:

```bash
# Arrancar Metro bundler
npm run start

# Ejecutar Android (emulador o dispositivo)
npm run android

# Ejecutar iOS (solo macOS)
npm run ios

# Limpiar cache de Metro
npm run reset-cache

# (Opcional) Limpiar Android Gradle
cd android && ./gradlew clean && cd ..
```

> Si usas **yarn**, reemplaza `npm run` por `yarn` (ej: `yarn android`).

---

## ▶️ Ejecutar la app

### Android

```bash
npm run android
```

* Asegúrate de tener un emulador abierto desde Android Studio **o** un dispositivo con **depuración USB** activada.

### iOS (macOS)

```bash
# 1) Instalar pods (solo la primera vez o cuando cambian librerías nativas)
cd ios && pod install && cd ..

# 2) Ejecutar\ nnpm run ios
```

* También puedes abrir `ios/NombreDelProyecto.xcworkspace` en Xcode y ejecutar con el botón ▶️.

---

## 🛠 Solución de problemas (FAQ)

**1) `Cannot find entry file index.js` o errores raros de bundler**

```bash
npm run reset-cache
```

**2) Error iOS: `No such file or directory: Pods/…`**

* Corre `cd ios && pod install && cd ..`
* Si falla, prueba `pod repo update` y luego `pod install`.

**3) Error Android: `SDK location not found`**

* Configura `ANDROID_HOME` y añade `platform-tools` y `emulator` al `PATH`.
* Verifica en Android Studio → **SDK Manager** la ruta del SDK.

**4) Error Gradle o compilación en Android**

```bash
cd android
./gradlew clean
cd ..
```

* Verifica que tienes **JDK 17**.

**5) iOS: Problemas de firma (signing)**

* Abre el workspace en Xcode → **Signing & Capabilities** → selecciona tu **Team** y un **Bundle Identifier** único.

**6) Firebase no conecta**

* Verifica que los archivos `google-services.json` (Android) y `GoogleService-Info.plist` (iOS) estén en las rutas correctas.
* Revisa que el **Bundle ID** (iOS) y **ApplicationId** (Android) coincidan con los de Firebase.

**7) Error M1/M2/M3/M4 con pods**

```bash
sudo arch -x86_64 gem install ffi
cd ios && arch -x86_64 pod install && cd ..
```

*(Solo si usas terminal en modo Rosetta; muchas veces ya no es necesario en macOS modernos)*

**8) El proyecto compila en una máquina pero no en otra**

* Asegúrate de correr `npm install` en cada máquina.
* Borra caches: `npm run reset-cache`.
* En iOS, borra Derived Data desde Xcode (Window → Projects → Derived Data → Delete).

---

## 🌿 Buenas prácticas de Git

* No subir `node_modules/`, `ios/Pods/`, `android/.gradle/` (ya se manejan con `.gitignore`).
* Commits descriptivos:

```bash
git add .
git commit -m "feat: login por número + Firebase Auth"
git push origin main
```

* Usa ramas para nuevas features: `feat/login`, `fix/auth`, `chore/ci`.

---

## 📄 Licencia

Este proyecto es de uso privado del autor a menos que se indique lo contrario en el repositorio.

---

## 🧩 Contacto / Ayuda

Si tienes problemas al ejecutar el proyecto, abre un **Issue** en GitHub o contacta al mantenedor.
