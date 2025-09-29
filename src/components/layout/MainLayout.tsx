import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Bot } from 'lucide-react';
import IntervieweeTab from '@/components/interview/IntervieweeTab';
import InterviewerTab from '@/components/interview/InterviewerTab';
import WelcomeBackModal from '@/components/interview/WelcomeBackModal';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('interviewee');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crisp</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Interview Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="interviewee" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Interviewee</span>
            </TabsTrigger>
            <TabsTrigger value="interviewer" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Interviewer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interviewee" className="mt-0">
            <IntervieweeTab />
          </TabsContent>
          
          <TabsContent value="interviewer" className="mt-0">
            <InterviewerTab />
          </TabsContent>
        </Tabs>
      </main>

      <WelcomeBackModal />
    </div>
  );
};

export default MainLayout;