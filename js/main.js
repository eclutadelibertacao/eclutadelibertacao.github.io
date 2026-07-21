const botao=document.querySelector('.menu-botao');const menu=document.querySelector('.menu');botao.addEventListener('click',()=>{const aberto=menu.classList.toggle('aberto');botao.setAttribute('aria-expanded',String(aberto));});document.querySelectorAll('.menu a').forEach(link=>link.addEventListener('click',()=>menu.classList.remove('aberto')));
const observados=document.querySelectorAll('.secao article,.titulo,.estado-vazio');
const observador=new IntersectionObserver((entradas)=>{
  entradas.forEach((entrada)=>{
    if(entrada.isIntersecting){
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    }
  });
},{threshold:.12});
observados.forEach((item)=>{
  item.classList.add('revelar');
  observador.observe(item);
});

const slides=[...document.querySelectorAll('.evento-slide')];
const pontos=[...document.querySelectorAll('.carrossel-indicadores button')];
const anterior=document.querySelector('.carrossel-seta.anterior');
const proxima=document.querySelector('.carrossel-seta.proxima');
let indiceEvento=0;
let temporizadorEvento;

function mostrarEvento(indice){
  if(!slides.length) return;
  indiceEvento=(indice+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('ativo',i===indiceEvento));
  pontos.forEach((ponto,i)=>ponto.classList.toggle('ativo',i===indiceEvento));
}
function iniciarCarrossel(){
  clearInterval(temporizadorEvento);
  temporizadorEvento=setInterval(()=>mostrarEvento(indiceEvento+1),6000);
}
if(slides.length){
  anterior?.addEventListener('click',()=>{mostrarEvento(indiceEvento-1);iniciarCarrossel();});
  proxima?.addEventListener('click',()=>{mostrarEvento(indiceEvento+1);iniciarCarrossel();});
  pontos.forEach((ponto,i)=>ponto.addEventListener('click',()=>{mostrarEvento(i);iniciarCarrossel();}));
  mostrarEvento(0);
  iniciarCarrossel();
}

function formatarContagem(dataEvento){
  const agora=new Date();
  const diferenca=dataEvento-agora;
  if(diferenca<=0) return "";
  const dias=Math.floor(diferenca/86400000);
  const horas=Math.floor((diferenca%86400000)/3600000);
  const minutos=Math.floor((diferenca%3600000)/60000);
  if(dias>0) return `Faltam ${dias} dia${dias===1?"":"s"} e ${horas}h`;
  if(horas>0) return `Faltam ${horas}h e ${minutos}min`;
  return `Faltam ${Math.max(1,minutos)} minutos`;
}

function classificarEventosHome(){
  const slidesHome=[...document.querySelectorAll('.evento-slide[data-event-date]')];
  if(!slidesHome.length) return;
  const agora=new Date();
  const futuros=slidesHome
    .map((slide,index)=>({slide,index,data:new Date(slide.dataset.eventDate)}))
    .filter(item=>item.data>=agora)
    .sort((a,b)=>a.data-b.data);
  const proximo=futuros[0];

  slidesHome.forEach((slide)=>{
    const data=new Date(slide.dataset.eventDate);
    const status=slide.querySelector('.status-evento');
    const contagem=slide.querySelector('.contagem-regressiva');
    slide.classList.toggle('realizado',data<agora);

    if(data<agora){
      status.textContent='Evento realizado';
      status.className='status-evento realizado';
      if(contagem) contagem.textContent='';
    }else if(proximo && slide===proximo.slide){
      status.textContent='Próximo evento';
      status.className='status-evento proximo';
      if(contagem) contagem.textContent=formatarContagem(data);
    }else{
      status.textContent='Evento futuro';
      status.className='status-evento futuro';
      if(contagem) contagem.textContent='';
    }
  });

  if(proximo && typeof mostrarEvento==='function'){
    mostrarEvento(proximo.index);
    iniciarCarrossel();
  }
}

