'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Volume2, VolumeX, CheckSquare, Square, X, Lock, Unlock } from 'lucide-react';

// --- DATA KONFIGURASI ---
const CONFIG = {
  name: "Vita",
  from: "Tevan",
  reasons: [
    "Senyummu bikin hari terburukku jadi ringan.",
    "Kamu peduli sama hal-hal kecil yang orang lain nggak sadar.",
    "Bersamamu, diam pun terasa nyaman.",
    "Kamu bikin aku ingin jadi versi terbaik diriku."
  ],
  clues: [
    "Petunjuk 1: Bisa kamu pakai setiap hari.",
    "Petunjuk 2: Waktu lihat ini, kamu pasti ingat aku.",
    "Petunjuk 3: Aku sudah lama mencarinya buat kamu."
  ],
  photos: [
    { src: "/images/foto1.jpg", cap: "Pertama kali kita jalan" },
    { src: "/images/foto2.jpg", cap: "Hari yang paling lucu" },
    { src: "/images/foto3.jpg", cap: "Senyummu di sini" },
    { src: "/images/foto4.jpg", cap: "Kita berdua" },
    { src: "/images/foto5.jpg", cap: "Favoritku" },
    { src: "/images/foto6.jpg", cap: "Dan masih banyak lagi" }
  ],
  wishlist: [
    { text: "Jalan-jalan ke pantai berdua", done: true },
    { text: "Nonton konser bareng", done: true },
    { text: "PhotoBooth", done: false },
    { text: "Bikin pizza bareng", done: true },
    { text: "Ke telomoyo", done: false },
    { text: "Bikin album foto fisik kenangan kita", done: false }
  ],
  // Konfigurasi Gembok Rahasia
  secretPassword: "02092026",
  secretMessage: "Terima kasih sudah bertahan sejauh ini denganku. Aku mungkin bukan orang yang paling romantis atau sempurna, tapi aku selalu berusaha memberikan yang terbaik buat kamu. Semoga di tahun-tahun berikutnya, kita tetap bisa merayakan hari spesialmu bersama-sama. I love you, Vita."
};

