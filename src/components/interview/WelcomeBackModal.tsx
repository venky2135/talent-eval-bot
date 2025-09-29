import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedSelector';
import { dismissWelcomeBack, resumeInterview } from '@/store/slices/interviewSlice';
import { Clock, User, RotateCcw } from 'lucide-react';

const WelcomeBackModal = () => {
  const dispatch = useAppDispatch();
  const { showWelcomeBack, currentCandidateId, candidates } = useAppSelector((state) => state.interview);
  
  const currentCandidate = candidates.find(c => c.id === currentCandidateId);

  const handleResume = () => {
    if (currentCandidateId) {
      dispatch(resumeInterview(currentCandidateId));
    }
  };

  const handleDismiss = () => {
    dispatch(dismissWelcomeBack());
  };

  if (!showWelcomeBack || !currentCandidate) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={showWelcomeBack} onOpenChange={handleDismiss}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            <span>Welcome Back!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You have a paused interview session.
            </p>
            
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{currentCandidate.name}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <span>Question {currentCandidate.currentQuestionIndex + 1} of 6</span>
              </div>
              
              {currentCandidate.timeRemaining !== undefined && (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Time remaining: {formatTime(currentCandidate.timeRemaining)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleDismiss} className="flex-1">
              Later
            </Button>
            <Button variant="gradient" onClick={handleResume} className="flex-1">
              Resume Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeBackModal;