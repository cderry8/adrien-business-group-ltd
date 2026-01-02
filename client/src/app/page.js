import Navbar from '@/components/layout/navbar';
import HeroVideo from '@/components/layout/hero';
import HeroContent from '@/components/section/herocontent';
import Image from 'next/image';
import ProjectsVideoGrid from '@/components/section/projectvideo';
import FeaturedProjects from '@/components/section/featuredprojects';
import RecentNews from '@/components/section/recentnews';
import Footer from '@/components/section/footer';

export default function Home() {
  return (
     <div className="relative pb-20 w-full">
      {/* Navbar on top */}
      <Navbar />

      {/* Fullscreen hero */}
      <HeroVideo />

      <HeroContent/>
      <ProjectsVideoGrid/>
      <FeaturedProjects/>
      <RecentNews/>
      <Footer/>
    </div>
  );
}
