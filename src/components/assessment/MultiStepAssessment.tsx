'use client';

import { useState, useEffect } from 'react';
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

const steps = [
  { id: 'Step 1', name: 'Profile', fields: ['currentClass', 'stream'] },
  { id: 'Step 2', name: 'Academics', fields: ['marks', 'strongestSubject'] },
  { id: 'Step 3', name: 'Interests', fields: ['interests'] },
  { id: 'Step 4', name: 'Filters', fields: ['budget', 'location'] },
  { id: 'Step 5', name: 'Finish', fields: [] },
];

const slideVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

const subjects = ["Math", "Physics", "Chemistry", "Biology", "History", "Geography", "Economics", "English", "Computer Science"];
const interests = [
  { name: "Coding 💻", icon: Code },
  { name: "Design 🎨", icon: Palette },
  { name: "Money 💰", icon: IndianRupee },
  { name: "Helping People 🤝", icon: Handshake },
];

export function MultiStepAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    currentClass: '',
    stream: '',
    marks: 75,
    strongestSubject: '',
    interests: [] as string[],
    budget: '',
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

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    if (!currentFields) return true;
    return currentFields.every(field => {
        const value = formData[field as keyof typeof formData];
        if (Array.isArray(value)) return value.length > 0;
        return value !== '';
    });
  };

  const progressValue = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <Progress value={progressValue} className="w-full h-2 mb-4" />
        <CardTitle className="text-2xl font-headline">{steps[currentStep].name}</CardTitle>
        <CardDescription>Step {currentStep + 1} of {steps.length -1}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden relative min-h-[400px]">
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
              <div className="space-y-8">
                <div>
                  <Label className="text-lg font-semibold">Current Class</Label>
                  <Select onValueChange={(value) => handleFormData('currentClass', value)} value={formData.currentClass}>
                    <SelectTrigger className="w-full mt-2 h-12 text-base">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      {['9', '10', '11', '12'].map(c => <SelectItem key={c} value={`Class ${c}`}>Class {c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-lg font-semibold">Stream</Label>
                  <RadioGroup onValueChange={(value) => handleFormData('stream', value)} value={formData.stream} className="mt-2 grid grid-cols-2 gap-4">
                     {(['Science-PCM', 'Science-PCB', 'Commerce', 'Arts'] as const).map(stream => (
                        <Label key={stream} htmlFor={stream} className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-primary ${formData.stream === stream ? 'border-primary bg-primary/10' : 'border-muted'}`}>
                          <RadioGroupItem value={stream} id={stream} className="sr-only"/>
                          {stream === 'Science-PCM' && <Beaker className="mb-2" />}
                          {stream === 'Science-PCB' && <Book className="mb-2" />}
                          {stream === 'Commerce' && <Briefcase className="mb-2" />}
                          {stream === 'Arts' && <Landmark className="mb-2" />}
                          <span className="font-semibold">{stream}</span>
                        </Label>
                     ))}
                  </RadioGroup>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <Label className="text-lg font-semibold flex justify-between">
                    <span>Marks Percentage</span>
                    <span className="text-primary font-bold">{formData.marks}%</span>
                  </Label>
                  <Slider
                    defaultValue={[formData.marks]}
                    min={40}
                    max={99}
                    step={1}
                    onValueChange={([value]) => handleFormData('marks', value)}
                    className="mt-4"
                  />
                </div>
                <div>
                  <Label className="text-lg font-semibold">Strongest Subject</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subjects.map(subject => (
                      <Button key={subject} variant={formData.strongestSubject === subject ? 'default' : 'outline'} onClick={() => handleFormData('strongestSubject', subject)}>
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <Label className="text-lg font-semibold">What are your interests?</Label>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-2">
                  {interests.map(interest => (
                    <Button key={interest.name} variant={formData.interests.includes(interest.name) ? "default" : "outline"} className="h-24 flex-col gap-2"
                      onClick={() => {
                        const newInterests = formData.interests.includes(interest.name)
                          ? formData.interests.filter(i => i !== interest.name)
                          : [...formData.interests, interest.name];
                        handleFormData('interests', newInterests);
                      }}
                    >
                      <interest.icon size={24} />
                      {interest.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
             {currentStep === 3 && (
                <div className="space-y-8">
                    <div>
                        <Label className="text-lg font-semibold">Yearly Budget</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                           {(['< 2 Lakhs', '2-5 Lakhs', '> 5 Lakhs'] as const).map(budget => (
                               <Button key={budget} variant={formData.budget === budget ? 'default' : 'outline'} className="h-20 text-lg" onClick={() => handleFormData('budget', budget)}>
                                   <IndianRupee className="mr-2"/> {budget}
                               </Button>
                           ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold">Location Preference</Label>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                           {(['Home Town', 'Metro City'] as const).map(location => (
                               <Button key={location} variant={formData.location === location ? 'default' : 'outline'} className="h-20 text-lg" onClick={() => handleFormData('location', location)}>
                                   {location === 'Home Town' ? <Building className="mr-2"/> : <Briefcase className="mr-2"/>} {location}
                               </Button>
                           ))}
                        </div>
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
