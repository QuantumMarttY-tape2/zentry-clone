import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useWindowScroll } from "react-use";
import gsap from "gsap";

const navItems = ['Nexus', 'Vault', 'Prologue', 'About', 'Contact'];

const Navbar = () => {
    // We want animations for the navbar.
    const navContainerRef = useRef(null);

    // When the user is scrolling down, we want the navbar to slowly hidden, and pops if the user is scrolling up.
    const { y: currentScrollY } = useWindowScroll();
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);
    useEffect(() => {
        // If the user is at the top of the webpage, then we do not need a navbar background in this case.
        if (currentScrollY === 0) {
            setIsNavVisible(true);
            navContainerRef.current.classList.remove('floating-nav');
        }
        // If the user is just scrolling down:
        else if (currentScrollY > lastScrollY) {
            setIsNavVisible(false);
            navContainerRef.current.classList.add('floating-nav');
        }
        // If the user is scrolling up:
        else if (currentScrollY < lastScrollY) {
            setIsNavVisible(true);
            navContainerRef.current.classList.add('floating-nav');
        }

        // Keep track of the user's scrolls.
        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY])

    // Animate the navbar poping up animation.
    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2
        })
    }, [isNavVisible])

    // Attach audio.
    const audioElementRef = useRef(null);

    // Check if audio is playing.
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);

    // Function that allows to play music.
    const toggleAudioIndicator = () => {
        setIsAudioPlaying((prev) => !prev)

        setIsIndicatorActive((prev) => !prev)
    }

    useEffect(() => {
        // If we are playing audio, then set to play, otherwise pause.
        if (isAudioPlaying) {
            audioElementRef.current.play();
        } else {
            audioElementRef.current.pause();
        }
    }, [])

    return (
        <div ref={navContainerRef} className="fixed inser-x-0 top-4 z-50 h-16 border-none transition-all
            duration-700 sm:inset-x-6">
            <header className="absolute top-1/2 w-full -translate-y-1/2">
                <nav className="flex size-full items-center justify-between p-4">
                    <div className="flex items-center gap-7">
                        {/* Logo. */}
                        <img
                            src="/img/logo.png"
                            alt="logo"
                            className="w-10"
                        />

                        <Button
                            id="product-button"
                            title="Products"
                            rightIcon={<TiLocationArrow />}
                            containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
                        />
                    </div>

                    {/* Navigation links and audio button. */}
                    <div className="flex h-full items-center">
                        {/* Hidden on small devices. */}
                        <div className="hidden md:block">
                            {navItems.map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="nav-hover-btn">
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Audio button. */}
                        <button className="ml-10 flex items-center space-x-0.5 " onClick={toggleAudioIndicator}>
                            <audio ref={audioElementRef} src="/audio/loop.mp3" className="hidden" loop />
                            
                            {/* Audio button. */}
                            {[1, 2, 3, 4].map((bar) => (
                                <div
                                    key={bar}
                                    className={`indicator-line ${isIndicatorActive ? 'active' : ''}`}
                                    style={{ animationDelay: `${bar * 0.1}s` }}
                                />
                            ))}
                            
                        </button>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar;