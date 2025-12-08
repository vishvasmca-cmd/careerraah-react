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
    title: 'B.Tech vs. BCA vs. B.Sc (CS): Which IT Degree is Right for You?',
    author: 'CareerRaah Insights',
    date: 'November 5, 2023',
    content: `Choosing the right undergraduate degree after 12th is one of the most critical decisions, especially when aiming for a career in the booming IT industry. The alphabet soup of B.Tech (CS), BCA, and B.Sc (CS) can be confusing. While they all lead to the tech world, their paths, focus, and outcomes are quite different. This guide breaks down the core differences to help you choose the right fit.\n\n**B.Tech (Computer Science): The Engineer's Path**\nThis is a 4-year professional engineering degree focused on the deep, foundational aspects of computing. It's heavy on mathematics, algorithms, and core concepts like operating systems and computer architecture. It is the most sought-after degree for top-tier product companies and research roles.\n- **Focus:** Core Engineering, R&D\n- **Math Level:** High\n- **Best For:** Students who love deep problem-solving, math, and aspire to work in core technology development (e.g., at Google, Microsoft) or pursue higher studies like M.Tech or an MS abroad.\n\n**BCA (Bachelor of Computer Applications): The Application Expert**\nThis is a 3-year degree that focuses on the practical application of computer science. The curriculum is designed to get students job-ready for roles in IT services, web development, and database management. It's generally less math-intensive than B.Tech.\n- **Focus:** Software Development, IT Services\n- **Math Level:** Medium\n- **Best For:** Students who are more interested in building software applications than in deep theoretical research. It's a great path to becoming a web developer, app developer, or systems analyst. Often paired with an MCA degree for career growth.\n\n**B.Sc (Computer Science): The Scientist's Approach**\nThis 3-year science degree sits between B.Tech and BCA. It covers theoretical computer science concepts but with less emphasis on the engineering/hardware aspects than B.Tech. It provides a strong foundation in CS principles, making it a good base for a variety of roles or for further academic pursuits.\n- **Focus:** Theoretical CS, Academia\n- **Math Level:** Medium to High\n- **Best For:** Students who have a scientific temper and wish to keep their options open. A B.Sc (CS) graduate can move into the IT industry (often after an MCA), pursue a career in research, or become a teacher.`
  },
  {
    id: '8',
    title: 'How to Become a Pilot in India After 12th: A Step-by-Step Guide',
    author: 'CareerRaah Aviation Desk',
    date: 'November 12, 2023',
    content: `Becoming a commercial pilot is a dream for many, combining a love for flying with a high-prestige, high-paying career. But the path is not as straightforward as engineering or medicine. This guide provides a clear, step-by-step roadmap for students and parents.\n\n**Step 1: Eligibility (The Foundation)**\n- **Education:** You must pass Class 12 with Physics and Mathematics. There is no minimum percentage, but a strong grasp of these subjects is crucial.\n- **Age:** You must be at least 17 years old to start your training.\n- **Medical:** You need to clear a Class 2 Medical test from a DGCA-approved doctor. This will later be converted to a Class 1 Medical, which has stringent requirements for eyesight, hearing, and overall physical fitness.\n\n**Step 2: Choose a Flight School**\nThis is the most critical decision. You can train in India or abroad.\n- **India:** Flight schools like Indira Gandhi Rashtriya Uran Akademi (IGRUA), Chimes Aviation Academy, or the National Flying Training Institute (NFTI) are popular. The cost is typically ₹40-50 Lakhs.\n- **Abroad:** Countries like the USA, Canada, or New Zealand offer faster training but can be more expensive (₹60-80 Lakhs). You will need to convert your foreign license to an Indian one upon return.\n\n**Step 3: Ground School & Exams**\nBefore you can fly solo, you must clear DGCA exams in subjects like Air Navigation, Air Meteorology, and Air Regulations. This requires dedicated study for 3-6 months.\n\n**Step 4: Flying Hours & Licenses**\n- **Student Pilot License (SPL):** Your first license, allowing you to start flying with an instructor.\n- **Private Pilot License (PPL):** Requires around 60 hours of flying.\n- **Commercial Pilot License (CPL):** The final goal. Requires a minimum of 200 flying hours and passing all DGCA exams. This entire process can take 18-24 months.\n\n**Step 5: Type Rating & Getting Hired**\nAfter getting your CPL, airlines require a 'Type Rating' for specific aircraft like an Airbus A320 or Boeing 737. This is an additional, expensive qualification (₹15-30 Lakhs) that makes you 'job-ready'. Airlines like IndiGo and Vistara then conduct their own entrance exams and interviews. With the current boom in Indian aviation, the job prospects for well-trained pilots are excellent.`
  },
  {
    id: '9',
    title: 'Which is Better After 12th: Commerce or Science? A Practical Comparison',
    author: 'CareerRaah Insights',
    date: 'November 10, 2023',
    content: `The choice between Science and Commerce after Class 10 is one of the first major decisions that shapes a student's career. Both streams offer excellent, high-paying opportunities, but they cater to very different aptitudes and interests. Here’s a practical breakdown to help you decide.\n\n**The Science Stream (PCM/PCB)**\nScience is the stream of 'how things work'. It's analytical, technical, and research-oriented. It opens the doors to the most in-demand technical fields.\n- **Who is it for?** Students who have a strong aptitude for Mathematics, Physics, and logical problem-solving. A natural curiosity for science and technology is a must.\n- **Top Career Paths:** Engineering (Software, Mechanical, etc.), Medicine (Doctor, Dentist), Research (ISRO, DRDO), Data Science, AI/ML, Architecture, and Pharmacy.\n- **The Advantage:** The Science stream offers immense flexibility. A science student can switch to Commerce or Arts-related careers later on (like an MBA or Civil Services), but a Commerce student cannot become an Engineer.\n- **The Challenge:** It is extremely competitive, with exams like JEE and NEET having a success rate of less than 2%. The curriculum is rigorous and demanding.\n\n**The Commerce Stream**\nCommerce is the stream of 'how business works'. It's about finance, trade, economics, and management. It's the backbone of every industry.\n- **Who is it for?** Students who are good with numbers (but not necessarily complex theoretical math), have an organized mind, and are interested in how money and businesses operate.\n- **Top Career Paths:** Chartered Accountancy (CA), MBA in Finance/Marketing, Investment Banking, Financial Planning, Company Secretary (CS), and Entrepreneurship.\n- **The Advantage:** The path to professional qualifications like CA is less dependent on a single entrance exam and more about clearing multiple levels of a professional course. This provides more opportunities for hard-working students.\n- **The Challenge:** Top-tier careers like Investment Banking or getting into a top IIM for an MBA are just as competitive as engineering. Some roles can be high-pressure and demand long working hours.\n\n**The Verdict**\n- **Choose Science if:** Your child has a genuine passion for science and a strong analytical mind. They are ready for intense competition for a few top spots.\n- **Choose Commerce if:** Your child is practical, organized, and has a keen interest in the world of business and finance. They are more suited to a career path that rewards consistent effort over a period of time.`
  },
  {
    id: '10',
    title: 'How to Join ISRO or Become a Space Scientist: A Guide for Aspiring Stars',
    author: 'CareerRaah Research Desk',
    date: 'November 18, 2023',
    content: `Inspired by the success of Chandrayaan and Mangalyaan, a career at the Indian Space Research Organisation (ISRO) is a top dream for many students. It's a career of national pride, cutting-edge science, and immense prestige. Here’s how your child can chart a course to the stars.\n\n**The Primary Gateway: IIST**\nThe most direct entry into ISRO is through the Indian Institute of Space Science and Technology (IIST) in Thiruvananthapuram. \n- **What it is:** An autonomous university under the Department of Space, created specifically to groom future ISRO scientists.\n- **How to get in:** Admission is based on JEE Advanced ranks. Students must have a very high rank to be considered.\n- **The Advantage:** ISRO directly absorbs the top-performing graduates of IIST's B.Tech programs (like Aerospace Engineering and Electronics & Communication) as 'Scientist/Engineer-SC'.\n\n**The Secondary Gateway: The ICRB Exam**\nIf your child doesn't get into IIST, they can still join ISRO after completing their engineering degree from other top colleges like IITs, NITs, or BITS.\n- **What it is:** ISRO conducts a centralized written test, the ICRB exam, to recruit scientists and engineers.\n- **Eligibility:** A B.E./B.Tech degree with an aggregate minimum of 65% marks. The eligible disciplines are usually Electronics, Mechanical, and Computer Science.\n- **The Process:** The written test is followed by an interview. The competition is intense, but it's a major recruitment drive for ISRO.\n\n**Key Qualities of an ISRO Scientist:**\n- **Strong Fundamentals:** Exceptional command over Physics and Mathematics is non-negotiable.\n- **Problem-Solving Mindset:** ISRO scientists deal with complex, multi-disciplinary problems.\n- **Passion & Patriotism:** A deep-seated passion for space exploration and a desire to contribute to India's growth are common traits among the scientists who thrive at ISRO.`
  },
  {
    id: '11',
    title: 'Cricket as a Career in India: The Ultimate Guide for Parents',
    author: 'CareerRaah Sports Desk',
    date: 'November 16, 2023',
    content: `The IPL has turned cricket from a passion into a multi-billion dollar industry and a lucrative career. But for every successful star, thousands struggle. As a parent, it's crucial to understand the high-risk, high-reward path of a professional cricketer.\n\n**Is it a Realistic Goal?**\nThe odds are steep. Less than 0.01% of all cricket-playing children in India make it to the national level. Success requires immense talent, financial backing, and mental toughness.\n\n**The Step-by-Step Roadmap:**\n**1. Age 8-12 (The Foundation):** Enroll your child in a reputable local cricket academy. Focus on mastering the basics under a good coach. This is the most important stage.\n\n**2. Age 14-19 (The Grind):** The goal is to get selected for district and then state-level age-group teams (Under-14, Under-16, Under-19). Performance in these BCCI-recognized tournaments is what gets a player noticed.\n\n**3. Age 19-22 (The Big Leap):** Breaking into the state's senior team to play in the Ranji Trophy is the next big milestone. Consistent performance in the Ranji Trophy, Vijay Hazare Trophy, and Syed Mushtaq Ali Trophy is the primary pathway to an IPL contract or a national team call-up.\n\n**4. The IPL Auction & National Team:** If a player has been a standout performer in the domestic circuit, IPL franchises will notice them. This is where the financial rewards become significant. A stellar domestic and IPL performance can finally lead to the ultimate dream: playing for India.\n\n**The Role of Parents:**\n- **Financial Support:** Coaching, equipment, travel, and nutrition require significant investment (often ₹2-5 Lakhs per year).\n- **Emotional Support:** Your child will face more failures than successes. Your role as a support system is critical.\n- **Focus on Education:** Do not sacrifice education. A degree provides a crucial backup plan if the cricket career doesn't work out.`
  },
  {
    id: '12',
    title: 'How to Become an IAS/IPS Officer: A Guide to Cracking the UPSC Exam',
    author: 'CareerRaah Civil Services Desk',
    date: 'November 14, 2023',
    content: `A career in the Indian Administrative Service (IAS) or Indian Police Service (IPS) is considered one of the most prestigious and impactful jobs in the country. It offers a unique combination of power, prestige, and the ability to make a real difference in society. But the path goes through one of the world's toughest exams: the UPSC Civil Services Examination (CSE).\n\n**Understanding the Exam:**\nThe UPSC CSE is a three-stage exam:\n1.  **Prelims:** An objective-type screening test (2 papers) to filter candidates for the main exam.\n2.  **Mains:** A descriptive written exam (9 papers) that tests in-depth knowledge and analytical ability.\n3.  **Interview:** A personality test to assess the candidate's suitability for a life in public service.\n\nThe entire cycle, from Prelims to the final result, takes almost a full year. The success rate is incredibly low, around 0.1-0.2%.\n\n**Step-by-Step Preparation Strategy:**\n**1. Graduation (The Foundation):** You can graduate in any stream. The goal during college should be to develop a strong reading habit (especially newspapers like The Hindu/The Indian Express) and build a solid foundation in NCERT textbooks from Class 6 to 12.\n\n**2. Choose Your Optional Subject:** This is a critical decision. You must choose one subject for in-depth study (2 papers in Mains). It's wise to choose a subject you have an interest in or have studied during graduation.\n\n**3. Dedicated Preparation (1-2 Years):** Most serious aspirants dedicate at least a year of full-time study. This involves covering the vast syllabus for General Studies, practicing answer writing, and taking mock tests. Joining a coaching institute (in Delhi or online) is common but not essential if you are disciplined.\n\n**4. The Attempt Cycle:** It is very common for aspirants to take multiple attempts. The key is to have immense perseverance, mental resilience, and a strong support system. Having a 'Plan B' career is highly advisable due to the low success rate.\n\n**Who is it for?**\nThis career is not for everyone. It's for those who have a deep-seated desire for public service, possess intellectual curiosity, and have the mental fortitude to endure a long, arduous preparation journey.`
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
