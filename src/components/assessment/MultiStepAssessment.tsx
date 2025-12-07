'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, ArrowLeft, Book, Beaker, Landmark, Palette, Code, Handshake, IndianRupee, Briefcase, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const steps = [
  { id: 'Step 1', name: 'Profile', fields: ['currentStage'] },
  { id: 'Step 2', name: 'Academics', fields: ['strongSubjects', 'academicScore'] },
  { id: 'Step 3', name: 'Interests', fields: ['interests', 'workStyle'] },
  { id: 'Step 4', name: 'Goals', fields: ['budget', 'location'] },
  { id: 'Step 5', name: 'Finish', fields: [] },
];

const slideVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science/IP", "Accounts", "Economics", "Business Studies", "History/Pol Sci", "Geography", "English/Literature", "Art/Design"];
const entranceExams = ["No, focusing on Boards", "JEE (Main/Advanced)", "NEET (Medical)", "CUET (Central Universities)", "CLAT (Law)", "Design (NID/NIFT/UCEED)", "Other"];
const interests = [
  { name: "Coding / App Dev / AI 💻", icon: Code },
  { name: "Robotics / Electronics 🤖", icon: Beaker },
  { name: "Human Biology / Medicine ⚕️", icon: Handshake },
  { name: "Stock Market / Finance 💰", icon: IndianRupee },
  { name: "Marketing / Business Strategy 📈", icon: Briefcase },
  { name: "Sketching / UI Design 🎨", icon: Palette },
  { name: "Writing / Journalism ✍️", icon: Book },
  { name: "Law / Social Justice ⚖️", icon: Landmark },
];

