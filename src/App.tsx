import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Video, 
  User, 
  Film, 
  Copy, 
  Download, 
  Settings, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  Zap,
  Languages,
  Moon,
  Sun,
  FileText,
  Code,
  Check,
  AlertCircle,
  Loader2,
  Hash,
  Type as TypeIcon,
  Lightbulb,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeVideo, CharacterProfile, Scene, AnalysisResult } from './services/aiService';
import { extractFrames } from './services/mediaService';

// --- Components ---

const Header = ({ lang, setLang }: { lang: 'vi' | 'en', setLang: (l: 'vi' | 'en') => void }) => (
  <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        <Film className="text-black w-6 h-6" />
      </div>
      <div>
        <h1 className="font-bold text-lg tracking-tight">TonyHoaiVu</h1>
        <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest">Grok Prompt Factory</p>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="hidden md:flex flex-col items-end mr-4 text-[10px] text-zinc-500 font-medium leading-tight">
        <span>Bản quyền: TonyHoaiVu@gmail.com</span>
        <span>SĐT: 0927099940</span>
      </div>
      <button 
        onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-xs font-medium"
      >
        <Languages size={14} />
        {lang === 'vi' ? 'Tiếng Việt' : 'English'}
      </button>
      <div className="w-px h-6 bg-white/10" />
      <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
        <Moon size={18} className="text-zinc-400" />
      </button>
    </div>
  </header>
);

