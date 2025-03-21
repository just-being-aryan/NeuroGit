import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { Card as ShadcnCard, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // shadcn/ui card component
import Navbar from "./_components/Navbar";
import { TypewriterEffect, TypewriterEffectSmooth } from "./_components/typewriter-effect"; // Import TypewriterEffect components
import { TextGenerateEffect } from "./_components/text-generate-effect";
import { Carousel } from "./_components/carousel";
import { HeroParallax } from "./_components/hero-parallax";
import Image from "next/image";
import { Timeline } from "./_components/timeline";
import project from "@/images/project.png";
import question from "@/images/question.png"
import meeting from "@/images/meeting.png"
import billing from "@/images/billing.png"


export default function Home() {
   
  const data = [
    {
      title: "Create your Project!",
      content: (
        <div>
         <p className="text-white-800 dark:text-neutral-200 text-base md:text-lg font-normal mb-8">
  New Users get 150 credits free!, you can buy credits from the Billing section.
</p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src= {project}
              alt="startup template"
              width={800}
              height={800}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Ask NeuroGit about your repo",
      content: (
        <div>
          <p className="text-white-800 dark:text-neutral-200 text-base md:text-lg font-normal mb-8">
            
            NeuroGit can answer any question related to your GitHub Repo!
          </p>
          <p className="text-white-800 dark:text-neutral-200 text-base md:text-m font-normal mb-8">
          You can save questions using "Save Answer" button, and view it later on QnA page
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={question}
              alt="hero template"
              width={800}
              height={800}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            
          </div>
        </div>
      ),
    },
    {
      title: "Meetings Page",
      content: (
        <div>
          <p className="text-white-800 dark:text-neutral-200 text-base md:text-lg font-normal mb-8">
            You can add your Meeting Audio, and extract meaningfull insights from it by
            audio to text conversion using Assembly AI
          </p>
          <p className="text-white-800 dark:text-neutral-200 text-base md:text-m font-normal mb-8">
            Each credit allows you to index 1 file in the repository.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Image
              src={meeting}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            
          </div>
        </div>
      ),
    },
    {
      title: "Buy Credits to continue creating Projects!",
      content: (
        <div>
          <p className="text-white-800 dark:text-neutral-200 text-base md:text-lg font-normal mb-8">
            
           You can buy credits on Billing page, for every 100 credits, $2.00 is charged, 
           you can buy 1000 credits at once 
          </p>
         
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={billing}
              alt="hero template"
              width={800}
              height={800}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            
          </div>
        </div>
      ),
    },
  ];

  const typewriterWords = [
    { text: "Automate", className: "text-white-500" },
    { text: "GitHub", className: "text-white-500" },
    { text: "Repositories", className: "text-white-500" },
    { text: "with", className: "text-white-500" },
    { text: "AI", className: "text-orange-500" },
  ];

  const words = '  NeuroGit leverages Gemini AI and Assembly AI to revolutionize repository management.';

  return (
    <div className="min-h-screen bg-black text-white font-montserrat">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-[60vh] pt-20 text-center">
        
        

      {/*Brand */}
      <h1 className = "text-xl md:text-8xl pb-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-sans font-bold">
                  NeuroGit
      </h1>
   

        {/* TypewriterEffectSmooth */}
        <TypewriterEffectSmooth
          words={typewriterWords}
          className="text-6xl font-bold mb-4"
          cursorClassName="bg-orange-700"
        />
   
        <TextGenerateEffect className="text-gray-500 pb-7" duration={2} filter = {false} words = {words} />

     
     

        <div className="space-x-4">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Link href="https://github.com/just-being-aryan/NeuroGit" target="_blank">
              View on GitHub
            </Link>
          </Button>
          <Button variant="outline" className="text-black border-orange-500 hover:bg-orange-500 hover:text-white">
            
            <Link href="/sign-up" target="_blank">
              Get Started
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section*/}
      <HeroParallax products={products}/>
      {/*Functioning */}
      <Timeline data={data} />
      
            
    </div>
  );
}


export const products = [
  {
    title: "vercel",
    link: "https://vercel.com",
    thumbnail:
      "/vercel.png",
  },
  {
    title: "Assembly AI",
    link: "https://www.assemblyai.com/",
    thumbnail:
      "/assembly.png",
  },
  {
    title: "ShadcnUi",
    link: "https://ui.shadcn.com/",
    thumbnail:
      "/shadcn.jpg",
  },
 
  {
    title: "Gemini AI",
    link: "https://deepmind.google/technologies/gemini/",
    thumbnail:
      "/gemini.png",
  },
  {
    title: "Stripe",
    link: "https://stripe.com/in/use-cases/global-businesses?utm_campaign=APAC_IN_EN_Search_Brand_Core_EXA-22293766222&utm_medium=cpc&utm_source=google&ad_content=735084253675&utm_term=stripe&utm_matchtype=e&utm_adposition=&utm_device=c&gad_source=1&gclid=CjwKCAjwnPS-BhBxEiwAZjMF0lH7VzJguw1c0N5bqhL-FYn0PRY5KN5QVLYaByFQCiAEHkMcTYWaphoCrToQAvD_BwE",
    thumbnail:
      "/stripe.png",
  },
  {
    title: "Prisma",
    link: "https://www.prisma.io/",
    thumbnail:
      "/prisma.png",
  },
 
  {
    title: "Clerk",
    link: "https://clerk.com/",
    thumbnail:
      "/clerk.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
  },
 
  {
    title: "NextJS",
    link: "https://nextjs.org/",
    thumbnail:
      "/nextjs.png",
  },
  {
    title: "TypeScript",
    link: "https://www.typescriptlang.org",
    thumbnail:
      "/typescript.png",
  },
  {
    title: "Neon",
    link: "https://neon.tech/?gad_source=1&gclid=CjwKCAjwnPS-BhBxEiwAZjMF0k1EiOAp8oKZAxUcxZOcxIiwiGjPN4Mu62x-RoE_dtOWhtyp9CwGMxoCn9wQAvD_BwE",
    thumbnail:
      "/neon.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];
