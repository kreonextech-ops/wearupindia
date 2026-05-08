import GalleryGrid from '@/components/gallery/GalleryGrid';
import { getAssetUrl } from '@/lib/assets';
import { listGalleryFiles } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let files: string[] = [];
  let heroPhotos: string[] = [];

  try {
    const rawFiles = await listGalleryFiles();
    console.log('DEBUG: rawFiles.length =', rawFiles.length);

    const videos = rawFiles.filter(f => f.toLowerCase().endsWith('.mp4'));
    const photos = rawFiles.filter(f => !f.toLowerCase().endsWith('.mp4'));

    const shuffle = (arr: string[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const shuffledVideos = shuffle(videos);
    const shuffledPhotos = shuffle(photos);

    // First 3 photos go to the hero collage
    heroPhotos = shuffledPhotos.slice(0, 3);
    const remainingPhotos = shuffledPhotos.slice(3);

    // Bento pattern: video always on right edge of 4-col grid
    const pattern = ['img', 'img', 'vid', 'img', 'vid', 'img', 'img', 'vid', 'img', 'vid'];
    let pIdx = 0, vIdx = 0, step = 0;

    while (pIdx < remainingPhotos.length) {
      if (pattern[step % 10] === 'vid') {
        files.push(shuffledVideos[vIdx % shuffledVideos.length]);
        vIdx++;
      } else {
        files.push(remainingPhotos[pIdx]);
        pIdx++;
      }
      step++;
    }
  } catch (err) {
    console.error('Gallery folder not found', err);
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Header – Cinematic Full-Bleed */}
      <div className="relative h-[45vh] min-h-[380px] overflow-hidden">

        {/* Background Image */}
        {heroPhotos[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getAssetUrl(`/gallery/${encodeURIComponent(heroPhotos[0])}`)}
            alt="Gallery Hero"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover scale-105"
            style={{ filter: 'brightness(0.45)' }}
          />
        )}

        {/* Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Decorative scan line */}
        <div className="absolute top-0 left-0 w-full h-px bg-[#E8161B]/40" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
          <div>
              <p className="font-mono text-[10px] text-[#E8161B] tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-[#E8161B]" />
                Our Portfolio
              </p>
              <h1 className="font-display font-black leading-[0.85] uppercase text-white">
                <span className="block text-6xl sm:text-8xl">THE KINETIC</span>
                <span className="block text-6xl sm:text-8xl text-[#E8161B]">GALLERY</span>
              </h1>
              <p className="font-mono text-[10px] text-white/40 tracking-widest mt-4 uppercase">
                {files.length + 3}+ shots &nbsp;·&nbsp; Real Builds &nbsp;·&nbsp; Zero CGI
              </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid + Lightbox */}
      <GalleryGrid files={files} />

      {/* Stats Bar */}
      <div className="border-t border-[#1a1a1a] bg-[#0d0d0d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '1,500+', label: 'Wraps Completed' },
              { num: '800+', label: 'Happy Riders' },
              { num: '4.9★', label: 'Average Rating' },
              { num: `${files.length || 150}+`, label: 'Gallery Shots' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-display font-black text-4xl text-[#E8161B] mb-1">{stat.num}</div>
                <div className="font-mono text-[10px] text-[#555] tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
