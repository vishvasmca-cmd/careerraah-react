import { PlaceHolderImages } from './placeholder-images';

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  imageHint: string;
  content: string;
}

const getImage = (id: string) => {
  return PlaceHolderImages.find(img => img.id === id) || PlaceHolderImages[0];
};

const posts: Omit<BlogPost, 'imageUrl' | 'imageHint'>[] = [
  {
    id: '1',
    title: 'Beyond IIT/NEET: Top 5 New-Age Careers for Your Child',
    author: 'CareerRaah Research Wing',
    date: 'October 26, 2023',
    content: `Is the relentless pressure of IIT/NEET coaching causing sleepless nights? You're not alone. While engineering and medicine are respected paths, the intense competition and low success rates (less than 1%) are forcing smart parents to look for Plan B. The good news? The digital economy has created high-paying, respected careers that didn't exist a decade ago. This guide explores the top 5 "New-Age" careers like Data Science, UI/UX Design, and AI Engineering, detailing the skills required, salary potential, and a clear roadmap for your child to succeed.`
  },
  {
    id: '2',
    title: 'The Real Cost of Studying Abroad: A Guide for Tier 2/3 Families',
    author: 'CareerRaah Research Wing',
    date: 'October 22, 2023',
    content: `Seeing your child graduate from a foreign university is the ultimate dream for many parents. But the journey is filled with hidden costs and complex procedures. A staggering 57% of Indian students studying abroad now come from non-metro cities. This guide breaks down the real costs—beyond just tuition fees—for popular destinations like Canada, the UK, and Germany. We provide a step-by-step checklist, from building the right profile in Class 9 to navigating visa applications, helping you make an informed financial decision for this life-changing investment.`
  },
  {
    id: '3',
    title: 'Sports Is a Real Career: How to Turn Your Child\'s Talent into a Profession',
    author: 'CareerRaah Research Wing',
    date: 'October 18, 2023',
    content: `Did Neeraj Chopra's Olympic gold make you wonder about your own child's athletic talent? The perception of sports is shifting from a "hobby" to a viable, high-earning profession. Today, 71% of parents are willing to support a career in sports beyond cricket. This guide details the pathways in rising sports like Badminton and Football. Learn about the role of private academies, the importance of the Khelo India scheme, and how a disciplined sports career can lead to government jobs, professional leagues, and a secure future for your child.`
  },
  {
    id: '4',
    title: 'Coding vs. Robotics: Which "Future-Proof" Skill Is Right for Your Child?',
    author: 'CareerRaah Research Wing',
    date: 'October 15, 2023',
    content: 'In the age of AI, parents are terrified of their children being left behind. You know tech skills are the new guarantee of employability, but where do you start? Should your child learn Python, or build a robot they can touch? This guide explains the difference between coding, robotics, and other STEM fields. We analyze which skills are in demand, the investment required for each, and how to choose the right path based on your child’s learning style and interests, ensuring your investment in "future-proofing" them pays off.'
  },
  {
    id: '5',
    title: 'The "Phygital" Advantage: Why Your Local Tuition Teacher is Still Your Best Bet',
    author: 'CareerRaah Research Wing',
    date: 'October 11, 2023',
    content: 'Post-pandemic, parents have realized that pure online learning apps have limitations. The "Trust Deficit" is real. You want the accountability of a physical center combined with the quality of digital tools. This is the "Phygital" model. This article explains why your local tuition center, when empowered with the right technology, can be the most effective learning environment. We show how CareerRaah partners with these trusted local teachers to provide world-class guidance, blending personal trust with scientific career mapping.'
  },
  {
    id: '6',
    title: 'The English Fluency Myth: Speaking vs. Learning',
    author: 'CareerRaah Research Wing',
    date: 'October 5, 2023',
    content: 'Every parent wants their child to be fluent in English. But does that mean they must learn complex subjects like Physics or Chemistry only in English? Research shows that students learn best in their mother tongue. This guide explores the "Vernacular is the Gateway" strategy used by top educational platforms. Learn how to prioritize "Spoken English" as a separate, premium skill while allowing your child to master core subjects in the language they understand best. This balanced approach builds both confidence and competence.'
  },
];

export const getBlogPosts = (): BlogPost[] => {
  return posts.map(post => {
    const img = getImage(`blog-${post.id}`);
    return {
      ...post,
      imageUrl: img.imageUrl,
      imageHint: img.imageHint,
    };
  });
};

export const getBlogPost = (id: string): BlogPost | undefined => {
  return getBlogPosts().find(post => post.id === id);
};
