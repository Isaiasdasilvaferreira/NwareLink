// script/carrossel.js
class Carrossel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
    this.prevBtn = container.querySelector('.carousel-prev');
    this.nextBtn = container.querySelector('.carousel-next');
    
    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
    this.dragThreshold = 50; // Threshold para mudar de slide
    this.autoPlayInterval = null;
    this.progressBar = null;
    
    this.init();
  }
  
  init() {
    // Criar indicadores
    this.createIndicators();
    
    // Criar barra de progresso
    this.createProgressBar();
    
    // Event listeners
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Eventos de arrastar (mouse)
    this.track.addEventListener('mousedown', (e) => this.dragStart(e));
    this.track.addEventListener('mousemove', (e) => this.dragMove(e));
    this.track.addEventListener('mouseup', () => this.dragEnd());
    this.track.addEventListener('mouseleave', () => this.dragEnd());
    
    // Eventos de arrastar (touch)
    this.track.addEventListener('touchstart', (e) => this.dragStart(e));
    this.track.addEventListener('touchmove', (e) => this.dragMove(e));
    this.track.addEventListener('touchend', () => this.dragEnd());
    
    // Prevenir drag de imagens
    this.slides.forEach(slide => {
      slide.addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    // Iniciar autoplay
    this.startAutoPlay();
    
    // Parar autoplay quando mouse estiver sobre o carrossel
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
  }
  
  createIndicators() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    
    for (let i = 0; i < this.slideCount; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToSlide(i));
      indicatorsContainer.appendChild(dot);
    }
    
    this.container.appendChild(indicatorsContainer);
    this.indicators = Array.from(indicatorsContainer.children);
  }
  
  createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'carousel-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'carousel-progress-bar';
    
    progressContainer.appendChild(progressBar);
    this.container.appendChild(progressContainer);
    this.progressBar = progressBar;
  }
  
  updateIndicators() {
    this.indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  updateProgressBar() {
    if (this.progressBar) {
      const progress = ((this.currentIndex + 1) / this.slideCount) * 100;
      this.progressBar.style.width = `${progress}%`;
    }
  }
  
  goToSlide(index) {
    if (index < 0) index = this.slideCount - 1;
    if (index >= this.slideCount) index = 0;
    
    this.currentIndex = index;
    this.currentTranslate = index * -100;
    this.prevTranslate = this.currentTranslate;
    
    this.track.style.transform = `translateX(${this.currentTranslate}%)`;
    this.updateIndicators();
    this.updateProgressBar();
  }
  
  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }
  
  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }
  
  dragStart(e) {
    e.preventDefault();
    
    if (e.type === 'touchstart') {
      this.startPos = e.touches[0].clientX;
    } else {
      this.startPos = e.clientX;
    }
    
    this.isDragging = true;
    this.track.classList.add('dragging');
    
    // Parar animação atual
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
    }
  }
  
  dragMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    let currentPosition;
    if (e.type === 'touchmove') {
      currentPosition = e.touches[0].clientX;
    } else {
      currentPosition = e.clientX;
    }
    
    const diff = currentPosition - this.startPos;
    const slideWidth = this.container.offsetWidth;
    const diffPercent = (diff / slideWidth) * 100;
    
    // Calcular nova posição com limites
    let newTranslate = this.prevTranslate + diffPercent;
    
    // Adicionar resistência nas bordas
    if (this.currentIndex === 0 && diffPercent > 0) {
      newTranslate = this.prevTranslate + (diffPercent * 0.3);
    } else if (this.currentIndex === this.slideCount - 1 && diffPercent < 0) {
      newTranslate = this.prevTranslate + (diffPercent * 0.3);
    }
    
    this.currentTranslate = newTranslate;
    this.track.style.transform = `translateX(${newTranslate}%)`;
  }
  
  dragEnd() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.track.classList.remove('dragging');
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    
    // Se moveu mais que o threshold, mudar slide
    if (Math.abs(movedBy) > this.dragThreshold / 10) { // Dividido por 10 porque estamos em porcentagem
      if (movedBy < 0 && this.currentIndex < this.slideCount - 1) {
        this.nextSlide();
      } else if (movedBy > 0 && this.currentIndex > 0) {
        this.prevSlide();
      } else {
        // Se chegou na borda, volta
        this.goToSlide(this.currentIndex);
      }
    } else {
      // Se não moveu o suficiente, volta para o slide atual
      this.goToSlide(this.currentIndex);
    }
  }
  
  startAutoPlay() {
    if (this.autoPlayInterval) return;
    
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Inicializar carrossel quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  const carrosselContainer = document.querySelector('.carousel-container');
  if (carrosselContainer) {
    new Carrossel(carrosselContainer);
  }
});