export function MultiStepAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1
    currentStage: '',
    board: '',
    stream: '',
    university: '',
    collegeStream: '',
    currentGoal: '',
    industryPreference: '',
    goalTimeline: '',
    gapDegree: '',
    gapYearCompleted: '',
    gapDuration: 1,
    gapAspiration: '',
    // Step 2
    strongSubjects: [] as string[],
    academicScore: '60% - 75%',
    examStatus: [] as string[],
    // Step 3
    interests: [] as string[],
    workStyle: '',
    // Step 4
    budget: '',
    parentPressure: false,
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) { // Submitting on the last real step
        setIsSubmitting(true);
        setTimeout(() => {
          setIsFinished(true);
          setCurrentStep(currentStep + 1);
        }, 3000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleMultiSelect = (field: 'strongSubjects' | 'examStatus' | 'interests', value: string) => {
    const currentValues = formData[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(i => i !== value)
      : [...currentValues, value];
    handleFormData(field, newValues);
  }

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    if (!currentFields) return true;
    return currentFields.every(field => {
        const value = formData[field as keyof typeof formData];
        if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined;
    });
  };

  const progressValue = ((currentStep) / (steps.length - 1)) * 100;
  const currentStage = formData.currentStage;

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <Progress value={progressValue} className="w-full h-2 mb-4" />
        <CardTitle className="text-2xl font-headline">{steps[currentStep].name}</CardTitle>
        <CardDescription>Step {currentStep + 1} of {steps.length -1}</CardDescription>
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
                <RadioGroup onValueChange={(value) => handleFormData('currentStage', value)} value={formData.currentStage} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                   {(['Class 8-10', 'Class 11-12', 'College / Graduate', 'Post Graduate', 'Gap Year'] as const).map(stage => (
                      <Label key={stage} htmlFor={stage} className={`flex items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-primary ${formData.currentStage === stage ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                        <RadioGroupItem value={stage} id={stage} className="sr-only"/>
                        <span className="font-semibold text-center text-sm">{stage}</span>
                      </Label>
                   ))}
                </RadioGroup>

                {currentStage === 'Class 8-10' && (
                  <Select onValueChange={(value) => handleFormData('board', value)} value={formData.board}>
                    <SelectTrigger><SelectValue placeholder="Select your Education Board" /></SelectTrigger>
                    <SelectContent><SelectItem value="CBSE">CBSE</SelectItem><SelectItem value="ICSE">ICSE</SelectItem><SelectItem value="State Board">State Board</SelectItem></SelectContent>
                  </Select>
                )}
                {currentStage === 'Class 11-12' && (
                    <div className='space-y-4'>
                        <Select onValueChange={(value) => handleFormData('board', value)} value={formData.board}>
                            <SelectTrigger><SelectValue placeholder="Select your Education Board" /></SelectTrigger>
                            <SelectContent><SelectItem value="CBSE">CBSE</SelectItem><SelectItem value="ICSE">ICSE</SelectItem><SelectItem value="State Board">State Board</SelectItem></SelectContent>
                        </Select>
                        <Select onValueChange={(value) => handleFormData('stream', value)} value={formData.stream}>
                            <SelectTrigger><SelectValue placeholder="Select your Stream" /></SelectTrigger>
                            <SelectContent><SelectItem value="Science (PCM)">Science (PCM)</SelectItem><SelectItem value="Science (PCB)">Science (PCB)</SelectItem><SelectItem value="Commerce">Commerce</SelectItem><SelectItem value="Arts">Arts</SelectItem></SelectContent>
                        </Select>
                    </div>
                )}
                { (currentStage === 'College / Graduate' || currentStage === 'Post Graduate') && (
                    <div className="space-y-4">
                        <Input placeholder="University/College" value={formData.university} onChange={e => handleFormData('university', e.target.value)} />
                        <Input placeholder="Stream/Degree" value={formData.collegeStream} onChange={e => handleFormData('collegeStream', e.target.value)} />
                        <Select onValueChange={(value) => handleFormData('currentGoal', value)} value={formData.currentGoal}>
                            <SelectTrigger><SelectValue placeholder="What is your current primary goal?" /></SelectTrigger>
                            <SelectContent><SelectItem value="Get a Job">Get a Job</SelectItem><SelectItem value="Higher Studies">Pursue Higher Studies</SelectItem><SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem></SelectContent>
                        </Select>
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
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold">Which subjects do you genuinely enjoy & score well in?</Label>
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
                    <Select onValueChange={(value) => handleFormData('academicScore', value)} value={formData.academicScore}>
                        <SelectTrigger className="w-full mt-2 h-12 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="< 60%">&lt; 60%</SelectItem>
                            <SelectItem value="60% - 75%">60% - 75%</SelectItem>
                            <SelectItem value="75% - 85%">75% - 85%</SelectItem>
                            <SelectItem value="85% - 95%">85% - 95%</SelectItem>
                            <SelectItem value="95%+">95%+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                  <Label className="text-lg font-semibold">Are you preparing for any entrance exams?</Label>
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
            {currentStep === 2 && (
              <div className='space-y-6'>
                <div>
                    <Label className="text-lg font-semibold">What topics excite you outside of textbooks?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-2">
                    {interests.map(interest => (
                        <Button key={interest.name} variant={formData.interests.includes(interest.name) ? "default" : "outline"} className="h-24 flex-col gap-2"
                        onClick={() => handleMultiSelect('interests', interest.name)}
                        >
                        <interest.icon size={24} />
                        {interest.name.split(' ')[0]}
                        </Button>
                    ))}
                    </div>
                </div>
                <div>
                    <Label className="text-lg font-semibold">Work Style Preference</Label>
                    <RadioGroup onValueChange={(value) => handleFormData('workStyle', value)} value={formData.workStyle} className="mt-2 space-y-2">
                        {["Desk Job (Office)", "Field Work (Travel)", "Creative Studio", "Uniform/Discipline"].map(style => (
                            <Label key={style} htmlFor={style} className="flex items-center gap-4 rounded-md border-2 p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                                <RadioGroupItem value={style} id={style}/>
                                {style}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
              </div>
            )}
             {currentStep === 3 && (
                <div className="space-y-8">
                    <div>
                        <Label className="text-lg font-semibold">College Budget Expectation (Per Year)</Label>
                        <RadioGroup onValueChange={(value) => handleFormData('budget', value)} value={formData.budget} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                           {(['Low (< ₹1L)', 'Medium (₹1L - ₹4L)', 'High (> ₹4L)'] as const).map(budget => (
                               <Label key={budget} htmlFor={budget} className={`flex items-center justify-center rounded-md border-2 p-4 h-20 cursor-pointer hover:border-primary ${formData.budget === budget ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                                <RadioGroupItem value={budget} id={budget} className="sr-only"/>
                                <span className='text-center'><IndianRupee className="inline-flex mr-2"/> {budget}</span>
                               </Label>
                           ))}
                        </RadioGroup>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold">Location Preference</Label>
                         <RadioGroup onValueChange={(value) => handleFormData('location', value)} value={formData.location} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                           {(['Home Town', 'Metro City', 'Abroad'] as const).map(location => (
                               <Label key={location} htmlFor={location} className={`flex items-center justify-center rounded-md border-2 p-4 h-20 cursor-pointer hover:border-primary ${formData.location === location ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                                <RadioGroupItem value={location} id={location} className="sr-only"/>
                                {location === 'Home Town' ? <Building className="mr-2"/> : <Briefcase className="mr-2"/>} {location}
                               </Label>
                           ))}
                        </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="parentPressure" checked={formData.parentPressure} onCheckedChange={(checked) => handleFormData('parentPressure', !!checked)} />
                        <label htmlFor="parentPressure" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            My parents strictly want Engineering/Medical.
                        </label>
                    </div>
                </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col items-center justify-center text-center h-[300px]">
                {!isFinished ? (
                  <>
                    <div className="flex flex-col gap-4 w-full">
                        <Skeleton className="h-8 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                        <Skeleton className="h-20 w-full mt-4" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <p className="text-lg font-semibold mt-4">Analyzing Profile...</p>
                  </>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold font-headline">Career Report Ready!</h2>
                    <p className="text-muted-foreground mt-2">(AI Connectivity Pending)</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <div className="p-6 pt-0 flex justify-between items-center">
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
              {isSubmitting ? 'Analyzing...' : 'Finish'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
