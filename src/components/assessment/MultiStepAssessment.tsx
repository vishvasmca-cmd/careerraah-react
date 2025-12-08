

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ArrowLeft, Book, Beaker, Landmark, Palette, Code, Handshake, IndianRupee, Briefcase, Building, Gamepad2, Mic2, Star, Video, ArrowRight, Film, Atom, Trophy, Scale, BrainCircuit, Users, Rocket, DollarSign, Loader2, Mail, FileDown, Lock, Info, Search, Heart, Lightbulb, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getCareerReportAction } from '@/lib/actions';
import type { GenerateCareerReportInput, GenerateCareerReportOutput } from '@/ai/schemas/career-report';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { InteractiveChat } from '@/components/assessment/InteractiveChat';
import { useTranslation } from '@/hooks/use-translation';
import { useRouter } from 'next/navigation';
import html2pdf from 'html2pdf.js';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// A simple markdown-to-html renderer
const MarkdownRenderer = ({ content, id }: { content: string; id: string }) => {
  const processLine = (line: string) => {
    // Headings
    if (line.startsWith('### ')) return `<h3 class="text-xl font-bold font-headline mt-6 mb-2">${line.substring(4)}</h3>`;
    if (line.startsWith('## ')) return `<h2 class="text-2xl font-bold font-headline mt-8 mb-4">${line.substring(3)}</h2>`;
    if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold font-headline mt-8 mb-4">${line.substring(2)}</h1>`;

    // Bold and Italic
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Checkboxes
    line = line.replace(/\[ \]/g, '&#9744;'); // Unchecked
    line = line.replace(/\[x\]/g, '&#9745;'); // Checked
    
    // List items
    if (line.match(/^\s*-\s/)) return `<li class="ml-4 list-disc">${line.replace(/^\s*-\s/, '')}</li>`;
    if (line.match(/^\s*\d\.\s/)) return `<li class="ml-4 list-decimal">${line.replace(/^\s*\d\.\s/, '')}</li>`;

    // Tables
    if (line.startsWith('|') && line.endsWith('|')) {
        if (line.includes('---')) return ''; // Skip markdown table separator
        const cells = line.split('|').slice(1, -1).map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
    }

    // Default to a paragraph for non-empty lines
    return line ? `<p>${line}</p>` : '<br />';
  };

  const html = content.split('\n').map(processLine).join('');

  // A bit of post-processing to wrap list items and table rows correctly
  const finalHtml = html
    .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/(<tr>.*?<\/tr>)/g, '<table><tbody>$1</tbody></table>')
    .replace(/<\/tbody><\/table>\s*<table><tbody>/g, '');


  return <div id={id} className="prose prose-sm max-w-none text-foreground/90 space-y-4" dangerouslySetInnerHTML={{ __html: finalHtml }} />;
};



const WhatsAppIcon = () => (
  <svg
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.89-5.465 0-9.89 4.428-9.889 9.891.001 2.23.651 4.35 1.848 6.096l-1.214 4.439 4.542-1.192z" />
  </svg>
);


const baseSteps = [
  { id: 'Step 1', name: 'Profile', fields: ['currentStage'] },
  { id: 'Step 2', name: 'Academics', fields: ['strongSubjects', 'academicScore'] },
  { id: 'Step 3', name: 'Interests', fields: ['interests', 'workStyle'] },
  { id: 'Step 4', name: 'Goals', fields: ['budget', 'location', 'parentQuestion'] },
  { id: 'Step 5', name: 'Finish', fields: [] },
];

const juniorSteps = [
    { id: 'Step 1', name: 'Profile', fields: ['currentStage'] },
    { id: 'Step 2', name: 'Exploration', fields: ['strongSubjects', 'interests', 'parentQuestion'] },
    { id: 'Step 3', name: 'Finish', fields: [] },
];

const youngestSteps = [
    { id: 'Step 1', name: 'Profile', fields: ['currentStage'] },
    { id: 'Step 2', name: 'Child\'s Personality', fields: ['childNewSituation', 'childThinkingStyle', 'childIntelligenceType'] },
    { id: 'Step 3', name: 'Exploration', fields: ['strongSubjects', 'interests', 'parentQuestion'] },
    { id: 'Step 4', name: 'Finish', fields: [] },
];


const slideVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science/IP", "Accounts", "Economics", "Business Studies", "History/Pol Sci", "Geography", "English/Literature", "Art/Design"];

const entranceExams = ["No, focusing on Boards", "JEE (Main/Advanced)", "NEET (Medical)", "BITSAT", "VITEEE / SRMJEEE", "CUET (Central Universities)", "IPMAT (IIM Indore/Rohtak)", "CLAT (Law)", "AILET (NLU Delhi)", "NDA (Defence)", "CA Foundation", "Design (NID/NIFT/UCEED)", "SAT/IELTS/TOEFL"];

const interests = [
  { name: "Building/Creating 🎨", icon: Palette },
  { name: "Solving Puzzles 🧠", icon: Code },
  { name: "Nature/Animals 🌳", icon: Beaker },
  { name: "Reading/Stories 📖", icon: Book },
  { name: "Sports/Games 🏃", icon: Gamepad2 },
  { name: "Helping People ❤️", icon: Handshake },
  { name: "Performing/Singing 🎤", icon: Mic2 },
  { name: "Leading a team 🧑‍🤝‍🧑", icon: Briefcase },
];

const seniorInterests = [
    { name: "💻 Coding / App Dev / AI", icon: Code },
    { name: "🤖 Robotics / Electronics", icon: Beaker },
    { name: "⚕️ Human Biology / Medicine", icon: Handshake },
    { name: "💰 Stock Market / Finance", icon: IndianRupee },
    { name: "📈 Marketing / Business Strategy", icon: Briefcase },
    { name: "🎨 Sketching / UI Design", icon: Palette },
    { name: "✍️ Writing / Journalism", icon: Book },
    { name: "⚖️ Law / Social Justice", icon: Landmark },
    { name: "🎬 Video Editing / Content Creation", icon: Film},
    { name: "🌍 Travel / Geography", icon: Building },
];

const workStyles = [
    { value: "Desk Job (Office)", label: "I want a Desk Job (AC Office, Laptop)"},
    { value: "Field Work (Travel)", label: "I want Field Work (Travel, Sites, interaction)"},
    { value: "Creative Studio", label: "I want a Creative Studio (Art, Design, Freedom)"},
    { value: "Uniform/Discipline", label: "I want Uniform/Discipline (Defense, Pilot, Merchant Navy)"}
]

const formatReportForShare = (name: string): string => {
  return `Check out this amazing AI-generated Career Report I created for ${name} on CareerRaah! You can create one too. Discover your path today: https://careerraah.com`;
};


