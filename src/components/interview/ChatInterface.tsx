import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Send, Clock, Pause, Play, Bot, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useTypedSelector';
import { 
  addChatMessage, 
  setCurrentQuestion, 
  updateTimeRemaining,
  submitAnswer,
  completeInterview,
  pauseInterview,
  resumeInterview
} from '@/store/slices/interviewSlice';
import { Question, QuestionDifficulty, Answer, ChatMessage } from '@/types/interview';

// Mock AI service - in real app, this would call actual AI APIs
const generateQuestion = (difficulty: QuestionDifficulty, questionNumber: number): Question => {
  const questions = {
    easy: [
      "What is the difference between let, const, and var in JavaScript?",
      "Explain the concept of hoisting in JavaScript.",
      "What are the basic HTTP methods and their purposes?",
      "What is the difference between == and === in JavaScript?",
    ],
    medium: [
      "Explain the concept of closures in JavaScript with an example.",
      "What are React hooks and why were they introduced?",
      "Describe the difference between SQL and NoSQL databases.",
      "How would you implement authentication in a web application?",
    ],
    hard: [
      "Design a scalable system for handling millions of concurrent users.",
      "Explain how you would optimize a React application for performance.",
      "Describe microservices architecture and its trade-offs.",
      "How would you handle state management in a large React application?",
    ]
  };

  const questionList = questions[difficulty];
  const questionText = questionList[questionNumber % questionList.length];
  
  const timeLimit = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120;

  return {
    id: Date.now().toString(),
    text: questionText,
    difficulty,
    timeLimit,
    role: 'fullstack',
    category: 'technical'
  };
};

const ChatInterface = () => {
  const dispatch = useAppDispatch();
  const { 
    currentCandidateId, 
    candidates, 
    isInterviewActive, 
    currentQuestion, 
    timeRemaining,
    chatMessages 
  } = useAppSelector((state) => state.interview);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const currentCandidate = candidates.find(c => c.id === currentCandidateId);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Timer logic
  useEffect(() => {
    if (isInterviewActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch(updateTimeRemaining(timeRemaining - 1));
      }, 1000);
    } else if (timeRemaining === 0 && isInterviewActive) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isInterviewActive, timeRemaining]);

  const startInterview = () => {
    if (!currentCandidate) return;

    const firstQuestion = generateQuestion('easy', 0);
    
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello ${currentCandidate.name}! Welcome to your Full Stack Developer interview. You'll be asked 6 questions total: 2 easy, 2 medium, and 2 hard. Each question has a time limit. Let's begin with your first question.`,
      timestamp: new Date().toISOString(),
    };

    const questionMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: firstQuestion.text,
      timestamp: new Date().toISOString(),
      questionId: firstQuestion.id,
      isQuestion: true,
    };

    dispatch(addChatMessage(welcomeMessage));
    dispatch(addChatMessage(questionMessage));
    dispatch(setCurrentQuestion(firstQuestion));
    setHasStarted(true);
  };

  const handleTimeUp = () => {
    if (currentAnswer.trim()) {
      submitCurrentAnswer();
    } else {
      submitCurrentAnswer('No answer provided (time expired)');
    }
  };

  const submitCurrentAnswer = (answer = currentAnswer) => {
    if (!currentCandidate || !currentQuestion) return;

    const timeUsed = currentQuestion.timeLimit - timeRemaining;
    
    // Add user's answer to chat
    const answerMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: answer,
      timestamp: new Date().toISOString(),
    };
    dispatch(addChatMessage(answerMessage));

    // Create answer object
    const answerObj: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer,
      difficulty: currentQuestion.difficulty,
      timeAllowed: currentQuestion.timeLimit,
      timeUsed,
      score: Math.floor(Math.random() * 100), // Mock scoring - would be AI-generated
      answeredAt: new Date().toISOString(),
    };

    dispatch(submitAnswer({ candidateId: currentCandidate.id, answer: answerObj }));

    const nextQuestionIndex = currentCandidate.currentQuestionIndex + 1;
    
    if (nextQuestionIndex >= 6) {
      // Interview complete
      completeInterviewProcess();
    } else {
      // Move to next question
      moveToNextQuestion(nextQuestionIndex);
    }

    setCurrentAnswer('');
  };

  const moveToNextQuestion = (questionIndex: number) => {
    const difficulties: QuestionDifficulty[] = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'];
    const difficulty = difficulties[questionIndex];
    const nextQuestion = generateQuestion(difficulty, questionIndex);

    const questionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: nextQuestion.text,
      timestamp: new Date().toISOString(),
      questionId: nextQuestion.id,
      isQuestion: true,
    };

    dispatch(addChatMessage(questionMessage));
    dispatch(setCurrentQuestion(nextQuestion));
  };

  const completeInterviewProcess = () => {
    if (!currentCandidate) return;

    const totalScore = Math.floor(Math.random() * 100); // Mock final scoring
    const summary = `Interview completed. The candidate demonstrated good technical knowledge with room for improvement in advanced concepts.`; // Mock AI summary

    const completionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Congratulations! You've completed your interview. Your final score is ${totalScore}%. Thank you for your time, and we'll be in touch soon.`,
      timestamp: new Date().toISOString(),
    };

    dispatch(addChatMessage(completionMessage));
    dispatch(completeInterview({ 
      candidateId: currentCandidate.id, 
      finalScore: totalScore, 
      summary 
    }));
  };

  const handlePause = () => {
    if (currentCandidate) {
      dispatch(pauseInterview(currentCandidate.id));
    }
  };

  const handleResume = () => {
    if (currentCandidate) {
      dispatch(resumeInterview(currentCandidate.id));
    }
  };

  const getDifficultyColor = (difficulty: QuestionDifficulty) => {
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

  if (!currentCandidate) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interview Session</CardTitle>
              <p className="text-sm text-muted-foreground">{currentCandidate.name}</p>
            </div>
            
            {hasStarted && (
              <div className="flex items-center space-x-4">
                {currentQuestion && (
                  <>
                    <Badge variant={getDifficultyColor(currentQuestion.difficulty) as any}>
                      {currentQuestion.difficulty.toUpperCase()}
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className={`font-mono ${timeRemaining <= 10 ? 'text-danger' : ''}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isInterviewActive ? handlePause : handleResume}
                >
                  {isInterviewActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
          
          {hasStarted && (
            <Progress 
              value={(currentCandidate.currentQuestionIndex / 6) * 100} 
              className="w-full"
            />
          )}
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-chat-user text-chat-user-foreground'
                      : 'bg-chat-ai text-chat-ai-foreground'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' ? (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          {!hasStarted ? (
            <div className="text-center">
              <Button variant="gradient" onClick={startInterview}>
                Start Interview
              </Button>
            </div>
          ) : isInterviewActive && currentQuestion ? (
            <div className="flex space-x-2">
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && currentAnswer.trim()) {
                    submitCurrentAnswer();
                  }
                }}
                disabled={!isInterviewActive}
              />
              <Button
                onClick={() => submitCurrentAnswer()}
                disabled={!currentAnswer.trim() || !isInterviewActive}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Interview paused. Click resume to continue.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;