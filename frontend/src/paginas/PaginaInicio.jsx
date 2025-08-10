import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import FormularioContacto from '../componentes/FormularioContacto';

const PaginaInicio = () => {
    const [inicio, setInicio] = useState({});
    const [imagenes, setImagenes] = useState([]);
    const [banners, setBanners] = useState([]);
    const [slugEventos, setSlugEventos] = useState('');
    const [seccionEventos, setSeccionEventos] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inicioRes, imgRes, banRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio`),
                    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-imagenes`),
                    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/inicio-banners`)
                ]);

                setInicio(inicioRes.data[0] || {});
                setImagenes(Array.isArray(imgRes.data) ? imgRes.data : []);
                setBanners(Array.isArray(banRes.data) ? banRes.data : []);
            } catch (error) {
                console.error('Error al obtener datos de inicio:', error);
            }
        };

        fetchData();
    }, []);

    //NECESARIO PARA QUE FUNCIONE EL BOTÓN FLOTANTE DE LOS EVENTOS 
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contenido/extra/evento`)
            .then(res => {
                setSlugEventos(res.data.slug);
                setSeccionEventos(res.data.extra);
            })
            .catch(console.error);
    }, []);

    const handleIrAEventos = () => {
        if (seccionEventos && slugEventos) {
            navigate(`/${seccionEventos}/${slugEventos}`);
        }
    };


    return (
        <>
            <Header />

            {/* VIDEO DINÁMICO */}
            <section className="video-container">
                {inicio.Video && (
                    <video autoPlay muted loop aria-label="Video promocional de EPMTY.COM">
                        <source src={`${import.meta.env.VITE_REACT_APP_API_URL}${inicio.Video}`} type="video/mp4" />
                        Tu navegador no soporta video HTML5.
                    </video>
                )}
            </section>

            {/* SECCIÓN CAMPUS MONTERREY */}
            <section className="wrapper container" id="mty">
                <div className="row align-items-center">
                    <h2 className="campus text-center">CAMPUS GUADALAJARA</h2>
                    <div className="col-lg-6 col-12">
                        <div className="text-box">
                            {inicio.Texto ? (
                                <div dangerouslySetInnerHTML={{ __html: inicio.Texto }} />
                            ) : (
                                <p>Cargando contenido...</p>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 col-12 text-center mt-4 mt-lg-0">
                        <section className="campus-inicio">
                            {imagenes
                                .filter(img => img.Posicion === 'inicio')
                                .map(img => (
                                    <div className="card" key={img.id_imagen}>
                                        <a>
                                            <img src={`${import.meta.env.VITE_REACT_APP_API_URL}${img.Imagen}`} alt={img.Alt} />
                                        </a>
                                    </div>
                                ))}
                        </section>
                    </div>
                </div>
            </section>

            {/* IMAGEN COMPLETA - FRASE */}
            <div className="full-width-image-container">
                {imagenes
                    .filter(img => img.Posicion === 'banner')
                    .map(img => (
                        <div className="card" key={img.id_imagen}>
                            <a href={img.Enlace || '#'}>
                                <img src={`${import.meta.env.VITE_REACT_APP_API_URL}${img.Imagen}`} alt={img.Alt} className="full-width-image" />
                            </a>
                        </div>
                    ))}
            </div>

            {/* BOTONES INFERIORES CIRCULARES (DINÁMICOS) */}
            <section className="container-btnbajos">
                {banners.filter(b => b.Posicion === 'btnbajos').map(banner => (
                    <a href={banner.Enlace} className="btn-circle" key={banner.id_banner}>
                        <div
                            className="circle-img-wrapper-btn-bajos"
                            style={{
                                backgroundImage: `url(${import.meta.env.VITE_REACT_APP_API_URL}}${banner.Banner})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    </a>
                ))}
            </section>

            {/* OFERTA ACADÉMICA */}
            <section>
                <h1 className="title">OFERTA ACADÉMICA</h1>
            </section>

            {/* Galería de Diplomados y Posgrados */}
            <section className="gallery container">
                {imagenes
                    .filter(img => img.Posicion === 'diplomado')
                    .map(img => (
                        <div className="card" key={img.id_imagen}>
                            <a href={img.Enlace || '#'}>
                                <img src={`${import.meta.env.VITE_REACT_APP_API_URL}${img.Imagen}`} alt={img.Alt} />
                            </a>
                        </div>
                    ))}
            </section>


            {/* GALERÍA DE IMÁGENES DINÁMICA */}
            <section className="container-btnbajos">
                {banners.filter(b => b.Posicion === 'proximos').map(banner => (
                    <a href={banner.Enlace} className="btn-circle" key={banner.id_banner}>
                        <div
                            className="circle-img-wrapper"
                            style={{
                                backgroundImage: `url(${import.meta.env.VITE_REACT_APP_API_URL}${banner.Banner})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    </a>

                ))}
            </section>
            {/* AQUI VA EL FORMULARIO  */}
            <div>
                <section>
                    <FormularioContacto />
                </section>
            </div>
            {/* GALERIA DE CAMPUS */}
            <section>
                <h1 className="title">CAMPUS</h1>
                <section className="container-btnbajos">
                    {banners.filter(b => b.Posicion === 'campus').map(banner => (
                        <a href={banner.Enlace} className="btn-circle" key={banner.id_banner}>
                            <div

                                className="circle-img-wrapper-campus"
                                style={{
                                    backgroundImage: `url(${import.meta.env.VITE_REACT_APP_API_URL}${banner.Banner})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            />
                            <p>{banner.Alt}</p>
                        </a>
                    ))}
                </section>
            </section>
            {/*  alt={banner.Alt} */}
            {/* SIGUENOS */}
            <div className="full-width-image-container">
                {imagenes
                    .filter(img => img.Posicion === 'footer')
                    .map(img => (
                        <div className="card" key={img.id_imagen}>
                            <a href={img.Enlace || '#'}>
                                <img src={`${import.meta.env.VITE_REACT_APP_API_URL}${img.Imagen}`} alt={img.Alt} className="full-width-image" />
                            </a>
                        </div>
                    ))}
            </div>
            {/* FOOTER */}
            <footer className="pie-pagina">
                <Footer />
            </footer>
            {/* BOTONES FLOTANTES */}
            <div
                className="floating-btn whatsapp-btn"
                onClick={() =>
                    window.open("https://api.whatsapp.com/send?phone=8112142744&text=Hola, me gustaría recibir más información", "_blank")
                }
            >
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
            </div>

            <div className="floating-btn eventos-btn" onClick={handleIrAEventos}>
                <i className="fas fa-calendar-alt"></i>
                <span>Eventos</span>
            </div>

        </>
    );
};

export default PaginaInicio;
