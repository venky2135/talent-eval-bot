import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, User, Mail, Phone } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedSelector';
import { addCandidate, setCurrentCandidate } from '@/store/slices/interviewSlice';
import { Candidate } from '@/types/interview';
import ChatInterface from './ChatInterface';
import { useToast } from '@/hooks/use-toast';

const IntervieweeTab = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { currentCandidateId, candidates } = useAppSelector((state) => state.interview);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [candidateData, setCandidateData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'form' | 'chat'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentCandidate = candidates.find(c => c.id === currentCandidateId);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setIsProcessing(true);

    try {
      // Simulate resume parsing - in real app, this would call PDF/DOCX parsing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data - in real app, this would come from actual parsing
      const extractedData = {
        name: 'John Doe', // Would be extracted from resume
        email: 'john.doe@email.com', // Would be extracted from resume
        phone: '', // Might be missing
      };

      setCandidateData(extractedData);
      setStep('form');
      
      toast({
        title: "Resume processed successfully",
        description: "Please verify and complete your information.",
      });
    } catch (error) {
      toast({
        title: "Error processing resume",
        description: "Please try again or fill in the form manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartInterview = () => {
    if (!candidateData.name || !candidateData.email || !candidateData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone,
      resumeFileName: resumeFile?.name,
      createdAt: new Date().toISOString(),
      status: 'pending',
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
    };

    dispatch(addCandidate(newCandidate));
    dispatch(setCurrentCandidate(newCandidate.id));
    setStep('chat');
  };

  if (currentCandidate && step === 'chat') {
    return <ChatInterface />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Start Your Interview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Upload your resume to get started. We'll extract your basic information automatically.
                </p>
                
                <div 
                  className="border-2 border-dashed border-muted rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload Resume</p>
                  <p className="text-sm text-muted-foreground">
                    PDF or DOCX files only. Click to browse.
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              {isProcessing && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground">Processing resume...</span>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('form')}
                  className="mt-4"
                >
                  Skip Resume Upload
                </Button>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="space-y-4">
              {resumeFile && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{resumeFile.name}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="name"
                    value={candidateData.name}
                    onChange={(e) => setCandidateData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={candidateData.email}
                    onChange={(e) => setCandidateData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number *</span>
                  </Label>
                  <Input
                    id="phone"
                    value={candidateData.phone}
                    onChange={(e) => setCandidateData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('upload')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  variant="gradient"
                  onClick={handleStartInterview}
                  className="flex-1"
                >
                  Start Interview
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntervieweeTab;