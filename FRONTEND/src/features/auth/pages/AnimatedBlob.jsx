import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// This component generates a complex knot of particles and animates them mathematically
const EnergyNetwork = ({ color, radius, tube, p, q, speed, reverse, particleSize }) => {
    const pointsRef = useRef();

    // Generate the initial particle positions using a TorusKnot geometry
    const { positions, originalPositions, randoms, count } = useMemo(() => {
        // We use a TorusKnot purely as a skeleton to place our points
        const geom = new THREE.TorusKnotGeometry(radius, tube, 200, 40, p, q);
        const originalPositions = geom.attributes.position.array;
        
        const count = originalPositions.length / 3;
        const positions = new Float32Array(originalPositions.length);
        const randoms = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random();
            // Clone the original positions into our active array
            positions[i*3] = originalPositions[i*3];
            positions[i*3+1] = originalPositions[i*3+1];
            positions[i*3+2] = originalPositions[i*3+2];
        }
        
        return { positions, originalPositions, randoms, count };
    }, [radius, tube, p, q]);

    useFrame((state) => {
        const time = state.clock.elapsedTime * speed;
        const posAttr = pointsRef.current.geometry.attributes.position;
        
        // Loop through every single particle and shift it based on Sine/Cosine waves
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = originalPositions[i3];
            const y = originalPositions[i3 + 1];
            const z = originalPositions[i3 + 2];
            const rand = randoms[i];

            // Complex organic math to create undulating plasma waves
            const noiseX = Math.sin(time + y * 2.0 + z * 1.0) * 0.2;
            const noiseY = Math.cos(time + x * 2.0 + z * 1.0) * 0.2;
            const noiseZ = Math.sin(time + x * 1.0 + y * 2.0) * 0.2;
            
            // Add a breathing expansion effect based on random offsets
            const breath = Math.sin(time * 0.5 + rand * Math.PI) * 0.1;

            // Apply the new coordinates
            posAttr.array[i3] = x + noiseX + (x * breath);
            posAttr.array[i3 + 1] = y + noiseY + (y * breath);
            posAttr.array[i3 + 2] = z + noiseZ + (z * breath);
        }
        
        // Tell Three.js to re-render the updated positions
        posAttr.needsUpdate = true;
        
        // Slowly rotate the entire network on its axis
        const dir = reverse ? -1 : 1;
        pointsRef.current.rotation.x = time * 0.1 * dir;
        pointsRef.current.rotation.y = time * 0.15 * dir;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute 
                    attach="attributes-position" 
                    count={count} 
                    array={positions} 
                    itemSize={3} 
                />
            </bufferGeometry>
            {/* 
                AdditiveBlending makes overlapping particles glow brightly like fire/energy. 
                depthWrite=false prevents weird black transparency rendering glitches.
            */}
            <pointsMaterial 
                size={particleSize} 
                color={color} 
                transparent 
                opacity={0.8} 
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending} 
                depthWrite={false} 
            />
        </points>
    );
};

const AnimatedBlob = () => {
    return (
        <div className="blob-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                
                {/* 1. Golden Energy Flow (Outer Ring) */}
                <EnergyNetwork 
                    color="#fbbf24" // Bright Amber/Gold
                    radius={2} 
                    tube={0.5} 
                    p={3} 
                    q={4} // Complex twisted knot shape
                    speed={1.5} 
                    reverse={false}
                    particleSize={0.04}
                />
                
                {/* 2. Blue Energy Flow (Inner Core) */}
                <EnergyNetwork 
                    color="#38bdf8" // Electric Cyan/Blue
                    radius={1.2} 
                    tube={0.4} 
                    p={2} 
                    q={3} // Simpler, tighter knot shape
                    speed={1.2} 
                    reverse={true} // Rotates in the opposite direction
                    particleSize={0.03}
                />

                {/* 3. Ambient Floating Sparks in the background */}
                <Sparkles 
                    count={300} 
                    scale={10} 
                    size={2} 
                    speed={0.4} 
                    opacity={0.3} 
                    color="#e4e4e7"
                />
                
                {/* User Interaction */}
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
                
            </Canvas>
        </div>
    );
};

export default AnimatedBlob;