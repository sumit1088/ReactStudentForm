
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Canvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Document objects
    const createPaper = (x: number, y: number, z: number, rotation: number, color: string) => {
      const geometry = new THREE.PlaneGeometry(1.5, 2);
      
      const material = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        metalness: 0.1,
        roughness: 0.8,
      });
      
      const paper = new THREE.Mesh(geometry, material);
      paper.position.set(x, y, z);
      paper.rotation.x = 0.1;
      paper.rotation.y = rotation;
      scene.add(paper);
      
      // Add some "text lines" to the paper
      const createTextLine = (width: number, yPos: number) => {
        const textGeom = new THREE.PlaneGeometry(width, 0.05);
        const textMat = new THREE.MeshBasicMaterial({ 
          color: 0x333333,
          transparent: true,
          opacity: 0.7 
        });
        const textLine = new THREE.Mesh(textGeom, textMat);
        textLine.position.set(0, yPos, 0.01);
        return textLine;
      };
      
      // Add several text lines
      for (let i = 0; i < 7; i++) {
        const width = Math.random() * 0.5 + 0.7;
        const y = 0.7 - i * 0.2;
        paper.add(createTextLine(width, y));
      }
      
      return paper;
    };
    
    // Create multiple paper sheets
    const papers = [
      createPaper(-1.2, 0.2, 0, -0.2, '#ffffff'),
      createPaper(-0.3, -0.3, -0.5, 0.1, '#f5f5f5'),
      createPaper(0.8, 0.1, -1, 0.3, '#ffffff'),
    ];
    
    // Create a magnifying glass
    const createMagnifyingGlass = () => {
      const group = new THREE.Group();
      
      // Handle
      const handleGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1, 16);
      const handleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        metalness: 0.3,
        roughness: 0.5
      });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.rotation.x = Math.PI / 4;
      handle.position.y = -0.5;
      group.add(handle);
      
      // Lens rim
      const rimGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
      const rimMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        metalness: 0.5,
        roughness: 0.4
      });
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      group.add(rim);
      
      // Lens glass
      const glassGeometry = new THREE.CircleGeometry(0.45, 32);
      const glassMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xd4e8ff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.9
      });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      glass.position.z = 0.01;
      group.add(glass);
      
      // Position the entire group
      group.position.set(2.2, 0.5, 1);
      group.rotation.z = -Math.PI / 6;
      scene.add(group);
      
      return group;
    };
    
    const magnifyingGlass = createMagnifyingGlass();
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Subtle paper movement
      papers.forEach((paper, i) => {
        paper.position.y += Math.sin(Date.now() * 0.001 + i) * 0.0005;
        paper.rotation.y += Math.sin(Date.now() * 0.0005 + i) * 0.0002;
      });
      
      // Magnifying glass movement
      magnifyingGlass.position.y += Math.sin(Date.now() * 0.001) * 0.001;
      magnifyingGlass.rotation.z = -Math.PI / 6 + Math.sin(Date.now() * 0.0005) * 0.05;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-[400px]" />;
};

export default Canvas3D;