const CharacterPanel = ({ profile, setProfile, lang, onSaveToStorage }: { profile: CharacterProfile | null, setProfile: (p: CharacterProfile) => void, lang: 'vi' | 'en', onSaveToStorage: () => void }) => {
  const [isEditing, setIsEditing] = useState(!profile);

  const t = {
    vi: {
      title: "HỒ SƠ NHÂN VẬT MASTER",
      subtitle: "Cố định để giữ đồng nhất khuôn mặt",
      name: "Tên",
      age: "Tuổi",
      gender: "Giới tính",
      face: "Khuôn mặt",
      hair: "Tóc",
      outfit: "Trang phục",
      skin: "Màu da",
      style: "Phong cách",
      seed: "Seed",
      edit: "Chỉnh sửa",
      save: "Xong",
      backup: "Lưu hồ sơ"
    },
    en: {
      title: "MASTER CHARACTER PROFILE",
      subtitle: "Locked for face consistency",
      name: "Name",
      age: "Age",
      gender: "Gender",
      face: "Face",
      hair: "Hair",
      outfit: "Outfit",
      skin: "Skin",
      style: "Style",
      seed: "Seed",
      edit: "Edit",
      save: "Done",
      backup: "Save Profile"
    }
  }[lang];

  return (
    <div className="glass-panel p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User size={18} className="text-emerald-500" />
          <div>
            <h3 className="font-bold text-sm tracking-wide">{t.title}</h3>
            <p className="text-[10px] text-zinc-500">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onSaveToStorage}
            className="text-[10px] uppercase font-bold text-amber-500 hover:underline flex items-center gap-1"
          >
            <Download size={12} />
            {t.backup}
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-[10px] uppercase font-bold text-emerald-500 hover:underline"
          >
            {isEditing ? t.save : t.edit}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {isEditing ? (
          <>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">{t.name}</label>
              <input 
                className="w-full bg-black/30 border border-white/10 rounded p-1.5 text-xs focus:border-emerald-500 outline-none"
                value={profile?.name || ''}
                onChange={e => setProfile({...profile!, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">{t.age}</label>
              <input 
                className="w-full bg-black/30 border border-white/10 rounded p-1.5 text-xs focus:border-emerald-500 outline-none"
                value={profile?.age || ''}
                onChange={e => setProfile({...profile!, age: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">{t.face}</label>
              <input 
                className="w-full bg-black/30 border border-white/10 rounded p-1.5 text-xs focus:border-emerald-500 outline-none"
                value={profile?.faceDescription || ''}
                onChange={e => setProfile({...profile!, faceDescription: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">{t.style}</label>
              <input 
                className="w-full bg-black/30 border border-white/10 rounded p-1.5 text-xs focus:border-emerald-500 outline-none"
                value={profile?.cinematicStyle || ''}
                onChange={e => setProfile({...profile!, cinematicStyle: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">{t.seed}</label>
              <input 
                className="w-full bg-black/30 border border-white/10 rounded p-1.5 text-xs focus:border-emerald-500 outline-none"
                value={profile?.seed || ''}
                onChange={e => setProfile({...profile!, seed: e.target.value})}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-0.5">
              <p className="text-[9px] text-zinc-500 uppercase">{t.name}</p>
              <p className="text-xs font-medium">{profile?.name || '---'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-zinc-500 uppercase">{t.age}</p>
              <p className="text-xs font-medium">{profile?.age || '---'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-zinc-500 uppercase">{t.face}</p>
              <p className="text-xs font-medium truncate">{profile?.faceDescription || '---'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-zinc-500 uppercase">{t.style}</p>
              <p className="text-xs font-medium">{profile?.cinematicStyle || '---'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-zinc-500 uppercase">{t.seed}</p>
              <p className="text-xs font-mono text-emerald-500">{profile?.seed || '---'}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [character, setCharacter] = useState<CharacterProfile | null>(null);
  const [marketing, setMarketing] = useState<AnalysisResult['marketing'] | null>(null);
  const [viralScripts, setViralScripts] = useState<AnalysisResult['viralScripts']>([]);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<{id: string, type: string} | null>(null);

  // Check for API key on mount
  React.useEffect(() => {
    if (!process.env.GEMINI_API_KEY) {
      setError(lang === 'vi' 
        ? "Thiếu GEMINI_API_KEY. Vui lòng thiết lập trong Environment Variables trên Vercel và redeploy." 
        : "GEMINI_API_KEY is missing. Please set it in Vercel Environment Variables and redeploy.");
    }

    // Load character profile from storage
    const savedProfile = localStorage.getItem('master_character_profile');
    if (savedProfile) {
      try {
        setCharacter(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, [lang]);

  const saveProfileToStorage = () => {
    if (character) {
      localStorage.setItem('master_character_profile', JSON.stringify(character));
      setCopyStatus({ id: 'profile', type: 'save' });
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const startAnalysis = async () => {
    if (!videoFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Step 1: Extract frames from video
      // We extract 1 frame per 2 seconds, max 12 frames to keep payload reasonable
      const frames = await extractFrames(videoFile, 2, 12);
      
      if (frames.length === 0) {
        throw new Error(lang === 'vi' ? "Không thể trích xuất hình ảnh từ video" : "Could not extract frames from video");
      }

      // Step 2: Send frames to AI for analysis
      const result = await analyzeVideo(frames, character || undefined);
      
      setScenes(result.scenes);
      setCharacter(result.character);
      setMarketing(result.marketing);
      setViralScripts(result.viralScripts);
      setIsAnalyzing(false);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || (lang === 'vi' ? "Phân tích thất bại" : "Analysis failed"));
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, id: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ id, type });
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const copyAllSceneData = (scene: Scene) => {
    const text = `
SCENE ${scene.number} [${scene.timestamp}]
------------------------------------------
DESCRIPTION: ${scene.description}
VISUAL DETAILS: ${scene.visualDetails}
ACTION: ${scene.action}
DIALOGUE: ${scene.dialogue}
CAMERA: ${scene.camera}
EMOTION: ${scene.emotion}
LIGHTING: ${scene.lighting}
GROK VIDEO PROMPT: ${scene.prompt}
IMAGE PROMPT: ${scene.imagePrompt}
    `.trim();
    copyToClipboard(text, scene.number.toString(), 'all');
  };

  const copyMarketingInfo = () => {
    if (!marketing) return;
    const text = `
TITLE: ${marketing.suggestedTitle}
HASHTAGS: ${marketing.hashtags.join(' ')}
IDEAS: ${marketing.similarContentIdeas.join('\n- ')}
    `.trim();
    copyToClipboard(text, 'marketing', 'info');
  };

  const copyViralScript = (script: AnalysisResult['viralScripts'][0], index: number) => {
    const text = `
KỊCH BẢN VIRAL ${index + 1}
-----------------------
HOOK: ${script.hook}
BODY: ${script.body}
CTA: ${script.callToAction}
VISUAL HOOK: ${script.visualHook}
VIRAL PROMPT: ${script.alternativeViralPrompt}
    `.trim();
    copyToClipboard(text, `viral-${index}`, 'script');
  };

  const exportData = (format: 'json' | 'txt' | 'grok') => {
    let content = '';
    let filename = `scenes-export.${format}`;
    
    if (format === 'json') {
      content = JSON.stringify({ character, scenes, marketing, viralScripts }, null, 2);
    } else if (format === 'txt') {
      content = scenes.map(s => `[${s.timestamp}]\n${s.prompt}\n`).join('\n');
    } else {
      content = scenes.map(s => `// SCENE ${s.number}\n${s.prompt}`).join('\n\n');
      filename = `grok-script.txt`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const t = {
    vi: {
      upload: "Tải video lên",
      analyze: "Phân tích Video",
      analyzing: "Đang xử lý...",
      noVideo: "Chưa chọn video (Nhấp để chọn)",
      scenes: "Phân cảnh & Prompt",
      marketing: "Gợi ý Marketing",
      viral: "Kịch bản Viral",
      copyAll: "Copy tất cả dữ liệu",
      export: "Xuất file",
      scene: "Cảnh",
      time: "Thời gian",
      desc: "Mô tả",
      visual: "Chi tiết hình ảnh",
      action: "Hành động",
      camera: "Góc quay",
      dialogue: "Lời thoại",
      copy: "Copy Prompt",
      copyImage: "Copy Ảnh",
      copyMarketing: "Copy Marketing",
      copyScript: "Copy Kịch bản",
      title: "Tiêu đề gợi ý",
      hashtags: "Hashtags",
      ideas: "Ý tưởng tương tự",
      hook: "Mở đầu (Hook)",
      body: "Nội dung (Body)",
      cta: "Kêu gọi (CTA)",
      vHook: "Hình ảnh Viral",
      vPrompt: "Prompt Viral",
      imagePrompt: "Prompt Ảnh tĩnh"
    },
    en: {
      upload: "Upload Video",
      analyze: "Analyze Video",
      analyzing: "Analyzing...",
      noVideo: "No video selected (Click to select)",
      scenes: "Scenes & Prompts",
      marketing: "Marketing Suggestions",
      viral: "Viral Scripts",
      copyAll: "Copy All Scene Data",
      export: "Export",
      scene: "Scene",
      time: "Time",
      desc: "Description",
      visual: "Visual Details",
      action: "Action",
      camera: "Camera",
      dialogue: "Dialogue",
      copy: "Copy Prompt",
      copyImage: "Copy Image",
      copyMarketing: "Copy Marketing",
      copyScript: "Copy Script",
      title: "Suggested Title",
      hashtags: "Hashtags",
      ideas: "Similar Ideas",
      hook: "Hook",
      body: "Body",
      cta: "Call to Action",
      vHook: "Visual Hook",
      vPrompt: "Viral Prompt",
      imagePrompt: "Static Image Prompt"
    }
  }[lang];

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} setLang={setLang} />
      
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          <CharacterPanel 
            profile={character} 
            setProfile={setCharacter} 
            lang={lang} 
            onSaveToStorage={saveProfileToStorage}
          />
          
          <div className="glass-panel p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <Video size={16} className="text-emerald-500" />
                VIDEO SOURCE
              </h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition-all font-bold"
              >
                {t.upload}
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
            </div>

            <div 
              onClick={() => !videoUrl && fileInputRef.current?.click()}
              className={`aspect-video bg-black/50 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500/30 transition-all ${!videoUrl ? 'group' : ''}`}
            >
              {videoUrl ? (
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              ) : (
                <div className="text-center space-y-3">
                  <Upload className="text-zinc-500 mx-auto group-hover:text-emerald-500 transition-colors" />
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">{t.noVideo}</p>
                </div>
              )}
            </div>

            <button 
              disabled={!videoFile || isAnalyzing}
              onClick={startAnalysis}
              className={`mt-6 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !videoFile || isAnalyzing ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-500 text-black hover:bg-emerald-400'
              }`}
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
              {isAnalyzing ? t.analyzing : t.analyze}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-xs animate-pulse">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Marketing Suggestions */}
          <AnimatePresence>
            {marketing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass-panel p-4 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-500" />
                    {t.marketing}
                  </h3>
                  <button 
                    onClick={copyMarketingInfo}
                    className="text-[10px] bg-white/5 px-2 py-1 rounded flex items-center gap-1 hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    {copyStatus?.id === 'marketing' ? <Check size={10} /> : <Copy size={10} />}
                    {t.copyMarketing}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                      <TypeIcon size={10} /> {t.title}
                    </p>
                    <p className="text-xs font-medium text-emerald-400">{marketing.suggestedTitle}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                      <Hash size={10} /> {t.hashtags}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {marketing.hashtags.map((h, i) => (
                        <span key={i} className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">#{h}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                      <Lightbulb size={10} /> {t.ideas}
                    </p>
                    <ul className="space-y-1">
                      {marketing.similarContentIdeas.map((idea, i) => (
                        <li key={i} className="text-[10px] text-zinc-400 flex items-start gap-2">
                          <ChevronRight size={10} className="mt-0.5 text-emerald-500" />
                          {idea}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          {/* Viral Scripts Section */}
          <AnimatePresence>
            {viralScripts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4"
              >
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-amber-500" />
                  {t.viral}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viralScripts.map((script, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 relative group">
                      <button 
                        onClick={() => copyViralScript(script, i)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-emerald-500"
                      >
                        {copyStatus?.id === `viral-${i}` ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[8px] text-amber-500 uppercase font-bold">{t.hook}</p>
                          <p className="text-[10px] text-zinc-300 line-clamp-2">{script.hook}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-zinc-500 uppercase font-bold">{t.vHook}</p>
                          <p className="text-[10px] text-zinc-400 italic line-clamp-2">{script.visualHook}</p>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[8px] text-emerald-500 uppercase font-bold">{t.vPrompt}</p>
                          <p className="text-[9px] font-mono text-zinc-500 line-clamp-3">{script.alternativeViralPrompt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-panel flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <ClipboardList size={16} className="text-emerald-500" />
                {t.scenes}
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => exportData('grok')} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400"><Code size={16} /></button>
                <button onClick={() => exportData('json')} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400"><Download size={16} /></button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {scenes.map((scene, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-xs font-bold">
                          {scene.number}
                        </span>
                        <div>
                          <p className="text-[10px] text-zinc-500 font-mono">{scene.timestamp}</p>
                          <h4 className="text-xs font-bold text-zinc-300">{scene.camera} | {scene.emotion}</h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => copyAllSceneData(scene)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase"
                        >
                          {copyStatus?.id === scene.number.toString() && copyStatus?.type === 'all' ? <Check size={10} /> : <ClipboardList size={10} />}
                          {t.copyAll}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(scene.prompt, scene.number.toString(), 'prompt')}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all text-[9px] font-bold uppercase"
                        >
                          {copyStatus?.id === scene.number.toString() && copyStatus?.type === 'prompt' ? <Check size={10} /> : <Copy size={10} />}
                          {t.copy}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(scene.imagePrompt, scene.number.toString(), 'image')}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black transition-all text-[9px] font-bold uppercase"
                        >
                          {copyStatus?.id === scene.number.toString() && copyStatus?.type === 'image' ? <Check size={10} /> : <Copy size={10} />}
                          {t.copyImage}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">{t.desc}</p>
                        <p className="text-xs text-zinc-300">{scene.description}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">{t.visual}</p>
                        <p className="text-xs text-zinc-400 italic">{scene.visualDetails}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">{t.action}</p>
                        <p className="text-xs text-zinc-300">{scene.action}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">{t.dialogue}</p>
                        <p className="text-xs text-emerald-500/80 italic">"{scene.dialogue || '---'}"</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1">
                          <Video size={10} className="text-emerald-500" />
                          Grok Video Prompt
                        </p>
                        <p className="text-[11px] font-mono text-zinc-400">{scene.prompt}</p>
                      </div>
                      <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                        <p className="text-[9px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1">
                          <Sparkles size={10} className="text-amber-500" />
                          {t.imagePrompt}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-500">{scene.imagePrompt}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
