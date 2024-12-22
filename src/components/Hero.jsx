import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

// Enable scrool for gsap to trigger.
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    // We need to know when the user clicks a video, and we need to know which video is playing at the moment.
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);

    // Videos take some time to load.
    const [isLoading, setIsLoading] = useState(true);

    // The number of videos loaded.
    const [loadedVideos, setLoadedVideos] = useState(0);

    // The number of total videos intended to play.
    const totalVideos = 4;

    // We need a reference inwhich we can switch the videos.
    const nextVideoRef = useRef(null);

    // We want to loop the videos once we reach the max index.
    const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

    const handleVideoLoad = () => {
        setLoadedVideos((prev) => prev + 1);
    }

    // If the user has clicked a video:
    const handleMiniVdClick = () => {
        setHasClicked(true);

        setCurrentIndex(upcomingVideoIndex);
    }

    // Render the loader when videos are loading.
    useEffect(() => {
        if (loadedVideos === totalVideos - 1) {
            setIsLoading(false);
        }
    }, [loadedVideos])

    // GSAP for animating the website.
    useGSAP(() => {
        // If the user has clicked the mini video in the center, animate the next video:
        if (hasClicked) {
            // Start playing the next video.
            gsap.set('#next-video', { visibility: 'visible' });

            // The next video will expand from the center.
            gsap.to('#next-video', {
                transformOrigin: 'center center',
                scale: 1,
                width: '100%',
                height: '100%',
                duration: 1,
                ease: 'power1.inOut',
                onStart: () => nextVideoRef.current.play(),
            })

            // The "next video", which is now the current video, also plays in the background.
            gsap.from('#current-video', {
                transformOrigin: 'center center',
                scale: 0,
                duration: 1.5,
                ease: 'power1.inOut',
            })
        }
    }, {dependencies: [currentIndex], revertOnUpdate: true});

    // When we scrool down, we want the video section to shrink in a polygon style.
    useGSAP(() => {
        // Final shape after scroll down.
        gsap.set('#video-frame', {
            clipPath: 'polygon(0% 60%, 20% 60%, 20% 0%, 80% 0%, 80% 60%, 100% 60%, 50% 100%)',
            borderRadius: '0 0 50% 50%'
        });

        // The above effect triggers after scrolling down.
        gsap.from('#video-frame', {
            clipPath: 'polygon(0% 100%, 0% 60%, 0% 0%, 100% 0%, 100% 60%, 100% 100%, 50% 100%)',
            borderRadius: '0 0 0 0',
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '#video-frame',
                start: 'center center',
                end: 'bottom center',
                scrub: true
            }
        })
    })

    // Video source.
    const getVideoSrc = (index) => `videos/hero-${index}.mp4`

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden">
            {/* If loading is true, render a loader. */}
            {isLoading && (
                <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
                    <div className="three-body">
                        <div className="three-body__dot" />
                        <div className="three-body__dot" />
                        <div className="three-body__dot" />
                    </div>
                </div>
            )}

            {/* Video. */}
            <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue">
                <div className="">
                    <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer
                        overflow-hidden rounded-lg">
                        {/* Mini video in the middle, only appears when hovered over it. */}
                        <div onClick={handleMiniVdClick} className="origin-center scale-50 opacity-0 transition-all
                            duration-500 ease-in hover:scale-100 hover:opacity-100">
                            <video
                                ref={nextVideoRef}

                                // Once we click on the video, we want to show the next video.
                                src={getVideoSrc(upcomingVideoIndex)}

                                // Video loops and muted.
                                loop
                                muted

                                id="current-video"
                                className="size-64 origin-center scale-150 object-cover object-center"
                                onLoadedData={handleVideoLoad}
                            />
                        </div>
                    </div>

                    {/* The next video starts playing when clicked and takes the screen with an animation. */}
                    <video
                        ref={nextVideoRef}
                        src={getVideoSrc(currentIndex)}
                        loop
                        muted
                        id="next-video"
                        className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
                        onLoadedData={handleVideoLoad}
                    />

                    {/* Play the current video. */}
                    <video
                        src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
                        autoPlay
                        loop
                        muted
                        className="absolute left-0 top-0 size-full object-cover object-center"
                        onLoadedData={handleVideoLoad}
                    />
                </div>

                {/* Text. */}
                <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
                    G<b>a</b>ming
                </h1>

                {/* More text. */}
                <div className="absolute left-0 top-0 z-40 size-full">
                    <div className="mt-24 px-5 sm:px-10">
                        <h1 className="special-font hero-heading text-blue-100">Redefi<b>n</b>e</h1>

                        <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
                            Enter the Metagame Layer <br /> Unleash the Play Economy
                        </p>

                        {/* Button. */}
                        <Button
                            id="watch-trailer"
                            title="Watch Trailer"
                            leftIcon={<TiLocationArrow />}
                            containerClass="!bg-yellow-300 flex-center gap-1"
                        />
                    </div>
                </div>
            </div>

            <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
                G<b>a</b>ming
            </h1>
        </div>
    )
}

export default Hero;