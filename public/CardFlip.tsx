"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Briefcase, Youtube, BookOpen, Linkedin, Instagram, MessageCircle } from "lucide-react";
import Image from "next/image";

// 型別定義
interface SocialLinks {
  youtube: string;
  linkedin: string;
  instagram: string;
  whatsapp: string;
  portfolio: string;
  blog: string;
}

interface ProfileInfo {
  name: string;
  title: string;
  avatar: string;
  socialLinks: SocialLinks;
  qrCodeUrl: string;
}

// 預設 profile
const defaultProfile: ProfileInfo = {
  name: "Howard",
  title: "Invert, always invert.",
  avatar: "/portfolio.jpeg",
  socialLinks: {
    youtube: "https://www.youtube.com/@QQ-ms6sx",
    linkedin: "https://www.linkedin.com/in/%E8%BB%92%E8%B1%AA-%E8%83%A1-897713180/",
    instagram: "https://www.instagram.com/d_arwin/",
    whatsapp: "https://wa.me/your-number",
    portfolio: "https://howard1021.github.io/HowsCoding/",
    blog: "https://your-blog.com"
  },
  qrCodeUrl: "https://www.teamtaiwan.win/"
};

export const CardFlip = () => {
  const [flipped, setFlipped] = useState(false);
  const [overlay, setOverlay] = useState<'none' | 'qr' | 'whatsapp'>('none');
  const [profile] = useState<ProfileInfo>(defaultProfile);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-72 h-[600px] rounded-3xl overflow-hidden shadow-xl cursor-pointer" tabIndex={0} aria-label="Flip card" onClick={() => setFlipped(f => !f)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}>
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ perspective: 2000 }}
        >
          <motion.div
            className="w-full h-full"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front Side */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white rounded-3xl backface-hidden">
              <div className="text-center">
                <Image src="/sample.png" alt="Business Card" width={240} height={150} className="rounded shadow-lg mx-auto mb-4" />
                <div className="text-sm text-gray-500 mt-2">Click the card to flip</div>
              </div>
            </div>
            {/* Back Side */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center backface-hidden" style={{ transform: "rotateY(180deg)" }}>
              <div className="relative w-full h-full flex flex-col items-center px-4 py-10 bg-gradient-to-b from-purple-300 via-orange-300 to-red-300 rounded-3xl">
                {overlay === 'none' ? (
                  <>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                      <Image src={profile.avatar} alt={profile.name} width={96} height={96} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{profile.name}</h1>
                    <p className="text-sm text-white/90 mb-8 italic">{profile.title}</p>

                    {/* Main Links */}
                    <div className="w-full space-y-3 mb-8">
                      <a 
                        href={profile.socialLinks.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-white/90 hover:bg-white rounded-md font-medium text-gray-700
                          shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]
                          flex items-center justify-center gap-2"
                      >
                        <Briefcase size={18} />
                        <span>Portfolio</span>
                      </a>
                      <a 
                        href={profile.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-white/90 hover:bg-white rounded-md font-medium text-gray-700
                          shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]
                          flex items-center justify-center gap-2"
                      >
                        <Youtube size={18} />
                        <span>YouTube Channel</span>
                      </a>
                      <a 
                        href={profile.socialLinks.blog} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-white/90 hover:bg-white rounded-md font-medium text-gray-700
                          shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]
                          flex items-center justify-center gap-2"
                      >
                        <BookOpen size={18} />
                        <span>Blog</span>
                      </a>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex space-x-5 mt-auto items-center">
                      <a 
                        href={profile.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/20 rounded-full" 
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={20} />
                      </a>
                      <button
                        className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/20 rounded-full"
                        aria-label="Show WhatsApp overlay"
                        tabIndex={0}
                        onClick={e => { e.stopPropagation(); setOverlay('whatsapp'); }}
                      >
                        <MessageCircle size={20} />
                      </button>
                      <a 
                        href={profile.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/20 rounded-full" 
                        aria-label="Instagram"
                      >
                        <Instagram size={20} />
                      </a>
                      <button
                        className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/20 rounded-full"
                        aria-label="Show QR code"
                        tabIndex={0}
                        onClick={e => { e.stopPropagation(); setOverlay('qr'); }}
                      >
                        <QrCode size={20} />
                      </button>
                    </div>
                  </>
                ) : overlay === 'qr' ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <Image src="/qrcode.png" alt="QR code" width={192} height={192} className="w-48 h-48 object-contain rounded" />
                    </div>
                    <div className="mt-4 text-white break-all text-center">{profile.qrCodeUrl}</div>
                    <button
                      className="mt-6 px-4 py-2 bg-white text-gray-800 rounded"
                      onClick={e => { e.stopPropagation(); setOverlay('none'); }}
                      aria-label="Back to profile"
                      tabIndex={0}
                    >
                      back
                    </button>
                  </div>
                ) : overlay === 'whatsapp' ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <Image src="/whatappqrcode.png" alt="WhatsApp QR code" width={192} height={192} className="w-48 h-48 object-contain rounded" />
                    </div>
                    <div className="mt-4 text-white break-all text-center">{profile.socialLinks.whatsapp}</div>
                    <button
                      className="mt-6 px-4 py-2 bg-white text-gray-800 rounded"
                      onClick={e => { e.stopPropagation(); setOverlay('none'); }}
                      aria-label="Back to profile"
                      tabIndex={0}
                    >
                      back
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardFlip;