//REVISAR POSIBLEMENTE NO SE OCUPA
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Banner = ({ slug }) => {
  const [bannerPath, setBannerPath] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBanner = async () => {
      try {
        // Llamamos a /api/banner/slug/:slug
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/banner/slug/${slug}`);
        // Asegúrate de que el backend responda { Banner: "/uploads/banners/xxx.jpg" }
        if (res.data.Banner) {
          setBannerPath(res.data.Banner);
        } else {
          setBannerPath(null);
        }
      } catch (err) {
        console.error('[Banner] Error al obtener banner:', err);
        setBannerPath(null);
      }
    };

    fetchBanner();
  }, [slug]);

  if (!bannerPath) return null;

  return (
    <div className="banner-container">
        <img src={`${import.meta.env.VITE_REACT_APP_API_URL}${bannerPath}`} alt={`Banner de ${slug}`} />  
    </div>
  );
};

export default Banner;

// classname imagen w-full object-cover