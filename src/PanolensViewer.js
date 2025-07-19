import React, { useEffect, useRef } from 'react';
// Panolens and three.js must be loaded via CDN in public/index.html
export default function PanolensViewer({ imageUrl }) {
    const viewerRef = useRef();

    useEffect(() => {
        if (!imageUrl) return;
        viewerRef.current.innerHTML = '';
        // eslint-disable-next-line no-undef
        const panorama = new PANOLENS.ImagePanorama(imageUrl);
        // eslint-disable-next-line no-undef
        const viewer = new PANOLENS.Viewer({
            container: viewerRef.current,
            autoHideInfospot: false,
            controlBar: true,
            output: 'console',
        });
        viewer.add(panorama);
        return () => {
            viewer.dispose();
        };
    }, [imageUrl]);

    return (
        <div
            ref={viewerRef}
            style={{
                width: '100%',
                maxWidth: 700,
                height: 400,
                margin: '0 auto',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#222',
            }}
        />
    );
} 