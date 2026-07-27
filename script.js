/* script.js */

document.addEventListener('DOMContentLoaded', () => {


  /* ── Hero video — Desktop ── */
  const desktopVideo    = document.getElementById('hero-video-desktop');
  const btnPlayPause    = document.getElementById('hero-play-pause');
  const iconPause       = document.getElementById('icon-pause');
  const iconPlay        = document.getElementById('icon-play');
  const btnMute         = document.getElementById('hero-mute');
  const iconMute        = document.getElementById('icon-mute');
  const iconSound       = document.getElementById('icon-sound');
  const volSlider       = document.getElementById('hero-volume');

  function setDesktopPlayIcon(playing) {
    iconPause.style.display = playing ? '' : 'none';
    iconPlay.style.display  = playing ? 'none' : '';
  }

  function setDesktopMuteIcon(muted) {
    iconMute.style.display  = muted ? '' : 'none';
    iconSound.style.display = muted ? 'none' : '';
  }

  if (desktopVideo) {
    /* Clique direto no vídeo pausa/retoma */
    desktopVideo.addEventListener('click', () => {
      if (desktopVideo.paused) { desktopVideo.play(); setDesktopPlayIcon(true); }
      else { desktopVideo.pause(); setDesktopPlayIcon(false); }
    });

    /* Botão play/pause */
    btnPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      if (desktopVideo.paused) { desktopVideo.play(); setDesktopPlayIcon(true); }
      else { desktopVideo.pause(); setDesktopPlayIcon(false); }
    });

    /* Mute/unmute */
    btnMute.addEventListener('click', () => {
      if (desktopVideo.muted) {
        desktopVideo.muted  = false;
        desktopVideo.volume = volSlider.value > 0 ? parseFloat(volSlider.value) : 0.5;
        volSlider.value     = desktopVideo.volume;
        setDesktopMuteIcon(false);
      } else {
        desktopVideo.muted = true;
        setDesktopMuteIcon(true);
      }
    });

    /* Volume slider */
    volSlider.addEventListener('input', () => {
      desktopVideo.volume = parseFloat(volSlider.value);
      desktopVideo.muted  = desktopVideo.volume === 0;
      setDesktopMuteIcon(desktopVideo.muted);
    });
  }

  /* ── Hero video — Mobile (estilo Instagram) ── */
  const mobileSlot = document.getElementById('hero-video-mobile-slot');

  function buildMobileVideo() {
    if (window.innerWidth >= 1024 || !mobileSlot) return;
    if (mobileSlot.querySelector('video')) return; // já montado

    mobileSlot.innerHTML = ''; // limpa comentário

    /* Wrapper */
    const wrap = document.createElement('div');
    wrap.className = 'hero-video-mobile-inner';

    /* Vídeo — mudo por padrão (autoplay policy) */
    const vid = document.createElement('video');
    vid.autoplay   = true;
    vid.muted      = true;
    vid.loop       = true;
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.poster = 'imagens/hero-building.jpg';

    const srcWebm = document.createElement('source');
    srcWebm.src  = 'imagens/hero-video.webm';
    srcWebm.type = 'video/webm';

    const srcMp4 = document.createElement('source');
    srcMp4.src  = 'imagens/hero-video.mp4';
    srcMp4.type = 'video/mp4';

    vid.appendChild(srcWebm);
    vid.appendChild(srcMp4);

    /* Aviso "toque para ativar o som" */
    const hint = document.createElement('div');
    hint.className = 'mobile-sound-hint';
    hint.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> Toque para ativar o som';

    /* Controles circulares */
    const controls = document.createElement('div');
    controls.className = 'mobile-video-controls';

    /* Botão mute */
    const btnM = document.createElement('button');
    btnM.className  = 'mobile-ctrl-btn';
    btnM.setAttribute('aria-label', 'Ativar som');
    btnM.innerHTML  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" id="mob-icon-mute"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" id="mob-icon-sound" style="display:none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';

    /* Botão pause */
    const btnP = document.createElement('button');
    btnP.className  = 'mobile-ctrl-btn';
    btnP.setAttribute('aria-label', 'Pausar');
    btnP.innerHTML  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white" id="mob-icon-pause"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><svg width="16" height="16" viewBox="0 0 24 24" fill="white" id="mob-icon-play" style="display:none"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

    controls.appendChild(btnM);
    controls.appendChild(btnP);

    /* Lógica mute */
    btnM.addEventListener('click', () => {
      if (vid.muted) {
        vid.muted = false;
        vid.volume = 0.7;
        hint.classList.add('hidden');
        btnM.querySelector('#mob-icon-mute').style.display  = 'none';
        btnM.querySelector('#mob-icon-sound').style.display = '';
      } else {
        vid.muted = true;
        btnM.querySelector('#mob-icon-mute').style.display  = '';
        btnM.querySelector('#mob-icon-sound').style.display = 'none';
      }
    });

    /* Lógica pause — toque no botão */
    btnP.addEventListener('click', () => {
      if (vid.paused) {
        vid.play();
        btnP.querySelector('#mob-icon-pause').style.display = '';
        btnP.querySelector('#mob-icon-play').style.display  = 'none';
      } else {
        vid.pause();
        btnP.querySelector('#mob-icon-pause').style.display = 'none';
        btnP.querySelector('#mob-icon-play').style.display  = '';
      }
    });

    /* Toque direto no vídeo também ativa o som (primeira vez) */
    vid.addEventListener('click', () => {
      if (vid.muted) {
        vid.muted = false;
        vid.volume = 0.7;
        hint.classList.add('hidden');
        btnM.querySelector('#mob-icon-mute').style.display  = 'none';
        btnM.querySelector('#mob-icon-sound').style.display = '';
      }
    });

    wrap.appendChild(vid);
    wrap.appendChild(hint);
    wrap.appendChild(controls);
    mobileSlot.appendChild(wrap);

    vid.play().catch(() => {});
  }

  buildMobileVideo();
  window.addEventListener('resize', buildMobileVideo);



  /* ── Muta vídeos ao sair do viewport ── */
  const allVideoWrappers = [
    { el: document.getElementById('hero-video-col'),        getVid: () => desktopVideo },
    { el: document.getElementById('hero-video-mobile-slot'), getVid: () => mobileSlot?.querySelector('video') },
  ];

  allVideoWrappers.forEach(({ el, getVid }) => {
    if (!el) return;
    const vpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = getVid();
        if (!vid) return;
        if (!entry.isIntersecting) {
          vid._mutedByScroll = !vid.muted; // salva se estava com som
          vid.muted = true;
        } else {
          if (vid._mutedByScroll) {
            vid.muted = false; // restaura som se tinha antes
            vid._mutedByScroll = false;
          }
        }
      });
    }, { threshold: 0.1 });
    vpObserver.observe(el);
  });

  

