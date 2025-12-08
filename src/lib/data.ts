
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
  {
    id: '7',
    title: 'B.Tech vs BCA vs B.Sc (Computer Science): The Ultimate Comparison',
    author: 'CareerRaah Research Wing',
    date: 'October 1, 2023',
    content: `It's the most confusing choice for any student interested in a tech career. Do you go for the engineering prestige of a B.Tech, the application-focused approach of a BCA, or the theoretical foundation of a B.Sc? Each path leads to a different career outcome. This definitive guide breaks down the curriculum, job opportunities, salary expectations, and ideal student profiles for each degree. We provide a clear framework to help you and your child choose the right path based on their marks, interests, and long-term goals, saving you from making a costly mistake.`
  },
  {
    id: '8',
    title: 'How to Become a Pilot in India After 12th: A Step-by-Step Guide',
    author: 'CareerRaah Research Wing',
    date: 'September 28, 2023',
    content: `The dream of flying is a powerful one. For many students, becoming a commercial pilot is the ultimate career aspiration. But the path is expensive and demanding. This guide provides a realistic, step-by-step roadmap for Indian students. We cover everything from the required subjects in Class 12, the medical fitness tests, the costs of flight school (in India vs. abroad), and the type of exams you need to clear to get your Commercial Pilot License (CPL). We also look at the job market and salary expectations for new pilots.`
  },
  {
    id: '9',
    title: 'Which is Better After 12th: Commerce or Science?',
    author: 'CareerRaah Research Wing',
    date: 'September 25, 2023',
    content: `This is the great Indian education dilemma. Should your child pursue the 'safe' and diverse path of Science, or the business-oriented world of Commerce? The choice made in Class 11 can define their entire career trajectory. This article provides a comprehensive analysis, comparing the subjects, difficulty levels, and the wide array of career options available for both streams. From engineering and medicine to CA and marketing, we lay out the pros and cons to help you have a productive conversation with your child and make a choice that aligns with their aptitude and interests, not just societal pressure.`
  },
  {
    id: '10',
    title: 'How to Join ISRO / Become a Space Scientist in India',
    author: 'CareerRaah Research Wing',
    date: 'September 20, 2023',
    content: 'With the success of Chandrayaan and Gaganyaan, a career at ISRO is the new dream for millions of Indian students. But how do you get there? The path is challenging but clear. This guide breaks down the exact steps to become a scientist or engineer at the prestigious Indian Space Research Organisation. We detail the importance of the IIST exam, the direct recruitment process via the ICRB, and which engineering branches are most in-demand. Learn what it takes to work on India\'s most ambitious space missions.'
  },
  {
    id: '11',
    title: 'How to Become a Professional Cricketer in India: A Realistic Guide',
    author: 'CareerRaah Research Wing',
    date: 'September 15, 2023',
    content: 'The dream of playing for India or getting a lucrative IPL contract is shared by millions, but the path is one of the toughest in the world. This guide provides a brutally honest and realistic roadmap. We explain the structure of age-group cricket (U-14, U-16, U-19), the importance of performing in BCCI-affiliated tournaments, and the role of the Ranji Trophy. We also discuss the financial costs, the importance of a backup plan, and how to identify if your child has the extraordinary talent and mental toughness required to even have a chance.'
  },
  {
    id: '12',
    title: 'How to Become an IAS/IPS Officer: Cracking the UPSC Dream',
    author: 'CareerRaah Research Wing',
    date: 'September 10, 2023',
    content: 'The UPSC Civil Services Exam is more than just a test; it\'s a national obsession. But what does it really take to become an IAS or IPS officer? This guide demystifies the process. We break down the three stages of the exam (Prelims, Mains, Interview), the syllabus, the importance of choosing the right optional subject, and the timeline for preparation. We also offer a realistic look at the dedication required, the high competition, and why having a backup plan is essential for every aspirant.'
  }
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
