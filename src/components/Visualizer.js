import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import '../styles/Visualizer.css';

function Visualizer() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Basic scene setup
    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create planet
    const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0x3366ff,
      wireframe: false,
      roughness: 0.8,
      metalness: 0.2,
      emissive: 0x112244,
      emissiveIntensity: 0.2
    });
    
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);
    
    // Create orbit rings
    const ringGeometry = new THREE.RingGeometry(1.5, 1.6, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x80b3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    // Create particle field
    const particlesCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      // Position
      const distance = Math.random() * 3 + 2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = distance * Math.cos(phi);
      
      // Color
      colors[i * 3] = 0.5 + 0.5 * Math.random();
      colors[i * 3 + 1] = 0.5 + 0.5 * Math.random();
      colors[i * 3 + 2] = 0.5 + 0.5 * Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Animation loop
    let animationFrameId;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      planet.rotation.y += 0.005;
      particles.rotation.y -= 0.002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      mountRef.current && mountRef.current.removeChild(renderer.domElement);
    };
  }, []);
  
  return (
    <div className="visualizer">
      <h3>Music Visualization</h3>
      <div className="visualizer-container" ref={mountRef}></div>
      <div className="visualizer-info">
        <p>A unique music universe, built from your emotions</p>
      </div>
    </div>
  );
}

export default Visualizer; 