/* NEW FORM INTEGRAÇÃO */

/* ── Integração Formulário com Make ── */
/* ── Envio do Formulário + Timer de 2.5s e Animação de Carregamento ── */
const leadForm = document.getElementById('lead-form');
const formFeedback = document.getElementById('form-feedback');

if (leadForm) {
  leadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn ? submitBtn.innerText : '';

    // 1. Ativa estado de carregamento no botão
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
      submitBtn.innerText = 'Enviando';
    }

    const formData = new FormData(leadForm);
    const data = Object.fromEntries(formData.entries());
    const webhookUrl = 'https://hook.us2.make.com/02vrpz1tcsr477ybqpwe98vhhv7dq3ve';

    // 2. Timer de delay mínimo de 2.500ms (2,5 segundos)
    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      // Executa a requisição HTTP e o cronômetro simultaneamente
      const [response] = await Promise.all([
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
        minDelay
      ]);

      if (response.ok) {
        // 3. Oculta o formulário e exibe o bloco de sucesso
        leadForm.classList.add('hidden');
        if (formFeedback) {
          formFeedback.classList.remove('hidden');
        }
        leadForm.reset();
      } else {
        throw new Error(`Erro no servidor: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro de envio:', error);
      alert('Houve um problema ao enviar seus dados. Por favor, tente novamente ou entre em contato via WhatsApp.');
      
      // Restaura o botão em caso de falha para o usuário tentar novamente
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerText = originalBtnText;
      }
    } finally {
      // Garante a remoção da animação se o formulário continuar visível
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.classList.remove('btn-loading');
      }
    }
  });
}	

	  /* Máscara dinâmica para telefone/WhatsApp (DDD + 9 dígitos) */
const phoneInput = document.getElementById('whatsapp');

if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    
    // Limita o tamanho máximo a 11 dígitos (DDD + 9 do celular)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Aplica a formatação conforme o tamanho do texto
    if (value.length > 10) {
      // Formato com 11 dígitos: (XX) XXXXX-XXXX
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    } else if (value.length > 6) {
      // Formato intermediário com 10 dígitos (caso receba fixo ou digitando): (XX) XXXX-XXXX
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      // Formato apenas com DDD: (XX) XXXX
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      // Apenas parêntese inicial: (XX
      value = `(${value}`;
    }

    e.target.value = value;
  });
}
	  
	  

  /* ── Testimonials carousel — entrada suave do container ── */
  const testimonialsCarousel = document.querySelector('.testimonials-carousel');
  if (testimonialsCarousel) {
    testimonialsCarousel.classList.add('anim-stagger');
    const tcObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          testimonialsCarousel.classList.add('visible');
          tcObserver.unobserve(testimonialsCarousel);
        }
      });
    }, { threshold: 0.15 });
    tcObserver.observe(testimonialsCarousel);
  }

  /* ── Pillar cards — stagger de entrada separado ── */
  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        pillarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.pillar-card').forEach((card, i) => {
    card.classList.add('anim-stagger');
    card.style.transitionDelay = `${i * 80}ms`;
    pillarObserver.observe(card);
  });

  /* ── Pillar cards — efeito dock estilo Apple ── */
  const pillarsGrid = document.querySelector('.pillars-grid');
  const pillarCards = document.querySelectorAll('.pillar-card');

  if (pillarsGrid && window.innerWidth >= 1024) {
    let leaveTimer = null;

    pillarCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        /* Cancela timer de saída se ainda estiver pendente */
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }

        /* Ativa o grid e troca o card ativo em uma operação — sem reset intermediário */
        pillarsGrid.classList.add('has-hover');
        pillarCards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });

      card.addEventListener('mouseleave', (e) => {
        /* Verifica se o mouse foi para outro card */
        const toElement = e.relatedTarget;
        const goingToCard = toElement && toElement.closest('.pillar-card');

        if (!goingToCard) {
          /* Mouse saiu do grid inteiro — aguarda um frame para evitar flicker */
          leaveTimer = setTimeout(() => {
            pillarsGrid.classList.remove('has-hover');
            pillarCards.forEach(c => c.classList.remove('is-active'));
            leaveTimer = null;
          }, 80);
        }
      });
    });

    /* Saída do grid completo */
    pillarsGrid.addEventListener('mouseleave', () => {
      leaveTimer = setTimeout(() => {
        pillarsGrid.classList.remove('has-hover');
        pillarCards.forEach(c => c.classList.remove('is-active'));
        leaveTimer = null;
      }, 80);
    });

    pillarsGrid.addEventListener('mouseenter', () => {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ── Carrossel de imagens por cidade ── */
  const AUTOPLAY_DELAY = 3500;

  document.querySelectorAll('[data-carousel]').forEach(wrap => {
    const slides = wrap.querySelectorAll('.carousel-slide');
    const dots   = wrap.querySelectorAll('.carousel-dot');
    const prev   = wrap.querySelector('.carousel-prev');
    const next   = wrap.querySelector('.carousel-next');
    let current  = 0;
    let timer    = null;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    /* Autoplay pausa quando o carrossel sai do viewport */
    const cityPanel = wrap.closest('.city-panel');
    const observeTarget = cityPanel || wrap;
    const panelObserver = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? startAutoplay() : stopAutoplay());
    }, { threshold: 0.2 });
    panelObserver.observe(observeTarget);

    /* Setas */
    prev.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
    next.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

    /* Dots */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
    });

    /* Pausa no hover */
    wrap.addEventListener('mouseenter', stopAutoplay);
    wrap.addEventListener('mouseleave', startAutoplay);

    /* Para city-panel: inicia só se ativo. Para outros (consultor): deixa o observer decidir */
    if (cityPanel && !cityPanel.classList.contains('active')) stopAutoplay();
  });

  /* ── City tabs com slider ── */
  const tabsContainer = document.querySelector('.city-tabs');
  const slider = document.querySelector('.city-tabs-slider');

  function moveSlider(tab) {
    slider.style.width  = tab.offsetWidth  + 'px';
    slider.style.height = tab.offsetHeight + 'px';
    slider.style.transform = 'translateX(' + tab.offsetLeft + 'px) translateY(' + tab.offsetTop + 'px)';
  }

  /* posiciona na aba ativa ao carregar */
  const firstActive = document.querySelector('.city-tab.active');
  if (firstActive) {
    slider.style.transition = 'none';
    moveSlider(firstActive);
    requestAnimationFrame(() => {
      slider.style.transition = '';
    });
  }

  document.querySelectorAll('.city-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.city;
      document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.city-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const activePanel = document.getElementById('city-' + target);
      activePanel.classList.add('active');
      moveSlider(tab);
      /* Inicia autoplay do carrossel da aba recém-ativada */
      const carousel = activePanel.querySelector('[data-carousel]');
      if (carousel) carousel.dispatchEvent(new Event('mouseleave'));
    });
  });


/* Ajusta o slider se a tela mudar de tamanho */
window.addEventListener('resize', () => {
  const activeTab = document.querySelector('.city-tab.active');
  if (activeTab && slider) moveSlider(activeTab);
});




  /* ── Carrossel de Depoimentos (coverflow) ── */
  (function() {
    const track   = document.getElementById('testimonials-track');
    const dots    = document.querySelectorAll('.t-dot');
    const cards   = document.querySelectorAll('.testimonial-card[data-index]');
    if (!track || !cards.length) return;

    const TOTAL       = cards.length; // 3
    const AUTOPLAY_MS = 6000;
    let current       = 0;
    let autoTimer     = null;
    let isAnimating   = false;

    /* Aplica as classes de posição */
    function applyPositions(animate) {
      const left   = (current - 1 + TOTAL) % TOTAL;
      const center = current;
      const right  = (current + 1) % TOTAL;

      if (!animate) {
        /* Desativa transição temporariamente para posicionamento inicial */
        cards.forEach(c => {
          c.style.transition = 'none';
          c.classList.remove('pos-left', 'pos-center', 'pos-right');
        });
        cards[center].classList.add('pos-center');
        cards[left].classList.add('pos-left');
        cards[right].classList.add('pos-right');
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        /* Força reflow antes de reativar transição */
        track.getBoundingClientRect();
        cards.forEach(c => c.style.transition = '');
      } else {
        cards.forEach((card, i) => {
          card.classList.remove('pos-left', 'pos-center', 'pos-right');
          if (i === center)    card.classList.add('pos-center');
          else if (i === left) card.classList.add('pos-left');
          else if (i === right) card.classList.add('pos-right');
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }
    }

    /* Navega para índice — direção determina animação */
    function goTo(index) {
      if (isAnimating || index === current) return;
      isAnimating = true;
      current = ((index % TOTAL) + TOTAL) % TOTAL;
      applyPositions(true);
      setTimeout(() => { isAnimating = false; }, 570);
    }

    function next() { goTo((current + 1) % TOTAL); }
    function prev() { goTo((current - 1 + TOTAL) % TOTAL); }

    function startAutoplay() {
      stopAutoplay();
      autoTimer = setInterval(next, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    /* Init sem animação */
    applyPositions(false);
    startAutoplay();

    /* Clique nos cards laterais */
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('pos-center')) return;
        goTo(i);
        startAutoplay();
      });
    });

    /* Dots */
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.goto));
        startAutoplay();
      });
    });

    /* Pausa autoplay quando hover no carrossel */
    track.closest('.testimonials-carousel').addEventListener('mouseenter', stopAutoplay);
    track.closest('.testimonials-carousel').addEventListener('mouseleave', startAutoplay);

    /* Swipe mobile */
    let touchStartX = 0;
    let touchStartY = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      /* Só dispara se o swipe for mais horizontal que vertical */
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) next(); // swipe left → próximo
        else prev();        // swipe right → anterior
        startAutoplay();
      }
    }, { passive: true });

    /* Pausa quando sai do viewport */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? startAutoplay() : stopAutoplay());
    }, { threshold: 0.3 });
    observer.observe(track.closest('.testimonials-carousel'));

  })();

  /* ── Zoom de imagem — carrossel cidades (desktop only) ── */
  const zoomModal    = document.getElementById('zoom-modal');
  const zoomModalImg = document.getElementById('zoom-modal-img');
  const zoomClose    = document.getElementById('zoom-modal-close');

  function openZoom(src, alt) {
    if (window.innerWidth < 1024) return; // desktop only
    zoomModalImg.src = src;
    zoomModalImg.alt = alt || 'Imagem ampliada';
    zoomModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeZoom() {
    zoomModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Delegação de eventos — clique nas imagens zoomáveis dentro dos carrosseis das cidades */
  document.querySelectorAll('[data-carousel] .zoom-trigger').forEach(img => {
    img.addEventListener('click', (e) => {
      /* Não dispara se o clique veio de dentro dos controles */
      if (e.target.closest('.carousel-controls')) return;
      openZoom(img.src, img.alt);
    });
  });

  /* Fechar */
  if (zoomClose) zoomClose.addEventListener('click', closeZoom);

  /* Clique na imagem ampliada fecha (cursor zoom-out) */
  if (zoomModalImg) zoomModalImg.addEventListener('click', closeZoom);

  /* Clique no overlay escuro fecha */
  zoomModal.addEventListener('click', (e) => {
    if (e.target === zoomModal) closeZoom();
  });

  /* ESC fecha */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && zoomModal.classList.contains('open')) closeZoom();
  });

  /* ── Modal Águia Consultoria ── */
const aguiaModal   = document.getElementById('aguia-modal');
const aguiaTrigger = document.getElementById('aguia-modal-trigger');
const aguiaClose   = document.getElementById('aguia-modal-close');

// 1. Função para ABRIR o modal e criar o estado no histórico
function openAguiaModal(e) {
  if (e) e.preventDefault();
  
  aguiaModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Adiciona o estado temporário no histórico de navegação
  history.pushState({ aguiaModalOpen: true }, '');
}

// 2. Função pura para OCULTAR visualmente o modal da tela
function hideAguiaModal() {
  aguiaModal.classList.remove('open');
  document.body.style.overflow = '';
}

// 3. Função acionada ao fechar por Botão X, Overlay ou Tecla ESC
function closeAguiaModal() {
  // Se o estado ainda está no histórico, recuamos via JS (isso dispara o evento 'popstate')
  if (history.state && history.state.aguiaModalOpen) {
    history.back();
  } else {
    hideAguiaModal();
  }
}

/* Eventos de Abertura e Fechamento Direto */
if (aguiaTrigger) aguiaTrigger.addEventListener('click', openAguiaModal);
if (aguiaClose)   aguiaClose.addEventListener('click', closeAguiaModal);

/* Fecha ao clicar no overlay (fundo escuro) */
if (aguiaModal) {
  aguiaModal.addEventListener('click', (e) => {
    if (e.target === aguiaModal) closeAguiaModal();
  });
}

/* Fecha com a tecla ESC no Desktop */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aguiaModal.classList.contains('open')) {
    closeAguiaModal();
  }
});

/* 4. CAPTURA DO BOTÃO "VOLTAR" / GESTO MOBILE */
window.addEventListener('popstate', () => {
  if (aguiaModal.classList.contains('open')) {
    hideAguiaModal();
  }
});


  /* ── Cookie Banner (LGPD) ── */
  const cookieBanner = document.getElementById('cookie-banner');

  function hideBanner() {
    cookieBanner.classList.add('hidden');
  }

  /* Só mostra se o usuário ainda não escolheu */
  if (!localStorage.getItem('cookie-consent')) {
    cookieBanner.classList.remove('hidden');
  } else {
    cookieBanner.classList.add('hidden');
  }

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'all');
    hideBanner();
  });

  document.getElementById('cookie-essential').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'essential');
    hideBanner();
  });

  /* ── Open first FAQ by default ── */
  //const firstFaq = document.querySelector('.faq-item');
  //if (firstFaq) firstFaq.classList.add('open');

  /* ── Stagger scroll animations ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  /* Agrupa elementos por seção pai e aplica delay em cascata */
  const sections = document.querySelectorAll(
    'header, section, .trust-bar, .testimonials, .lead-form, .cta-block, footer'
  );

  sections.forEach(section => {
    const animEls = section.querySelectorAll(
      'h1, h2, h3, p.eyebrow, .section-eyebrow, .hero-desc, .section-sub, ' +
      '.trust-item, .metric-item, .city-headline, .city-body, ' +
      '.checklist li, .hero-ctas, .btn-cta, .btn-cta-full, ' +
      '.consultant-content h2, .consultant-content p, .consultant-meta, ' +
      '.lead-form-info h2, .lead-form-info p, form, ' +
      '.faq-item, .footer-brand, .footer-col'
    );

    animEls.forEach((el, i) => {
      el.classList.add('anim-stagger');
      el.style.transitionDelay = `${i * 80}ms`;
      observer.observe(el);
    });
  });

});
