import React, { useState } from 'react';
import bgImg from "./bg.png";
interface ImgBBResponse {
    data: {
        url_viewer: string;
    };
    success: boolean;
}

export const PhotoGenerator: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [imgbbUrl, setImgbbUrl] = useState<string | null>(null);

    const generateImage = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://ai16z-image-generator-hnxc8rtju-rubys-projects-fb9e0c83.vercel.app/api/generate-image', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const generatedImageUrl = data; 

            const imageResponse = await fetch(generatedImageUrl);
            const imageBlob = await imageResponse.blob();

            const formData = new FormData();
            formData.append('image', imageBlob, 'eliza_wisdom.jpg');
            formData.append('name', "eliza_wisdom");

            const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const imgbbData: ImgBBResponse = await imgbbResponse.json();

            if (!imgbbData.success) {
                throw new Error('Failed to upload image to ImgBB');
            }

            setGeneratedImage(generatedImageUrl);
            setImgbbUrl(imgbbData.data.url_viewer);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const shareOnX = () => {
        if (imgbbUrl) {
            const tweetText = encodeURIComponent('#AI16Z');
            const xUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imgbbUrl)}`;
            window.open(xUrl, '_blank');
        }
    };


    return (
        <div className="min-h-screen bg-[#1a1a1a] bg-opacity-95 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-repeat"
                style={{
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: '200px',
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-transparent to-[#1a1a1a]" />

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="flex flex-col justify-center">
                        <div className="text-left mb-8">
                            <h1 className="text-6xl font-bold text-[#ff6b2b] mb-4 animate-pulse">
                                AI16Z
                            </h1>
                            <p className="text-2xl text-gray-400 tracking-wide mb-4">eliza image lab</p>
                            <p className="text-gray-500 leading-relaxed">
                                hey anon, let's make some weird art together. i wrote this script that generates
                                maximally interesting images. might be cursed, might be based - only one way to find out.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <h3 className="text-[#ff6b2b] font-semibold mb-2">features (trust me bro)</h3>
                                <ul className="text-gray-400 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#ff6b2b]">✓</span> next-level image generation (thank you Heuristic)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#ff6b2b]">✓</span> auto-posting to x (touch grass edition)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#ff6b2b]">✓</span> based image hosting included
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={generateImage}
                                disabled={isLoading}
                                className={`
                                    w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff6b2b] to-[#ff8f5a]
                                    text-white font-bold text-lg uppercase tracking-wider
                                    transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-[#ff6b2b]/20
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                    border-2 border-[#ff6b2b]/20
                                `}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        summoning eliza...
                                    </span>
                                ) : 'manifest image'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col items-center justify-center relative">
                        {error && (
                            <div className="absolute top-0 left-0 right-0 mt-4 p-4 bg-red-500/20 text-red-300 rounded-lg backdrop-blur-sm border border-red-500/20">
                                oops, something broke: {error}
                            </div>
                        )}

                        {!generatedImage && !error && (
                            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                                <div className="w-64 h-64 bg-gradient-to-br from-[#ff6b2b]/20 to-[#ff8f5a]/20 rounded-lg mb-4 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-[#ff6b2b]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400">your potentially blessed/cursed image will manifest here</p>
                            </div>
                        )}

                        {generatedImage && (
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-[#ff6b2b] to-[#ff8f5a] rounded-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                                <div className="relative bg-[#1a1a1a] p-4 rounded-lg">
                                    <img
                                        src={generatedImage}
                                        alt="Generated wisdom"
                                        className="rounded-lg shadow-lg"
                                    />
                                    <div className="mt-4 text-center text-gray-300 font-semibold">
                                        eliza's based moments
                                    </div>

                                    {imgbbUrl && (
                                        <button
                                            onClick={shareOnX}
                                            className={`
                                                mt-6 px-8 py-3 rounded-xl bg-black text-white w-full
                                                font-bold uppercase tracking-wider
                                                transition-all hover:bg-zinc-800 transform hover:scale-105
                                                flex items-center justify-center gap-3
                                                border border-zinc-700 hover:border-zinc-600
                                                shadow-lg hover:shadow-xl shadow-black/20
                                            `}
                                        >
                                            shitpost to
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>

                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff6b2b] opacity-5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ff6b2b] opacity-5 rounded-full blur-3xl" />
        </div>
    );
};

export default PhotoGenerator;