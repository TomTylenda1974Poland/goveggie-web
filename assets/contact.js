(() => {
  const mount = document.getElementById('friendly-contact');
  if (!mount) return;
  const copy = {
    es: {intro:'Elige lo que necesitas y cómo prefieres que te contactemos.', intent:'¿En qué podemos ayudarte?', catalog:'Quiero el catálogo', quote:'Solicitar cotización', other:'Tengo una pregunta', name:'Tu nombre', company:'Empresa (opcional)', channel:'¿Cómo prefieres que te contactemos?', email:'Correo electrónico', phone:'WhatsApp', detail:'Algo más que debamos saber (opcional)', send:'Abrir correo para enviar', note:'Abriremos el mensaje listo para que lo envíes desde tu correo.', status:'Si el borrador no se abrió, copia tu consulta y envíala a', copy:'Copiar consulta', copied:'Consulta copiada', manual:'Selecciona y copia el texto de tu consulta.', hint:'Solo necesitamos tu nombre y un medio de contacto.', companyHint:'Nombre de tu negocio', nameHint:'¿Cómo te llamas?', detailHint:'Productos, cantidades o cualquier duda…'},
    en: {intro:'Choose what you need and how you would like us to contact you.', intent:'How can we help?', catalog:'Get the catalogue', quote:'Request a quote', other:'Ask a question', name:'Your name', company:'Company (optional)', channel:'How should we contact you?', email:'Email address', phone:'WhatsApp', detail:'Anything else we should know? (optional)', send:'Open email to send', note:'Your email app will open with the message ready for you to send.', status:'If the draft did not open, copy your enquiry and email it to', copy:'Copy enquiry', copied:'Enquiry copied', manual:'Select and copy your enquiry below.', hint:'We only need your name and one way to contact you.', companyHint:'Your business name', nameHint:'What’s your name?', detailHint:'Products, quantities or any questions…'}
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
    <div class="contact-status" hidden>
      <p><span data-contact="status"></span> <a href="mailto:james@goveggie.life">james@goveggie.life</a>.</p>
      <button type="button" data-contact="copy"></button>
      <textarea aria-label="GoVeggie" readonly hidden></textarea>
      <span role="status"></span>
    </div>
  </form>`;
  const form = mount.querySelector('form');
  const status = mount.querySelector('.contact-status');
  const update = () => {
    const t = current();
    mount.querySelectorAll('[data-contact]').forEach(el => el.textContent = t[el.dataset.contact]);
    mount.querySelectorAll('[data-placeholder]').forEach(el => el.placeholder = t[el.dataset.placeholder]);
    mount.querySelector('#contact-submit').textContent = t.send;
    for (const type of ['email','phone']) {
      const input = mount.querySelector('#contact-'+type);
      mount.querySelector('#'+type+'-field').hidden = type !== channel;
      input.disabled = type !== channel;
      input.required = type === channel;
    }

  };
  form.addEventListener('change', e => {
    if (e.target.name === 'intent') intent = e.target.value;
    if (e.target.name === 'channel') channel = e.target.value;
    status.hidden = true;
    update();
  });
  function buildDraft() {
    const t = current();
    const data = new FormData(form);
    const from = data.get('name').trim();
    const lines = [
      t[intent],
      t.name + ': ' + from,
      data.get('company') && t.company.replace(/ \(.*?\)/, '') + ': ' + data.get('company'),
      t[channel] + ': ' + data.get(channel),
      data.get('message')
    ];
    return {subject: 'GoVeggie - ' + t[intent], body: lines.filter(Boolean).join('\r\n')};
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const {subject, body} = buildDraft();
    const url = 'mailto:james@goveggie.life?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    status.hidden = false;
    status.querySelector('[role=status]').textContent = '';
    status.querySelector('textarea').hidden = true;
    window.location.href = url;
  });
  status.querySelector('button').addEventListener('click', async () => {
    const {body} = buildDraft();
    const result = status.querySelector('[role=status]');
    try {
      await navigator.clipboard.writeText(body);
      result.textContent = current().copied;
    } catch {
      const field = status.querySelector('textarea');
      field.value = body;
      field.hidden = false;
      field.focus();
      field.select();
      result.textContent = current().manual;
    }
  });
  new MutationObserver(update).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  update();
})();
