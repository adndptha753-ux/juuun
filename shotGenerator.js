/**
 * Shot Generator - Mengelola dan menghasilkan animasi shots
 * Mengintegrasikan Animation class untuk membuat serangkaian animasi
 */

import Animation from './animation.js';

class ShotGenerator {
  constructor(options = {}) {
    this.shots = [];
    this.currentShotIndex = 0;
    this.isPlaying = false;
    this.defaultDuration = options.defaultDuration || 1000;
    this.defaultEasing = options.defaultEasing || 'linear';
  }

  /**
   * Tambahkan shot fade ke queue
   * @param {HTMLElement} element - Target elemen
   * @param {number} from - Opacity awal (0-1)
   * @param {number} to - Opacity akhir (0-1)
   * @param {Object} options - Opsi animasi
   */
  addFadeShot(element, from = 0, to = 1, options = {}) {
    const shot = {
      type: 'fade',
      element,
      from,
      to,
      duration: options.duration || this.defaultDuration,
      delay: options.delay || 0,
      easing: options.easing || this.defaultEasing,
      repeat: options.repeat || 1,
    };
    this.shots.push(shot);
    return this;
  }

  /**
   * Tambahkan shot slide ke queue
   * @param {HTMLElement} element - Target elemen
   * @param {number} fromX - Posisi X awal
   * @param {number} toX - Posisi X akhir
   * @param {number} fromY - Posisi Y awal
   * @param {number} toY - Posisi Y akhir
   * @param {Object} options - Opsi animasi
   */
  addSlideShot(element, fromX = 0, toX = 100, fromY = 0, toY = 0, options = {}) {
    const shot = {
      type: 'slide',
      element,
      fromX,
      toX,
      fromY,
      toY,
      duration: options.duration || this.defaultDuration,
      delay: options.delay || 0,
      easing: options.easing || this.defaultEasing,
      repeat: options.repeat || 1,
    };
    this.shots.push(shot);
    return this;
  }

  /**
   * Tambahkan shot scale ke queue
   * @param {HTMLElement} element - Target elemen
   * @param {number} fromScale - Scale awal
   * @param {number} toScale - Scale akhir
   * @param {Object} options - Opsi animasi
   */
  addScaleShot(element, fromScale = 1, toScale = 1.5, options = {}) {
    const shot = {
      type: 'scale',
      element,
      fromScale,
      toScale,
      duration: options.duration || this.defaultDuration,
      delay: options.delay || 0,
      easing: options.easing || this.defaultEasing,
      repeat: options.repeat || 1,
    };
    this.shots.push(shot);
    return this;
  }

  /**
   * Tambahkan shot rotate ke queue
   * @param {HTMLElement} element - Target elemen
   * @param {number} fromDeg - Rotasi awal (derajat)
   * @param {number} toDeg - Rotasi akhir (derajat)
   * @param {Object} options - Opsi animasi
   */
  addRotateShot(element, fromDeg = 0, toDeg = 360, options = {}) {
    const shot = {
      type: 'rotate',
      element,
      fromDeg,
      toDeg,
      duration: options.duration || this.defaultDuration,
      delay: options.delay || 0,
      easing: options.easing || this.defaultEasing,
      repeat: options.repeat || 1,
    };
    this.shots.push(shot);
    return this;
  }

  /**
   * Tambahkan shot background color ke queue
   * @param {HTMLElement} element - Target elemen
   * @param {string} fromColor - Warna awal (hex)
   * @param {string} toColor - Warna akhir (hex)
   * @param {Object} options - Opsi animasi
   */
  addColorShot(element, fromColor, toColor, options = {}) {
    const shot = {
      type: 'color',
      element,
      fromColor,
      toColor,
      duration: options.duration || this.defaultDuration,
      delay: options.delay || 0,
      easing: options.easing || this.defaultEasing,
      repeat: options.repeat || 1,
    };
    this.shots.push(shot);
    return this;
  }

  /**
   * Jalankan semua shots secara berurutan
   * @param {boolean} sequential - true untuk berurutan, false untuk parallel
   */
  async play(sequential = true) {
    if (this.shots.length === 0) {
      console.warn('Tidak ada shots untuk dijalankan!');
      return;
    }

    this.isPlaying = true;
    this.currentShotIndex = 0;

    if (sequential) {
      // Jalankan berurutan
      for (let i = 0; i < this.shots.length; i++) {
        if (!this.isPlaying) break;
        await this.executeShot(this.shots[i]);
        this.currentShotIndex = i + 1;
      }
    } else {
      // Jalankan parallel
      const promises = this.shots.map((shot) => this.executeShot(shot));
      await Promise.all(promises);
    }

    this.isPlaying = false;
  }

  /**
   * Jalankan shot individual
   * @private
   */
  executeShot(shot) {
    const animationOptions = {
      duration: shot.duration,
      delay: shot.delay,
      easing: shot.easing,
      repeat: shot.repeat,
    };

    const animation = new Animation(shot.element, animationOptions);

    switch (shot.type) {
      case 'fade':
        return animation.fade(shot.from, shot.to);
      case 'slide':
        return animation.slide(shot.fromX, shot.toX, shot.fromY, shot.toY);
      case 'scale':
        return animation.scale(shot.fromScale, shot.toScale);
      case 'rotate':
        return animation.rotate(shot.fromDeg, shot.toDeg);
      case 'color':
        return animation.backgroundColor(shot.fromColor, shot.toColor);
      default:
        console.warn(`Tipe shot tidak dikenal: ${shot.type}`);
    }
  }

  /**
   * Stop animasi yang sedang berjalan
   */
  stop() {
    this.isPlaying = false;
  }

  /**
   * Reset queue shots
   */
  reset() {
    this.shots = [];
    this.currentShotIndex = 0;
    this.isPlaying = false;
  }

  /**
   * Dapatkan informasi shots
   */
  getShotsList() {
    return this.shots.map((shot, index) => ({
      index,
      type: shot.type,
      duration: shot.duration,
      delay: shot.delay,
      element: shot.element.className || shot.element.id || 'unknown',
    }));
  }

  /**
   * Tampilkan preview semua shots
   */
  previewShots() {
    console.table(this.getShotsList());
  }
}

export default ShotGenerator;
