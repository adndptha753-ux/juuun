/**
 * Objek Animasi - Class untuk membuat dan mengelola animasi
 * Belajar dan mencoba membuat animasi sederhana
 */

class Animation {
  constructor(element, options = {}) {
    this.element = element;
    this.duration = options.duration || 1000; // durasi dalam ms
    this.delay = options.delay || 0; // delay sebelum animasi mulai
    this.easing = options.easing || 'linear'; // jenis easing
    this.repeat = options.repeat || 1; // berapa kali animasi diulangi
    this.startTime = null;
    this.isRunning = false;
  }

  // Fungsi easing untuk transisi halus
  getEasingFunction(easing) {
    const easings = {
      linear: (t) => t,
      easeIn: (t) => t * t,
      easeOut: (t) => t * (2 - t),
      easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      bounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
      },
    };
    return easings[easing] || easings.linear;
  }

  // Animasi fade (transparansi)
  fade(from = 0, to = 1) {
    return this.animate((progress) => {
      const opacity = from + (to - from) * progress;
      this.element.style.opacity = opacity;
    });
  }

  // Animasi slide (geser)
  slide(fromX = 0, toX = 100, fromY = 0, toY = 0) {
    return this.animate((progress) => {
      const x = fromX + (toX - fromX) * progress;
      const y = fromY + (toY - fromY) * progress;
      this.element.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // Animasi scale (perbesar/perkecil)
  scale(fromScale = 1, toScale = 1.5) {
    return this.animate((progress) => {
      const scale = fromScale + (toScale - fromScale) * progress;
      this.element.style.transform = `scale(${scale})`;
    });
  }

  // Animasi rotate (putar)
  rotate(fromDeg = 0, toDeg = 360) {
    return this.animate((progress) => {
      const deg = fromDeg + (toDeg - fromDeg) * progress;
      this.element.style.transform = `rotate(${deg}deg)`;
    });
  }

  // Animasi warna background
  backgroundColor(fromColor, toColor) {
    return this.animate((progress) => {
      const color = this.interpolateColor(fromColor, toColor, progress);
      this.element.style.backgroundColor = color;
    });
  }

  // Interpolasi warna RGB
  interpolateColor(color1, color2, progress) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * progress);
    const g = Math.round(c1.g + (c2.g - c1.g) * progress);
    const b = Math.round(c1.b + (c2.b - c1.b) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Konversi hex ke RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  // Fungsi animasi utama
  animate(updateCallback) {
    return new Promise((resolve) => {
      this.isRunning = true;
      let repetitions = 0;

      const startAnimation = () => {
        this.startTime = Date.now();

        const frame = () => {
          const elapsed = Date.now() - this.startTime;
          let progress = Math.min(elapsed / this.duration, 1);

          // Terapkan easing function
          const easingFunction = this.getEasingFunction(this.easing);
          progress = easingFunction(progress);

          // Update elemen
          updateCallback(progress);

          if (elapsed < this.duration) {
            requestAnimationFrame(frame);
          } else {
            repetitions++;
            if (repetitions < this.repeat) {
              // Ulangi animasi
              startAnimation();
            } else {
              this.isRunning = false;
              resolve();
            }
          }
        };

        requestAnimationFrame(frame);
      };

      // Terapkan delay
      if (this.delay > 0) {
        setTimeout(startAnimation, this.delay);
      } else {
        startAnimation();
      }
    });
  }

  // Stop animasi
  stop() {
    this.isRunning = false;
  }
}

// Export untuk CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Animation;
}
