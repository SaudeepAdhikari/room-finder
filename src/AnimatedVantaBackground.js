import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

export default function AnimatedVantaBackground() {
    const vantaRef = useRef(null);
    useEffect(() => {
        let effect = WAVES({
            el: vantaRef.current,
            THREE,
            color: 0x38bdf8, // bright blue
            shininess: 80.0,
            waveHeight: 35.0,
            waveSpeed: 1.2,
            zoom: 1.0,
            backgroundColor: 0x18181b, // dark background
            mouseControls: true,
            touchControls: true,
            minHeight: 200.0,
            minWidth: 200.0
        });
        return () => { if (effect) effect.destroy(); };
    }, []);
    return <div ref={vantaRef} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: -1 }} />;
} 