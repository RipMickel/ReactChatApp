import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [progress, setProgress] = useState(0);

  // Simulate loading progress (you can adjust the interval or logic as needed)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        clearInterval(interval);
        return 100; // Ensure it stops at 100%
      });
    }, 250); // Update progress every 100ms

    return () => clearInterval(interval); // Cleanup interval when the component unmounts
  }, []);

  return (
    <div style={styles.loadingContainer}>
      <div style={styles.overlay}>
        <div style={styles.background}></div>  {/* Background image */}
        <div style={styles.progressContainer}>
          <p style={styles.progressText}>Loading... {progress}%</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it appears above all other content
  },
  overlay: {
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyBCTK_zNERJ5PQv1X3zrr5GdlAxLucK-rwA&s")', // Your image URL
    backgroundSize: 'cover', // Ensures the image covers the entire screen without distortion
    backgroundPosition: 'center center', // Ensures the image is centered
    zIndex: -1, // Ensure the background is behind the loading text
  },
  progressContainer: {
    position: 'absolute',  // Make the progress text overlay the image
    bottom: '20px',
    width: '100%',
    textAlign: 'center',
  },
  progressText: {
    fontSize: '18px',
    color: 'white',
    fontWeight: 'bold',
  },
};

export default Loading;
