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

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
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
      document.getElementById('city-' + target).classList.add('active');
      moveSlider(tab);
    });
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
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');

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
      '.pillar-card, .trust-item, .metric-item, .city-headline, .city-body, ' +
      '.testimonial-card, .checklist li, .hero-ctas, .btn-cta, .btn-cta-full, ' +
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
