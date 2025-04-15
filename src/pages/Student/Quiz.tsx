import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendRequest } from '@/Helper/backendRequest';

interface QuizPageProps {
  courseId: string | undefined;
}

const QuizPage = ({ courseId }: QuizPageProps) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [attemptId, setAttemptId] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        
        // 1. Get quiz for this course
        const quizResponse = await backendRequest("GET", `/quiz/courses/${courseId}/quiz`);
        if (!quizResponse.success) {
          throw new Error(quizResponse.message || "Failed to load quiz");
        }
        setQuiz(quizResponse.data);

        // 2. Start/resume attempt
        const attemptResponse = await backendRequest("POST", `/quiz/quizzes/${courseId}/attempts`);
        if (!attemptResponse.success) {
          throw new Error(attemptResponse.message || "Failed to start attempt");
        }

        setAttemptId(attemptResponse.data.attemptId);
        setCurrentQuestionIndex(attemptResponse.data.resumeQuestion || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [courseId]);

  // Timer effect
  useEffect(() => {
    if (!quiz || quizCompleted) return;

    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quiz, quizCompleted]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleTimeUp = async () => {
    if (!selectedAnswer) {
      await submitAnswer('');
    }
    goToNextQuestion();
  };

  const submitAnswer = async (answer: string) => {
    try {
      const questionId = quiz.questions[currentQuestionIndex]._id;
      const timeSpent = 60 - timeLeft;
      
      await backendRequest("POST", `/quiz/attempts/${attemptId}/questions/${questionId}/answer`, {
        answer: answer || selectedAnswer,
        timeSpent
      });
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  const goToNextQuestion = async () => {
    await submitAnswer(selectedAnswer);
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60);
      setSelectedAnswer('');
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    try {
      const response = await backendRequest("POST", `/quiz/attempts/${attemptId}/complete`);
      if (response.success) {
        setQuizResult(response.data);
        setQuizCompleted(true);
      }
    } catch (err) {
      console.error("Error completing quiz:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate(`/course/${courseId}`)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Course
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Quiz Completed!</h2>
        
        <div className="mb-6">
          <div className={`text-4xl font-bold mb-2 ${
            quizResult.isPassed ? 'text-green-600' : 'text-red-600'
          }`}>
            {quizResult.score}/{quizResult.totalQuestions}
          </div>
          <p className="text-lg dark:text-gray-300">
            {quizResult.isPassed ? 'Congratulations! You passed!' : 'Try again to pass the quiz'}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Time Taken:</span>
            <span className="font-medium">
              {Math.floor(quizResult.totalTimeSpent / 60)}m {quizResult.totalTimeSpent % 60}s
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Passing Score:</span>
            <span className="font-medium">
              {quizResult.passingScore}/{quizResult.totalQuestions}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
        >
          Back to Course
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Quiz Header */}
      <div className="bg-blue-600 dark:bg-blue-800 p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <div className="text-sm bg-blue-700 dark:bg-blue-900 px-2 py-1 rounded">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>
        <div className="w-full bg-blue-500 dark:bg-blue-700 rounded-full h-2.5">
          <div 
            className="bg-yellow-400 h-2.5 rounded-full" 
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          ></div>
        </div>
        <div className="text-right mt-1 text-sm">
          Time left: {timeLeft}s
        </div>
      </div>

      {/* Question Area */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={goToNextQuestion}
          disabled={!selectedAnswer && timeLeft > 0}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            !selectedAnswer && timeLeft > 0
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;