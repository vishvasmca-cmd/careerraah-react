
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  X,
  DollarSign,
  Map,
  CheckCircle,
  BarChart,
  TrendingUp,
  Shield,
  Briefcase,
  Rocket,
  Heart,
  Palette,
  Landmark,
  FileDown,
  BrainCircuit,
  Users,
  Atom,
  Film,
  Trophy,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const CAREER_DB = [
  {
    id: 1,
    name: 'Drone Pilot & Ops',
    category: 'Future Tech',
    icon: Rocket,
    salary: { low: 6, high: 18 },
    risk: 'Medium',
    trustScore: 8,
    description: 'Operate and manage unmanned aerial vehicles for aerial photography, surveying, and delivery.',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxEUk9ORSUyMGZseWluZ3xlbnwwfHx8fDE3NjY4MjE0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'drone flying',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 3, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 6, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: '10+2 (Any Stream)', desc: 'Focus on Physics and Math.' },
      { step: 'DGCA Certification', desc: 'Get certified by an approved flight school.' },
      { step: 'Specialize', desc: 'Agriculture, Surveying, or Cinematography.' },
      { step: 'First Job', desc: 'Junior Pilot or Data Analyst.' },
    ],
    fitCheck: [
      { question: 'Is your child good with spatial awareness & hand-eye coordination?' },
      { question: 'Do they enjoy outdoor activities and technology?' },
      { question: 'Are they patient and responsible under pressure?' },
    ],
  },
  {
    id: 2,
    name: 'Clinical Psychologist',
    category: 'Medical',
    icon: Heart,
    salary: { low: 4, high: 15 },
    risk: 'Low',
    trustScore: 9,
    description: 'Assess, diagnose, and treat mental, emotional, and behavioral disorders.',
    imageUrl: 'https://images.unsplash.com/photo-1579493934963-f145c3427b3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwc3ljaG9sb2d5JTIwdGhlcmFweXxlbnwwfHx8fDE3NjY4MjE4MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'psychology therapy',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 5, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 4, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: '10+2 (Any Stream)', desc: 'Psychology preferred.' },
      { step: 'BA/BSc in Psychology', desc: 'Build a strong theoretical base.' },
      { step: 'MA/MSc in Clinical Psychology', desc: 'Core specialization.' },
      { step: 'M.Phil / PhD (RCI License)', desc: 'Mandatory for clinical practice in India.' },
    ],
    fitCheck: [
      { question: 'Is your child empathetic and a good listener?' },
      { question: 'Do they have a strong interest in understanding human behavior?' },
      { question: 'Are they emotionally resilient and patient?' },
    ],
  },
  {
    id: 3,
    name: 'UI/UX Designer',
    category: 'Creative Arts',
    icon: Palette,
    salary: { low: 6, high: 30 },
    risk: 'Medium',
    trustScore: 8,
    description: 'Design user-friendly interfaces for websites and apps to enhance user experience.',
    imageUrl: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxVSVVYJTIwZGVzaWdufGVufDB8fHx8MTc2NjgyMTg1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'UIUX design',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 4, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 6, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: 'Any Degree + Portfolio', desc: 'Degree is secondary to a strong portfolio.' },
      { step: 'Learn Tools', desc: 'Figma, Adobe XD, Sketch.' },
      { step: 'Internships', desc: 'Gain real-world project experience.' },
      { step: 'First Job', desc: 'Junior UI/UX Designer at a startup or agency.' },
    ],
    fitCheck: [
      { question: 'Does your child have a good eye for aesthetics and detail?' },
      { question: 'Are they problem-solvers who enjoy making things easier for others?' },
      { question: 'Are they open to feedback and iterative work?' },
    ],
  },
  {
    id: 4,
    name: 'Corporate Lawyer',
    category: 'Legal',
    icon: Landmark,
    salary: { low: 12, high: 50 },
    risk: 'Low',
    trustScore: 9,
    description: 'Advise businesses on their legal rights, responsibilities, and obligations.',
    imageUrl: 'https://images.unsplash.com/photo-1598257992949-8835a4623a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBsYXd8ZW58MHx8fHwxNzY2ODIxODk5fDA&ixlibrb-4.1.0&q=80&w=1080',
    imageHint: 'corporate law',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 15, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 12, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: '10+2 (Any Stream)', desc: 'Commerce or Humanities is helpful.' },
      { step: 'CLAT/AILET Exam', desc: 'Crack the entrance for top National Law Universities.' },
      { step: '5-Year BA.LLB / BBA.LLB', desc: 'Integrated law degree from a top NLU.' },
      { step: 'Corporate Internships', desc: 'Intern at law firms during semester breaks.' },
    ],
    fitCheck: [
      { question: 'Does your child possess strong analytical and reasoning skills?' },
      { question: 'Are they meticulous, with a keen eye for detail?' },
      { question: 'Can they handle high-pressure negotiations and deadlines?' },
    ],
  },
  {
    id: 5,
    name: 'AI & ML Engineer',
    category: 'Future Tech',
    icon: Rocket,
    salary: { low: 12, high: 60 },
    risk: 'Medium',
    trustScore: 9,
    description: 'Develop intelligent algorithms and systems that can learn and make decisions.',
    imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhaSUyMGVuZ2luZWVyfGVufDB8fHx8MTc2NjgyMTk1NHww&ixlibrb-4.1.0&q=80&w=1080',
    imageHint: 'ai engineer',
    roiChart: [
        { name: 'Avg. Edu Cost', value: 16, fill: 'hsl(var(--muted))' },
        { name: 'Starting Salary', value: 12, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
        { step: '10+2 (Science)', desc: 'Strong foundation in Math and CS is a must.' },
        { step: 'B.Tech in CS/AI', desc: 'From a Tier-1 institute (IIT/NIT/BITS).' },
        { step: 'Master Projects', desc: 'Build projects in NLP, Computer Vision, etc.' },
        { step: 'First Job', desc: 'Join a product-based company or a research lab.' },
    ],
    fitCheck: [
        { question: 'Is your child exceptionally strong in mathematics and logic?' },
        { question: 'Do they have a passion for programming and building complex systems?' },
        { question: 'Are they a self-learner, constantly updating their skills?' },
    ],
  },
  {
    id: 6,
    name: 'Data Scientist',
    category: 'Data Science',
    icon: BrainCircuit,
    salary: { low: 9, high: 50 },
    risk: 'Medium',
    trustScore: 9,
    description: 'Analyze large, complex data sets to identify trends, develop predictive models, and provide actionable insights to businesses.',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxkYXRhJTIwc2NpZW5jZXxlbnwwfHx8fDE3NjY4MjE5OTR8MA&ixlib.rb-4.1.0&q=80&w=1080',
    imageHint: 'data science',
    roiChart: [
        { name: 'Avg. Edu Cost', value: 10, fill: 'hsl(var(--muted))' },
        { name: 'Starting Salary', value: 9, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
        { step: 'Degree in CS/Stats/Math', desc: 'A quantitative background is key.' },
        { step: 'Master Python/R', desc: 'Learn libraries like Pandas, Scikit-learn, TensorFlow.' },
        { step: 'Build a Portfolio', desc: 'Work on Kaggle competitions or personal projects.' },
        { step: 'First Job', desc: 'Data Analyst or Junior Data Scientist.' },
    ],
    fitCheck: [
        { question: 'Does your child enjoy finding patterns in numbers and information?' },
        { question: 'Are they skilled in statistics and logical reasoning?' },
        { question: 'Do they have the persistence to clean and analyze messy data?' },
    ],
  },
  {
    id: 7,
    name: 'Investment Banker',
    category: 'Finance',
    icon: DollarSign,
    salary: { low: 20, high: 100 },
    risk: 'High',
    trustScore: 7,
    description: 'Help companies and governments raise capital by issuing stocks and bonds, and provide advice on mergers and acquisitions (M&A).',
    imageUrl: 'https://images.unsplash.com/photo-1664448039325-797c6241ab9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwdHJhZGluZ3xlbnwwfHx8fDE3NjY4MjIwMzV8MA&ixlib.rb-4.1.0&q=80&w=1080',
    imageHint: 'finance trading',
    roiChart: [
        { name: 'Avg. Edu Cost', value: 30, fill: 'hsl(var(--muted))' },
        { name: 'Starting Salary', value: 20, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
        { step: 'Tier-1 Degree', desc: 'B.Com(H)/Eco(H) from SRCC/LSR or B.Tech from IIT/BITS.' },
        { step: 'MBA in Finance', desc: 'From an IIM A/B/C or equivalent top B-School.' },
        { step: 'Grueling Internships', desc: 'Secure internships in finance firms during college.' },
        { step: 'Analyst Role', desc: 'Start as an analyst at an investment bank.' },
    ],
    fitCheck: [
        { question: 'Can your child handle extremely long hours and high-pressure situations?' },
        { question: 'Are they exceptionally good with numbers and financial modeling?' },
        { question: 'Do they have strong networking and communication skills?' },
    ],
  },
  {
    id: 8,
    name: 'Product Manager',
    category: 'Management',
    icon: Users,
    salary: { low: 18, high: 80 },
    risk: 'Medium',
    trustScore: 8,
    description: 'Act as the "CEO" of a product, guiding its success by defining strategy, roadmap, and features from conception to launch.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbWFuYWdlbWVudHxlbnwwfHx8fDE3NjY4MjIwODJ8MA&ixlib.rb-4.1.0&q=80&w=1080',
    imageHint: 'product management',
    roiChart: [
        { name: 'Avg. Edu Cost', value: 25, fill: 'hsl(var(--muted))' },
        { name: 'Starting Salary', value: 18, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
        { step: 'Engg or Business Degree', desc: 'A B.Tech or BBA from a good college is a common start.' },
        { step: 'Gain Experience', desc: 'Work for 2-4 years in a related field like engineering, design, or marketing.' },
        { step: 'MBA (Optional but helpful)', desc: 'An MBA from a top school can fast-track the career.' },
        { step: 'APM Role', desc: 'Join as an Associate Product Manager.' },
    ],
    fitCheck: [
        { question: 'Is your child a natural leader who can influence without authority?' },
        { question: 'Do they have a strong sense of empathy for users and their problems?' },
        { question: 'Are they excellent communicators who can balance business and tech needs?' },
    ],
  },
  {
    id: 9,
    name: 'ISRO/Space Scientist',
    category: 'Science & Research',
    icon: Atom,
    salary: { low: 8, high: 35 },
    risk: 'Low',
    trustScore: 10,
    description: 'Work on cutting-edge space missions, from satellite design to planetary exploration, contributing to India\'s prestigious space program.',
    imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256ec677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJU1JPJTIwcm9ja2V0fGVufDB8fHx8MTc2NzEyNDQ2MHww&ixlib-rb-4.1.0&q=80&w=1080',
    imageHint: 'ISRO rocket',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 6, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 8, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: '10+2 (Science, PCM)', desc: 'Excel in Physics, Chemistry, and Mathematics.' },
      { step: 'B.Tech/M.Tech (Relevant Field)', desc: 'Aerospace, ECE, CS from IIST, IITs or NITs.' },
      { step: 'Crack ICRB Exam', desc: 'ISRO Centralised Recruitment Board exam is the main entry point.' },
      { step: 'Join as Scientist/Engineer \'SC\'', desc: 'Begin a prestigious career with the Indian Space Research Organisation.' },
    ],
    fitCheck: [
      { question: 'Does your child have a deep passion for space, science, and technology?' },
      { question: 'Are they exceptionally strong in physics and mathematics?' },
      { question: 'Do they have a strong sense of patriotism and desire to contribute to national progress?' },
    ],
  },
  {
    id: 10,
    name: 'Film Director',
    category: 'Creative Arts',
    icon: Film,
    salary: { low: 2, high: 100 },
    risk: 'Very High',
    trustScore: 5,
    description: 'The creative lead of a film, responsible for visualizing the script and guiding the actors and technical crew to bring that vision to life.',
    imageUrl: 'https://images.unsplash.com/photo-1574717024633-596a8376b0f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaWxtJTIwZGlyZWN0b3J8ZW58MHx8fHwxNzY3MTI0NTMxfDA&ixlib-rb-4.1.0&q=80&w=1080',
    imageHint: 'film director',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 10, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 2, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: 'Any Stream, Focus on Arts', desc: 'Develop a strong foundation in storytelling, literature, and art.' },
      { step: 'Degree in Film/Mass Comm', desc: 'Study at FTII, SRFTI, or private institutes like Whistling Woods.' },
      { step: 'Create Short Films', desc: 'Build a strong portfolio by directing and creating your own content.' },
      { step: 'Work as an Assistant Director', desc: 'Gain industry experience by working on film sets.' },
    ],
    fitCheck: [
      { question: 'Is your child a natural storyteller with a strong visual imagination?' },
      { question: 'Can they lead a team and communicate a complex vision clearly?' },
      { question: 'Are they resilient and prepared for a highly competitive and often unstructured career path?' },
    ],
  },
  {
    id: 11,
    name: 'Professional Cricketer',
    category: 'Sports',
    icon: Trophy,
    salary: { low: 10, high: 2000 },
    risk: 'Very High',
    trustScore: 3,
    description: 'A high-performance athlete dedicated to playing cricket at state, national, or international levels, including lucrative leagues like the IPL.',
    imageUrl: 'https://images.unsplash.com/photo-1595435940989-798240980479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwYmF0dGluZ3xlbnwwfHx8fDE3NjcxMjQ2MTB8MA&ixlib-rb-4.1.0&q=80&w=1080',
    imageHint: 'cricket batting',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 5, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 10, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: 'Start Early (Age 8-12)', desc: 'Join a reputable local cricket academy for professional coaching.' },
      { step: 'Play District/State U-14, U-16, U-19', desc: 'Perform consistently in age-group tournaments to get noticed.' },
      { step: 'Ranji Trophy / Domestic Circuit', desc: 'Break into the senior state team, the gateway to national selection.' },
      { step: 'IPL / National Team', desc: 'Perform in domestic cricket to get an IPL contract or a call-up to the Indian team.' },
    ],
    fitCheck: [
      { question: 'Does your child have exceptional natural talent and athletic ability?' },
      { question: 'Are they mentally tough, disciplined, and able to handle extreme pressure?' },
      { question: 'Is the entire family prepared to make significant sacrifices for a high-risk, high-reward career?' },
    ],
  },
  {
    id: 12,
    name: 'IAS / IPS Officer',
    category: 'Civil Services',
    icon: Scale,
    salary: { low: 7, high: 25 },
    risk: 'Very High',
    trustScore: 10,
    description: 'Serve the nation as a top-level administrator or police officer by cracking the highly competitive UPSC Civil Services Examination.',
    imageUrl: 'https://images.unsplash.com/photo-1608222351213-824141947273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBwb2xpY2V8ZW58MHx8fHwxNzY3MTI0NzExfDA&ixlib-rb-4.1.0&q=80&w=1080',
    imageHint: 'Indian police',
    roiChart: [
      { name: 'Avg. Edu Cost', value: 3, fill: 'hsl(var(--muted))' },
      { name: 'Starting Salary', value: 7, fill: 'hsl(var(--primary))' },
    ],
    roadmap: [
      { step: 'Graduate in Any Stream', desc: 'A simple graduation degree is the only eligibility criteria.' },
      { step: 'UPSC Exam Preparation (2-3 Years)', desc: 'Intensive preparation for Prelims, Mains, and Interview stages.' },
      { step: 'Clear UPSC CSE', desc: 'One of the toughest exams in the world with a ~0.1% success rate.' },
      { step: 'Training at LBSNAA/SVPNPA', desc: 'Foundation course and professional training to become an officer.' },
    ],
    fitCheck: [
      { question: 'Does your child have a strong sense of public service and national duty?' },
      { question: 'Are they academically consistent, with a wide-ranging curiosity?' },
      { question: 'Do they possess extreme mental fortitude and perseverance for a long and arduous preparation journey?' },
    ],
  },
];

