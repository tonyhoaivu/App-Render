/**
 * Extracts frames from a video file at a specific interval.
 * This runs entirely in the browser using HTML5 Video and Canvas.
 */
export const extractFrames = async (
  file: File,
  intervalSeconds: number = 1,
  maxFrames: number = 10
): Promise<{ data: string, mimeType: string }[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const frames: { data: string, mimeType: string }[] = [];

    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const duration = video.duration;
      const totalFramesToExtract = Math.min(Math.floor(duration / intervalSeconds) + 1, maxFrames);
      
      try {
        for (let i = 0; i < totalFramesToExtract; i++) {
          const time = i * intervalSeconds;
          video.currentTime = time;
          
          await new Promise((res) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                // Use jpeg for smaller size
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                const base64 = dataUrl.split(',')[1];
                frames.push({ data: base64, mimeType: 'image/jpeg' });
              }
              res(true);
            };
            video.addEventListener('seeked', onSeeked);
          });
        }
        
        URL.revokeObjectURL(video.src);
        resolve(frames);
      } catch (err) {
        URL.revokeObjectURL(video.src);
        reject(err);
      }
    };

    video.onerror = (err) => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Failed to load video for frame extraction"));
    };
  });
};
