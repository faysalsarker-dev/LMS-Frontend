import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause,
  SkipForward, 
  SkipBack,
  Volume2,
  Settings,
  Maximize,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';

const Learn = () => {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1200); // 20 minutes in seconds
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/dashboard/my-courses">
            <Button>Back to My Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock curriculum data for the learning interface
  type LessonType = {
    id: string;
    title: string;
    duration: string;
    type: "video" | "reading" | "quiz";
    completed: boolean;
  };

  const curriculum = [
    {
      title: "Getting Started",
      lessons: [
        { id: '1', title: "Course Introduction", duration: "5:30", type: "video" as const, completed: true },
        { id: '2', title: "Setting up Development Environment", duration: "12:45", type: "video" as const, completed: true },
        { id: '3', title: "Course Resources", duration: "3:20", type: "reading" as const, completed: false },
      ] as LessonType[]
    },
    {
      title: "Fundamentals", 
      lessons: [
        { id: '4', title: "Understanding the Basics", duration: "18:30", type: "video" as const, completed: false },
        { id: '5', title: "Hands-on Practice", duration: "25:15", type: "video" as const, completed: false },
        { id: '6', title: "Knowledge Check", duration: "10:00", type: "quiz" as const, completed: false },
      ] as LessonType[]
    },
    {
      title: "Advanced Concepts",
      lessons: [
        { id: '7', title: "Deep Dive into Advanced Topics", duration: "32:45", type: "video" as const, completed: false },
        { id: '8', title: "Real-world Project", duration: "45:20", type: "video" as const, completed: false },
        { id: '9', title: "Final Assessment", duration: "15:00", type: "quiz" as const, completed: false },
      ] as LessonType[]
    }
  ];

  const allLessons = curriculum.flatMap(section => section.lessons);
  const currentLesson = allLessons[currentLessonIndex];
  const completedLessons = allLessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / allLessons.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/my-courses">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Courses
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold truncate max-w-xs lg:max-w-none">{course.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{completedLessons}/{allLessons.length} lessons</span>
                <span>•</span>
                <span>{Math.round(progressPercentage)}% complete</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <Progress value={progressPercentage} className="w-32 hidden sm:block" />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:mr-80' : ''}`}>
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="aspect-video w-full max-w-4xl bg-gray-900 rounded-lg flex items-center justify-center">
              {currentLesson.type === 'video' ? (
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">
                    {isPlaying ? <Pause className="h-16 w-16 mx-auto" /> : <Play className="h-16 w-16 mx-auto" />}
                  </div>
                  <p className="text-lg mb-2">{currentLesson.title}</p>
                  <p className="text-sm opacity-75">Video Player Simulation</p>
                </div>
              ) : currentLesson.type === 'reading' ? (
                <div className="text-center text-white">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg mb-2">{currentLesson.title}</p>
                  <p className="text-sm opacity-75">Reading Material</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg mb-2">{currentLesson.title}</p>
                  <p className="text-sm opacity-75">Interactive Quiz</p>
                </div>
              )}
            </div>
            
            {/* Video Controls */}
            {currentLesson.type === 'video' && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center gap-4 text-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousLesson}
                    disabled={currentLessonIndex === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextLesson}
                    disabled={currentLessonIndex === allLessons.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <div className="w-32 bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <span>{formatTime(duration)}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Navigation */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold mb-1">{currentLesson.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {currentLesson.duration}
                  <Badge variant="outline" className="ml-2">
                    {currentLesson.type === 'video' ? 'Video' : 
                     currentLesson.type === 'reading' ? 'Reading' : 'Quiz'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                {currentLesson.type !== 'video' && (
                  <Button>
                    {currentLesson.type === 'reading' ? 'Mark as Read' : 'Start Quiz'}
                  </Button>
                )}
                
                <Button
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === allLessons.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`w-80 bg-muted/30 border-l flex-shrink-0 ${
          sidebarOpen ? 'block' : 'hidden'
        } fixed right-0 top-[73px] h-[calc(100vh-73px)] lg:relative lg:top-0 lg:h-auto lg:block z-40`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Course Content</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-120px)]">
            {curriculum.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4">
                <div className="px-4 py-2 bg-muted/50 font-medium text-sm">
                  {section.title}
                </div>
                
                <div className="space-y-1">
                  {section.lessons.map((lesson, lessonIndex) => {
                    const globalIndex = curriculum
                      .slice(0, sectionIndex)
                      .reduce((acc, s) => acc + s.lessons.length, 0) + lessonIndex;
                    const isActive = globalIndex === currentLessonIndex;
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(globalIndex)}
                        className={`w-full p-3 text-left hover:bg-muted/50 transition-colors ${
                          isActive ? 'bg-primary/10 border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {lesson.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : lesson.type === 'video' ? (
                              <PlayCircle className="h-5 w-5 text-primary" />
                            ) : lesson.type === 'reading' ? (
                              <BookOpen className="h-5 w-5 text-secondary" />
                            ) : (
                              <HelpCircle className="h-5 w-5 text-warning" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              isActive ? 'text-primary' : ''
                            }`}>
                              {lesson.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </div>
                          </div>
                          
                          {isActive && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;