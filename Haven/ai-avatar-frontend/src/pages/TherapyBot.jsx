import React from 'react';
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "../components/Experience";
import { UI } from "../components/UI";
import SupportSafeNavbar from '../components/SupportSafeNavbar';

function TherapyBot() {
  return (
    <div className="h-screen w-full flex flex-col">
      <SupportSafeNavbar />
      <div className="flex-1 pt-16">
        <Loader />
        <Leva hidden />
        <UI />
        <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
          <Experience />
        </Canvas>
      </div>
    </div>
  );
}

export default TherapyBot; 