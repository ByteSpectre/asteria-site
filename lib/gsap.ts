"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Fewer refreshes on mobile URL-bar resize; smoother catch-up after long frames.
ScrollTrigger.config({ ignoreMobileResize: true });
gsap.ticker.lagSmoothing(500, 33);

export { gsap, ScrollTrigger, useGSAP };
