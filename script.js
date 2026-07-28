/* script.js */

document.addEventListener('DOMContentLoaded', () => {


  /* ── Hero video ── */
  const heroVideo       = document.getElementById('hero-video');
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

  if (heroVideo) {
    /* Clique direto no vídeo pausa/retoma */
    heroVideo.addEventListener('click', () => {
      if (heroVideo.paused) { heroVideo.play(); setDesktopPlayIcon(true); }
      else { heroVideo.pause(); setDesktopPlayIcon(false); }
    });

    /* Botão play/pause */
    btnPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      if (heroVideo.paused) { heroVideo.play(); setDesktopPlayIcon(true); }
      else { heroVideo.pause(); setDesktopPlayIcon(false); }
    });

    /* Mute/unmute */
    btnMute.addEventListener('click', () => {
      if (heroVideo.muted) {
        heroVideo.muted  = false;
        heroVideo.volume = volSlider.value > 0 ? parseFloat(volSlider.value) : 0.5;
        volSlider.value  = heroVideo.volume;
        setDesktopMuteIcon(false);
      } else {
        heroVideo.muted = true;
        setDesktopMuteIcon(true);
      }
    });

    /* Volume slider */
    volSlider.addEventListener('input', () => {
      heroVideo.volume = parseFloat(volSlider.value);
      heroVideo.muted  = heroVideo.volume === 0;
      setDesktopMuteIcon(heroVideo.muted);
    });
  }

  /* Pausa o player fora da viewport e retoma somente se ele estava tocando. */
  const heroVideoWrapper = document.getElementById('hero-video-col');
  if (heroVideo && heroVideoWrapper) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (heroVideo.dataset.resume === 'true') {
          heroVideo.play().catch(() => {});
          heroVideo.dataset.resume = 'false';
        }
        return;
      }

      heroVideo.dataset.resume = String(!heroVideo.paused);
      heroVideo.pause();
      setDesktopPlayIcon(false);
    }, { threshold: 0.1 });
    videoObserver.observe(heroVideoWrapper);
  }

  

/* NEW FORM INTEGRAÇÃO */

/* ── Integração Formulário com Make ── */
/* ── Envio do Formulário + Timer de 2.5s e Animação de Carregamento ── */
const leadForm = document.getElementById('lead-form');
const formFeedback = document.getElementById('form-feedback');
const formError = document.getElementById('form-error');

if (leadForm) {
  const submitBtn = document.getElementById('submit-btn');
  const originalBtnText = submitBtn ? submitBtn.innerText : '';

  function showFormError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.remove('hidden');
    formError.focus();
  }

  function clearFormError() {
    if (!formError) return;
    formError.textContent = '';
    formError.classList.add('hidden');
  }

  leadForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('invalid', () => field.setAttribute('aria-invalid', 'true'));
    field.addEventListener('input', () => {
      field.setAttribute('aria-invalid', String(!field.validity.valid));
      if (field.validity.valid) clearFormError();
    });
  });

  leadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      return;
    }

    clearFormError();
    leadForm.setAttribute('aria-busy', 'true');

    // 1. Ativa estado de carregamento no botão
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
      submitBtn.innerText = 'Enviando';
    }

    const formData = new FormData(leadForm);
    const data = Object.fromEntries(formData.entries());
    const webhookUrl = 'https://hook.us2.make.com/02vrpz1tcsr477ybqpwe98vhhv7dq3ve';
    const requestController = new AbortController();
    const requestTimeout = setTimeout(() => requestController.abort(), 15000);

    // 2. Timer de delay mínimo de 2.500ms (2,5 segundos)
    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      // Executa a requisição HTTP e o cronômetro simultaneamente
      const [response] = await Promise.all([
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: requestController.signal,
        }),
        minDelay
      ]);

      if (response.ok) {
        // 3. Oculta o formulário e exibe o bloco de sucesso
        leadForm.classList.add('hidden');
        if (formFeedback) {
          formFeedback.classList.remove('hidden');
          formFeedback.focus();
        }
        leadForm.reset();
      } else {
        throw new Error(`Erro no servidor: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro de envio:', error);
      const message = error?.name === 'AbortError'
        ? 'O envio demorou mais do que o esperado. Verifique sua conexão e tente novamente.'
        : 'Não foi possível enviar seus dados agora. Tente novamente em instantes.';
      showFormError(message);
      
      // Restaura o botão em caso de falha para o usuário tentar novamente
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerText = originalBtnText;
      }
    } finally {
      clearTimeout(requestTimeout);
      leadForm.removeAttribute('aria-busy');
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
    const isCompletePhone = value === '' || /^(\([0-9]{2}\) [0-9]{4,5}-[0-9]{4})$/.test(value);
    e.target.setCustomValidity(isCompletePhone ? '' : 'Informe um telefone válido com DDD.');
    e.target.setAttribute('aria-invalid', String(!e.target.validity.valid));
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
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
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
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === current;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        if (slide.classList.contains('zoom-trigger')) slide.tabIndex = isActive ? 0 : -1;
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === current;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', String(isActive));
      });
    }

    goTo(0);

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

  const cityTabs = Array.from(document.querySelectorAll('.city-tab'));

  function activateCityTab(tab, moveFocus = false) {
      const target = tab.dataset.city;
      cityTabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', String(isActive));
        t.tabIndex = isActive ? 0 : -1;
      });
      document.querySelectorAll('.city-panel').forEach(panel => {
        const isActive = panel.id === 'city-' + target;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
      const activePanel = document.getElementById('city-' + target);
      moveSlider(tab);
      /* Inicia autoplay do carrossel da aba recém-ativada */
      const carousel = activePanel.querySelector('[data-carousel]');
      if (carousel) carousel.dispatchEvent(new Event('mouseleave'));
      if (moveFocus) tab.focus();
  }

  cityTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateCityTab(tab));
    tab.addEventListener('keydown', (event) => {
      const keyToOffset = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (event.key in keyToOffset) {
        event.preventDefault();
        activateCityTab(cityTabs[(index + keyToOffset[event.key] + cityTabs.length) % cityTabs.length], true);
      } else if (event.key === 'Home') {
        event.preventDefault();
        activateCityTab(cityTabs[0], true);
      } else if (event.key === 'End') {
        event.preventDefault();
        activateCityTab(cityTabs[cityTabs.length - 1], true);
      }
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

    /* ── Drag/touch interativo em tempo real ── */
    let dragStartX   = 0;
    let dragStartY   = 0;
    let isDragging   = false;
    let isHorizontal = null;

    /* Offset base de cada posição — deve espelhar exatamente o CSS */
    const isMobile = () => window.innerWidth < 768;
    function getBaseOffset(pos) {
      if (pos === 'center') return 0;
      const offset = isMobile() ? window.innerWidth * 0.70 : 408;
      return pos === 'right' ? offset : -offset;
    }

    function getBaseScale(pos) {
      return pos === 'center' ? 1 : 0.75;
    }

    function getCardPos(card) {
      if (card.classList.contains('pos-center')) return 'center';
      if (card.classList.contains('pos-left'))   return 'left';
      return 'right';
    }

    /* Aplica transform diretamente no card durante o drag */
    function setCardDragTransform(card, extraX, progress) {
      const pos       = getCardPos(card);
      const baseOffset = getBaseOffset(pos);
      const baseScale  = getBaseScale(pos);

      /* Escala progressiva no card que se aproxima */
      let scale = baseScale;
      const approaching =
        (pos === 'right' && extraX < 0) ||
        (pos === 'left'  && extraX > 0);
      if (approaching) {
        scale = baseScale + (1 - baseScale) * Math.min(progress, 1) * 0.7;
      }

      card.style.transform = `translateX(calc(-50% + ${baseOffset + extraX}px)) scale(${scale.toFixed(4)})`;
    }

    function onDragStart(clientX, clientY) {
      dragStartX   = clientX;
      dragStartY   = clientY;
      isDragging   = true;
      isHorizontal = null;
      stopAutoplay();
      /* Desativa transição para movimento instantâneo */
      cards.forEach(c => {
        c.style.transition = 'none';
      });
    }

    function onDragMove(clientX, clientY) {
      if (!isDragging) return;

      const dx = clientX - dragStartX;
      const dy = clientY - dragStartY;

      /* Detecta direção dominante nos primeiros pixels */
      if (isHorizontal === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        isHorizontal = Math.abs(dx) > Math.abs(dy);
        if (!isHorizontal) { onDragCancel(); return; }
      }

      if (!isHorizontal) return;

      /* Deslocamento com resistência progressiva */
      const maxDrag    = isMobile() ? window.innerWidth * 0.5 : 300;
      const resistance = 1 - (Math.abs(dx) / (maxDrag * 3));
      const extraX     = dx * Math.max(resistance, 0.3);
      const progress   = Math.abs(dx) / 120;

      cards.forEach(card => setCardDragTransform(card, extraX, progress));
    }

    function onDragEnd(clientX) {
      if (!isDragging) return;
      isDragging = false;

      const dx        = clientX - dragStartX;
      const threshold = isMobile() ? 60 : 80;

      /* Reativa transição antes do snap/navigate */
      cards.forEach(c => {
        c.style.transition = '';
        c.style.transform  = ''; /* deixa CSS assumir */
      });

      if (isHorizontal && Math.abs(dx) >= threshold) {
        dx < 0 ? next() : prev();
      } else {
        applyPositions(true); /* snap back */
      }

      startAutoplay();
    }

    function onDragCancel() {
      if (!isDragging) return;
      isDragging = false;
      cards.forEach(c => { c.style.transition = ''; c.style.transform = ''; });
      applyPositions(true);
      startAutoplay();
    }

    /* Touch */
    track.addEventListener('touchstart', (e) => {
      onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (isDragging && isHorizontal) e.preventDefault();
      onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    track.addEventListener('touchend',    (e) => onDragEnd(e.changedTouches[0].clientX), { passive: true });
    track.addEventListener('touchcancel', onDragCancel, { passive: true });

    /* Mouse (desktop) */
    track.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('.t-dot')) return;
      onDragStart(e.clientX, e.clientY);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) onDragMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', (e) => {
      if (isDragging) onDragEnd(e.clientX);
    });

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
  let activeModal = null;
  let lastFocusedElement = null;
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openModal(modal, trigger) {
    lastFocusedElement = trigger || document.activeElement;
    activeModal = modal;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const initialFocus = modal.querySelector('.aguia-modal-close, .zoom-modal-close') || modal.querySelector(focusableSelector);
    requestAnimationFrame(() => initialFocus?.focus());
  }

  function hideModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (activeModal === modal) activeModal = null;
    if (lastFocusedElement instanceof HTMLElement && lastFocusedElement.isConnected) {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  document.addEventListener('keydown', (event) => {
    if (!activeModal || event.key !== 'Tab') return;
    const focusable = Array.from(activeModal.querySelectorAll(focusableSelector));
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function openZoom(src, alt, trigger) {
    if (window.innerWidth < 1024) return; // desktop only
    zoomModalImg.src = src;
    zoomModalImg.alt = alt || 'Imagem ampliada';
    openModal(zoomModal, trigger);
  }

  function closeZoom() {
    hideModal(zoomModal);
  }

  /* Delegação de eventos — clique nas imagens zoomáveis dentro dos carrosseis das cidades */
  document.querySelectorAll('[data-carousel] .zoom-trigger').forEach(img => {
    img.tabIndex = img.classList.contains('active') ? 0 : -1;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Ampliar imagem: ${img.alt}`);

    function openImageZoom(event) {
      /* Não dispara se o clique veio de dentro dos controles */
      if (event.target.closest('.carousel-controls')) return;
      openZoom(img.src, img.alt, img);
    }

    img.addEventListener('click', openImageZoom);
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImageZoom(event);
      }
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
  openModal(aguiaModal, e?.currentTarget);

  // Adiciona o estado temporário no histórico de navegação
  history.pushState({ aguiaModalOpen: true }, '');
}

// 2. Função pura para OCULTAR visualmente o modal da tela
function hideAguiaModal() {
  hideModal(aguiaModal);
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
