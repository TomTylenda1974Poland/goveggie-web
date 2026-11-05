(() => {
  const mount = document.getElementById('friendly-contact');
  if (!mount) return;
  const copy = {
    es: {intro:'Elige lo que necesitas y cómo prefieres que te contactemos.', intent:'¿En qué podemos ayudarte?', catalog:'Quiero el catálogo', quote:'Solicitar cotización', other:'Tengo una pregunta', name:'Tu nombre', company:'Empresa (opcional)', channel:'¿Cómo prefieres que te contactemos?', email:'Correo electrónico', phone:'WhatsApp', detail:'Algo más que debamos saber (opcional)', submitCatalog:'Solicitar catálogo', submitQuote:'Solicitar cotización', submitOther:'Enviar consulta', note:'Vista previa: este formulario todavía no envía solicitudes.', status:'Gracias por probar el formulario. Esta es una vista previa; no se ha enviado tu solicitud.', hint:'Solo necesitamos tu nombre y un medio de contacto.', companyHint:'Nombre de tu negocio', nameHint:'¿Cómo te llamas?', detailHint:'Productos, cantidades o cualquier duda…'},
    en: {intro:'Choose what you need and how you would like us to contact you.', intent:'How can we help?', catalog:'Get the catalogue', quote:'Request a quote', other:'Ask a question', name:'Your name', company:'Company (optional)', channel:'How should we contact you?', email:'Email address', phone:'WhatsApp', detail:'Anything else we should know? (optional)', submitCatalog:'Request catalogue', submitQuote:'Request a quote', submitOther:'Send enquiry', note:'Preview: this form does not send requests yet.', status:'Thanks for trying the form. This is a preview; your request has not been sent.', hint:'We only need your name and one way to contact you.', companyHint:'Your business name', nameHint:'What’s your name?', detailHint:'Products, quantities or any questions…'}
  };
  let intent = 'catalog', channel = 'email';
  const current = () => copy[document.documentElement.lang === 'en' ? 'en' : 'es'];
  mount.innerHTML = `<form class="friendly-form" id="contactRequest">
    <p data-contact="intro"></p>
    <fieldset><legend data-contact="intent"></legend><div class="contact-choices">
      <label><input type="radio" name="intent" value="catalog" checked><span data-contact="catalog"></span></label>
      <label><input type="radio" name="intent" value="quote"><span data-contact="quote"></span></label>
      <label><input type="radio" name="intent" value="other"><span data-contact="other"></span></label>
    </div></fieldset>
    <div class="contact-fields"><div><label for="contact-name" data-contact="name"></label><input id="contact-name" name="name" autocomplete="name" required maxlength="120" data-placeholder="nameHint"></div>
    <div><label for="contact-company" data-contact="company"></label><input id="contact-company" name="company" autocomplete="organization" maxlength="160" data-placeholder="companyHint"></div></div>
    <fieldset><legend data-contact="channel"></legend><div class="contact-choices contact-choices--channel">
      <label><input type="radio" name="channel" value="email" checked><span data-contact="email"></span></label>
      <label><input type="radio" name="channel" value="phone"><span data-contact="phone"></span></label>
    </div></fieldset>
    <div id="email-field"><label for="contact-email" data-contact="email"></label><input id="contact-email" name="email" type="email" autocomplete="email" placeholder="nombre@empresa.com" required></div>
    <div id="phone-field" hidden><label for="contact-phone" data-contact="phone"></label><input id="contact-phone" name="phone" type="tel" autocomplete="tel" placeholder="+1 809 000 0000" disabled></div>
    <div><label for="contact-message" data-contact="detail"></label><textarea id="contact-message" name="message" rows="3" maxlength="3000" data-placeholder="detailHint"></textarea></div>
    <p class="contact-hint" data-contact="hint"></p>
    <button class="btn" type="submit" id="contact-submit"></button>
    <p class="contact-preview" data-contact="note"></p>
    <p class="contact-status" role="status" hidden></p>
  </form>`;
  const form = mount.querySelector('form');
  const status = mount.querySelector('.contact-status');
  const update = () => {
    const t = current();
    mount.querySelectorAll('[data-contact]').forEach(el => el.textContent = t[el.dataset.contact]);
    mount.querySelectorAll('[data-placeholder]').forEach(el => el.placeholder = t[el.dataset.placeholder]);
    mount.querySelector('#contact-submit').textContent = t[{catalog:'submitCatalog',quote:'submitQuote',other:'submitOther'}[intent]];
    for (const type of ['email','phone']) {
      const input = mount.querySelector('#contact-'+type);
      mount.querySelector('#'+type+'-field').hidden = type !== channel;
      input.disabled = type !== channel;
      input.required = type === channel;
    }
    if (!status.hidden) status.textContent = t.status;
  };
  form.addEventListener('change', e => {
    if (e.target.name === 'intent') intent = e.target.value;
    if (e.target.name === 'channel') channel = e.target.value;
    status.hidden = true;
    update();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = current().status;
    status.hidden = false;
  });
  new MutationObserver(update).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  update();
})();