const categories = ['All', 'Future Tech', 'Medical', 'Creative Arts', 'Legal', 'Data Science', 'Finance', 'Management', 'Science & Research', 'Sports', 'Civil Services'];
const categoryIcons: { [key: string]: React.ElementType } = {
  'Future Tech': Rocket,
  'Medical': Heart,
  'Creative Arts': Palette,
  'Legal': Landmark,
  'Data Science': BrainCircuit,
  'Finance': DollarSign,
  'Management': Users,
  'Science & Research': Atom,
  'Sports': Trophy,
  'Civil Services': Scale,
};

export default function ParentExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState<typeof CAREER_DB[0] | null>(null);

  const filteredCareers = useMemo(() => {
    return CAREER_DB.filter(career => {
      const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
      const matchesSearch = career.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <div className="sticky top-[64px] z-30 bg-gray-50/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search any career, e.g., 'Data Scientist'"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-shadow"
            />
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 pb-2">
              {categories.map(category => {
                const CategoryIcon = categoryIcons[category];
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {CategoryIcon && <CategoryIcon className="mr-2 h-4 w-4" />}
                    {category}
                  </Button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCareers.map(career => {
            const CategoryIcon = career.icon;
            return (
              <Card key={career.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group flex flex-col">
                <div className="relative h-40 w-full">
                    <Image 
                        src={career.imageUrl} 
                        alt={career.name} 
                        data-ai-hint={career.imageHint}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                        <CategoryIcon className="w-8 h-8 mb-2 text-white" />
                        <h3 className="font-bold text-lg text-white shadow-md">{career.name}</h3>
                    </div>
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{career.description}</p>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-primary text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={() => setSelectedCareer(career)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
             <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setSelectedCareer(null)}
              />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedCareer(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors z-10 p-1 bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>

              <header className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-foreground">{selectedCareer.name}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                        <Shield size={14} />
                        <span>Trust Score: {selectedCareer.trustScore}/10 Job Security</span>
                    </div>
                </div>
              </header>

              <div className="flex-grow overflow-y-auto">
                <Tabs defaultValue="roi" className="h-full flex flex-col">
                  <TabsList className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm rounded-none border-b justify-start px-6">
                    <TabsTrigger value="roi"><DollarSign className="mr-2 h-4 w-4" /> Money & ROI</TabsTrigger>
                    <TabsTrigger value="roadmap"><Map className="mr-2 h-4 w-4" /> Roadmap</TabsTrigger>
                    <TabsTrigger value="fit"><CheckCircle className="mr-2 h-4 w-4" /> Fit Check</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6">
                    <TabsContent value="roi">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card className="p-4 bg-gray-50">
                            <CardContent className="p-0">
                                <p className="text-sm font-medium text-muted-foreground">Expected Salary Range (Per Annum)</p>
                                <p className="text-2xl font-bold text-primary">₹{selectedCareer.salary.low}L - ₹{selectedCareer.salary.high}L+</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 bg-gray-50">
                             <CardContent className="p-0">
                                <p className="text-sm font-medium text-muted-foreground">Financial Risk</p>
                                <p className={`text-2xl font-bold ${selectedCareer.risk === 'High' || selectedCareer.risk === 'Very High' ? 'text-red-600' : 'text-green-600'}`}>
                                    {selectedCareer.risk}
                                </p>
                            </CardContent>
                        </Card>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">Cost vs. Starting Salary</h3>
                       <p className="text-sm text-muted-foreground mb-4">A visual comparison of average education cost vs. potential starting salary (in Lakhs Per Annum).</p>
                      <div className="h-40 w-full bg-gray-50 rounded-lg p-4 flex items-end gap-8">
                         {selectedCareer.roiChart.map(item => (
                             <div key={item.name} className="flex-1 flex flex-col items-center">
                                 <motion.div
                                    initial={{height: 0}}
                                    animate={{height: `${item.value * 6}%`}}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="w-full rounded-t-md"
                                    style={{backgroundColor: item.fill}}
                                 />
                                 <p className="text-xs font-medium mt-2 text-center">{item.name}</p>
                                 <p className="text-sm font-bold">~₹{item.value}L</p>
                             </div>
                         ))}
                      </div>
                       <p className="text-xs text-muted-foreground mt-3 text-center">Note: This is a simplified illustration. Actual figures can vary significantly.</p>
                    </TabsContent>

                    <TabsContent value="roadmap">
                       <h3 className="text-lg font-semibold mb-4">Path to Your First Job</h3>
                       <div className="space-y-4">
                           {selectedCareer.roadmap.map((step, index) => (
                               <div key={index} className="flex items-start gap-4">
                                   <div className="flex-shrink-0 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                   <div>
                                       <h4 className="font-semibold">{step.step}</h4>
                                       <p className="text-muted-foreground text-sm">{step.desc}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                    </TabsContent>

                    <TabsContent value="fit">
                        <h3 className="text-lg font-semibold mb-4">Is This Career Right for Your Child?</h3>
                        <ul className="space-y-3">
                            {selectedCareer.fitCheck.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{item.question}</span>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <footer className="p-6 border-t border-gray-200 bg-gray-50/50">
                <Button size="lg" className="w-full" asChild style={{ backgroundColor: '#FF6B00', color: 'white' }}>
                  <Link href="/login">
                    Create Roadmap for my child
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
