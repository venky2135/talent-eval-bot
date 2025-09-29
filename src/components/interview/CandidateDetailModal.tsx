import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, FileText, Clock, Award } from 'lucide-react';
import { Candidate } from '@/types/interview';

interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
}

const CandidateDetailModal = ({ candidate, onClose }: CandidateDetailModalProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'secondary';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Candidate Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Name:</span>
                  <span>{candidate.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{candidate.email}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{candidate.phone}</span>
                </div>
                
                {candidate.resumeFileName && (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Resume:</span>
                    <span>{candidate.resumeFileName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <Badge variant={candidate.status === 'completed' ? 'default' : 'secondary'}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </Badge>
                
                {candidate.status === 'completed' && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className={`font-bold ${getScoreColor(candidate.score)}`}>
                      {candidate.score}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interview Timeline */}
          {candidate.answers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Questions & Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.answers.map((answer, index) => (
                    <div key={answer.questionId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge variant={getDifficultyColor(answer.difficulty) as any}>
                            {answer.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(answer.timeUsed)} / {formatTime(answer.timeAllowed)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-3 w-3" />
                            <span className={getScoreColor(answer.score)}>{answer.score}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium text-sm mb-1">Question:</p>
                          <p className="text-sm text-muted-foreground">{answer.question}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-sm mb-1">Answer:</p>
                          <p className="text-sm">{answer.answer}</p>
                        </div>
                        
                        {answer.aiGrading && (
                          <div>
                            <p className="font-medium text-sm mb-1">AI Feedback:</p>
                            <p className="text-sm text-muted-foreground">{answer.aiGrading}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Final Summary */}
          {candidate.finalSummary && (
            <Card>
              <CardHeader>
                <CardTitle>AI Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{candidate.finalSummary}</p>
              </CardContent>
            </Card>
          )}

          {/* Interview Stats */}
          {candidate.status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{candidate.answers.length}</p>
                    <p className="text-xs text-muted-foreground">Questions Answered</p>
                  </div>
                  
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                      {candidate.score}%
                    </p>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">
                      {Math.round(
                        candidate.answers.reduce((sum, a) => sum + a.timeUsed, 0) / 60
                      )}m
                    </p>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">
                      {candidate.startedAt && candidate.completedAt
                        ? Math.round(
                            (new Date(candidate.completedAt).getTime() - 
                             new Date(candidate.startedAt).getTime()) / (1000 * 60)
                          )
                        : 0}m
                    </p>
                    <p className="text-xs text-muted-foreground">Session Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;