function organizarAgenda(){
  const eventos=[...document.querySelectorAll('.agenda-evento[data-event-date]')];
  if(!eventos.length) return;

  const agora=new Date();
  const futuros=eventos
    .filter(evento=>new Date(evento.dataset.eventDate)>=agora)
    .sort((a,b)=>new Date(a.dataset.eventDate)-new Date(b.dataset.eventDate));
  const realizados=eventos
    .filter(evento=>new Date(evento.dataset.eventDate)<agora)
    .sort((a,b)=>new Date(b.dataset.eventDate)-new Date(a.dataset.eventDate));

  const listaFuturos=document.querySelector('.agenda-lista-futuros');
  const listaRealizados=document.querySelector('.agenda-lista-realizados');
  const destaque=document.getElementById('proximo-evento-destaque');

  const proximo=futuros[0];

  eventos.forEach((evento)=>{
    const status=evento.querySelector('.status-evento');
    const data=new Date(evento.dataset.eventDate);
    if(data<agora){
      status.textContent='Evento realizado';
      status.className='status-evento realizado';
    }else if(evento===proximo){
      status.textContent='Próximo evento';
      status.className='status-evento proximo';
    }else{
      status.textContent='Evento futuro';
      status.className='status-evento futuro';
    }
  });

  futuros.forEach((evento)=>listaFuturos?.appendChild(evento));
  realizados.forEach((evento)=>listaRealizados?.appendChild(evento));

  if(proximo && destaque){
    const clone=proximo.cloneNode(true);
    clone.className='proximo-destaque';
    clone.removeAttribute('id');
    const data=new Date(proximo.dataset.eventDate);
    const conteudo=clone.querySelector('div:last-child');
    if(conteudo){
      const contagem=document.createElement('div');
      contagem.className='contagem-regressiva';
      contagem.textContent=formatarContagem(data);
      conteudo.appendChild(contagem);
    }
    destaque.innerHTML='';
    destaque.appendChild(clone);
  }else if(destaque){
    destaque.innerHTML='<div class="estado-vazio"><strong>Nenhum evento futuro cadastrado</strong><p>Novos eventos serão publicados assim que forem confirmados.</p></div>';
  }
}

classificarEventosHome();
organizarAgenda();
setInterval(()=>{
  document.querySelectorAll('.evento-slide[data-event-date] .contagem-regressiva').forEach((el)=>{
    const slide=el.closest('.evento-slide');
    const status=slide?.querySelector('.status-evento');
    if(status?.classList.contains('proximo')){
      el.textContent=formatarContagem(new Date(slide.dataset.eventDate));
    }
  });
  const destaque=document.querySelector('.proximo-destaque');
  if(destaque){
    const dataStr=destaque.dataset.eventDate;
    const contagem=destaque.querySelector('.contagem-regressiva');
    if(dataStr && contagem) contagem.textContent=formatarContagem(new Date(dataStr));
  }
},60000);

const fotosGaleria=[...document.querySelectorAll('.foto-galeria')];
const lightbox=document.querySelector('.lightbox');
const imagemLightbox=lightbox?.querySelector('img');
const legendaLightbox=lightbox?.querySelector('figcaption');
let indiceFoto=0;

function abrirFoto(indice){
  if(!lightbox || !fotosGaleria.length) return;
  indiceFoto=(indice+fotosGaleria.length)%fotosGaleria.length;
  const botao=fotosGaleria[indiceFoto];
  const imagem=botao.querySelector('img');
  imagemLightbox.src=botao.dataset.full;
  imagemLightbox.alt=imagem.alt;
  legendaLightbox.textContent=`${indiceFoto+1} de ${fotosGaleria.length}`;
  lightbox.classList.add('aberto');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-ativo');
}
function fecharFoto(){
  if(!lightbox) return;
  lightbox.classList.remove('aberto');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('lightbox-ativo');
}
fotosGaleria.forEach((foto,i)=>foto.addEventListener('click',()=>abrirFoto(i)));
lightbox?.querySelector('.lightbox-fechar')?.addEventListener('click',fecharFoto);
lightbox?.querySelector('.lightbox-anterior')?.addEventListener('click',()=>abrirFoto(indiceFoto-1));
lightbox?.querySelector('.lightbox-proxima')?.addEventListener('click',()=>abrirFoto(indiceFoto+1));
lightbox?.addEventListener('click',(evento)=>{if(evento.target===lightbox) fecharFoto();});
document.addEventListener('keydown',(evento)=>{
  if(!lightbox?.classList.contains('aberto')) return;
  if(evento.key==='Escape') fecharFoto();
  if(evento.key==='ArrowLeft') abrirFoto(indiceFoto-1);
  if(evento.key==='ArrowRight') abrirFoto(indiceFoto+1);
});
