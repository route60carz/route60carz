'use client'

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const totalFrames = 190;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Preload images
        const images: HTMLImageElement[] = [];
        const frameCount = totalFrames;
        const currentFrame = { index: 0 };

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Updated path based on moved frames
            img.src = `/ducati_frames/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            images.push(img);
        }

        // Helper to draw image cover
        const render = (index: number) => {
            const img = images[index];
            if (img && img.complete) {
                // Calculate scale to cover
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        }

        // Initial sizing and render
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(Math.round(currentFrame.index));
        };

        // Call resize once to set initial size
        handleResize();
        window.addEventListener('resize', handleResize);

        // Make sure first image is loaded before rendering
        images[0].onload = () => {
            handleResize();
        };

        // GSAP ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=3000", // Scroll distance
                scrub: 1, // Smooth scrub
                pin: true,
                anticipatePin: 1
            }
        });

        tl.to(currentFrame, {
            index: frameCount - 1,
            snap: "index",
            ease: "none",
            onUpdate: () => render(Math.round(currentFrame.index))
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        }
    }, []);

    return (
        <div ref={containerRef} className="relative w-full bg-black overflow-hidden z-0">
            <canvas ref={canvasRef} className="block w-full h-screen object-cover" />

            {/* Overlay Content demonstrating branding */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-4 text-center">
                {/* Title Text - Increased size for impact without logo competition */}
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mix-blend-difference mb-2">
                    ROUTE <span className="text-primary">60</span> CARZ
                </h1>

                {/* Subtitle */}
                <p className="text-secondary text-sm md:text-xl font-light tracking-widest uppercase">
                    Premium Trading • Theni
                </p>
            </div>
        </div>
    );
}
