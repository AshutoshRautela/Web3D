# Web3D

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![WebGL](https://img.shields.io/badge/WebGL-2.0-orange)

A modern 3D rendering framework built with WebGL 2.0 and TypeScript. Web3D provides a structured approach to building interactive 3D graphics applications in the browser.

![](images/Render6.png) 

## ✨ Features

- Full WebGL 2.0 rendering pipeline
- Component-based architecture
- Advanced material system with reflection/refraction
- Scene management with hierarchical transforms
- Camera controls with perspective projection
- Dynamic lighting system
- Primitive and custom mesh rendering
- Cubemap support for environment mapping
- Input handling for interactive applications

## 📷 Screenshots

<p align="center">
  <img src="images/Render9.png" width="45%" />
  <img src="images/Render10.png" width="45%" /> 
</p>

## 🚀 Project Structure

The project is organized into modules:

- **web3d-core**: Core rendering engine components
- **web3d-sandbox**: Examples and demo applications

## 🛠️ Setup and Installation

### Prerequisites

- Node.js 14.0+ (compatible with Node.js 22.0+)
- Yarn 1.22+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Ashutosh421/Web3D.git
   ```

2. Install dependencies
   ```bash
   yarn
   ```

3. Run the sandbox demo
   ```bash
   yarn start:sandbox
   ```

4. Build for production
   ```bash
   yarn build:sandbox
   ```

## 🎮 Controls

- **W/S**: Move forward/backward
- **A/D**: Move left/right
- **Q/E**: Rotate left/right
- **Z/X**: Rotate up/down

## 🧩 Architecture

Web3D uses a component-based architecture for building 3D applications:

- **Transform**: Handles positioning, rotation, and scaling
- **Shader**: Provides WebGL shader management
- **Mesh**: Manages geometry data
- **Material**: Controls appearance with textures and shading properties
- **Camera**: Handles view and projection matrices
- **Lights**: Provides various lighting types (directional, point, etc.)
- **Scene**: Manages rendering hierarchy and state

## 📚 Development

### Building Core Library

```bash
cd packages/web3d-core
yarn build
```

### Creating Custom Applications

Import the core library and create your own WebGL applications:

```typescript
import { Scene, Camera, Primitive, PrimitiveType, Shaders } from 'web3d-core';

// Initialize Web3D
Web3D.init();

// Create a scene
const scene = SceneManager.createScene("MyScene", { 
  width: window.innerWidth, 
  height: window.innerHeight 
});

// Add a camera
const camera = new Camera(scene, vec3.fromValues(0, 0, -10));
scene.AddCamera(camera);

// Add objects
const cube = Primitive.createPrimitive(scene, PrimitiveType.Cube, Shaders.StandardPhong);
scene.Add(cube);

// Start rendering
const renderLoop = () => {
  scene.draw();
  requestAnimationFrame(renderLoop);
};
requestAnimationFrame(renderLoop);
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Ashutosh Rautela**

- GitHub: [@Ashutosh421](https://github.com/Ashutosh421)