export default function SuratUlangTahun() {
  const [isEnvOpen, setIsEnvOpen] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  
  // State Lilin & Harapan
  const [flames, setFlames] = useState([true, true, true]);
  const [wishMade, setWishMade] = useState(false);
  
  // State Kado
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [clueStep, setClueStep] = useState(0);
  const [shake, setShake] = useState(false);
  
  // State Galeri & Wishlist
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{src: string, cap: string} | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false); 
  
  // State Gembok Rahasia
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Audio & Canvas
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Efek Kelopak Bunga Jatuh
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let animationFrameId: number;
    let W = (cv.width = window.innerWidth);
    let H = (cv.height = window.innerHeight);

    window.addEventListener('resize', () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    });

    const cols = ["#f2a7b8", "#f5c77e", "#b83a60", "#fbf3ea"];
    const petal = (top: boolean) => ({
      x: Math.random() * W,
      y: top ? -20 : Math.random() * H,
      r: 4 + Math.random() * 6,
      vy: 0.4 + Math.random() * 0.8,
      vx: -0.3 + Math.random() * 0.6,
      a: Math.random() * 6,
      va: 0.01 + Math.random() * 0.03,
      c: cols[Math.floor(Math.random() * cols.length)]
    });

    const parts = Array.from({ length: 25 }, () => petal(false));

    const frame = () => {
      cx.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.a) * 0.4;
        p.a += p.va;
        if (p.y > H + 20) Object.assign(p, petal(true));

        cx.save();
        cx.translate(p.x, p.y);
        cx.rotate(p.a);
        cx.globalAlpha = 0.5;
        cx.fillStyle = p.c;
        cx.beginPath();
        cx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.3);
        cx.fill();
        cx.restore();
      });
      animationFrameId = requestAnimationFrame(frame);
    };
    frame();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handler Buka Surat
  const handleOpenEnvelope = () => {
    setIsEnvOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio diblokir browser:", e));
      setIsPlaying(true);
    }
    setTimeout(() => setHideIntro(true), 1200);
  };

  // Handler Kontrol Musik
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handler Tiup Lilin
  const blowOut = (idx: number) => {
    setFlames(prev => {
      const next = [...prev];
      next[idx] = false;
      return next;
    });
  };

  const blowAll = () => {
    flames.forEach((_, i) => {
      setTimeout(() => blowOut(i), i * 300);
    });
  };

  // Confetti saat lilin mati semua
  useEffect(() => {
    if (flames.every(f => !f) && !wishMade) {
      setWishMade(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f2a7b8', '#f5c77e', '#b83a60']
      });
    }
  }, [flames, wishMade]);

  // Handler Buka Kado
  const handleBoxClick = () => {
    if (clueStep >= CONFIG.clues.length) return; 

    const nextStep = clueStep + 1;
    setClueStep(nextStep);

    if (nextStep === CONFIG.clues.length) {
      setIsGiftOpened(true);
      setTimeout(() => {
        setShowGallery(true);
      }, 2200); 
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400); 
    }
  };

  // Handler Cek Password Gembok Rahasia
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CONFIG.secretPassword) {
      setIsSecretUnlocked(true);
      setPasswordError(false);
      confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 }, colors: ['#f2a7b8'] });
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_80%_at_50%_0%,#2b1738,#1c1026_70%)] text-[#fbf3ea] font-sans overflow-x-hidden relative selection:bg-rose-400 selection:text-white pb-32">
      
      <audio ref={audioRef} src="/lagu-kita.mp3" loop />
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />

      {hideIntro && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 p-4 bg-[#7a1f3d] text-[#f5c77e] rounded-full shadow-[0_0_20px_rgba(242,167,184,0.3)] hover:scale-110 transition-transform focus:outline-none"
          aria-label="Toggle Music"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {/* INTRO */}
      <AnimatePresence>
        {!hideIntro && (
          <motion.section
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[radial-gradient(100%_70%_at_50%_40%,#2b1738,#1c1026)] px-6 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#f2a7b8]">
              Ada surat kecil<br/>untukmu
            </h1>
            
            <div className="relative w-[min(84vw,340px)] aspect-[3/2] bg-gradient-to-br from-[#f3dcc9] to-[#e8c6b0] rounded-md shadow-2xl shadow-rose-900/20">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_49.5%,rgba(122,31,61,0.12)_50%)] bg-[length:50%_100%] bg-left bg-no-repeat rounded-md" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,transparent_49.5%,rgba(122,31,61,0.12)_50%)] bg-[length:50%_100%] bg-right bg-no-repeat rounded-md" />
              
              <motion.div
                animate={{ rotateX: isEnvOpen ? 180 : 0 }}
                transition={{ duration: 0.9, ease: [0.6, 0.1, 0.3, 1] }}
                className="absolute top-0 left-0 w-full h-[58%] bg-gradient-to-b from-[#ecd0bc] to-[#e0b9a3] origin-top z-10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />
              
              {!isEnvOpen && (
                <button
                  onClick={handleOpenEnvelope}
                  className="absolute left-1/2 top-[58%] -ml-8 -mt-8 w-16 h-16 rounded-full bg-[radial-gradient(circle_at_35%_30%,#b83a60,#7a1f3d)] text-[#ffd9e2] flex items-center justify-center text-2xl shadow-lg z-20 hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-[#f5c77e]"
                >
                  <Heart className="fill-current animate-pulse" />
                </button>
              )}
            </div>
            <p className="text-white/70">Ketuk segelnya untuk membuka</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA */}
      {hideIntro && (
        <main className="relative z-10 max-w-2xl mx-auto px-5 pt-16 space-y-24">
          
          {/* Surat Kertas */}
          <motion.article 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
            className="bg-[#fbf3ea] text-[#3a2230] rounded-lg p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#7a1f3d] mb-6">
              Selamat ulang tahun, {CONFIG.name}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>Hari ini bukan cuma tanggal di kalender. Hari ini adalah hari dunia kedatangan seseorang yang bikin hari-hariku jauh lebih berwarna, dan orang itu adalah kamu.</p>
              <p>Terima kasih sudah sabar menghadapi aku, sudah tertawa di lelucon receh yang sama berulang kali, dan sudah menjadi tempat pulang yang paling nyaman.</p>
              <p>Aku nggak butuh kata-kata yang rumit. Aku cuma ingin kamu tahu: kamu dicintai, hari ini dan setiap hari sesudahnya.</p>
            </div>
            
            <h3 className="text-2xl font-serif italic text-[#7a1f3d] mt-10 mb-4">
              Beberapa alasan aku sayang kamu
            </h3>
            <ul className="space-y-3 border-l-2 border-[#f2a7b8] pl-5 text-lg">
              {CONFIG.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            
            <p className="font-serif italic text-2xl text-[#7a1f3d] mt-10 whitespace-pre-line">
              {`Dengan seluruh sayang,\n${CONFIG.from}`}
            </p>
          </motion.article>

          {/* Kue Ulang Tahun */}
          <section className="text-center">
            <h2 className="text-3xl font-serif italic text-[#f2a7b8] mb-2">Satu permintaan dulu ya</h2>
            <p className="text-white/80 mb-8">Pejamkan mata, buat harapan, lalu tiup lilinnya.</p>
            
            <div className="flex justify-center mb-8">
              <svg className="w-[min(78vw,300px)] h-auto overflow-visible" viewBox="0 0 300 260">
                <ellipse cx="150" cy="238" rx="130" ry="14" fill="#000" opacity=".3"/>
                <rect x="40" y="150" width="220" height="84" rx="14" fill="#7a1f3d"/>
                <path d="M40 168q18 22 36 0t36 0 36 0 36 0 36 0 40 0v-16a14 14 0 0 0-14-14H54a14 14 0 0 0-14 14z" fill="#fbf3ea"/>
                <rect x="62" y="108" width="176" height="52" rx="12" fill="#b83a60"/>
                <path d="M62 128q15 18 29 0t29 0 29 0 29 0 29 0v-8a12 12 0 0 0-12-12H74a12 12 0 0 0-12 12z" fill="#f2a7b8"/>
                <g fill="#f5c77e">
                  <rect x="108" y="74" width="8" height="36" rx="3"/><rect x="146" y="68" width="8" height="42" rx="3"/><rect x="184" y="74" width="8" height="36" rx="3"/>
                </g>
                {[
                  { cx: 112, cy: 60, fx: 112, fy: 64 },
                  { cx: 150, cy: 54, fx: 150, fy: 58 },
                  { cx: 188, cy: 60, fx: 188, fy: 64 }
                ].map((pos, i) => (
                  <motion.g 
                    key={i} onClick={() => blowOut(i)} className="cursor-pointer origin-bottom"
                    animate={{ scale: flames[i] ? [1, 0.95, 1] : 0, rotate: flames[i] ? [-3, 3, -3] : 0, opacity: flames[i] ? 1 : 0 }}
                    transition={flames[i] ? { repeat: Infinity, duration: 0.5 } : { duration: 0.3 }}
                  >
                    <ellipse cx={pos.cx} cy={pos.cy} rx="9" ry="14" fill="#ffd36e"/>
                    <ellipse cx={pos.fx} cy={pos.fy} rx="4" ry="8" fill="#fff6d6"/>
                  </motion.g>
                ))}
              </svg>
            </div>

            {!wishMade ? (
              <button onClick={blowAll} className="px-8 py-3 border border-[#f5c77e] text-[#f5c77e] rounded-full font-semibold hover:bg-[#f5c77e]/10 transition-colors">
                Tiup lilinnya
              </button>
            ) : (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="text-center">
                <div className="text-4xl md:text-5xl font-serif italic text-[#f5c77e] mb-4">
                  Happy birthday, {CONFIG.name} ♥
                </div>
                <p className="text-lg">Semoga semua yang kamu harapkan tadi terkabul.<br/>Aku akan ada di sampingmu saat itu terjadi.</p>
              </motion.div>
            )}
          </section>

          {/* Hadiah Misteri */}
          {wishMade && (
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-center">
              <h2 className="text-3xl font-serif italic text-[#f2a7b8] mb-2">Eh, tunggu dulu…</h2>
              <p className="text-white/80 mb-8">Ada hadiah yang sudah kusiapkan buatmu. Isinya? Itu rahasia.<br/>Ketuk kotaknya untuk dapat petunjuk.</p>
              
              <motion.button 
                animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} whileTap={!isGiftOpened ? { scale: 0.9 } : {}}
                onClick={handleBoxClick} className={`w-[min(52vw,190px)] mx-auto block focus:outline-none ${isGiftOpened ? 'cursor-default' : 'cursor-pointer hover:scale-105 transition-transform'}`}
              >
                <svg viewBox="0 0 200 200" className="drop-shadow-[0_0_26px_rgba(242,167,184,0.4)]">
                  <rect x="30" y="85" width="140" height="90" rx="8" fill="#b83a60"/>
                  <rect x="92" y="85" width="16" height="90" fill="#f5c77e"/>
                  <motion.g animate={isGiftOpened ? { y: -60, opacity: 0, rotate: -15 } : { y: 0, opacity: 1, rotate: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    <rect x="22" y="55" width="156" height="30" rx="6" fill="#d65a80"/>
                    <rect x="92" y="55" width="16" height="30" fill="#f5c77e"/>
                    <path d="M100 55 C 65 15 35 45 90 55 Z" fill="#f5c77e"/>
                    <path d="M100 55 C 135 15 165 45 110 55 Z" fill="#f5c77e"/>
                    {!isGiftOpened && <text x="100" y="135" textAnchor="middle" fontSize="40" className="font-serif italic" fill="#fbf3ea" opacity=".9">?</text>}
                  </motion.g>
                </svg>
              </motion.button>

              <div className="mt-8 space-y-4">
                <AnimatePresence>
                  {CONFIG.clues.slice(0, clueStep).map((clue, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="max-w-sm mx-auto p-4 border border-dashed border-[#f5c77e] rounded-xl text-[#f5c77e] font-serif italic text-xl">
                      {clue}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {clueStep > 0 && clueStep < CONFIG.clues.length && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-white/50 text-sm">
                  Ketuk lagi untuk petunjuk berikutnya ({clueStep}/{CONFIG.clues.length})
                </motion.p>
              )}

              {clueStep === CONFIG.clues.length && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} className="mt-8 italic text-lg">
                  Sisanya rahasia. Hadiahnya kubawa sendiri, jadi sampai ketemu ya.
                </motion.p>
              )}
            </motion.section>
          )}

          {/* Galeri Foto & Wishlist & Gembok */}
          {showGallery && (
            <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center pt-10">
              <h2 className="text-3xl font-serif italic text-[#f2a7b8] mb-8">Sambil menunggu, ini kenangan kita</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {CONFIG.photos.map((photo, i) => (
                  <motion.figure 
                    key={i} onClick={() => photo.src ? setSelectedPhoto(photo) : null}
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-[#fbf3ea] text-[#3a2230] p-3 pb-5 rounded shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(242,167,184,0.7)] relative z-0 hover:z-10 cursor-pointer"
                    style={{ rotate: i % 2 === 0 ? '-2deg' : '2.5deg' }}
                  >
                    <div className="w-full aspect-square bg-[#ead9cc] border border-dashed border-[#f2a7b8] flex items-center justify-center overflow-hidden relative">
                      {photo.src ? <img src={photo.src} alt={photo.cap} className="w-full h-full object-cover" /> : <span className="text-[#7a1f3d] text-4xl">♥</span>}
                    </div>
                    <figcaption className="font-serif italic mt-3 text-lg">{photo.cap}</figcaption>
                  </motion.figure>
                ))}
              </div>

              {/* Tombol Wishlist */}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }} className="mt-20">
                <h3 className="text-2xl font-serif italic text-[#f5c77e] mb-4">Masih banyak yang harus kita buat...</h3>
                <button 
                  onClick={() => setIsWishlistOpen(true)}
                  className="px-8 py-4 bg-[#7a1f3d] text-[#f5c77e] rounded-full font-serif italic text-xl shadow-[0_0_20px_rgba(122,31,61,0.5)] hover:bg-[#8f2548] hover:scale-105 transition-all focus:outline-none"
                >
                  Buka Wishlist Kita
                </button>
              </motion.div>
              
              {/* PENUTUP & GEMBOK RAHASIA YANG MENGKILAP */}
              <div className="mt-32 pb-16 pt-16 border-t border-rose-900/30 relative">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <p className="text-rose-300 italic font-serif text-lg mb-6">Psstt... ada satu pesan terakhir buatmu.</p>
                  
                  <motion.button 
                    onClick={() => setIsSecretOpen(true)}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="group relative flex flex-col items-center gap-3 p-6 px-10 rounded-2xl bg-[#7a1f3d]/40 border border-[#f5c77e]/40 shadow-[0_0_20px_rgba(245,199,126,0.3)] hover:shadow-[0_0_40px_rgba(245,199,126,0.6)] hover:bg-[#7a1f3d]/80 hover:border-[#f5c77e] transition-all duration-300 focus:outline-none overflow-hidden"
                  >
                    {/* Efek Cahaya / Swipe Latar Dalam Tombol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f5c77e]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {isSecretUnlocked ? <Unlock className="text-[#f5c77e]" size={36} /> : <Lock className="text-[#f5c77e]" size={36} />}
                    </motion.div>
                    
                    <span className="text-sm tracking-widest uppercase text-[#f5c77e] font-bold group-hover:text-white transition-colors relative z-10">
                      {isSecretUnlocked ? "Secret Unlocked" : "Secret Area"}
                    </span>
                  </motion.button>
                </motion.div>
              </div>

            </motion.section>
          )}
        </main>
      )}

      {/* OVERLAY: Gembok Rahasia */}
      <AnimatePresence>
        {isSecretOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !isSecretUnlocked && setIsSecretOpen(false)} // Bisa ditutup kalau belum kebuka
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-[#2b1738] border border-rose-900/50 p-8 rounded-xl shadow-[0_0_40px_rgba(122,31,61,0.3)] max-w-md w-full text-center relative"
            >
              <button onClick={() => setIsSecretOpen(false)} className="absolute top-4 right-4 text-rose-300/50 hover:text-rose-300 focus:outline-none">
                <X size={20} />
              </button>

              {!isSecretUnlocked ? (
                <>
                  <Lock className="mx-auto text-[#f5c77e] mb-4" size={40} />
                  <h3 className="text-2xl font-serif italic text-[#f2a7b8] mb-2">Area Terkunci</h3>
                  <p className="text-white/60 mb-6 text-sm">Masukkan password untuk membuka pesan rahasia.</p>
                  
                  <form onSubmit={handlePasswordSubmit}>
                    <motion.input 
                      animate={passwordError ? { x: [-10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      type="password"
                      placeholder="Password..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className={`w-full bg-[#1c1026] border ${passwordError ? 'border-red-500' : 'border-rose-900/50'} rounded-lg px-4 py-3 text-center text-white focus:outline-none focus:border-[#f5c77e] tracking-[0.2em] font-mono`}
                      autoFocus
                    />
                    {passwordError && <p className="text-red-400 text-xs mt-2">Password salah. Coba ingat lagi...</p>}
                    <button type="submit" className="w-full mt-4 py-3 bg-[#7a1f3d] text-[#f5c77e] rounded-lg font-medium hover:bg-[#8f2548] transition-colors focus:outline-none">
                      Buka Kunci
                    </button>
                  </form>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-left">
                  <Unlock className="mx-auto text-[#f5c77e] mb-6" size={40} />
                  <p className="text-[#fbf3ea] text-lg leading-relaxed font-serif italic text-center">
                    {CONFIG.secretMessage}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX OVERLAY: Galeri Foto */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-12 cursor-zoom-out backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-[#fbf3ea] p-4 md:p-6 pb-8 md:pb-12 rounded shadow-2xl max-w-2xl w-full cursor-default"
            >
              <div className="relative w-full aspect-square md:aspect-[4/3] bg-[#ead9cc] overflow-hidden rounded">
                <img src={selectedPhoto.src} alt={selectedPhoto.cap} className="w-full h-full object-contain bg-black/5" />
              </div>
              <p className="text-center font-serif italic mt-6 text-2xl text-[#7a1f3d]">{selectedPhoto.cap}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX OVERLAY: Wishlist */}
      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-[#fbf3ea] text-[#3a2230] p-6 md:p-10 rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative"
            >
              <button onClick={() => setIsWishlistOpen(false)} className="absolute top-4 right-4 text-[#7a1f3d] hover:bg-rose-100 p-2 rounded-full transition-colors focus:outline-none">
                <X size={24} />
              </button>

              <h2 className="text-3xl font-serif italic text-[#7a1f3d] mb-6 text-center border-b-2 border-rose-200 pb-4">Wishlist Kita</h2>
              <ul className="space-y-4">
                {CONFIG.wishlist.map((item, idx) => (
                  <motion.li key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`flex items-start gap-3 p-3 rounded-lg border ${item.done ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="mt-1 flex-shrink-0">{item.done ? <CheckSquare className="text-emerald-500" size={22} /> : <Square className="text-gray-300" size={22} />}</div>
                    <span className={`text-lg leading-snug ${item.done ? 'text-gray-500 line-through decoration-rose-300 decoration-2' : 'text-gray-800'}`}>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 text-center text-sm text-[#7a1f3d] italic"><p>Dan masih banyak lagi yang akan kita isi ke depannya...</p></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}