import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/hooks/useTypedSelector';
import { Search, Users, Award, Clock, Eye } from 'lucide-react';
import CandidateDetailModal from './CandidateDetailModal';
import { Candidate } from '@/types/interview';

const InterviewerTab = () => {
  const { candidates } = useAppSelector((state) => state.interview);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filteredAndSortedCandidates = candidates
    .filter(candidate => 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'paused':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: Candidate['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'paused':
        return 'Paused';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Interview Dashboard</h2>
          <p className="text-muted-foreground">Manage and review candidate interviews</p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{candidates.length} Total Candidates</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{candidates.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {candidates.filter(c => c.status === 'in-progress').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {candidates.filter(c => c.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Avg Score</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {candidates.filter(c => c.status === 'completed').length > 0
                ? Math.round(
                    candidates.filter(c => c.status === 'completed')
                      .reduce((sum, c) => sum + c.score, 0) /
                    candidates.filter(c => c.status === 'completed').length
                  )
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Sort */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={sortBy === 'score' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('score')}
              >
                Score
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                Name
              </Button>
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('date')}
              >
                Date
              </Button>
            </div>
          </div>

          {/* Candidates List */}
          {filteredAndSortedCandidates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {candidates.length === 0 ? 'No candidates yet' : 'No candidates match your search'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-medium">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                      <Badge variant={getStatusColor(candidate.status) as any}>
                        {getStatusText(candidate.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {candidate.status === 'completed' && (
                      <div className="text-right">
                        <p className="font-medium">{candidate.score}%</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default InterviewerTab;