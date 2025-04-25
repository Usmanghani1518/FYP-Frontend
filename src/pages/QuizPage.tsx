import React, { useState, useEffect } from 'react';
import { backendRequest } from '@/Helper/backendRequest';
import { notifyResponse } from '@/Helper/notify';

interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctOption: number;
  points: number;
}

interface QuizData {
  _id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timePerQuestion: number;
  totalPoints: number;
}

interface QuizAttempt {
  attemptId: string;
  answers: {
    questionId: string;
    answer: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  score: number;
  isPassed: boolean;
}

const QuizPage = ({ courseId }: { courseId: string }) => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await backendRequest('GET', `/quiz/courses/${courseId}/quiz`);
        if (response.success) {
          setQuiz(response.data);
          await startNewAttempt(response.data._id);
        } else {
          notifyResponse({ success: false, message: 'No quiz found for this course' });
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        notifyResponse({ success: false, message: 'Failed to load quiz' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  // Start a new quiz attempt
  const startNewAttempt = async (quizId: string) => {
    try {
      const response = await backendRequest('POST', `/quiz/quizzes/${quizId}/attempts`);
      if (response.success) {
        setAttempt({
          attemptId: response.data.attemptId,
          answers: [],
          score: 0,
          isPassed: false
        });
        setTimeLeft(60);
        setTimeStarted(Date.now());
      }
    } catch (error) {
      console.error('Error starting attempt:', error);
    }
  };

  // Timer effect - automatically submits after 1 minute
  useEffect(() => {
    if (!attempt || isCompleted || !timeStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [attempt, currentQuestionIndex, isCompleted, selectedOption, timeStarted]);

  // Handle answer selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  // Calculate time spent on current question
  const getTimeSpent = () => {
    if (!timeStarted) return 0;
    const timeElapsed = Math.floor((Date.now() - timeStarted) / 1000);
    return Math.min(timeElapsed, 60);
  };

  // Submit answer for current question
  const submitAnswer = async () => {
    if (!attempt || !quiz || !timeStarted || !attempt.attemptId) {
      if (selectedOption === null) {
        handleNextQuestion();
        return;
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const questionId = quiz.questions[currentQuestionIndex]._id;
      const answerToSubmit = selectedOption !== null ? selectedOption : -1;
      const timeSpent = getTimeSpent();
      
      const response = await backendRequest(
        'POST',
        `/quiz/attempts/${attempt.attemptId}/questions/${questionId}/answer`,
        { 
          answer: answerToSubmit,
          timeSpent: timeSpent
        }
      );

      if (response.success) {
        // Update attempt with the new answer
        const updatedAttempt = {
          ...attempt,
          answers: [
            ...attempt.answers,
            {
              questionId,
              answer: answerToSubmit,
              isCorrect: answerToSubmit === quiz.questions[currentQuestionIndex].correctOption,
              timeSpent
            }
          ],
          score: answerToSubmit === quiz.questions[currentQuestionIndex].correctOption 
            ? attempt.score + quiz.questions[currentQuestionIndex].points 
            : attempt.score
        };
        
        setAttempt(updatedAttempt);
        setSelectedOption(null);
        handleNextQuestion();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move to next question or complete quiz
  const handleNextQuestion = () => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60);
      setTimeStarted(Date.now());
    } else {
      completeQuiz();
    }
  };

  // Complete the quiz attempt
  const completeQuiz = async () => {
    if (!attempt || !attempt.attemptId) return;

    try {
      const response = await backendRequest('POST', `/quiz/attempts/${attempt.attemptId}/complete`);
      if (response.success) {
        setAttempt(prev => prev ? {
          ...prev,
          isPassed: response.data.isPassed
        } : null);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!attempt || !quiz) return 0;
    return (attempt.score / quiz.totalPoints) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">No quiz available for this course</p>
      </div>
    );
  }

  if (isCompleted && attempt) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">{quiz.title} - Results</h2>
          <h3 className="text-xl font-semibold mb-4">
            {attempt.isPassed ? 'Congratulations! You passed!' : 'Try again!'}
          </h3>
          <p className="text-gray-600 mb-1">
            You scored {attempt.score} out of {quiz.totalPoints} points
          </p>
          <p className="text-gray-600">
            Passing score: {quiz.passingScore} points
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span>Your Score</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${attempt.isPassed ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100  text-gray-600 p-4 rounded-lg">
            <p className="font-medium">Correct Answers</p>
            <p className="text-2xl font-bold text-green-700">
              {attempt.answers.filter(a => a.isCorrect).length}
            </p>
          </div>
          <div className="bg-red-100  text-gray-600 p-4 rounded-lg">
            <p className="font-medium">Incorrect Answers</p>
            <p className="text-2xl font-bold text-red-700">
              {attempt.answers.filter(a => !a.isCorrect).length}
            </p>
          </div>
        </div>

        <div className="bg-blue-50  text-gray-600 p-4 rounded-lg">
          <p className="font-medium text-gray-600">Average Time Per Question</p>
          <p className="text-xl">
            {attempt.answers.length > 0 
              ? Math.round(attempt.answers.reduce((sum, answer) => sum + answer.timeSpent, 0) / attempt.answers.length)
              : 0} seconds
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Time remaining: <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-sm text-gray-500">
            Points: {currentQuestion.points}
          </div>
        </div>
      </div>
      
      <div className="mb-6 text-black">
        <h3 className="text-lg text-black font-medium mb-4">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`option-${index}`}
                name="quiz-option"
                checked={selectedOption === index}
                onChange={() => handleOptionSelect(index)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`option-${index}`} className="ml-2">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={submitAnswer}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Submitting...' : 
           currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;