export function MultiStepAssessment({ userRole = 'student', userName = 'Student' }: { userRole:string, userName: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { language } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Session-based report storage
  const [report, setReportState] = useState<GenerateCareerReportOutput | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Check session storage on initial load
    const savedReport = sessionStorage.getItem('careerReport');
    if (savedReport) {
      setReportState(JSON.parse(savedReport));
      setIsFinished(true);
      setCurrentStep(steps.length - 1); // Go to final step
    }
  }, []);

  const setReport = (newReport: GenerateCareerReportOutput | null) => {
    setReportState(newReport);
    if (newReport) {
      sessionStorage.setItem('careerReport', JSON.stringify(newReport));
    } else {
      sessionStorage.removeItem('careerReport');
    }
  };


  const [formData, setFormData] = useState<GenerateCareerReportInput>({
    currentStage: '',
    board: '',
    stream: '',
    university: '',
    collegeStream: '',
    currentGoal: '',
    industryPreference: '',
    gapDegree: '',
    gapAspiration: '',
    strongSubjects: [],
    academicScore: "75% - 85%",
    examStatus: [],
    interests: [],
    workStyle: '',
    budget: "Medium (₹1L - ₹4L)",
    parentPressure: false,
    location: '',
    parentQuestion: '',
    userRole: userRole,
    userName: userName,
    language: language,
    childNewSituation: '',
    childThinkingStyle: '',
    childIntelligenceType: '',
  });

  const [formNumericData, setFormNumericData] = useState({
      academicScore: 80,
      budget: 250000,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planLevel, setPlanLevel] = useState<'none' | 'basic' | 'premium'>('none');
  
  const isUnlocked = planLevel === 'basic' || planLevel === 'premium';


  const reportPreview = useMemo(() => {
    if (!report) return "";
    const summaryRegex = /(### 1. .*?[\s\S]*?)(?=### 2.|$)/;
    const match = report.reportContent.match(summaryRegex);
    return match ? match[0] : "Your report is ready!";
  }, [report]);

  useEffect(() => {
    if (report && cardRef.current) {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [report]);


  const isYoungest = formData.currentStage === 'Class 1-5';
  const isJunior = ['Class 6-7', 'Class 8-10'].includes(formData.currentStage);
  const steps = isYoungest ? youngestSteps : isJunior ? juniorSteps : baseSteps;
  
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) { // Submitting on the last real step
        setIsSubmitting(true);
        setError(null);
        
        const payload = { ...formData, userRole: userRole, language: language, userName: userName };

        const result = await getCareerReportAction(payload);

        if (result.report) {
          setReport(result.report);
          setIsFinished(true);
          setCurrentStep(currentStep + 1);
        } else {
          setError(result.error || 'An unknown error occurred.');
          setIsFinished(true);
          setCurrentStep(currentStep + 1);
        }

        setIsSubmitting(false);

      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };
  
  const handleFormData = (field: keyof GenerateCareerReportInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericData = (field: 'academicScore' | 'budget', value: number) => {
      setFormNumericData(prev => ({ ...prev, [field]: value }));

      if (field === 'academicScore') {
          const getAcademicBucket = (score: number) => {
            if (score < 60) return "< 60%";
            if (score < 75) return "60% - 75%";
            if (score < 85) return "75% - 85%";
            if (score < 95) return "85% - 95%";
            return "95%+";
          }
          handleFormData('academicScore', getAcademicBucket(value));
      }

      if (field === 'budget') {
            const getBudgetBucket = (budget: number) => {
                if (budget <= 100000) return "Low (< ₹1L)";
                if (budget <= 400000) return "Medium (₹1L - ₹4L)";
                if (budget <= 1000000) return "High (₹4L - ₹10L)";
                return "Premium (> ₹10L)";
            }
            handleFormData('budget', getBudgetBucket(value));
      }
  }
  
  const handleMultiSelect = (field: 'strongSubjects' | 'examStatus' | 'interests', value: string) => {
    const currentValues = formData[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(i => i !== value)
      : [...currentValues, value];
    handleFormData(field, newValues);
  }

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    if (!currentFields || currentFields.length === 0) return true;
    
    return currentFields.every(field => {
        const value = formData[field as keyof typeof formData];
        if (Array.isArray(value)) return value.length > 0;
        // The question field is optional, so we don't validate its presence
        if (field === 'parentQuestion') return true;
        return value !== '' && value !== null && value !== undefined;
    });
  };

  const handleShare = (platform: 'whatsapp' | 'email') => {
    if (!isUnlocked) return;
    const reportText = formatReportForShare(userName);
    if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
      window.open(whatsappUrl, '_blank');
    } else if (platform === 'email') {
      const subject = `Check out this AI Career Report from CareerRaah!`;
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`;
      window.location.href = mailtoUrl;
    }
  };

  const handleDownload = () => {
    if (!report || !isUnlocked) return;

    const contentElement = document.getElementById('full-report-for-pdf');
    if (!contentElement) {
        console.error("PDF generation failed: full report content not found.");
        return;
    };

    const header = `
      <div style="padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
        <h1 style="font-size: 2.5rem; font-family: 'Belleza', sans-serif; color: #4F46E5; margin: 0;">CareerRaah</h1>
        <p style="font-size: 1rem; font-family: 'Alegreya', serif; color: #333; margin: 0;">https://careerraah.com</p>
      </div>
    `;

    const reportBody = `
      <div style="padding: 20px 40px; font-family: 'Alegreya', serif; color: #000; background-color: #fff;">
        ${contentElement.innerHTML}
      </div>
    `;

    const fullHtml = `
      <div style="font-family: 'Alegreya', serif; background-color: #fff;">
        ${header}
        ${reportBody}
      </div>
    `;

    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     `${userName.replace(/ /g, '_')}_CareerReport_Generated_by_CareerRaah.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(fullHtml).set(opt).save();
  };

  const progressValue = ((currentStep) / (steps.length - 1)) * 100;
  const currentStage = formData.currentStage;
  const isSchoolStage = ['Class 1-5', 'Class 6-7', 'Class 8-10', 'Class 11-12'].includes(currentStage);

  return (
    <>
    {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
                <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
                <h2 className="text-2xl font-bold font-headline text-foreground">Generating your Career Plan powered by CareerRaah..</h2>
                <p className="text-muted-foreground">Analyzing your profile against millions of data points.</p>
            </div>
        </div>
    )}
    <Card className="shadow-2xl bg-card" ref={cardRef}>
      <CardHeader>
        {!isFinished && <Progress value={progressValue} className="w-full h-2 mb-4" /> }
        <CardTitle className="text-2xl font-headline text-foreground">{steps[currentStep].name}</CardTitle>
        {currentStep < steps.length -1 && (
            <CardDescription className="text-foreground/80">
              Step {currentStep + 1} of {steps.length - 1} {userRole === 'parent' ? "for your child" : ""}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent className="overflow-hidden relative min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-full"
          >
            {currentStep === 0 && (
              <div className="space-y-6">
                <Label className="text-lg font-semibold text-foreground">Which class/academic stage are you in?</Label>
                <RadioGroup onValueChange={(value) => handleFormData('currentStage', value)} value={formData.currentStage} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {(['Class 1-5', 'Class 6-7', 'Class 8-10', 'Class 11-12', 'College / Graduate', 'Post Graduate', 'Gap Year'] as const).map(stage => (
                      <Label key={stage} htmlFor={stage} className={`flex items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-primary h-20 ${formData.currentStage === stage ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                        <RadioGroupItem value={stage} id={stage} className="sr-only"/>
                        <span className="font-semibold text-center text-base text-foreground">{stage}</span>
                      </Label>
                   ))}
                </RadioGroup>
              </div>
            )}
            {currentStep === 1 && isYoungest && (
                <div className="space-y-8">
                    <div>
                        <Label className="text-lg font-semibold text-foreground">How does your child react to new situations or people?</Label>
                        <RadioGroup onValueChange={(v) => handleFormData('childNewSituation', v)} value={formData.childNewSituation} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Label htmlFor="cns-curious" className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value="curious" id="cns-curious"/>
                                <div>
                                    <div className='flex items-center gap-2 font-semibold'><Search /> Curious & Excited</div>
                                    <p className='text-xs text-muted-foreground ml-7'>Jumps right in, asks questions.</p>
                                </div>
                            </Label>
                             <Label htmlFor="cns-cautious" className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value="cautious" id="cns-cautious"/>
                                <div>
                                    <div className='flex items-center gap-2 font-semibold'><UserCheck /> Cautious & Observant</div>
                                    <p className='text-xs text-muted-foreground ml-7'>Likes to watch first, then join in.</p>
                                </div>
                            </Label>
                        </RadioGroup>
                    </div>
                     <div>
                        <Label className="text-lg font-semibold text-foreground">When solving a problem, are they more of a...</Label>
                        <RadioGroup onValueChange={(v) => handleFormData('childThinkingStyle', v)} value={formData.childThinkingStyle} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Label htmlFor="cts-thinker" className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value="thinker" id="cts-thinker"/>
                                <div>
                                    <div className='flex items-center gap-2 font-semibold'><Lightbulb /> Thinker</div>
                                    <p className='text-xs text-muted-foreground ml-7'>Tries to understand the 'why' and 'how'.</p>
                                </div>
                            </Label>
                             <Label htmlFor="cts-feeler" className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value="feeler" id="cts-feeler"/>
                                 <div>
                                    <div className='flex items-center gap-2 font-semibold'><Heart /> Feeler</div>
                                    <p className='text-xs text-muted-foreground ml-7'>Considers how people are affected.</p>
                                </div>
                            </Label>
                        </RadioGroup>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-foreground">What's their favorite way to play?</Label>
                        <RadioGroup onValueChange={(v) => handleFormData('childIntelligenceType', v)} value={formData.childIntelligenceType} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Label htmlFor="cit-builder" className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value="building/creating" id="cit-builder"/>
                                 <div>
                                    <div className='flex items-center gap-2 font-semibold'><Palette /> Building & Creating</div>
                                    <p className='text-xs text-muted-foreground ml-7'>With blocks, clay, or drawings.</p>
                                </div>
                            </Label>
                             <Label htmlFor="cit-storyteller" className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value="stories/pretend-play" id="cit-storyteller"/>
                                 <div>
                                    <div className='flex items-center gap-2 font-semibold'><Book /> Stories & Pretend Play</div>
                                    <p className='text-xs text-muted-foreground ml-7'>Making up characters and worlds.</p>
                                </div>
                            </Label>
                        </RadioGroup>
                    </div>
                </div>
            )}
            {currentStep === 1 && isJunior && (
              <div className='space-y-6'>
                <div>
                    <Label className="text-lg font-semibold text-foreground">What subjects do you enjoy the most in school?</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {subjects.slice(0,6).map(subject => (
                        <Button key={subject} variant={formData.strongSubjects.includes(subject) ? 'default' : 'outline'} onClick={() => handleMultiSelect('strongSubjects', subject)}>
                            {subject}
                        </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="text-lg font-semibold text-foreground">What activities do you love doing after school?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {interests.map(interest => (
                        <Button key={interest.name} variant={formData.interests.includes(interest.name) ? "default" : "outline"} className="h-24 flex-col gap-2"
                        onClick={() => handleMultiSelect('interests', interest.name)}
                        >
                        <interest.icon size={24} />
                        <span className="text-xs text-center">{interest.name.split('/')[0]}</span>
                        </Button>
                    ))}
                    </div>
                </div>
                 <div>
                    <Label className="text-lg font-semibold text-foreground" htmlFor="parentQuestion">Any specific questions you have for us? (Optional)</Label>
                    <Textarea 
                      id="parentQuestion"
                      placeholder="e.g., 'I love drawing but I'm worried about career stability.' or 'How can my child balance studies and sports?'"
                      value={formData.parentQuestion}
                      onChange={(e) => handleFormData('parentQuestion', e.target.value)}
                      className="mt-2"
                    />
                </div>
              </div>
            )}
            {currentStep === 1 && !isJunior && !isYoungest && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold text-foreground">Which subjects do you genuinely enjoy & score well in?</Label>
                  <p className="text-sm text-muted-foreground">Select all that apply.</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subjects.map(subject => (
                      <Button key={subject} variant={formData.strongSubjects.includes(subject) ? 'default' : 'outline'} onClick={() => handleMultiSelect('strongSubjects', subject)}>
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                    <Label className="text-lg font-semibold text-foreground">What is your average aggregate percentage?</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider value={[formNumericData.academicScore]} onValueChange={(value) => handleNumericData('academicScore', value[0])} max={99} min={40} step={1} className="w-full" />
                      <span className="font-bold text-lg text-primary w-20 text-center">{formNumericData.academicScore}%</span>
                    </div>
                </div>
                 <div>
                  <Label className="text-lg font-semibold text-foreground">Are you preparing for any entrance exams?</Label>
                  <p className="text-sm text-muted-foreground">Select all that apply.</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entranceExams.map(exam => (
                      <Button key={exam} variant={formData.examStatus.includes(exam) ? 'default' : 'outline'} onClick={() => handleMultiSelect('examStatus', exam)}>
                        {exam}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && isYoungest && (
                <div className='space-y-6'>
                    <div>
                        <Label className="text-lg font-semibold text-foreground">What subjects does your child enjoy the most in school?</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {subjects.slice(0,6).map(subject => (
                            <Button key={subject} variant={formData.strongSubjects.includes(subject) ? 'default' : 'outline'} onClick={() => handleMultiSelect('strongSubjects', subject)}>
                                {subject}
                            </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-foreground">What activities do they love doing after school?</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {interests.map(interest => (
                            <Button key={interest.name} variant={formData.interests.includes(interest.name) ? "default" : "outline"} className="h-24 flex-col gap-2"
                            onClick={() => handleMultiSelect('interests', interest.name)}
                            >
                            <interest.icon size={24} />
                            <span className="text-xs text-center">{interest.name.split('/')[0]}</span>
                            </Button>
                        ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-foreground" htmlFor="parentQuestion">Any specific questions for us? (Optional)</Label>
                        <Textarea 
                        id="parentQuestion"
                        placeholder="e.g., 'How can I encourage my child's creativity?'"
                        value={formData.parentQuestion}
                        onChange={(e) => handleFormData('parentQuestion', e.target.value)}
                        className="mt-2"
                        />
                    </div>
                </div>
            )}

            {currentStep === 2 && !isJunior && !isYoungest && (
              <div className='space-y-6'>
                <div>
                    <Label className="text-lg font-semibold text-foreground">What topics excite you outside of textbooks?</Label>
                     <p className="text-sm text-muted-foreground">This helps us understand your real passions.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {seniorInterests.map(interest => (
                        <Button key={interest.name} variant={formData.interests.includes(interest.name) ? "default" : "outline"} className="h-20 flex-col justify-center items-center text-center text-xs"
                        onClick={() => handleMultiSelect('interests', interest.name)}
                        >
                          <interest.icon size={20} className="mb-1" />
                          {interest.name.split('/')[0]}
                        </Button>
                    ))}
                    </div>
                </div>
                <div>
                    <Label className="text-lg font-semibold text-foreground">Work Style Preference</Label>
                    <RadioGroup onValueChange={(value) => handleFormData('workStyle', value)} value={formData.workStyle} className="mt-2 space-y-2">
                        {workStyles.map(style => (
                            <Label key={style.value} htmlFor={style.value} className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value={style.value} id={style.value}/>
                                {style.label}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
              </div>
            )}
             {currentStep === 3 && !isJunior && !isYoungest && (
                <div className="space-y-8">
                    <div>
                        <Label className="text-lg font-semibold text-foreground">College Budget Expectation (Per Year)</Label>
                        <p className="text-sm text-muted-foreground">This helps us suggest Pvt vs Govt colleges.</p>
                        <div className="flex items-center gap-4 mt-2">
                           <Slider value={[formNumericData.budget]} onValueChange={(value) => handleNumericData('budget', value[0])} max={1500000} min={50000} step={50000} className="w-full" />
                           <span className="font-bold text-lg text-primary w-32 text-center">₹{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3, notation: 'compact' }).format(formNumericData.budget)}</span>
                        </div>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-foreground">Location Preference</Label>
                         <RadioGroup onValueChange={(value) => handleFormData('location', value)} value={formData.location} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                           {(['Home Town', 'Metro City', 'Abroad'] as const).map(location => (
                               <Label key={location} htmlFor={location} className={`flex items-center justify-center rounded-md border-2 p-4 h-20 cursor-pointer hover:border-primary ${formData.location === location ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                                <RadioGroupItem value={location} id={location} className="sr-only"/>
                                {location === 'Home Town' ? <Building className="mr-2"/> : location === 'Metro City' ? <Briefcase className="mr-2"/> : <Rocket className="mr-2"/>} {location}
                               </Label>
                           ))}
                        </RadioGroup>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold text-foreground" htmlFor="parentQuestion">
                          Any specific questions or concerns?
                        </Label>
                        <p className="text-sm text-muted-foreground">e.g., "How can I become a pilot if my budget is low?"</p>
                        <Textarea 
                          id="parentQuestion"
                          placeholder="Type your question here..."
                          value={formData.parentQuestion}
                          onChange={(e) => handleFormData('parentQuestion', e.target.value)}
                          className="mt-2"
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-4 border-t">
                        <Checkbox id="parentPressure" checked={formData.parentPressure} onCheckedChange={(checked) => handleFormData('parentPressure', !!checked)} />
                        <label htmlFor="parentPressure" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                            My parents strictly want Engineering/Medical.
                        </label>
                    </div>
                </div>
            )}
            {currentStep === steps.length - 1 && (
              <div className="flex flex-col items-center justify-center text-left min-h-[450px]">
                {isFinished && (
                  <>
                    {error && <div className="text-red-500 text-center">Error: {error}</div>}
                    {report && (
                       <div className="w-full text-left animate-fade-in space-y-6">
                            <div className="text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold font-headline text-foreground">
                                  {userRole === 'parent' ? `Your ${isYoungest ? 'Insights Report' : 'Career Strategy'} for ${userName} is Ready!` : `Your Career Strategy Report is Ready, ${userName}!`}
                                </h2>
                            </div>
                            
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertTitle>Important Note</AlertTitle>
                              <AlertDescription>
                                For your privacy, CareerRaah does not store your report. Please download a copy to your device for future reference.
                              </AlertDescription>
                            </Alert>

                            {/* Hidden div for full report PDF generation */}
                            <div className="hidden">
                                 <MarkdownRenderer id="full-report-for-pdf" content={report.reportContent} />
                            </div>

                            {/* Visible report content (summary or full) */}
                             <div id="report-content-wrapper">
                                <MarkdownRenderer id="report-content" content={isUnlocked ? report.reportContent : reportPreview} />
                            </div>
                            
                            {!isUnlocked && (
                                <div className="relative text-center p-8 border-dashed border-2 rounded-lg mt-4 bg-secondary/20">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-transparent" />
                                    <div className="relative z-10">
                                        <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold font-headline text-foreground">Unlock Your Full Potential</h3>
                                        <p className="text-muted-foreground mt-2">Choose a plan to view, share, and discuss your complete report.</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
                                            
                                            <Card className="text-left bg-background/70">
                                                <CardHeader>
                                                    <CardTitle className="font-headline">Basic Plan</CardTitle>
                                                    <p className="text-3xl font-bold text-primary">₹49</p>
                                                </CardHeader>
                                                <CardContent className="space-y-3 text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                        <span>Unlock and view the full, detailed career report.</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                        <span>Download the report as a professional PDF.</span>
                                                    </div>
                                                     <div className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                        <span>Share the report with family and counselors.</span>
                                                    </div>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button size="lg" className="w-full" onClick={() => setPlanLevel('basic')}>
                                                        Unlock Basic
                                                    </Button>
                                                </CardFooter>
                                            </Card>

                                            <Card className="text-left border-2 border-primary bg-primary/10 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                                                    BEST VALUE
                                                </div>
                                                <CardHeader>
                                                    <CardTitle className="font-headline">Premium Plan</CardTitle>
                                                    <p className="text-3xl font-bold text-primary">₹499</p>
                                                </CardHeader>
                                                <CardContent className="space-y-3 text-sm">
                                                    <div className="flex items-start gap-2 font-bold">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                        <span>Everything in the Basic Plan, plus:</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 pl-4">
                                                        <BrainCircuit className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                        <span>Unlimited chat with our AI Career Expert.</span>
                                                    </div>
                                                     <div className="flex items-start gap-2 pl-4">
                                                        <Video className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                        <span>30-minute video call with a human expert.</span>
                                                    </div>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button size="lg" style={{ backgroundColor: '#FF6B00', color: 'white' }} className="w-full" onClick={() => setPlanLevel('premium')}>
                                                        Unlock Premium
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-center gap-4">
                               <Button onClick={() => handleShare('whatsapp')} variant="outline" disabled={!isUnlocked} className="w-full sm:w-auto">
                                    <WhatsAppIcon /> Share on WhatsApp
                                </Button>
                                <Button onClick={() => handleShare('email')} variant="outline" disabled={!isUnlocked} className="w-full sm:w-auto">
                                    <Mail /> Share via Email
                                </Button>
                                <Button size="lg" style={{ backgroundColor: '#FF6B00', color: 'white' }} onClick={handleDownload} disabled={!isUnlocked} className="w-full sm:w-auto">
                                    <FileDown className="mr-2" />
                                    Download as PDF
                                </Button>
                            </div>
                            {planLevel === 'premium' && <InteractiveChat assessmentData={formData} />}
                        </div>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div>
          {isClient && currentStep < steps.length - 1 && (
              <Button variant="ghost" onClick={handleBack}><ArrowLeft className="mr-2" /> Back</Button>
          )}
        </div>
        <div>
          {isClient && !isFinished && currentStep < steps.length - 2 && (
            <Button
              onClick={handleNext}
              disabled={!validateStep()}
              style={{ backgroundColor: '#FF6B00', color: 'white' }}
              size="lg"
            >
              Next
            </Button>
          )}
          {isClient && !isFinished && currentStep === steps.length - 2 && (
            <Button
              onClick={handleNext}
              disabled={!validateStep() || isSubmitting}
              style={{ backgroundColor: '#FF6B00', color: 'white' }}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Generate Report'}
            </Button>
          )}
          {isFinished && (
             <Button asChild style={{ backgroundColor: '#FF6B00', color: 'white' }} size="lg">
                 <Link href="/parent-explorer">
                     Explore More Careers <ArrowRight className="ml-2"/>
                 </Link>
             </Button>
          )}
        </div>
      </CardFooter>
    </Card>
    </>
  );
}
