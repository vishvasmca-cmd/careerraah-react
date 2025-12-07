'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    roiChart: [
      { name: 'Cost', value: 2, fill: 'hsl(var(--muted))' },
      { name: 'Salary', value: 6, fill: 'hsl(var(--primary))' },
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
    salary: { low: 5, high: 20 },
    risk: 'Low',
    trustScore: 9,
    description: 'Assess, diagnose, and treat mental, emotional, and behavioral disorders.',
    roiChart: [
      { name: 'Cost', value: 8, fill: 'hsl(var(--muted))' },
      { name: 'Salary', value: 5, fill: 'hsl(var(--primary))' },
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
    category: 'Creative',
    icon: Palette,
    salary: { low: 7, high: 25 },
    risk: 'Medium',
    trustScore: 8,
    description: 'Design user-friendly interfaces for websites and apps to enhance user experience.',
    roiChart: [
      { name: 'Cost', value: 3, fill: 'hsl(var(--muted))' },
      { name: 'Salary', value: 7, fill: 'hsl(var(--primary))' },
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
    salary: { low: 9, high: 40 },
    risk: 'Low',
    trustScore: 9,
    description: 'Advise businesses on their legal rights, responsibilities, and obligations.',
    roiChart: [
      { name: 'Cost', value: 15, fill: 'hsl(var(--muted))' },
      { name: 'Salary', value: 9, fill: 'hsl(var(--primary))' },
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
    salary: { low: 10, high: 50 },
    risk: 'High',
    trustScore: 9,
    description: 'Develop intelligent algorithms and systems that can learn and make decisions.',
    roiChart: [
        { name: 'Cost', value: 12, fill: 'hsl(var(--muted))' },
        { name: 'Salary', value: 10, fill: 'hsl(var(--primary))' },
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
];

const categories = ['All', 'Future Tech', 'Medical', 'Creative', 'Legal'];
const categoryIcons: { [key: string]: React.ElementType } = {
  'Future Tech': Rocket,
  'Medical': Heart,
  'Creative': Palette,
  'Legal': Landmark,
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
              {categories.map(category => (
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
                  {category}
                </Button>
              ))}
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
              <Card key={career.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex-grow">
                    <CategoryIcon className="w-8 h-8 mb-3 text-primary" />
                    <h3 className="font-bold text-lg text-foreground mb-2">{career.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{career.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-primary text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={() => setSelectedCareer(career)}
                  >
                    View Report
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
                      <h3 className="text-lg font-semibold mb-4">Cost vs. Salary Analysis (in Lakhs Per Annum)</h3>
                      <div className="h-40 w-full bg-gray-50 rounded-lg p-4 flex items-end gap-8">
                         {selectedCareer.roiChart.map(item => (
                             <div key={item.name} className="flex-1 flex flex-col items-center">
                                 <motion.div
                                    initial={{height: 0}}
                                    animate={{height: `${item.value * 10}%`}}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="w-full rounded-t-md"
                                    style={{backgroundColor: item.fill}}
                                 />
                                 <p className="text-xs font-medium mt-1">{item.name}</p>
                                 <p className="text-sm font-bold">₹{item.value}L</p>
                             </div>
                         ))}
                      </div>
                       <p className="text-sm text-muted-foreground mt-4">This is a simplified illustration. Actual costs and salaries can vary based on college, location, and individual performance.</p>
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
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <FileDown className="mr-2"/> Download Full Guide
                </Button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
