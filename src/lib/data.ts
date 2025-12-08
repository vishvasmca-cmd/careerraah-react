
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
    id: '5',
    title: 'AI & ML Engineer: The Hottest Job of the Decade',
    author: 'CareerRaah Research Wing',
    date: 'November 20, 2023',
    content: 'Artificial Intelligence and Machine Learning are no longer science fiction; they are powering everything from your social media feed to medical diagnoses. An AI/ML Engineer is at the heart of this revolution, developing intelligent algorithms that can learn and make decisions. This guide breaks down the skills you need (hint: strong math and Python are non-negotiable), the kind of projects that get you noticed, and why a B.Tech in Computer Science from a top institute is the preferred launchpad. We also explore the staggering salary potential, which makes it one of the most lucrative careers today.'
  },
  {
    id: '6',
    title: 'How to Become a Data Scientist in India',
    author: 'CareerRaah Research Wing',
    date: 'November 18, 2023',
    content: 'Data is the new oil, and a Data Scientist is the one who refines it. These professionals analyze vast amounts of data to find trends, create predictive models, and provide crucial insights that drive business decisions. It\'s a career that blends statistics, computer science, and business acumen. This guide explains the essential skills, including Python, R, and SQL, and the importance of building a strong portfolio through platforms like Kaggle. Find out the different entry paths, from a B.Tech in CS to a degree in Statistics or Economics, and what to expect in your first job.'
  },
  {
    id: '8',
    title: 'Product Manager: The Mini-CEO of a Tech Product',
    author: 'CareerRaah Research Wing',
    date: 'November 16, 2023',
    content: 'Ever wondered who decides what new feature comes to Instagram or how a food delivery app works? That\'s the Product Manager. This role requires a unique blend of technical understanding, business strategy, and user empathy. A PM guides a product from an idea to a successful launch and beyond. It\'s a high-impact, high-growth career path. This guide explains why prior experience is often crucial, how an MBA can fast-track your journey, and what it takes to become a successful Associate Product Manager (APM) right after college.'
  },
  {
    id: '1',
    title: 'Drone Pilot & Operator: A Career Taking Flight',
    author: 'CareerRaah Research Wing',
    date: 'November 14, 2023',
    content: 'Drones are no longer just for hobbyists. They are transforming industries like agriculture, logistics, media, and infrastructure. A certified Drone Pilot and Operator is a skilled professional who can legally operate these unmanned aerial vehicles for tasks like aerial photography, land surveying, and even emergency response. This guide covers the DGCA certification process in India, the essential skills required (like spatial awareness and technical know-how), and the exciting, high-growth industries where you can build a career. It\'s a field where practical skill trumps a traditional degree.'
  },
  {
    id: '2',
    title: 'Clinical Psychologist: Healing Minds in Modern India',
    author: 'CareerRaah Research Wing',
    date: 'November 12, 2023',
    content: 'As mental health awareness grows in India, the demand for qualified Clinical Psychologists is rising rapidly. This is a deeply rewarding career for those who are empathetic, patient, and have a strong desire to help others. However, it requires a long and specific educational commitment. This guide lays out the complete roadmap: from a Bachelor\'s in Psychology to the crucial M.Phil from an RCI-recognized institution, which is mandatory for a license to practice. Understand the difference between a counselor and a clinical psychologist and the realities of this challenging but fulfilling profession.'
  },
  {
    id: '3',
    title: 'UI/UX Designer: Crafting Digital Experiences',
    author: 'CareerRaah Research Wing',
    date: 'November 10, 2023',
    content: 'Every app and website you love is the work of a great UI/UX Designer. This creative and analytical field focuses on making technology easy and enjoyable to use. UI (User Interface) is about the look and feel, while UX (User Experience) is about the overall journey. This guide explains why a strong portfolio of projects is more important than a specific degree. Learn about the essential tools like Figma and Adobe XD, the kind of problems you\'ll solve, and how to start your journey with internships that lead to high-paying jobs in the tech industry.'
  },
  {
    id: '4',
    title: 'Corporate Lawyer: The Architect of Business Deals',
    author: 'CareerRaah Research Wing',
    date: 'November 8, 2023',
    content: 'Behind every merger, acquisition, and major business decision is a team of sharp Corporate Lawyers. This is a high-stakes, high-reward legal field where you advise companies on their rights and obligations. It demands strong analytical skills, meticulous attention to detail, and the ability to handle intense negotiations. The premier path is to crack the CLAT or AILET exam to get into a top National Law University (NLU) for a 5-year integrated law degree. This guide explains the pathway, the importance of corporate internships, and the lucrative career that awaits at top law firms.'
  },
  {
    id: '7',
    title: 'Investment Banker: The World of High Finance',
    author: 'CareerRaah Research Wing',
    date: 'November 6, 2023',
    content: 'Investment Banking is one of the most demanding but also one of the highest-paying careers in the world. Bankers help companies raise money and advise on large financial deals like mergers. This career is for those who are exceptional with numbers, can work grueling hours, and thrive under pressure. The entry barriers are extremely high, typically requiring a degree from a Tier-1 institution (like an IIT or SRCC) followed by an MBA from a top IIM. This guide provides a realistic look at the demanding lifestyle, the required pedigree, and the path to becoming an analyst at a top firm.'
  },
  {
    id: '13',
    title: 'Pilot in India After 12th: A Step-by-Step Guide',
    author: 'CareerRaah Research Wing',
    date: 'September 28, 2023',
    content: `Soaring through the clouds in a pilot's uniform is a dream for many. But how do you turn this dream into a reality in India? This comprehensive guide breaks down the entire process, step-by-step. We cover the essential requirements like a Class 12 education in Science (with Physics and Math), the rigorous Class 2 and Class 1 medical examinations, and the process of joining a DGCA-approved flight school. Learn about the different types of licenses—from the Student Pilot License (SPL) to the Commercial Pilot License (CPL)—and the costs involved. This is your definitive roadmap to a career in the cockpit.`
  },
  {
    id: '14',
    title: 'B.Tech vs BCA vs B.Sc (Computer Science): The Ultimate Comparison',
    author: 'CareerRaah Research Wing',
    date: 'September 26, 2023',
    content: `For students passionate about computers, the choice between a B.Tech, BCA, or B.Sc in Computer Science is often confusing. Which degree offers the best job prospects? Which is more theoretical vs. practical? This article provides a head-to-head comparison to help you decide. We analyze the syllabus, the focus of each program (Engineering vs. Application vs. Science), entrance exams, typical college fees, and the long-term career growth associated with each degree. Whether you want to be a software architect, a web developer, or a research scientist, this guide will help you choose the right path.`
  },
  {
    id: '15',
    title: 'How to Become a Doctor or Nurse in India: The NEET & Beyond',
    author: 'CareerRaah Research Wing',
    date: 'October 5, 2023',
    content: 'A career in healthcare is one of the most respected and rewarding paths one can choose. For aspiring doctors, the journey is long and arduous, starting with the hyper-competitive NEET exam after Class 12 (Science with Biology). This guide breaks down the NEET preparation strategy, the 5.5-year MBBS course, and the specializations beyond. We also shed light on the equally vital career of Nursing. Learn about the B.Sc. Nursing course, the entrance exams, and the diverse opportunities in hospitals, public health, and even abroad. This is a career of service, empathy, and lifelong learning.'
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
  },
  {
    id: '16',
    title: 'How to Join the NDA After Class 12th: A Complete Guide',
    author: 'CareerRaah Research Wing',
    date: 'July 25, 2024',
    content: 'Joining the National Defence Academy (NDA) is a dream for many who wish to serve the country in the Army, Navy, or Air Force. This guide provides a complete roadmap for Class 12 students. We cover the eligibility criteria (age, education, physical standards), the two-stage UPSC written exam, and the exhaustive 5-day Services Selection Board (SSB) interview process. Learn about the intense training at Khadakwasla and the life of a cadet. This is your first step towards a prestigious and honorable career as an officer in the Indian Armed Forces.'
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

    

    

    


