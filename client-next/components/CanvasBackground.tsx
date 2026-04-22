"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleCloud(props: any) {
    const ref = useRef<THREE.Points>(null);
    // Generate random points in a sphere
    const sphere = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
        const radius = 1.5;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = Math.cbrt(Math.random()) * radius;
        sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        sphere[i * 3 + 2] = r * Math.cos(phi);
    }

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#d4af37"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

export default function CanvasBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleCloud />
            </Canvas>
        </div>
    );
}
