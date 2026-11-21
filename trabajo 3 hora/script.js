document.addEventListener('DOMContentLoaded', () => {
    const CONFIG = {
        email: 'info@amigospeludos.com',
        horarios: {
            semana: { inicio: 8, fin: 18 }, // Lunes a Viernes
            sabado: { inicio: 9, fin: 14 }  // Sábado
        }
    };

    // 1. Saludo dinámico según la hora del día
    const actualizarSaludo = () => {
        const subtitulo = document.querySelector('.logo p');
        if (!subtitulo) return;

        const hora = new Date().getHours();
        let saludo = '¡Bienvenido a Amigos Peludos! 🐾';

        if (hora >= 5 && hora < 12) {
            saludo = '¡Buenos días! Tu mascota merece lo mejor hoy ☀️🐾';
        } else if (hora >= 12 && hora < 18) {
            saludo = '¡Buenas tardes! Listos para atender a tu mejor amigo 🌤️🐾';
        } else {
            saludo = '¡Buenas noches! Revisa nuestros horarios de atención 🌙🐾';
        }

        subtitulo.textContent = saludo;
    };

    // 2. Indicador en tiempo real de "Abierto ahora" o "Cerrado"
    const mostrarEstadoHorario = () => {
        const seccionContacto = document.querySelector('.contacto-info') || document.querySelector('.contacto');
        if (!seccionContacto) return;

        const ahora = new Date();
        const dia = ahora.getDay(); // 0 = Domingo, 1-5 = Lun-Vie, 6 = Sábado
        const hora = ahora.getHours();
        let estaAbierto = false;

        if (dia >= 1 && dia <= 5) {
            estaAbierto = hora >= CONFIG.horarios.semana.inicio && hora < CONFIG.horarios.semana.fin;
        } else if (dia === 6) {
            estaAbierto = hora >= CONFIG.horarios.sabado.inicio && hora < CONFIG.horarios.sabado.fin;
        }

        const estadoEl = document.createElement('p');
        estadoEl.innerHTML = estaAbierto
            ? '🟢 <strong>Estado actual:</strong> Abierto ahora — ¡Te esperamos!'
            : '🔴 <strong>Estado actual:</strong> Cerrado en este momento';
        
        seccionContacto.appendChild(estadoEl);
    };

    // 3. Generador de enlace directo a Gmail con asunto y cuerpo prellenados
    const construirEnlaceGmail = (servicio = 'Consulta General') => {
        const asunto = encodeURIComponent(`Reserva de Cita: ${servicio} - Amigos Peludos`);
        const cuerpo = encodeURIComponent(
            `Hola equipo de Amigos Peludos,\n\n` +
            `Me gustaría agendar una cita para: ${servicio}.\n` +
            `• Nombre de mi mascota:\n` +
            `• Día y hora preferida:\n\n` +
            `¡Muchas gracias!`
        );

        return `https://google.com{CONFIG.email}&su=${asunto}&body=${cuerpo}`;
    };

    // 4. Interacción con las tarjetas de servicios
    const inicializarTarjetas = () => {
        const tarjetas = document.querySelectorAll('.tarjeta');
        const botonGmail = document.getElementById('btnGmail');

        // Configurar enlace inicial del botón Gmail
        if (botonGmail) {
            botonGmail.href = construirEnlaceGmail();
        }

        tarjetas.forEach((tarjeta) => {
            // Accesibilidad con teclado (Enter o Espacio)
            tarjeta.setAttribute('tabindex', '0');
            tarjeta.setAttribute('role', 'button');

            const seleccionarServicio = () => {
                const titulo = tarjeta.querySelector('h3')?.textContent.trim() || 'Consulta General';
                const servicio = tarjeta.dataset.servicio || titulo;

                // Resaltar visualmente la tarjeta seleccionada
                tarjetas.forEach((t) => t.classList.remove('tarjeta-activa'));
                tarjeta.classList.add('tarjeta-activa');

                // Actualizar el enlace y texto del botón de Gmail
                if (botonGmail) {
                    botonGmail.href = construirEnlaceGmail(servicio);
                    botonGmail.textContent = `✉️ Agendar: ${servicio}`;
                }

                // Desplazamiento suave a la sección de contacto
                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            };

            tarjeta.addEventListener('click', seleccionarServicio);
            tarjeta.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    seleccionarServicio();
                }
            });
        });
    };

    // Ejecutar funciones
    actualizarSaludo();
    mostrarEstadoHorario();
    inicializarTarjetas();
});