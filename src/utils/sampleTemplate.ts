export const SAMPLE_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-bio-text="business-name">Barbearia Don Corleone</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    body {
      background-color: #0b0d0c;
      color: #e5e7eb;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px 60px 16px;
      overflow-x: hidden;
    }
    .container {
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .header-card {
      background: linear-gradient(180deg, #151917 0%, #101312 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 28px;
      padding: 32px 24px;
      text-align: center;
      position: relative;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
    }
    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(53, 245, 138, 0.12);
      border: 1px solid rgba(53, 245, 138, 0.3);
      color: #35F58A;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 100px;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-dot {
      width: 7px;
      height: 7px;
      background-color: #35F58A;
      border-radius: 50%;
      box-shadow: 0 0 10px #35F58A;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
      100% { opacity: 1; transform: scale(1); }
    }
    .logo-wrap {
      width: 96px;
      height: 96px;
      margin: 0 auto 16px auto;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #35F58A, #10b981, rgba(255, 255, 255, 0.1));
      box-shadow: 0 10px 25px rgba(53, 245, 138, 0.25);
    }
    .logo-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #111;
      display: block;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
      margin-bottom: 8px;
    }
    .hero-subtitle {
      color: #35F58A;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .hero-description {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.6;
    }
    /* Action Buttons */
    .actions-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: #35F58A;
      color: #050505;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      padding: 16px 20px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(53, 245, 138, 0.3);
      transition: all 0.2s ease;
    }
    .btn-main:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(53, 245, 138, 0.45);
    }
    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #141816;
      border: 1px solid rgba(255, 255, 255, 0.07);
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 14px 18px;
      border-radius: 16px;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background: #19201d;
      border-color: rgba(53, 245, 138, 0.4);
      transform: translateY(-1px);
    }
    .btn-icon-label {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    /* Services Section */
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #8D9891;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
    }
    .services-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .service-card {
      background: #131715;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      transition: all 0.2s ease;
    }
    .service-card:hover {
      border-color: rgba(53, 245, 138, 0.3);
      background: #181d1a;
    }
    .service-info {
      flex: 1;
    }
    .service-name {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .service-desc {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.4;
      margin-bottom: 6px;
    }
    .service-price {
      font-size: 14px;
      font-weight: 700;
      color: #35F58A;
    }
    .service-btn {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 10px;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .service-btn:hover {
      background: #35F58A;
      color: #050505;
    }
    /* Gallery */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .gallery-item {
      aspect-ratio: 1;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
    }
    .gallery-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .gallery-img:hover {
      transform: scale(1.08);
    }
    /* Info Card */
    .info-card {
      background: #121514;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 13px;
      color: #d1d5db;
    }
    .info-icon {
      color: #35F58A;
      font-size: 16px;
      line-height: 1.2;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      margin-top: 10px;
    }
    .footer strong {
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Principal -->
    <header class="header-card">
      <div class="badge-status">
        <span class="badge-dot"></span>
        <span data-bio-text="badge">Atendimento Aberto Hoje</span>
      </div>

      <div class="logo-wrap">
        <img
          class="logo-img"
          data-bio-image="logo"
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300&h=300&fit=crop&crop=faces"
          alt="Logo da Barbearia"
        />
      </div>

      <h1 class="hero-title" data-bio-text="business-name">Barbearia Don Corleone</h1>
      <p class="hero-subtitle" data-bio-text="hero-subtitle">Cortes Clássicos & Barba Terapia</p>
      <p class="hero-description" data-bio-text="hero-description">
        Tradição, navalha quente e ambiente exclusivo para cavalheiros exigentes. Agende seu horário pelo WhatsApp.
      </p>
    </header>

    <!-- Botões de Ação Imediata -->
    <div class="actions-grid">
      <a
        class="btn-main"
        data-bio-link="whatsapp"
        href="https://wa.me/5534999999999?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20hor%C3%A1rio!"
        target="_blank"
      >
        <span>📱 Agendar Horário via WhatsApp</span>
      </a>

      <a
        class="btn-secondary"
        data-bio-link="instagram"
        href="https://instagram.com/doncorleonebarbearia"
        target="_blank"
      >
        <div class="btn-icon-label">
          <span>📸</span>
          <span data-bio-text="instagram-label">Siga nosso Instagram</span>
        </div>
        <span>→</span>
      </a>

      <a
        class="btn-secondary"
        data-bio-link="maps"
        href="https://www.google.com/maps/search/?api=1&query=Av.+Principal+1000"
        target="_blank"
      >
        <div class="btn-icon-label">
          <span>📍</span>
          <span data-bio-text="maps-label">Como Chegar (GPS)</span>
        </div>
        <span>→</span>
      </a>
    </div>

    <!-- Serviços -->
    <section>
      <div class="section-title">Nossos Serviços</div>
      <div class="services-container" data-bio-services="services-list">
        
        <div class="service-card" data-bio-service-item>
          <div class="service-info">
            <h3 class="service-name" data-bio-text="service-01-name">Corte Clássico & Degradê</h3>
            <p class="service-desc" data-bio-text="service-01-desc">Lavagem especial, finalização com pomada matte importada.</p>
            <span class="service-price" data-bio-text="service-01-price">R$ 55,00</span>
          </div>
          <a class="service-btn" data-bio-link="service-01-link" href="https://wa.me/5534999999999?text=Quero%20agendar%20Corte%20Cl%C3%A1ssico">Agendar</a>
        </div>

        <div class="service-card" data-bio-service-item>
          <div class="service-info">
            <h3 class="service-name" data-bio-text="service-02-name">Barboterapia Completa</h3>
            <p class="service-desc" data-bio-text="service-02-desc">Toalha quente com óleos essenciais, massagem facial e navalha.</p>
            <span class="service-price" data-bio-text="service-02-price">R$ 45,00</span>
          </div>
          <a class="service-btn" data-bio-link="service-02-link" href="https://wa.me/5534999999999?text=Quero%20agendar%20Barboterapia">Agendar</a>
        </div>

        <div class="service-card" data-bio-service-item>
          <div class="service-info">
            <h3 class="service-name" data-bio-text="service-03-name">Combo Cabelo + Barba</h3>
            <p class="service-desc" data-bio-text="service-03-desc">O tratamento completo para sair renovado e pronto pro final de semana.</p>
            <span class="service-price" data-bio-text="service-03-price">R$ 90,00</span>
          </div>
          <a class="service-btn" data-bio-link="service-03-link" href="https://wa.me/5534999999999?text=Quero%20agendar%20Combo%20Completo">Agendar</a>
        </div>

      </div>
    </section>

    <!-- Galeria de Fotos -->
    <section>
      <div class="section-title">Galeria de Estilos</div>
      <div class="gallery-grid" data-bio-gallery="barbershop-gallery">
        <div class="gallery-item">
          <img
            class="gallery-img"
            data-bio-image="gallery-photo-1"
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop"
            alt="Trabalho 1"
          />
        </div>
        <div class="gallery-item">
          <img
            class="gallery-img"
            data-bio-image="gallery-photo-2"
            src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop"
            alt="Trabalho 2"
          />
        </div>
        <div class="gallery-item">
          <img
            class="gallery-img"
            data-bio-image="gallery-photo-3"
            src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&h=300&fit=crop"
            alt="Trabalho 3"
          />
        </div>
      </div>
    </section>

    <!-- Localização e Horários -->
    <div class="info-card">
      <div class="info-row">
        <span class="info-icon">📍</span>
        <div>
          <strong style="color: #ffffff;">Endereço</strong>
          <p data-bio-text="address">Av. Getúlio Vargas, 1420 - Centro, Uberlândia - MG</p>
        </div>
      </div>

      <div class="info-row">
        <span class="info-icon">⏰</span>
        <div>
          <strong style="color: #ffffff;">Horário de Atendimento</strong>
          <p data-bio-text="hours">Terça a Sábado: 09h às 20h</p>
        </div>
      </div>
    </div>

    <!-- Rodapé -->
    <footer class="footer">
      <p>© 2026 <strong data-bio-text="business-name">Barbearia Don Corleone</strong>. Todos os direitos reservados.</p>
    </footer>
  </div>

  <script>
    // Teste de interatividade local dentro do modelo
    console.log("Biosite carregado com sucesso.");
  </script>
</body>
</html>`;
