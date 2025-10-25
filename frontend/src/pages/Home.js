import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });  return (
    <div className="home-main" style={{position: 'relative'}}>
      <svg className="home-wave" viewBox="0 0 900 600" width="100%" height="auto" style={{position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none'}}>
        <path d="M448 600L449.5 566.7C451 533.3 454 466.7 480.3 400C506.7 333.3 556.3 266.7 543 200C529.7 133.3 453.3 66.7 415.2 33.3L377 0L900 0L900 33.3C900 66.7 900 133.3 900 200C900 266.7 900 333.3 900 400C900 466.7 900 533.3 900 566.7L900 600Z" fill="#1c3d58" strokeLinecap="round" strokeLinejoin="miter"></path>
      </svg>
      <div className="home-wave-blob-wrapper" style={{position: 'absolute', left: 20, bottom: 0, zIndex: 2, width: '420px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
        <svg className="home-wave-blob" width="100%" height="100%" viewBox="0 0 400 320" style={{position: 'absolute', top: 0, left: 0,  zIndex: 2, margin: 0, pointerEvents: 'none'}}>
          <g transform="translate(200 160)">
            <path d="M138.1 -87.5C154.3 -51.6 125.9 2.3 95.4 54.8C65 107.2 32.5 158.1 -16.2 167.5C-65 176.8 -129.9 144.7 -157.8 93.8C-185.6 42.8 -176.4 -26.8 -143.9 -72.1C-111.4 -117.3 -55.7 -138.2 2.6 -139.7C60.9 -141.2 121.8 -123.3 138.1 -87.5" fill="#1c3d58"></path>
          </g>
        </svg>
        <div className="home-auth-blob" style={{position: 'absolute', top:0, left: 0 , width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', pointerEvents: 'auto'}}>
          <button className="btn btn-primary w-100" style={{padding: '12px 0', fontWeight: 600, fontSize: '1.1rem', borderRadius: '12px', width: '180px'}} onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-outline-primary w-100" style={{padding: '12px 0', fontWeight: 600, fontSize: '1.1rem', borderRadius: '12px', borderWidth: 2, width: '180px'}} onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
      <div className="home-hero" style={{position: 'relative', zIndex: 2}}>
        <div className="home-hero-content">
          <h1>Vet Booking</h1>
          <h2>Easily plan the best care for your pet!</h2>
          <p>A modern and secure veterinary appointment system</p>
        </div>
    
          <div className="preview-img" style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:14,marginLeft:50}}>
            <img
              src={image ? image.preview : '/images/womanwithdog.png'}
              alt="Pet Preview"
              style={{ width: 320, height: 620, borderRadius: 16, objectFit: 'cover', boxShadow: '0 1px 4px 0 rgba(28,61,88,0.08)' }}
            />
          </div>
        </div>
      </div>
      
  );
}

export default Home;
