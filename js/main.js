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
