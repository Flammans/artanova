import React from 'react';
import ScrollArrow from './ScrollArrow.tsx';
import ActionButton from './ActionButton.tsx';
import ParallaxImage from './ParallaxImage.tsx';
import FeatureSlider from './FeatureSlider.tsx';
import SectionTitle from './SectionTitle.tsx';
import { Palette, ShareNetwork, Users, Archive } from '@phosphor-icons/react';

const slideData = [
  {
    icon: Palette,
    title: 'Curate Your Own Art Collections',
    description: 'Easily curate personalized art collections from various museums and galleries.',
    iconColor: '#FFD700',
  },
  {
    icon: ShareNetwork,
    title: 'Share Collections with Friends',
    description: 'Collaborate and share your collections with friends and other users in just one click.',
    iconColor: '#1C3D5A',
  },
  {
    icon: Users,
    title: 'Join a Community of Art Lovers',
    description: 'Connect with a vibrant community of art enthusiasts and discover new collections.',
    iconColor: '#C0C0C0',
  },
  {
    icon: Archive,
    title: 'Access a Vast Art Archive',
    description: 'Explore a wide range of artworks from museums, universities, and private collections.',
    iconColor: '#708090',
  },
];

const Hero: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-space bg-black text-white min-h-screen pb-40">
        {/* Main Hero content */}
        <ParallaxImage
          imageUrlWebp="/images/slider/slide-1.webp"
          imageUrlJpg="/images/slider/slide-1.jpg"
          altText="British Museum"
        />

        {/* Section Title */}
        <SectionTitle
          titleText="Welcome to Artanova"
          subtitleText="Discover and curate the finest art collections from all over the world."
          titleTag="h1"
        />

        {/* Feature Slider */}
        <FeatureSlider slides={slideData} animationType="fade" />

        <ActionButton text="Explore Collections" to="/explore-collections" />

        {/* Down arrow to scroll to the next section */}
        <ScrollArrow targetId="explore-section" tooltipText="Explore Collections" />
      </section>
    </>
  );
};

export default Hero;