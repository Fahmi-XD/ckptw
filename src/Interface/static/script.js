document.addEventListener("DOMContentLoaded", async () => {
  const splash = document.querySelector(".splash");
  const gate = document.getElementById("gate");
  const dot = document.getElementById("stars");
  const startBtn = document.getElementById("start");
  const navigation = document.getElementById("navbar");
  const aside = document.querySelector(".aside");
  const btnAside = document.querySelector(".navbar .kiri");
  const btnAsideClose = document.querySelector(".aside #close");
  const asideCanvas = document.getElementById("aside-canvas");

  const PARTICLE_COUNT = 10;
  const MAX_DISTANCE = 100;
  const PARTICLE_SPEED = 0.5;
  const TEXT_SPEED = 7;
  const GATE_SPEED = 10;

  let isTooltip = false;

  const gateCtx = gate?.getContext("2d");
  gate.width = window.innerWidth;
  gate.height = window.innerHeight;

  const dotCtx = dot.getContext("2d");
  dot.width = window.innerWidth;
  dot.height = window.innerHeight;

  const asideCtx = asideCanvas.getContext("2d");
  const dpi = window.devicePixelRatio;
  asideCanvas.getContext('2d').scale(dpi, dpi);

  class FlipText {
    constructor(element, text, speed = 1) {
      this.element = element;
      this.text = [];
      this.opacity = 0;
      this.blur = 8;
      this.y = 20;
      this.scale = 0;
      this.spanList = [];
      this.index = 0;
      this.speed = speed * 0.3;

      this.element.style.display = "flex"
      this.element.textContent = "";

      for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == " ") {
          this.text.push("\u00A0")
        } else {
          this.text.push(text.charAt(i));
        }
      }
    }

    run() {
      const initSpan = () => {
        for (let huruf of this.text) {
          const span = document.createElement("span");
          span.style.opacity = this.opacity;
          span.style.filter = `blur(${this.blur}px)`
          span.style.transform = `scale(${this.scale})`
          span.textContent = huruf;
          this.element.appendChild(span);
          this.spanList.push(span);
        }
      }

      const next = () => {
        let blur = this.blur;
        let scale = this.scale;
        let opacity = this.opacity;
        let y = this.y;
        const currentSpan = this.spanList[this.index];

        const animate = () => {
          blur -= 0.5 + this.speed;
          y -= 2 + this.speed;
          scale += 0.5 + this.speed;
          opacity += 0.5 + this.speed;

          currentSpan.style.opacity = Math.min(opacity, 1);
          currentSpan.style.filter = `blur(${Math.max(blur, 0)}px)`
          currentSpan.style.transform = `scale(${Math.min(scale, 1)}) translateY(${Math.max(y, 0)}px)`

          if (blur < 0 && scale > 1 && opacity > 1) {
            this.index++;
            if (this.spanList[this.index]) {
              next();
            }
          } else {
            window.requestAnimationFrame(animate)
          }
        }

        animate();
      }

      initSpan();
      next();
    }
  }

  const particles = [];

  class Particle {
    constructor(ctx) {
      this.ctx = ctx;
      this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.x = Math.random() * dot.width;
      this.y = Math.random() * dot.height;
      this.size = Math.random() * 2;
      this.opacity = Math.max(0.3, Math.random());
    }

    move() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > dot.width) this.vx *= -1;
      if (this.y < 0 || this.y > dot.height) this.vy *= -1;
    }

    drawDot() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      this.ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(dotCtx));
  }

  function createTooltip(elem, text, duration = 0) {
    if (isTooltip) {
      document.body.removeChild(document.querySelector(".tooltip-custom"));
    }
    const div = document.createElement("div");
    const divCursor = document.createElement("div");
    const rect = elem.getBoundingClientRect();

    div.textContent = text;
    div.style.transform = `translateY(${rect.y + rect.height + 10}px)`
    divCursor.style.left = `${(elem.offsetLeft)}px`
    div.style.left = `${(elem.offsetLeft)}px`
    div.classList.add("tooltip-custom");
    divCursor.classList.add("cursor");
    div.appendChild(divCursor);
    document.body.appendChild(div);
    isTooltip = true;
  }

  function drawLine() {
    let row = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < MAX_DISTANCE) {
          dotCtx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / MAX_DISTANCE})`;
          dotCtx.lineWidth = 1;
          dotCtx.beginPath();
          dotCtx.moveTo(particles[i].x, particles[i].y);
          dotCtx.lineTo(particles[j].x, particles[j].y);
          dotCtx.stroke();
        }
      }
    }
  }

  function animate() {
    dotCtx.clearRect(0, 0, dot.width, dot.height);

    particles.forEach(v => {
      v.move()
      v.drawDot()
    })
    // drawLine()

    window.requestAnimationFrame(animate);
  }

  animate();

  const gateFragment = [
    { x: 0, y: 0, delay: 200 },
    { x: 0, y: gate.height / 9, delay: 150 },
    { x: 0, y: (gate.height / 9) * 2, delay: 100 },
    { x: 0, y: (gate.height / 9) * 3, delay: 50 },
    { x: 0, y: (gate.height / 9) * 4, delay: 0 },
    { x: 0, y: (gate.height / 9) * 5, delay: 50 },
    { x: 0, y: (gate.height / 9) * 6, delay: 100 },
    { x: 0, y: (gate.height / 9) * 7, delay: 150 },
    { x: 0, y: (gate.height / 9) * 8, delay: 200 },
  ]

  const drawGate = () => {
    gateCtx.clearRect(0, 0, gate.width, gate.height);

    gateCtx.fillStyle = "white"
    gateFragment.forEach((gt) => {
      gateCtx.fillRect(gt.x, gt.y, gate.width, (gate.height / 9) + 15)
    })
  }

  let startTime;
  let once = false;

  const moveGate = (second) => {
    if (!startTime) startTime = second;
    gateFragment.forEach((sec) => {
      if (second - startTime >= sec.delay) sec.x += GATE_SPEED;
    })
    if (gateFragment.every(v => v.x > window.innerWidth) && !once) {
      if (!once) {
        once = true
        nextt()
      }
    }

    drawGate();
    if (gateFragment.some(section => section.x < gate.width + 100)) {
      window.requestAnimationFrame(moveGate)
    } else {
      gateCtx.clearRect(0, 0, gate.width, gate.heigh);
    }
  }

  drawGate()

  const delay = (second) => {
    return new Promise((resolve) => setTimeout(resolve, second));
  }

  (new FlipText(document.getElementById("thanks"), "Thank you for using this library :)", TEXT_SPEED)).run();

  // startBtn.addEventListener("click", async () => {
    startBtn.style.opacity = 0;
    startBtn.classList.add("animate-blink")
    const elem = document.body;
    // if (elem.requestFullscreen) {
    //   elem.requestFullscreen();
    // } else if (elem.webkitRequestFullscreen) { /* Safari */
    //   elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) { /* IE11 */
    //   elem.msRequestFullscreen();
    // }
    await delay(1000);    
    document.getElementById("thanks").style.opacity = "0";
    document.querySelector(".splash p").style.opacity = "0";
    requestAnimationFrame(moveGate)
  // })

  async function nextt() {
    splash.style.display = "none";
    document.querySelector(".navbar .left.kiri")?.classList.add("normal")
    document.querySelector(".navbar .left.kanan")?.classList.add("normal")
    await delay(300);
    document.querySelector(".navbar .btn").classList.add("animate-blink")
    // pengenalan()
  }

  function blurAll(except = ["body"]) {
    const filter = [];
    const allElement = document.querySelectorAll("body *");
    allElement.forEach(e => {
      if (![...e.classList].some(v => except.some(f => v == f))) {
        e.style.filter = "blur(5px)"
        filter.push(e);
      }
    })

    return filter;
  }

  function unBlurAll(filtered) {
    filtered.forEach(e => {
      e.style.filter = "none"
    })
  }

  const tooltip = [
    [document.querySelector(".navbar .kiri"), "Navigasi"],
    [document.querySelector(".navbar .kanan"), "Nama bot mu"],
  ]
  let idx = 1;

  function pengenalan() {
    createTooltip(tooltip[0][0], tooltip[0][1]);
    const button = document.createElement("button");
    button.classList.add("btn-pengenalan");
    button.textContent = "Tekan dimana saja untuk melanjutkan";
    const filtered = blurAll(["navbar"]);
    console.log(filtered)
    button.onclick = () => {
      idx++
      if (idx <= tooltip.length) {
        createTooltip(tooltip[1][0], tooltip[1][1])
      } else {
        document.body.removeChild(button);
        document.body.removeChild(document.querySelector(".tooltip-custom"));
      }
    }
    document.body.appendChild(button);
  }

  navbar.addEventListener("click", () => {
    console.log("Anjay");
  })

  /**
   * Draw grid
   */
  let row = 0;
  let col = 0;
  while (50 * row < asideCanvas.width) {
    row += 1;
  }
  while (10 * col < window.innerHeight) {
    col += 1;
  }
  asideCtx.strokeStyle = 'rgba(255, 255, 255, 1)';
  asideCtx.lineWidth = 1;

  for (let i = 0; i <= row - 1; i++) {
    asideCtx.beginPath();
    asideCtx.moveTo(i * 50 + 0.5, 0);
    asideCtx.lineTo(i * 50 + 0.5, 200);
    asideCtx.stroke();
  }
  
  asideCtx.strokeStyle = 'rgba(255, 255, 255, 1)';
  for (let i = 0; i <= col - 1; i++) {
    asideCtx.beginPath();
    asideCtx.moveTo(0, i * 5);
    asideCtx.lineTo(asideCanvas.width, i * 5);
    asideCtx.stroke();
  }
  
  btnAside.addEventListener("click", () => {
    aside.classList.toggle("active")
  })
  
  btnAsideClose.addEventListener("click", () => {
    aside.classList.remove("active")
  })
});