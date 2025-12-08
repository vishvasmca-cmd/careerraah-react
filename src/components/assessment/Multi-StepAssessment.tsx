
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ArrowLeft, Book, Beaker, Landmark, Palette, Code, Handshake, IndianRupee, Briefcase, Building, Gamepad2, Mic2, Sparkles, ArrowRight, Film, Atom, Trophy, Scale, BrainCircuit, Users, Rocket, DollarSign, Loader2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getCareerReportAction } from '@/lib/actions';
import type { GenerateCareerReportInput, GenerateCareerReportOutput } from '@/ai/schemas/career-report';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { InteractiveChat } from '@/components/assessment/InteractiveChat';
import { useTranslation } from '@/hooks/use-translation';

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
  { id: 'Step 4', name: 'Goals', fields: ['budget', 'location'] },
  { id: 'Step 5', name: 'Finish', fields: [] },
];

const juniorSteps = [
    { id: 'Step 1', name: 'Profile', fields: ['currentStage'] },
    { id: 'Step 2', name: 'Exploration', fields: ['strongSubjects', 'interests'] },
    { id: 'Step 3', name: 'Finish', fields: [] },
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

const formatReportForShare = (name: string, report: GenerateCareerReportOutput): string => {
  const careerPaths = report.topCareerPaths.map(p => 
    `- ${p.name}: ${p.reason}`
  ).join('\n');

  return `
*My Personalized Career Report from CareerRaah*

Hello! I just generated a free AI-powered career report for ${name}. Here's a summary:

*RECOMMENDED CAREER CLUSTERS:*
${report.recommendedClusters}

*TOP CAREER SUGGESTIONS:*
${careerPaths}

This is just a summary! You can create your own free, detailed report and explore hundreds of modern careers.

*CareerRaah - Your Personal AI Career Guide*
Discover your path today: https://careerraah.com
  `.trim();
};


export function MultiStepAssessment({ userRole = 'student', userName = 'Student' }: { userRole:string, userName: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const { language } = useTranslation();
  const [formData, setFormData] = useState<GenerateCareerReportInput>({
    // Step 1
    currentStage: '',
    board: '',
    stream: '',
    university: '',
    collegeStream: '',
    currentGoal: '',
    industryPreference: '',
    gapDegree: '',
    gapAspiration: '',
    // Step 2
    strongSubjects: [],
    academicScore: "75% - 85%", // Default text bucket
    examStatus: [],
    // Step 3
    interests: [],
    workStyle: '',
    // Step 4
    budget: "Medium (₹1L - ₹4L)", // Default text bucket
    parentPressure: false,
    location: '',
    // Junior Flow Specific
    parentQuestion: '',
    userRole: userRole,
    userName: userName,
    language: language,
  });

  const [formNumericData, setFormNumericData] = useState({
      academicScore: 80,
      budget: 250000,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [report, setReport] = useState<GenerateCareerReportOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isJunior = ['Class 1-5', 'Class 6-7', 'Class 8-10'].includes(formData.currentStage);
  const steps = isJunior ? juniorSteps : baseSteps;
  
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
          setIsFinished(true); // Still go to final step to show error
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
      setCurrentStep(currentStep + 1);
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
    
    if (isJunior && currentStep === 1) {
      return currentFields.every(field => {
        if (field === 'parentQuestion') return true;
        const value = formData[field as keyof typeof formData];
        if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined;
      });
    }

    return currentFields.every(field => {
        const value = formData[field as keyof typeof formData];
        if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined;
    });
  };

  const handleShare = (platform: 'whatsapp' | 'email') => {
    if (!report) return;

    const reportText = formatReportForShare(userName, report);
    
    if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
      window.open(whatsappUrl, '_blank');
    } else if (platform === 'email') {
      const subject = `My CareerRaah Report for ${userName}`;
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`;
      window.location.href = mailtoUrl;
    }
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
                <h2 className="text-2xl font-bold font-headline">Generating Your Report...</h2>
                <p className="text-muted-foreground">Analyzing your profile against millions of data points.</p>
            </div>
        </div>
    )}
    <Card className="shadow-2xl">
      <CardHeader>
        <Progress value={progressValue} className="w-full h-2 mb-4" />
        <CardTitle className="text-2xl font-headline text-foreground">{steps[currentStep].name}</CardTitle>
        {currentStep < steps.length -1 && (
            <CardDescription className="text-foreground/80">Step {currentStep + 1} of {steps.length -1} {userRole === 'parent' ? "for your child" : ""}</CardDescription>
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
                <Label className="text-lg font-semibold">Which class/academic stage are you in?</Label>
                <RadioGroup onValueChange={(value) => handleFormData('currentStage', value)} value={formData.currentStage} className="grid grid-cols-2 md:grid-cols-4 gap-2">
                   {(['Class 1-5', 'Class 6-7', 'Class 8-10', 'Class 11-12', 'College / Graduate', 'Post Graduate', 'Gap Year'] as const).map(stage => (
                      <Label key={stage} htmlFor={stage} className={`flex items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-primary ${formData.currentStage === stage ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                        <RadioGroupItem value={stage} id={stage} className="sr-only"/>
                        <span className="font-semibold text-center text-sm">{stage}</span>
                      </Label>
                   ))}
                </RadioGroup>

                {isSchoolStage && formData.currentStage && (
                  <Select onValueChange={(value) => handleFormData('board', value)} value={formData.board}>
                    <SelectTrigger><SelectValue placeholder="Select your Education Board" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE/CISCE">ICSE/CISCE</SelectItem>
                        <SelectItem value="State Board">State Board</SelectItem>
                        <SelectItem value="IB">IB (International Baccalaureate)</SelectItem>
                        <SelectItem value="Cambridge">Cambridge (IGCSE, A-Levels)</SelectItem>
                        <SelectItem value="NIOS">NIOS</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {currentStage === 'Class 11-12' && (
                    <div className='space-y-4'>
                        <Select onValueChange={(value) => handleFormData('stream', value)} value={formData.stream}>
                            <SelectTrigger><SelectValue placeholder="Select your Stream" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Science (PCM)">Science (PCM) - Engineering Focus</SelectItem>
                                <SelectItem value="Science (PCB)">Science (PCB) - Medical Focus</SelectItem>
                                <SelectItem value="Science (PCMB)">Science (PCMB) - General</SelectItem>
                                <SelectItem value="Commerce with Maths">Commerce with Maths</SelectItem>
                                <SelectItem value="Commerce without Maths">Commerce without Maths</SelectItem>
                                <SelectItem value="Humanities / Arts">Humanities / Arts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                { (currentStage === 'College / Graduate' || currentStage === 'Post Graduate') && (
                    <div className="space-y-4">
                        <Input placeholder="University/College" value={formData.university} onChange={e => handleFormData('university', e.target.value)} />
                        <Input placeholder="Stream/Degree (e.g. B.Tech in CS)" value={formData.collegeStream} onChange={e => handleFormData('collegeStream', e.target.value)} />
                        <Select onValueChange={(value) => handleFormData('currentGoal', value)} value={formData.currentGoal}>
                            <SelectTrigger><SelectValue placeholder="What is your current primary goal?" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Get a Job">Get a Job</SelectItem>
                                <SelectItem value="Higher Studies">Pursue Higher Studies</SelectItem>
                                <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                            </SelectContent>
                        </Select>
                        {formData.currentGoal === 'Get a Job' && <Input placeholder="Which industry/field interests you?" value={formData.industryPreference} onChange={e => handleFormData('industryPreference', e.target.value)} />}
                    </div>
                )}
                { currentStage === 'Gap Year' && (
                    <div className="space-y-4">
                        <Input placeholder="Degree completed before gap" value={formData.gapDegree} onChange={e => handleFormData('gapDegree', e.target.value)} />
                        <Textarea placeholder="What is your main aspiration now? (e.g., prepare for an exam, explore a new field)" value={formData.gapAspiration} onChange={e => handleFormData('gapAspiration', e.target.value)} />
                    </div>
                )}
              </div>
            )}
            {currentStep === 1 && !isJunior && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold">Which subjects do you genuinely enjoy & score well in?</Label>
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
                    <Label className="text-lg font-semibold">What is your average aggregate percentage?</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider value={[formNumericData.academicScore]} onValueChange={(value) => handleNumericData('academicScore', value[0])} max={99} min={40} step={1} className="w-full" />
                      <span className="font-bold text-lg text-primary w-20 text-center">{formNumericData.academicScore}%</span>
                    </div>
                </div>
                 <div>
                  <Label className="text-lg font-semibold">Are you preparing for any entrance exams?</Label>
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
             {currentStep === 1 && isJunior && (
              <div className='space-y-6'>
                <div>
                    <Label className="text-lg font-semibold">What subjects do you enjoy the most in school?</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {subjects.slice(0,6).map(subject => (
                        <Button key={subject} variant={formData.strongSubjects.includes(subject) ? 'default' : 'outline'} onClick={() => handleMultiSelect('strongSubjects', subject)}>
                            {subject}
                        </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="text-lg font-semibold">What activities do you love doing after school?</Label>
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
                    <Label className="text-lg font-semibold" htmlFor="parentQuestion">Any specific questions you have for us? (Optional)</Label>
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
            {currentStep === 2 && !isJunior &&(
              <div className='space-y-6'>
                <div>
                    <Label className="text-lg font-semibold">What topics excite you outside of textbooks?</Label>
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
                    <Label className="text-lg font-semibold">Work Style Preference</Label>
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
             {currentStep === 3 && !isJunior && (
                <div className="space-y-8">
                    <div>
                        <Label className="text-lg font-semibold">College Budget Expectation (Per Year)</Label>
                        <p className="text-sm text-muted-foreground">This helps us suggest Pvt vs Govt colleges.</p>
                        <div className="flex items-center gap-4 mt-2">
                           <Slider value={[formNumericData.budget]} onValueChange={(value) => handleNumericData('budget', value[0])} max={1500000} min={50000} step={50000} className="w-full" />
                           <span className="font-bold text-lg text-primary w-32 text-center">₹{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3, notation: 'compact' }).format(formNumericData.budget)}</span>
                        </div>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold">Location Preference</Label>
                         <RadioGroup onValueChange={(value) => handleFormData('location', value)} value={formData.location} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                           {(['Home Town', 'Metro City', 'Abroad'] as const).map(location => (
                               <Label key={location} htmlFor={location} className={`flex items-center justify-center rounded-md border-2 p-4 h-20 cursor-pointer hover:border-primary ${formData.location === location ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                                <RadioGroupItem value={location} id={location} className="sr-only"/>
                                {location === 'Home Town' ? <Building className="mr-2"/> : location === 'Metro City' ? <Briefcase className="mr-2"/> : <Rocket className="mr-2"/>} {location}
                               </Label>
                           ))}
                        </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-2 pt-4 border-t">
                        <Checkbox id="parentPressure" checked={formData.parentPressure} onCheckedChange={(checked) => handleFormData('parentPressure', !!checked)} />
                        <label htmlFor="parentPressure" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                                <h2 className="text-3xl font-bold font-headline text-foreground">Your Career Report is Ready!</h2>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold font-headline flex items-center gap-2 text-foreground"><Sparkles className="text-primary"/> Recommended Career Clusters</h3>
                                <p className="text-muted-foreground mt-2">{report.recommendedClusters}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold font-headline flex items-center gap-2 text-foreground"><Rocket className="text-primary"/> Top 3 Career Paths</h3>
                                <ul className="mt-4 space-y-4">
                                    {report.topCareerPaths.map(suggestion => (
                                        <li key={suggestion.name} className="p-4 border rounded-lg bg-secondary/30">
                                            <p className="font-semibold text-primary text-lg">{suggestion.name}</p>
                                            <p className="text-muted-foreground mt-1"><b className="text-foreground/80">Why it fits:</b> {suggestion.reason}</p>
                                            <p className="text-sm text-foreground/90 mt-2"><b className="text-foreground/80">Path:</b> {suggestion.path}</p>
                                            <p className="text-sm text-foreground/90 mt-1"><b className="text-foreground/80">Reality Check:</b> {suggestion.realityCheck}</p>
                                            <p className="text-sm text-foreground/90 mt-1"><b className="text-foreground/80">Financials:</b> {suggestion.financials}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="pt-6 border-t">
                                <h3 className="text-xl font-bold font-headline text-foreground">Share Your Report</h3>
                                <div className="flex gap-2 mt-4">
                                  <Button onClick={() => handleShare('whatsapp')} variant="outline">
                                    <WhatsAppIcon /> Share on WhatsApp
                                  </Button>
                                  <Button onClick={() => handleShare('email')} variant="outline">
                                    <Mail /> Share via Email
                                  </Button>
                                </div>
                            </div>

                            <InteractiveChat assessmentData={formData} />
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
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <Button variant="ghost" onClick={handleBack}><ArrowLeft className="mr-2" /> Back</Button>
          )}
        </div>
        <div>
          {currentStep < steps.length - 2 && (
            <Button
              onClick={handleNext}
              disabled={!validateStep()}
              style={{ backgroundColor: '#FF6B00', color: 'white' }}
            >
              Next
            </Button>
          )}
          {currentStep === steps.length - 2 && (
            <Button
              onClick={handleNext}
              disabled={!validateStep() || isSubmitting}
              style={{ backgroundColor: '#FF6B00', color: 'white' }}
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
             <Button asChild style={{ backgroundColor: '#FF6B00', color: 'white' }}>
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

    

    



    